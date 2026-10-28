
import prisma from "../config/database.js";

export const createPatient = async (req, res, next) => {
  try {
    const { name, age, gender, phone, address, medicalHistory } = req.body;

    const patient = await prisma.patient.create({
      data: {
        name: name.trim(),
        age: age ?? null,
        gender: gender ?? null,
        phone: phone ?? null,
        address: address ?? null,
        medicalHistory: medicalHistory ?? null,
        userId: req.user.id,
      },
    });

    res.status(201).json({
      message: "Patient created successfully",
      patient,
    });
  } catch (error) {
    next(error);
  }
};

export const getPatients = async (req, res, next) => {
  try {
    const patients = await prisma.patient.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ patients });
  } catch (error) {
    next(error);
  }
};

export const getPatientById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    const patient = await prisma.patient.findFirst({
      where: { id, userId: req.user.id },
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({ patient });
  } catch (error) {
    next(error);
  }
};

export const updatePatient = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    const existingPatient = await prisma.patient.findFirst({
      where: { id, userId: req.user.id },
    });

    if (!existingPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const data = {};

    for (const field of [
      "name",
      "age",
      "gender",
      "phone",
      "address",
      "medicalHistory",
    ]) {
      if (req.body[field] !== undefined) {
        data[field] = req.body[field];
      }
    }

    if (typeof data.name === "string") {
      data.name = data.name.trim();
    }

    const patient = await prisma.patient.update({
      where: { id },
      data,
    });

    res.status(200).json({
      message: "Patient updated successfully",
      patient,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePatient = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    const existingPatient = await prisma.patient.findFirst({
      where: { id, userId: req.user.id },
    });

    if (!existingPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    await prisma.patient.delete({ where: { id } });

    res.status(200).json({
      message: "Patient deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
