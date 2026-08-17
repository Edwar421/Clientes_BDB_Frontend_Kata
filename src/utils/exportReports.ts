import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import type { Customer } from "../types/types";

type ActiveFilters = {
    identification: string;
    age: string;
    product: string;
    sortByDate: "recent" | "oldest";
};

type ExecutiveMetrics = {
    totalCustomers: number;
    averageAge: number;
    distinctProducts: number;
};

type ExecutivePdfInput = {
    customers: Customer[];
    filters: ActiveFilters;
    metrics: ExecutiveMetrics;
    ageChartElementId: string;
    productChartElementId: string;
};

type CapturedImage = {
    dataUrl: string;
    width: number;
    height: number;
};

const todayStamp = () => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
};

const resolveFilterLabel = (value: string, fallback = "Todos") => {
    const trimmed = value.trim();
    return trimmed === "" || trimmed === "all" ? fallback : trimmed;
};

const waitForNextPaint = async () => {
    await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
    await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
};

const loadImage = (src: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = "anonymous";
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = src;
    });

const copySvgComputedStyles = (sourceSvg: SVGSVGElement, targetSvg: SVGSVGElement) => {
    const sourceElements = [sourceSvg, ...Array.from(sourceSvg.querySelectorAll("*"))];
    const targetElements = [targetSvg, ...Array.from(targetSvg.querySelectorAll("*"))];

    const propertiesToCopy = [
        "font-family",
        "font-size",
        "font-weight",
        "font-style",
        "fill",
        "stroke",
        "stroke-width",
        "opacity",
        "color",
        "letter-spacing",
        "word-spacing",
        "text-anchor",
        "dominant-baseline",
    ];

    for (let index = 0; index < sourceElements.length; index++) {
        const source = sourceElements[index] as Element | undefined;
        const target = targetElements[index] as Element | undefined;

        if (!source || !target) continue;

        const style = window.getComputedStyle(source);
        const inlineStyles = propertiesToCopy
            .map((property) => `${property}:${style.getPropertyValue(property)};`)
            .join("");

        const currentStyle = target.getAttribute("style") ?? "";
        target.setAttribute("style", `${currentStyle}${inlineStyles}`);
    }
};

const captureSvgInsideElement = async (element: HTMLElement): Promise<CapturedImage | null> => {
    const svg = element.querySelector("svg");
    if (!svg) return null;

    const rect = svg.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect.width));
    const height = Math.max(1, Math.round(rect.height));

    const clonedSvg = svg.cloneNode(true) as SVGSVGElement;
    clonedSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    clonedSvg.setAttribute("width", String(width));
    clonedSvg.setAttribute("height", String(height));
    clonedSvg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    clonedSvg.setAttribute("shape-rendering", "geometricPrecision");
    clonedSvg.setAttribute("text-rendering", "optimizeLegibility");

    copySvgComputedStyles(svg, clonedSvg);

    const textNodes = clonedSvg.querySelectorAll("text, tspan");
    textNodes.forEach((node) => {
        const existingStyle = node.getAttribute("style") ?? "";
        node.setAttribute(
            "style",
            `${existingStyle}font-family:Helvetica,Arial,sans-serif;font-weight:600;letter-spacing:0;`
        );
    });

    const serialized = new XMLSerializer().serializeToString(clonedSvg);
    const encoded = window.btoa(unescape(encodeURIComponent(serialized)));
    const dataUrl = `data:image/svg+xml;base64,${encoded}`;

    const image = await loadImage(dataUrl);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) return null;

    context.fillStyle = "#FFFFFF";
    context.fillRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);

    return {
        dataUrl: canvas.toDataURL("image/png", 1.0),
        width,
        height,
    };
};

const captureElementAsImage = async (elementId: string): Promise<CapturedImage | null> => {
    try {
        const element = document.getElementById(elementId);
        if (!element) return null;

        await waitForNextPaint();

        const svgCapture = await captureSvgInsideElement(element);
        if (svgCapture) return svgCapture;

        const canvas = await html2canvas(element, {
            scale: 3,
            backgroundColor: "#FFFFFF",
            useCORS: true,
            logging: false,
        });

        return {
            dataUrl: canvas.toDataURL("image/png", 1.0),
            width: canvas.width,
            height: canvas.height,
        };
    } catch (error) {
        console.error(`No se pudo capturar el elemento ${elementId} para PDF `, error);
        return null;
    }
};

const drawChartCard = (
    pdf: jsPDF,
    title: string,
    image: CapturedImage,
    y: number,
    chartHeight: number
) => {
    const cardX = 10;
    const cardW = 190;
    const cardH = chartHeight + 16;

    pdf.setDrawColor(203, 213, 225);
    pdf.setFillColor(248, 250, 252);
    pdf.roundedRect(cardX, y, cardW, cardH, 2, 2, "FD");

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.setTextColor(15, 23, 42);
    pdf.text(title, cardX + 4, y + 6);

    const maxWidth = cardW - 8;
    const maxHeight = chartHeight;
    const widthRatio = maxWidth / image.width;
    const heightRatio = maxHeight / image.height;
    const ratio = Math.min(widthRatio, heightRatio);

    const drawWidth = image.width * ratio;
    const drawHeight = image.height * ratio;
    const drawX = cardX + 4 + (maxWidth - drawWidth) / 2;
    const drawY = y + 9 + (maxHeight - drawHeight) / 2;

    pdf.addImage(image.dataUrl, "PNG", drawX, drawY, drawWidth, drawHeight);

    return y + cardH + 6;
};

