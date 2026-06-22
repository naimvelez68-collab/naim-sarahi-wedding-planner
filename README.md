# 💍 Naim & Sarahí — Wedding Planner Digital

Sistema completo de planificación de boda para **Naim y Sarahí** · **8 de Agosto de 2026** · Ibarra, Ecuador.

## ✨ Módulos incluidos (20)

| Módulo | Descripción |
|--------|-------------|
| Dashboard | Resumen en tiempo real: días faltantes, invitados, presupuesto, alertas |
| Invitados | CRUD completo con filtros, estados y asignación de mesas |
| Mesas | Asignación visual, capacidad, alertas de exceso |
| Presupuesto | Categorías, prioridades, pagos, totales automáticos |
| Proveedores | Contratos, anticipos, riesgo, alertas |
| Cotizaciones | Precios reales Ecuador/Ibarra, comparación automática |
| Bocaditos | Comparador de opciones con calculadora de costo |
| Bebidas | Calculadora de cervezas + inventario completo |
| Ahorro & Decisiones | Qué reducir, eliminar, hacer nosotros o alquilar |
| Checklist | Tareas inteligentes con fechas y responsables |
| Cronograma del Día | Timeline minuto a minuto del 8/08/2026 |
| Lista de Compras | Por prioridad: comprar ya, después, cotizar, alquilar |
| Responsables | Asignación de personas clave |
| Ceremonia | Orden de la ceremonia editable con textos |
| Juegos & Dinámicas | Planificación de actividades para todas las edades |
| Bailes & Canciones | Canciones obligatorias, opcionales y prohibidas |
| Guion del MC | Maestro de ceremonia — guion editable e imprimible |
| Fotos Obligatorias | Checklist para el fotógrafo |
| Plan B | Contingencias: lluvia, proveedores, emergencias |
| Kit de Emergencia | Lista de empaque con estado por responsable |

## 🚀 Cómo correr en localhost

```bash
# 1. Clonar o descomprimir en tu computadora
cd naim-sarahi-wedding-planner

# 2. Instalar dependencias
npm install

# 3. Correr en desarrollo
npm run dev

# Abre: http://localhost:3000
```

## 📦 Subir a GitHub

```bash
# 1. Inicializar repositorio
git init
git add .
git commit -m "feat: wedding planner inicial - Naim y Sarahí 2026"

# 2. Crear repositorio en github.com y luego:
git remote add origin https://github.com/TU_USUARIO/naim-sarahi-wedding-planner.git
git branch -M main
git push -u origin main
```

## 🛠 Stack tecnológico

- **React 18** + **Vite 5** + **TypeScript**
- **Tailwind CSS** con colores personalizados (olive, gold, cream)
- **Zustand** con persist middleware → localStorage (fácil migración a Supabase)
- **React Router v6** para navegación
- **date-fns** para cálculos de fechas
- **Lucide React** para íconos

## 💾 Persistencia de datos

Todos los datos se guardan automáticamente en `localStorage` bajo la clave `wedding-planner-v1`.

Para migrar a Supabase en el futuro, solo reemplaza el middleware `persist` en `src/store/useWeddingStore.ts`.

## 📁 Estructura del proyecto

```
src/
├── types/          # Interfaces TypeScript de todos los modelos
├── constants/      # Configuración de la boda, labels
├── data/           # Datos de ejemplo (seed data)
├── store/          # Zustand store con persistencia
├── utils/          # Funciones helper (fechas, cálculos)
├── components/
│   ├── ui/         # Componentes reutilizables (Button, Card, Modal...)
│   └── layout/     # Sidebar, Layout, Header
└── pages/          # 20 páginas (una por módulo)
```
