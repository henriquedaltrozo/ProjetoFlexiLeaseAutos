import { Request, Response } from 'express';
import CreateUserService from '../services/CreateUserService';
import ListUsersService from '../services/ListUserService';
import ShowUserService from '../services/ShowUserService';
import UpdateUserService from '../services/UpdateUserService';
import DeleteUserService from '../services/DeleteUserService';
import { formatDate } from '../../../shared/utils/formatDate';
import { handleError } from '../../../shared/errors/HandleError';

class UsersController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const createUserService = new CreateUserService();
      const user = await createUserService.execute(req.body);

      user.birth = formatDate(user.birth);

      return res.status(201).json(user);
    } catch (error) {
      return handleError(res, error);
    }
  }

  public async list(req: Request, res: Response): Promise<Response> {
    try {
      const listUsersService = new ListUsersService();
      const users = await listUsersService.execute();
      users.forEach(user => {
        user.birth = formatDate(user.birth);
      });
      return res.status(200).json(users);
    } catch (error) {
      return handleError(res, error);
    }
  }

  public async show(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const showUserService = new ShowUserService();
      const user = await showUserService.execute(id);

      if (user) {
        user.birth = formatDate(user.birth);
      }

      return res.status(200).json(user);
    } catch (error) {
      return handleError(res, error);
    }
  }

  public async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const updateUserService = new UpdateUserService();
      const user = await updateUserService.execute(id, req.body);

      if (user) {
        user.birth = formatDate(user.birth);
      }

      return res.status(200).json(user);
    } catch (error) {
      return handleError(res, error);
    }
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const deleteUserService = new DeleteUserService();
      await deleteUserService.execute(id);
      return res.status(204).send();
    } catch (error) {
      return handleError(res, error);
    }
  }
}

export default UsersController;