export const exportCustomersToExcel = (
    customers: Customer[],
    filters: ActiveFilters
) => {
    const headers = [
        "Tipo Identificacion",
        "Identificacion",
        "Nombre",
        "Edad",
        "Correo",
        "Producto",
        "Fecha Registro",
    ];

    const rows = customers.map((customer) => [
        customer.typeIdentification,
        customer.identification,
        customer.name,
        Number(customer.age),
        customer.email,
        customer.product,
        new Date(customer.createdAt).toLocaleString("es-CO"),
    ]);

    const metadataRows = [
        ["Reporte", "Clientes filtrados"],
        ["Generado", new Date().toLocaleString("es-CO")],
        ["Filtro identificación", resolveFilterLabel(filters.identification)],
        ["Filtro edad", resolveFilterLabel(filters.age)],
        ["Filtro producto", resolveFilterLabel(filters.product)],
        ["Orden", filters.sortByDate === "recent" ? "Más recientes" : "Más antiguos"],
        [],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet([...metadataRows, headers, ...rows]);
    worksheet["!cols"] = [
        { wch: 24 },
        { wch: 18 },
        { wch: 30 },
        { wch: 10 },
        { wch: 30 },
        { wch: 28 },
        { wch: 24 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Clientes");
    XLSX.writeFile(workbook, `clientes-filtrados-${todayStamp()}.xlsx`);
};

export const exportExecutivePdf = async ({
    customers,
    filters,
    metrics,
    ageChartElementId,
    productChartElementId,
}: ExecutivePdfInput) => {
    const pdf = new jsPDF("p", "mm", "a4");

    try {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(18);
        pdf.text("Reporte Ejecutivo de Clientes", 14, 16);

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        pdf.text(`Generado: ${new Date().toLocaleString("es-CO")}`, 14, 23);

        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        pdf.text("Resumen", 14, 32);

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(11);
        pdf.text(`Clientes totales filtrados: ${metrics.totalCustomers}`, 14, 39);
        pdf.text(`Edad promedio: ${metrics.averageAge}`, 14, 45);
        pdf.text(`Productos distintos: ${metrics.distinctProducts}`, 14, 51);

        pdf.setFont("helvetica", "bold");
        pdf.text("Filtros aplicados", 14, 61);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        pdf.text(`Identificación: ${resolveFilterLabel(filters.identification)}`, 14, 67);
        pdf.text(`Edad: ${resolveFilterLabel(filters.age)}`, 14, 72);
        pdf.text(`Producto: ${resolveFilterLabel(filters.product)}`, 14, 77);
        pdf.text(
            `Orden: ${filters.sortByDate === "recent" ? "Más recientes" : "Más antiguos"}`,
            14,
            82
        );

        const ageChartImage = await captureElementAsImage(ageChartElementId);
        const productChartImage = await captureElementAsImage(productChartElementId);

        let currentY = 90;

        if (ageChartImage) {
            try {
                currentY = drawChartCard(
                    pdf,
                    "Distribución por Edad",
                    ageChartImage,
                    currentY,
                    76
                );
            } catch (error) {
                console.error("Error agregando la gráfica de edad al PDF", error);
            }
        }

        if (productChartImage) {
            try {
                if (currentY > 190) {
                    pdf.addPage();
                    currentY = 20;
                }

                currentY = drawChartCard(
                    pdf,
                    "Clientes por Producto",
                    productChartImage,
                    currentY,
                    84
                );
            } catch (error) {
                console.error("Error agregando la gráfica de productos al PDF", error);
            }
        }

        if (!ageChartImage && !productChartImage) {
            pdf.setFont("helvetica", "italic");
            pdf.setFontSize(10);
            pdf.text("No fue posible capturar las gráficas para este reporte.", 14, currentY);
        }

        if (!customers.length) {
            pdf.setFont("helvetica", "italic");
            pdf.setFontSize(10);
            pdf.text("No hay clientes en el resultado filtrado actual.", 14, 270);
        }
    } catch (error) {
        console.error("Error generando el PDF ejecutivo", error);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(16);
        pdf.text("Reporte Ejecutivo de Clientes", 14, 18);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        pdf.text("No fue posible adjuntar todas las secciones del reporte.", 14, 28);
        pdf.text("Sin embargo, este archivo se generó como respaldo.", 14, 34);
    }

    pdf.save(`reporte-ejecutivo-clientes-${todayStamp()}.pdf`);
};

export type { ActiveFilters, ExecutiveMetrics };
