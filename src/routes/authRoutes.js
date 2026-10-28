
import express from "express";
import { body, validationResult } from "express-validator";
import { register, login } from "../controllers/authController.js";

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

router.post(
  "/register/",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").trim().isEmail().withMessage("A valid email is required"),
    body("password")
      .isString()
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters"),
  ],
  validateRequest,
  register
);

router.post(
  "/login/",
  [
    body("email").trim().isEmail().withMessage("A valid email is required"),
    body("password").isString().notEmpty().withMessage("Password is required"),
  ],
  validateRequest,
  login
);

export default router;
