import * as Joi from "joi";

export const SignUpValidationSchema = Joi.object().keys({
  email: Joi.string().required().email(),
  password: Joi.string().required().min(8).max(30),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
});

export const SignInValidationSchema = Joi.object().keys({
  email: Joi.string().required().email(),
  password: Joi.string().required().min(8).max(30),
});

export const RefreshTokenValidationSchema = Joi.object().keys({
  refreshToken: Joi.string().required(),
});
