# Mini Clinic Information System 🏥

Mini Clinic Information System adalah aplikasi berbasis web yang dirancang untuk membantu proses administrasi dan pelayanan klinik pratama secara terintegrasi. Aplikasi ini mencakup pengelolaan data master pasien, pendaftaran kunjungan, pembuatan & panggilan antrean otomatis, pencatatan rekam medis dokter (metode SOAP), serta dashboard statistik pelayanan.

---

## 🛠️ Tech Stack & Teknologi
- **Frontend**: React.js (Vite)
- **Backend**: Node.js (Express.js)
- **Database**: MySQL
- **Authentication**: JSON Web Token (JWT)
- **Version Control**: Git & GitHub

---

## 👥 Akun Login Testing
Aplikasi menyediakan 3 role utama dengan hak akses tersendiri:

| Role | Username | Password | Hak Akses |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin` | `password123` | Akses penuh ke seluruh fitur & statistik dashboard |
| **Petugas Pendaftaran** | `petugas` | `password123` | Master data pasien, pendaftaran kunjungan, & nomor antrean |
| **Dokter** | `dokter` | `password123` | Pemanggilan antrean, rekam medis (SOAP), & resep obat |

---

## 🚀 Cara Instalasi & Menjalankan Aplikasi

### 1. Prasyarat System
- Node.js
- MySQL Server (XAMPP)
- Git

### 2. Setup Database
1. Buka MySQL Server / phpMyAdmin Anda.
2. Buat database baru bernama `mini_clinic_db`:
   ```sql
   CREATE DATABASE mini_clinic_db;

### 3. Setup Backend
1. Masuk ke direktori backend:
    cd .../mini-clinic-api
2. Masuk ke direktori backend:
    npm install
3. Salin file .env.example menjadi .env
4. Pastikan konfigurasi di .env sudah sesuai dengan kredensial database lokal Anda
5. npm run dev

### 4. Setup Backend
1. Buka terminal baru, lalu masuk ke direktori frontend:
    cd .../frontend
2. Install dependensi:
    npm install
3. Jalankan server frontend:
    npm run dev


## 📂 Deliverables & Dokumentasi Tambahan
Seluruh berkas dokumentasi telah disimpan di folder docs:
1. Entity Relationship Diagram (ERD): docs/erd.png
2. Postman Collection: docs/Mini Clinic API.postman_collection.json
2. Database Dump (.sql): docs/mini-clinic-db.sql