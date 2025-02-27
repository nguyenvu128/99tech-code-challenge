import express = require("express");
import {
  SignUpValidationSchema,
  SignInValidationSchema,
  RefreshTokenValidationSchema,
} from "../validations/user.schema";
import { validateSchema, validateToken } from "../middlewares";
import {
  signIn,
  signOut,
  signUp,
  getNewRefreshToken,
} from "../controller/user";
import { REQUEST_PARAMS } from "../constant/index";

const router = express.Router({});

router.post(
  "/sign-up",
  validateSchema(SignUpValidationSchema, REQUEST_PARAMS.BODY),
  signUp
);
router.post(
  "/sign-in",
  validateSchema(SignInValidationSchema, REQUEST_PARAMS.BODY),
  signIn
);
router.post("/sign-out", validateToken, signOut);
router.post(
  "/refresh-token",
  validateSchema(RefreshTokenValidationSchema, REQUEST_PARAMS.BODY),
  getNewRefreshToken
);

export default router;
