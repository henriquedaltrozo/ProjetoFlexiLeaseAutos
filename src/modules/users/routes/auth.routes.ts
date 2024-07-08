import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import AuthController from '../controllers/AuthController';

const authRouter = Router();
const authController = new AuthController();

authRouter.post(
  '/',
  celebrate({
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  authController.authenticate,
);

export default authRouter;
