import { Request, Response } from 'express';
import CreateCarService from '../services/CreateCarService';
import ListCarService from '../services/ListCarService';
import DeleteCarService from '../services/DeleteCarService';
import UpdateCarService from '../services/UpdateCarService';
import ShowCarService from '../services/ShowCarService';
import ModifyCarService from '../services/ModifyCarService';
import { handleError } from '../../../shared/errors/HandleError';

class CarsController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const body = req.body;

      const createCarService = new CreateCarService();
      const car = await createCarService.execute(body);

      return res.status(201).json(car);
    } catch (error) {
      return handleError(res, error);
    }
  }

  public async list(req: Request, res: Response): Promise<Response> {
    try {
      const query = req.query;

      const listCarsService = new ListCarService();
      const result = await listCarsService.execute(query);

      return res.status(200).json(result);
    } catch (error) {
      return handleError(res, error);
    }
  }

  public async show(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      const showCarService = new ShowCarService();
      const car = await showCarService.execute(id);

      return res.status(200).json(car);
    } catch (error) {
      return handleError(res, error);
    }
  }

  public async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const data = req.body;

      const updateCarService = new UpdateCarService();
      const car = await updateCarService.execute(id, data);

      return res.status(200).json(car);
    } catch (error) {
      return handleError(res, error);
    }
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      const deleteCarService = new DeleteCarService();
      await deleteCarService.execute(id);

      return res.status(204).send();
    } catch (error) {
      return handleError(res, error);
    }
  }

  public async modify(req: Request, res: Response): Promise<Response> {
    try {
      const { id, accessoryId } = req.params;
      const { description } = req.body;

      const modifyCarService = new ModifyCarService();
      const car = await modifyCarService.execute(id, accessoryId, {
        description,
      });

      return res.status(200).json(car);
    } catch (error) {
      return handleError(res, error);
    }
  }
}

export default CarsController;
