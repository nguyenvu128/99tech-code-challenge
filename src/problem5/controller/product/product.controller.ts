import { genSaltSync, hashSync, compareSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from "uuid";
import { AppDataSource } from "../../config/data-source";
import { Product, User } from "../../entity";
import { pagination } from "../../utils";
import { Like } from "typeorm";

const productRepository = AppDataSource.getRepository(Product);
/**
 * This function is used to create product
 * @param req Request body parameter
 * @param res Response object
 * @param next NextFunction callback
 * @returns result http status code and message
 */
export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, type, price, description, quantity } = req.body;
    const product = productRepository.create({
      name,
      type,
      price,
      userId: req.user.id,
      description,
      quantity,
    });
    await productRepository.save(product);

    return res.status(StatusCodes.CREATED).json({
      product,
    });
  } catch (e) {
    console.log(e);
    return next(e);
  }
};

/**
 * This function is used to get list of products
 * @param req Request query parameter
 * @param res Response object
 * @param next NextFunction callback
 * @returns result list of products
 */
export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { search } = req.query;
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const sort = req.query.sort as string;
    const { skip, sortField, sortOrder } = pagination(page, limit, sort);

    const [products, total] = await productRepository.findAndCount({
      where: search
        ? [
            { name: Like(`%${search}%`), deletedAt: null },
            { type: Like(`%${search}%`), deletedAt: null },
            { description: Like(`%${search}%`), deletedAt: null },
          ]
        : { deletedAt: null },
      skip,
      take: limit,
      order: {
        [sortField]: sortOrder,
      },
    });
    if (products.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "No data" });
    }

    return res.status(StatusCodes.ACCEPTED).json({
      products,
      total,
    });
  } catch (e) {
    console.log(e);
    return next(e);
  }
};

/**
 * This function is used to get product by id
 * @param req Request query parameter
 * @param res Response object
 * @param next NextFunction callback
 * @returns result product by id
 */
export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const productId = parseInt(req.params.id as string, 10);
    const product = await productRepository.findOneBy({
      id: productId,
      deletedAt: null,
    });
    if (!product) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Product does not exist",
      });
    }

    return res.status(StatusCodes.OK).json({
      product,
    });
  } catch (e) {
    console.log(e);
    return next(e);
  }
};

/**
 * This function is used to update product by id
 * @param req Request body parameter
 * @param res Response object
 * @param next NextFunction callback
 * @returns result http status code and message
 */
export const updateProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, type, price, quantity, description } = req.body;
    const productId = parseInt(req.params.id as string, 10);
    const product = await productRepository.findOne({
      where: { id: productId },
      relations: ["user"],
    });

    if (!product) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Product does not exist",
      });
    }

    if (product.userId !== req.user.id) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "You are not authorized to update this product",
      });
    }

    await productRepository.update(
      {
        id: productId,
      },
      {
        name,
        type,
        price,
        quantity,
        description,
      }
    );

    return res.status(StatusCodes.OK).json({
      message: "Product updated successfully",
    });
  } catch (e) {
    console.log(e);
    return next(e);
  }
};

/**
 * This function is used to soft delete product by id
 * @param req Request query parameter
 * @param res Response object
 * @param next NextFunction callback
 * @returns result http status code and message
 */
export const deleteProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const productId = parseInt(req.params.id as string, 10);
    const product = await productRepository.findOne({
      where: { id: productId },
      relations: ["user"],
    });
    if (!product) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Product does not exist",
      });
    }

    if (product.userId !== req.user.id) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "You are not allowed to delete this product",
      });
    }

    await productRepository.softDelete({ id: productId });

    return res.status(StatusCodes.OK).json({
      message: "Product deleted successfully",
    });
  } catch (e) {
    console.log(e);
    return next(e);
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProductById,
  deleteProductById,
};
