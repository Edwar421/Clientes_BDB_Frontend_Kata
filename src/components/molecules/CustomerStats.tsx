import React, { useMemo, useState, useEffect } from "react";
import type { Customer } from "../../types/types";

import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";

interface Props {
    customers: Customer[];
}

export const CustomerStats: React.FC<Props> = ({
    customers,
}) => {

    const [isDark, setIsDark] = useState(
        document.documentElement.classList.contains("dark")
    );

    useEffect(() => {
        const observer = new MutationObserver(() => {
            setIsDark(document.documentElement.classList.contains("dark"));
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => observer.disconnect();
    }, []);

    const textColor = isDark
        ? "#FFFFFF"
        : "#0F172A";

    const COLORS = [
        "#0D418C",
        "#1976D2",
        "#42A5F5",
        "#64B5F6",
    ];


    const averageAge = useMemo(() => {
        if (!customers.length) return 0;

        return Math.round(
            customers.reduce(
                (acc, customer) => acc + Number(customer.age),
                0
            ) / customers.length
        );
    }, [customers]);

    const productData = useMemo(() => {
        const grouped = customers.reduce(
            (acc: Record<string, number>, customer) => {
                acc[customer.product] =
                    (acc[customer.product] || 0) + 1;

                return acc;
            },
            {}
        );

        return Object.entries(grouped).map(([name, value]) => ({
            name:
                name.length > 24
                    ? `${name.substring(0, 24)}...`
                    : name,
            value,
        }));
    }, [customers]);

    const ageRanges = useMemo(() => {
        const ranges = {
            "18-25": 0,
            "26-49": 0,
            "50-65": 0,
            "65+": 0,
        };

        customers.forEach((customer) => {
            const age = Number(customer.age);

            if (age >= 18 && age <= 25) {
                ranges["18-25"]++;
            } else if (age >= 26 && age <= 49) {
                ranges["26-49"]++;
            } else if (age >= 50 && age <= 65) {
                ranges["50-65"]++;
            } else if (age > 65) {
                ranges["65+"]++;
            }
        });

        return Object.entries(ranges)
            .filter(([, value]) => value > 0)
            .map(([name, value]) => ({
                name,
                value,
            }));
    }, [customers]);

    const renderPercentage = (
        value: number,
        total: number
    ) => {
        return `${((value / total) * 100).toFixed(0)}%`;
    };

    const renderCustomPieLabel = ({
        cx,
        cy,
        midAngle,
        outerRadius,
        percent,
    }: any) => {
        const RADIAN = Math.PI / 180;

        const x =
            cx +
            (outerRadius + 25) *
            Math.cos(-midAngle * RADIAN);

        const y =
            cy +
            (outerRadius + 25) *
            Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill={textColor}
                textAnchor={x > cx ? "start" : "end"}
                dominantBaseline="central"
                fontSize={14}
                fontWeight={700}
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <div className="space-y-5">

            {/* KPI 1 */}
            <div className="rounded-2xl bg-slate-100 dark:bg-slate-700 p-4 shadow">
                <p className="text-sm text-gray-600 dark:text-slate-300">
                    Total Clientes
                </p>

                <h3 className="text-3xl font-bold text-[#0D418C] dark:text-white">
                    {customers.length}
                </h3>
            </div>

            {/* KPI 2 */}
            <div className="rounded-2xl bg-slate-100 dark:bg-slate-700 p-4 shadow">
                <p className="text-sm text-gray-600 dark:text-slate-300">
                    Edad Promedio
                </p>

                <h3 className="text-3xl font-bold text-[#0D418C] dark:text-white">
                    {averageAge}
                </h3>
            </div>

            {/* KPI 3 */}
            <div className="rounded-2xl bg-slate-100 dark:bg-slate-700 p-4 shadow">
                <p className="text-sm text-gray-600 dark:text-slate-300">
                    Productos Distintos
                </p>

                <h3 className="text-3xl font-bold text-[#0D418C] dark:text-white">
                    {productData.length}
                </h3>
            </div>

            {/* PIE CHART */}
            <div
                id="customer-age-chart"
                className="rounded-2xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 p-4 shadow"
            >

                <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
                    Distribución por Edad
                </h3>

                <ResponsiveContainer width="100%" height={320}>
                    <PieChart key={textColor}>
                        <Pie
                            data={ageRanges}
                            dataKey="value"
                            nameKey="name"
                            outerRadius={110}
                            isAnimationActive={false}
                            label={renderCustomPieLabel}
                            labelLine={{
                                stroke: textColor,
                            }}
                        >
                            {ageRanges.map((_, index) => (
                                <Cell
                                    key={index}
                                    fill={
                                        COLORS[
                                        index %
                                        COLORS.length
                                        ]
                                    }
                                />
                            ))}
                        </Pie>

                        <Tooltip
                            formatter={(value) => [
                                renderPercentage(
                                    Number(value),
                                    customers.length
                                ),
                                "Porcentaje",
                            ]}
                            contentStyle={{
                                backgroundColor: "#1E293B",
                                border: "none",
                                borderRadius: "12px",
                                color: "#FFFFFF",
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>

                <div className="mt-4 space-y-2">
                    {ageRanges.map((item, index) => (
                        <div
                            key={item.name}
                            className="flex items-center justify-between"
                        >
                            <div className="flex items-center gap-2">
                                <div
                                    className="h-3 w-3 rounded-full"
                                    style={{
                                        backgroundColor:
                                            COLORS[
                                            index %
                                            COLORS.length
                                            ],
                                    }}
                                />

                                <span className="text-gray-900 dark:text-white">
                                    {item.name} años
                                </span>
                            </div>

                            <span className="font-bold text-gray-900 dark:text-white">
                                {renderPercentage(
                                    item.value,
                                    customers.length
                                )}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* BARRAS */}
            <div
                id="customer-product-chart"
                className="rounded-2xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 p-4 shadow"
            >

                <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
                    Clientes por Producto
                </h3>

                <ResponsiveContainer width="100%" height={350}>
                    <BarChart
                        key={textColor}
                        data={productData}
                        layout="vertical"
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#64748B"
                        />

                        <XAxis
                            type="number"
                            allowDecimals={false}
                            domain={[0, "dataMax + 1"]}
                            tickCount={6}
                            tick={{
                                fill: textColor,
                            }}
                        />

                        <YAxis
                            type="category"
                            dataKey="name"
                            width={170}
                            tick={{
                                fill: textColor,
                                fontSize: 13,
                                fontWeight: 600,
                            }}
                        />

                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#1E293B",
                                border: "none",
                                borderRadius: "12px",
                            }}
                        />

                        <Bar
                            dataKey="value"
                            fill="#0D418C"
                            isAnimationActive={false}
                            radius={[0, 8, 8, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>

            </div>
        </div>
    );
};