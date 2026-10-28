
import prisma from "../config/database.js";

export const assignDoctor = async (req, res, next) => {
  try {
    const patientId = Number(req.body.patientId);
    const doctorId = Number(req.body.doctorId);

    const patient = await prisma.patient.findFirst({
      where: { id: patientId, userId: req.user.id },
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
    });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const mapping = await prisma.patientDoctor.create({
      data: { patientId, doctorId },
      include: { patient: true, doctor: true },
    });

    return res.status(201).json({
      message: "Doctor assigned to patient successfully",
      mapping,
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({
        message: "This doctor is already assigned to this patient",
      });
    }

    next(error);
  }
};

export const getMappings = async (req, res, next) => {
  try {
    const mappings = await prisma.patientDoctor.findMany({
      where: { patient: { userId: req.user.id } },
      include: { patient: true, doctor: true },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ mappings });
  } catch (error) {
    next(error);
  }
};

export const getPatientDoctors = async (req, res, next) => {
  try {
    const patientId = Number(req.params.patient_id);

    const patient = await prisma.patient.findFirst({
      where: { id: patientId, userId: req.user.id },
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const mappings = await prisma.patientDoctor.findMany({
      where: { patientId },
      include: { doctor: true },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      patientId,
      doctors: mappings.map((mapping) => mapping.doctor),
    });
  } catch (error) {
    next(error);
  }
};

export const removeMapping = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    const mapping = await prisma.patientDoctor.findFirst({
      where: { id, patient: { userId: req.user.id } },
    });

    if (!mapping) {
      return res.status(404).json({ message: "Mapping not found" });
    }

    await prisma.patientDoctor.delete({ where: { id } });

    res.status(200).json({
      message: "Doctor removed from patient successfully",
    });
  } catch (error) {
    next(error);
  }
};
