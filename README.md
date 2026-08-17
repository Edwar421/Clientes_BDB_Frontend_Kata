# Clientes BDB Frontend

Sistema de gestión de clientes del Banco de Bogotá.

## Requisitos

- Node.js >= 16.x
- npm >= 8.x

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

Accede a `http://localhost:5173`

## Producción

### Construir

```bash
npm run build
```

### Previsualizar build

```bash
npm run preview
```

### Despliegue

El deploy a AWS S3 se ejecuta automáticamente al hacer push a `main` via GitHub Actions.

## Variables de entorno

Crear archivo `.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

## Estructura del proyecto

```
src/
├── components/
│   ├── atoms/          # Componentes básicos (Button, Input, Modal)
│   ├── molecules/      # Componentes compuestos (CustomerCard, CustomerForm)
│   ├── organisms/      # Componentes complejos (Header, CustomerList)
│   └── templates/      # Layouts (DashboardTemplate)
├── pages/              # Páginas (DashboardPage, RegisterPage)
├── services/           # Llamadas API (api.ts)
├── types/              # Tipos TypeScript
├── App.tsx
└── main.tsx
```

## Componentes principales

| Componente | Descripción |
|------------|-------------|
| `DashboardPage` | Lista de clientes con filtros y acciones |
| `RegisterPage` | Formulario de registro de clientes |
| `CustomerForm` | Formulario con validación (Formik + Yup) |
| `CustomerList` | Tabla de clientes con búsqueda |
| `Header` | Navegación y toggle de tema |

## Pruebas

```bash
npm run test              # Ejecutar pruebas
npm run test:coverage     # Con cobertura
```

Archivos de test ubicados junto a sus componentes: `Button.test.tsx`, `CustomerForm.test.tsx`

## CI/CD

Pipeline en `.github/workflows/deploy.yml`:

1. **Build** - Compila el proyecto con Vite
2. **Terraform** - Provisiona infraestructura en AWS
3. **Deploy** - Sincroniza build a S3

Se ejecuta automáticamente en push a `main` (ignora cambios en archivos `.md`). 
