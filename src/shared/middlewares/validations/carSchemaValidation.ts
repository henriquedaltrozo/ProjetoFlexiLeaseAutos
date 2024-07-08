import { Joi } from 'celebrate';

const objectIdSchema = Joi.string().regex(/^[0-9a-fA-F]{24}$/);

export const createCarSchema = {
  body: Joi.object({
    model: Joi.string().required(),
    color: Joi.string().required(),
    year: Joi.number().min(1950).max(2023).required(),
    value_per_day: Joi.number().required(),
    accessories: Joi.array()
      .items(
        Joi.object({
          description: Joi.string().required(),
        }),
      )
      .min(1)
      .required(),
    number_of_passengers: Joi.number().required(),
  }),
};

export const updateCarSchema = {
  body: Joi.object({
    model: Joi.string().optional(),
    color: Joi.string().optional(),
    year: Joi.number().min(1950).max(2023).optional(),
    value_per_day: Joi.number().optional(),
    accessories: Joi.array()
      .items(
        Joi.object({
          description: Joi.string().required(),
        }),
      )
      .min(1)
      .optional(),
    number_of_passengers: Joi.number().optional(),
  }),
  params: Joi.object({
    id: objectIdSchema.required(),
  }),
};

export const showCarSchema = {
  params: Joi.object({
    id: objectIdSchema.required(),
  }),
};

export const deleteCarSchema = {
  params: Joi.object({
    id: objectIdSchema.required(),
  }),
};

export const modifyAccessorySchema = {
  params: Joi.object({
    id: objectIdSchema.required(),
    accessoryId: objectIdSchema.required(),
  }),
  body: Joi.object({
    description: Joi.string().required(),
  }),
};
