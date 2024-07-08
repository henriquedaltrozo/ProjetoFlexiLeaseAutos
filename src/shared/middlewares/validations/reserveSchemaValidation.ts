import { Joi } from 'celebrate';
import { parse, isValid } from 'date-fns';

const brazilianDatePattern = /^\d{2}\/\d{2}\/\d{4}$/;

const objectIdSchema = Joi.string().regex(/^[0-9a-fA-F]{24}$/);

export const createReserveSchema = {
  body: Joi.object().keys({
    start_date: Joi.string()
      .pattern(brazilianDatePattern)
      .required()
      .custom((value, helpers) => {
        const date = parse(value, 'dd/MM/yyyy', new Date());
        if (!isValid(date)) {
          return helpers.error('any.invalid');
        }
        return value;
      }, 'Date Validation'),
    end_date: Joi.string()
      .pattern(brazilianDatePattern)
      .required()
      .custom((value, helpers) => {
        const date = parse(value, 'dd/MM/yyyy', new Date());
        if (!isValid(date)) {
          return helpers.error('any.invalid');
        }
        return value;
      }, 'Date Validation'),
    id_car: objectIdSchema.required(),
    id_user: objectIdSchema.required(),
  }),
};

export const deleteReserveSchema = {
  params: Joi.object({
    id: objectIdSchema.required(),
  }),
};

export const showReserveSchema = {
  params: Joi.object({
    id: objectIdSchema.required(),
  }),
};

export const updateReserveSchema = {
  body: Joi.object().keys({
    start_date: Joi.string()
      .pattern(brazilianDatePattern)
      .required()
      .custom((value, helpers) => {
        const date = parse(value, 'dd/MM/yyyy', new Date());
        if (!isValid(date)) {
          return helpers.error('any.invalid');
        }
        return value;
      }, 'Date Validation'),
    end_date: Joi.string()
      .pattern(brazilianDatePattern)
      .required()
      .custom((value, helpers) => {
        const date = parse(value, 'dd/MM/yyyy', new Date());
        if (!isValid(date)) {
          return helpers.error('any.invalid');
        }
        return value;
      }, 'Date Validation'),
    id_car: objectIdSchema.required(),
    id_user: objectIdSchema.required(),
  }),
  params: Joi.object({
    id: objectIdSchema.required(),
  }),
};
