
import prisma from "../config/database.js";

export const createDoctor = async (req, res, next) => {
  try {
    const { name, specialization, email, phone } = req.body;

    const doctor = await prisma.doctor.create({
      data: {
        name: name.trim(),
        specialization: specialization.trim(),
        email: email?.trim().toLowerCase() || null,
        phone: phone ?? null,
      },
    });

    res.status(201).json({
      message: "Doctor created successfully",
      doctor,
    });
  } catch (error) {
    next(error);
  }
};

export const getDoctors = async (req, res, next) => {
  try {
    const doctors = await prisma.doctor.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ doctors });
  } catch (error) {
    next(error);
  }
};

export const getDoctorById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    const doctor = await prisma.doctor.findUnique({
      where: { id },
    });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json({ doctor });
  } catch (error) {
    next(error);
  }
};

export const updateDoctor = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    const existingDoctor = await prisma.doctor.findUnique({
      where: { id },
    });

    if (!existingDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const data = {};

    for (const field of ["name", "specialization", "email", "phone"]) {
      if (req.body[field] !== undefined) {
        data[field] = req.body[field];
      }
    }

    if (typeof data.name === "string") {
      data.name = data.name.trim();
    }

    if (typeof data.specialization === "string") {
      data.specialization = data.specialization.trim();
    }

    if (typeof data.email === "string") {
      data.email = data.email.trim().toLowerCase();
    } else if (data.email === null) {
      data.email = null;
    }

    const doctor = await prisma.doctor.update({
      where: { id },
      data,
    });

    res.status(200).json({
      message: "Doctor updated successfully",
      doctor,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDoctor = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    const existingDoctor = await prisma.doctor.findUnique({
      where: { id },
    });

    if (!existingDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    await prisma.doctor.delete({ where: { id } });

    res.status(200).json({
      message: "Doctor deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
