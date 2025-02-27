import express = require("express");
import "../entity";
import userRouter from "./user.route";
import productRouter from "./product.route";

const router = express.Router();

router.use("/users", userRouter);

router.use("/products", productRouter);

export default router;
