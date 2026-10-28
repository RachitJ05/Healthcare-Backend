
import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import mappingRoutes from "./routes/mappingRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Healthcare Backend API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/mappings", mappingRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      message: "Invalid JSON request body",
    });
  }

  if (err.code === "P2002") {
    return res.status(409).json({
      message: "A record with this value already exists",
    });
  }

  if (err.code === "P2003") {
    return res.status(400).json({
      message: "Invalid reference to a related record",
    });
  }

  console.error(err);

  res.status(500).json({
    message: "Internal server error",
  });
});

export default app;
