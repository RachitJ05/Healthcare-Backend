
import express from "express";
import { body, param, validationResult } from "express-validator";
import authenticate from "../middleware/authMiddleware.js";

import {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
} from "../controllers/patientController.js";

const router = express.Router();

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array().map(({ path, msg }) => ({
        field: path,
        message: msg,
      })),
    });
  }

  next();
};

const validateId = param("id")
  .isInt({ min: 1 })
  .withMessage("Patient ID must be a positive integer");

const validatePatientFields = [
  body("age")
    .optional({ nullable: true })
    .isInt({ min: 0, max: 150 })
    .withMessage("Age must be an integer between 0 and 150"),

  body("gender")
    .optional({ nullable: true })
    .isString()
    .withMessage("Gender must be a string"),

  body("phone")
    .optional({ nullable: true })
    .isString()
    .withMessage("Phone must be a string"),

  body("address")
    .optional({ nullable: true })
    .isString()
    .withMessage("Address must be a string"),

  body("medicalHistory")
    .optional({ nullable: true })
    .isString()
    .withMessage("Medical history must be a string"),
];

router.use(authenticate);

router.post(
  "/",
  [
    body("name")
      .isString()
      .withMessage("Name is required")
      .bail()
      .trim()
      .notEmpty()
      .withMessage("Name cannot be empty"),
    ...validatePatientFields,
  ],
  validateRequest,
  createPatient
);

router.get("/", getPatients);

router.get("/:id", validateId, validateRequest, getPatientById);

router.put(
  "/:id",
  [
    validateId,
    body("name")
      .optional()
      .isString()
      .withMessage("Name must be a string")
      .bail()
      .trim()
      .notEmpty()
      .withMessage("Name cannot be empty"),
    ...validatePatientFields,
  ],
  validateRequest,
  updatePatient
);

router.delete("/:id", validateId, validateRequest, deletePatient);

export default router;
