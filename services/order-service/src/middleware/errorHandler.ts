import { NextFunction, Request, Response } from "express";
import {
  UniqueConstraintError,
  ForeignKeyConstraintError,
  ValidationError,
  DatabaseError,
} from "sequelize";

import { AppError } from "../utils/errors/AppError";

export const errorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(error);

  // Application errors
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });

    return;
  }

  // Sequelize unique constraint violation
  if (error instanceof UniqueConstraintError) {
    res.status(409).json({
      success: false,
      message: "A resource with the provided value already exists",
    });

    return;
  }

  // Sequelize foreign key violation
  if (error instanceof ForeignKeyConstraintError) {
    res.status(400).json({
      success: false,
      message: "Referenced resource does not exist",
    });

    return;
  }

  // PostgreSQL errors wrapped by Sequelize
  if (error instanceof DatabaseError) {
    const databaseError = error.parent as {
      code?: string;
    };

    switch (databaseError.code) {
      case "23514":
        res.status(400).json({
          success: false,
          message: "Request violates a database constraint",
        });

        return;

      case "23505":
        res.status(409).json({
          success: false,
          message: "A resource with the provided value already exists",
        });

        return;

      case "23503":
        res.status(400).json({
          success: false,
          message: "Referenced resource does not exist",
        });

        return;
    }
  }

  // Unknown error
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};