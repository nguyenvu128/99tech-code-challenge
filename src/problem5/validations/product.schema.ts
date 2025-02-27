import * as Joi from "joi";

export const CreateProductValidationSchema = Joi.object().keys({
  name: Joi.string().required(),
  type: Joi.string().required(),
  price: Joi.number().required(),
  quantity: Joi.number().required(),
  description: Joi.string(),
});

export const UpdateProductValidationSchema = Joi.object().keys({
  name: Joi.string(),
  type: Joi.string(),
  price: Joi.number(),
  quantity: Joi.number(),
  description: Joi.string(),
});
