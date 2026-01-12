---
description: Deploy MPI to aaPanel server with Cloudflare Zero Trust
---

# Deploy MPI ke Server aaPanel

## Prasyarat
- aaPanel sudah terinstall di server 192.168.10.15
- Node.js >= 18 sudah terinstall (via aaPanel App Store)
- PM2 sudah terinstall (`npm install -g pm2`)
- PostgreSQL sudah terinstall dan database `mpi_db` sudah dibuat
- Cloudflare Zero Trust Tunnel sudah dikonfigurasi

## Langkah-langkah Deployment

### 1. Clone Repository ke Server
```bash
cd /www/wwwroot/mpi.khibroh.com
git clone https://github.com/add146/MPI.git .
```

### 2. Install Dependencies
```bash
# Install pnpm jika belum ada
npm install -g pnpm

# Install semua dependencies
pnpm install
```

### 3. Konfigurasi Environment
```bash
# Buat file .env di packages/db
cat > packages/db/.env << 'EOF'
DATABASE_URL=mysql://mpi_user:Bismillah123@localhost:3306/mpi_db
EOF

# Buat file .env di apps/api  
cat > apps/api/.env << 'EOF'
PORT=3005
JWT_SECRET=mpi_secret_key_2024_random_string
DATABASE_URL=mysql://mpi_user:Bismillah123@localhost:3306/mpi_db
EOF
```

### 4. Setup Database di aaPanel
```bash
# Database sudah dibuat via aaPanel
# Pastikan user mpi_user punya akses ke database mpi_db
```

### 5. Build Aplikasi
```bash
# Build frontend dan backend
pnpm build
```

### 6. Konfigurasi API Server dengan PM2
```bash
# Masuk ke folder api
cd /www/wwwroot/mpi.khibroh.com/apps/api

# Start dengan PM2 di port 3005
pm2 start dist/index.js --name mpi-api -- --port 3005

# Simpan konfigurasi agar auto-start saat reboot
pm2 save
pm2 startup
```

### 7. Konfigurasi Nginx (via aaPanel)

Buat website baru di aaPanel dengan domain `mpi.khibroh.com`, lalu edit konfigurasi Nginx:

```nginx
server {
    listen 80;
    server_name mpi.khibroh.com;
    
    # Root directory untuk frontend
    root /www/wwwroot/mpi.khibroh.com/apps/web/dist;
    index index.html;
    
    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
    
    # Frontend - SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # API Proxy ke backend (port 3005)
    location /api/ {
        proxy_pass http://127.0.0.1:3005/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

### 8. Konfigurasi Cloudflare Zero Trust Tunnel

Di Cloudflare Zero Trust Dashboard:
1. Buka **Access > Tunnels**
2. Pilih tunnel yang sudah ada
3. Tambah **Public Hostname**:
   - Subdomain: `mpi`
   - Domain: `khibroh.com`
   - Type: `HTTP`
   - URL: `192.168.10.15:80`

### 9. Verifikasi Deployment
// turbo
```bash
# Cek status PM2
pm2 status

# Cek logs API
pm2 logs mpi-api

# Test API endpoint
curl http://localhost:3005/api/health
```

## Update Deployment

Untuk update aplikasi setelah ada perubahan:

```bash
cd /www/wwwroot/mpi.khibroh.com

# Pull perubahan terbaru
git pull

# Install dependencies baru (jika ada)
pnpm install

# Rebuild
pnpm build

# Restart API
pm2 restart mpi-api
```

## Troubleshooting

### Port 3005 sudah terpakai
```bash
# Cek proses yang menggunakan port
lsof -i :3005

# Gunakan port lain (misal 3002)
# Edit .env dan restart PM2
```

### API tidak bisa connect ke database
```bash
# Cek PostgreSQL status
systemctl status postgresql

# Cek connection
psql -U mpi_user -d mpi_db -h localhost
```

### Frontend menampilkan blank page
```bash
# Pastikan build berhasil
ls -la /www/wwwroot/mpi.khibroh.com/apps/web/dist

# Cek Nginx error logs
tail -f /www/wwwroot/logs/nginx_error.log
```
