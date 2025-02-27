import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { joiValidationResponse } from "../utils";
import { Schema } from "joi";
import * as jwt from "jsonwebtoken";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/user";

/**
 * validate input data before receiving request from client
 * @param schema Joi validator schema
 * @param parameter params constant body
 * @returns next()
 */
export const validateSchema =
  (schema: Schema, parameter: string) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const dataNeedValidation: { [key: string]: any } = {};
      Object.assign(dataNeedValidation, req[parameter]);

      const { error } = schema.validate(dataNeedValidation);

      if (error) {
        return joiValidationResponse(error, res, next);
      }

      return next();
    } catch (e) {
      const msg = e.message ? e.message : JSON.stringify(e);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: msg,
      });
    }
  };

interface JwtPayload {
  id: number;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * This function is middleware to validate token
 * @param req Request body parameter
 * @param res Response object
 * @param next NextFunction callback
 */
export const validateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userRepository = AppDataSource.getRepository(User);

  const authHeader = req.headers["authorization"];
  const bearerToken = authHeader.split(" ")[1];

  const token =
    bearerToken || req.headers["token"] || req.query.token || req.body.token;
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.TOKEN_SECRET as string
    ) as JwtPayload;

    const user = await userRepository.findOneBy({ email: decoded.email });
    req.user = user; // Set req.auth
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
