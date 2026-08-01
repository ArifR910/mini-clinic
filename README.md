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

| Role | Hak Akses |
| :--- | :--- | :--- | :--- |
| **Administrator** | Akses penuh ke seluruh fitur & statistik dashboard |
| **Petugas Pendaftaran** | Data pasien, pendaftaran kunjungan, & nomor antrean |
| **Dokter** | Antrean, rekam medis (SOAP), & resep obat |

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

---

## 📁 Struktur Project

```text
MINICLINIC/
├── docs/                         # File dokumentasi (ERD, Postman Collection, Database Dump .sql)
│
├── frontend/                     # Source Code Frontend (React.js + Vite)
│   ├── public/
│   ├── src/
│   │   ├── api/                  # Konfigurasi Axios & API Client
│   │   ├── assets/               # Gambar, logo, & aset statis
│   │   ├── components/           # Reusable UI Components
│   │   ├── context/              # Auth Context & Management State
│   │   ├── pages/                # Halaman Aplikasi (Dashboard, Patients, Queues, MedicalRecord, PatientHistory, dll)
│   │   ├── App.jsx               # Routing & Root Component
│   │   └── main.jsx              # Entry point React
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── mini-clinic-api/              # Source Code Backend (Node.js + Express)
│   ├── src/                      # Controller, Routes, Middlewares, & Config
│   ├── .env                      # File environment lokal
│   ├── index.js                  # Entry point Server Express
│   ├── package.json
│   └── .gitignore
│
├── request/                      # File pengujian API/HTTP Client
├── .env.example                  # Template variabel lingkungan
├── .gitignore
└── README.md                     # Dokumentasi utama proyek
```

---

## 📂 Deliverables & Dokumentasi Tambahan
Seluruh berkas dokumentasi telah disimpan di folder docs:
1. Entity Relationship Diagram (ERD): docs/erd.png
2. Postman Collection: docs/Mini Clinic API.postman_collection.json
2. Database Dump (.sql): docs/mini-clinic-db.sql
