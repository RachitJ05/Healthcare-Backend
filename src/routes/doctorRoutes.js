
import express from "express";
import { body, param, validationResult } from "express-validator";
import authenticate from "../middleware/authMiddleware.js";

import {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
} from "../controllers/doctorController.js";

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
  .withMessage("Doctor ID must be a positive integer");

const requiredDoctorFields = [
  body("name")
    .isString()
    .withMessage("Name is required")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Name cannot be empty"),

  body("specialization")
    .isString()
    .withMessage("Specialization is required")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Specialization cannot be empty"),
];

const optionalDoctorFields = [
  body("email")
    .optional({ nullable: true })
    .isEmail()
    .withMessage("Enter a valid email address"),

  body("phone")
    .optional({ nullable: true })
    .isString()
    .withMessage("Phone must be a string"),
];

const optionalUpdateFields = [
  body("name")
    .optional()
    .isString()
    .withMessage("Name must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Name cannot be empty"),

  body("specialization")
    .optional()
    .isString()
    .withMessage("Specialization must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Specialization cannot be empty"),
];

router.use(authenticate);

router.post(
  "/",
  [...requiredDoctorFields, ...optionalDoctorFields],
  validateRequest,
  createDoctor
);

router.get("/", getDoctors);

router.get("/:id", validateId, validateRequest, getDoctorById);

router.put(
  "/:id",
  [validateId, ...optionalUpdateFields, ...optionalDoctorFields],
  validateRequest,
  updateDoctor
);

router.delete("/:id", validateId, validateRequest, deleteDoctor);

export default router;
