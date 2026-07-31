const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./src/config/db");

const authRoutes = require("./src/routes/authRoutes");
const patientRoutes = require("./src/routes/patientRoutes");
const registrationRoutes = require("./src/routes/registrationRoutes");
const medicalRecordRoutes = require("./src/routes/medicalRecordRoutes");
const queueRoutes = require("./src/routes/queueRoutes");
const dashboardRoutes = require("./src/routes/dashboardRoutes");
const doctorRoutes = require("./src/routes/doctorRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Selamat datang di API Mini Clinic Service!",
    status: "Server Berjalan dengan Baik",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/medical-records", medicalRecordRoutes);
app.use("/api/queues", queueRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/doctors", doctorRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
