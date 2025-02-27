import express = require("express");
import {
  CreateProductValidationSchema,
  UpdateProductValidationSchema,
} from "../validations/product.schema";
import { validateSchema, validateToken } from "../middlewares";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProductById,
  deleteProductById,
} from "../controller";
import { REQUEST_PARAMS } from "../constant/index";

const router = express.Router({});

router.post(
  "/",
  validateToken,
  validateSchema(CreateProductValidationSchema, REQUEST_PARAMS.BODY),
  createProduct
);
router.get("/", validateToken, getProducts);
router.get("/:id", validateToken, getProductById);
router.put(
  "/:id",
  validateToken,
  validateSchema(UpdateProductValidationSchema, REQUEST_PARAMS.BODY),
  updateProductById
);
router.put("/delete/:id", validateToken, deleteProductById);

export default router;
