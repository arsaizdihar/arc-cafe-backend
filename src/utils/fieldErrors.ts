import { Response } from "express";
import { Result, ValidationError } from "express-validator";

export default function fieldErrors(
  errors: Result<ValidationError>,
  res: Response
) {
  return res.status(400).json({ errors: errors.mapped() });
}
