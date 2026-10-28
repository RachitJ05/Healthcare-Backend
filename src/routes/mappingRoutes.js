
import express from "express";
import { body, param, validationResult } from "express-validator";
import authenticate from "../middleware/authMiddleware.js";

import {
  assignDoctor,
  getMappings,
  getPatientDoctors,
  removeMapping,
} from "../controllers/mappingController.js";

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

const validateId = (field) =>
  param(field)
    .isInt({ min: 1 })
    .withMessage(`${field} must be a positive integer`);

router.use(authenticate);

router.post(
  "/",
  [
    body("patientId")
      .isInt({ min: 1 })
      .withMessage("patientId must be a positive integer"),

    body("doctorId")
      .isInt({ min: 1 })
      .withMessage("doctorId must be a positive integer"),
  ],
  validateRequest,
  assignDoctor
);

router.get("/", getMappings);

router.get(
  "/:patient_id",
  validateId("patient_id"),
  validateRequest,
  getPatientDoctors
);

router.delete(
  "/:id",
  validateId("id"),
  validateRequest,
  removeMapping
);

export default router;
