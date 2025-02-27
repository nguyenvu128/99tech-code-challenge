import { Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

/**
 * This function will response error message
 * @param {*} err
 * @param {*} res
 * @param {*} next
 * @returns
 */
export const joiValidationResponse = (
  err: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const messages = err.details.map((detail: any) => {
      return detail.message;
    });

    return res.status(StatusCodes.BAD_REQUEST).json({
      messages,
    });
  } catch (err) {
    return next(err);
  }
};

/**
 * This function will calculate pagination and sorting
 * @param page number
 * @param limit
 * @param sort
 * @returns
 */
export const pagination = (page: number, limit: number, sort: string) => {
  const skip = (page - 1) * limit;
  const sortField = sort.split(":")[0] || "createdAt";
  const sortOrder = sort.split(":")[1] === "asc" ? "ASC" : "DESC";
  return { skip, sortField, sortOrder };
};
