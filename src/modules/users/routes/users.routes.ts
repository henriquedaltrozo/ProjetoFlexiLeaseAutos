import { Router } from 'express';
import { celebrate } from 'celebrate';
import UsersController from '../controllers/UsersController';
import {
  createUserSchema,
  updateUserSchema,
  showUserSchema,
  deleteUserSchema,
} from '../../../shared/middlewares/validations/userSchemaValidation';

const usersRouter = Router();
const usersController = new UsersController();

usersRouter.post('/', celebrate(createUserSchema), usersController.create);
usersRouter.get('/', usersController.list);
usersRouter.get('/:id', celebrate(showUserSchema), usersController.show);
usersRouter.put('/:id', celebrate(updateUserSchema), usersController.update);
usersRouter.delete('/:id', celebrate(deleteUserSchema), usersController.delete);

export default usersRouter;
