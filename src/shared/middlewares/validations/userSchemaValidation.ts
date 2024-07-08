import { Joi } from 'celebrate';
import { parse, isValid } from 'date-fns';

const brazilianDatePattern = /^\d{2}\/\d{2}\/\d{4}$/;

const objectIdSchema = Joi.string().regex(/^[0-9a-fA-F]{24}$/);

export const createUserSchema = {
  body: Joi.object({
    name: Joi.string().required(),
    cpf: Joi.string().required(),
    birth: Joi.string()
      .pattern(brazilianDatePattern)
      .required()
      .custom((value, helpers) => {
        const date = parse(value, 'dd/MM/yyyy', new Date());
        if (!isValid(date)) {
          return helpers.error('any.invalid');
        }
        return value;
      }, 'Date Validation'),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    cep: Joi.string().required(),
    qualified: Joi.string().valid('sim', 'não').required(),
  }),
};

export const updateUserSchema = {
  body: Joi.object({
    name: Joi.string().optional(),
    cpf: Joi.string().optional(),
    birth: Joi.string()
      .pattern(brazilianDatePattern)
      .optional()
      .custom((value, helpers) => {
        const date = parse(value, 'dd/MM/yyyy', new Date());
        if (!isValid(date)) {
          return helpers.error('any.invalid');
        }
        return value;
      }, 'Date Validation'),
    email: Joi.string().email().optional(),
    password: Joi.string().min(6).optional(),
    cep: Joi.string().optional(),
    qualified: Joi.string().valid('sim', 'não').optional(),
  }),
};

export const showUserSchema = {
  params: Joi.object({
    id: objectIdSchema.required(),
  }),
};

export const deleteUserSchema = {
  params: Joi.object({
    id: objectIdSchema.required(),
  }),
};
