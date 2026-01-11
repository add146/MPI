# MPI - Managemen Produksi Terintegrasi

Sistem manajemen bisnis all-in-one untuk **UMKM dan IKM** di Indonesia.

![Dashboard](docs/screen.png)

## 🚀 Features

- ✅ **Resep Produksi (BOM)** - Kelola resep produk dan hitung HPP otomatis
- ✅ **Multi-Level Pricing** - 4 tingkat harga (Retail, Reseller, Agen, Distributor)
- ✅ **Sistem Poin** - Customer loyalty dengan auto level-up
- ✅ **Bundle Promo** - Paket produk dengan harga khusus
- ✅ **Inventory Terintegrasi** - Stok bahan baku & produk jadi
- ✅ **Laporan Keuangan** - Neraca & Laba Rugi + Export Excel
- ✅ **Multi-Outlet** - Kelola beberapa cabang

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS |
| State | TanStack Query + Zustand |
| Backend | Hono.js |
| Database | PostgreSQL + Drizzle ORM |
| Auth | JWT |

## 📁 Project Structure

```
mpi/
├── apps/
│   ├── web/          # React Dashboard
│   └── api/          # Hono.js Backend
├── packages/
│   └── db/           # Drizzle ORM Schema
├── docs/             # Documentation & UI Reference
└── package.json      # Monorepo root
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+
- PostgreSQL 15+

### Installation

```bash
# Clone repository
git clone https://github.com/add146/MPI.git
cd MPI

# Install dependencies
pnpm install

# Setup environment
cp .env.example .env
# Edit .env with your database credentials

# Generate database
pnpm db:push

# Run development server
pnpm dev
```

### URLs

- **Dashboard**: http://localhost:5173
- **API**: http://localhost:3001

## 📖 API Endpoints

| Endpoint | Description |
|----------|-------------|
| `POST /api/auth/login` | User login |
| `POST /api/auth/register` | User registration |
| `GET /api/products` | List products |
| `GET /api/products/:id/hpp` | Get product HPP |
| `GET /api/raw-materials` | List raw materials |
| `PUT /api/recipes/product/:id` | Update product recipe |
| `GET /api/customers` | List customers |
| `GET /api/price-levels` | List price levels |
| `GET /api/bundles` | List bundles |
| `POST /api/transactions` | Create transaction |
| `GET /api/reports/profit-loss` | P&L Report |
| `GET /api/reports/balance-sheet` | Balance Sheet |
| `GET /api/reports/export/excel` | Export to Excel |

## 📱 UI/UX Reference

Design references are available in the following folders:
- `Dashboard 01/` - Production Analytics
- `Dashboard 02/` - Dashboard Overview
- `POS/` - Point of Sale
- `Checkout/` - Payment Flow

## 📄 License

MIT License
