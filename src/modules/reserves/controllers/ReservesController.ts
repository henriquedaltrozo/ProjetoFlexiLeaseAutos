import { Request, Response } from 'express';
import CreateReserveService from '../services/CreateReserveService';
import ListReservesService from '../services/ListReserveService';
import DeleteReserveService from '../services/DeleteReserveService';
import ShowReserveService from '../services/ShowReserveService';
import UpdateReserveService from '../services/UpdateReserveService';
import { formatDate } from '../../../shared/utils/formatDate';
import { handleError } from '../../../shared/errors/HandleError';

class ReservesController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const createReserveService = new CreateReserveService();
      const reserve = await createReserveService.execute(req.body);

      reserve.start_date = formatDate(reserve.start_date);
      reserve.end_date = formatDate(reserve.end_date);

      return res.status(201).json(reserve);
    } catch (error) {
      return handleError(res, error);
    }
  }

  public async list(req: Request, res: Response): Promise<Response> {
    try {
      const {
        id_user,
        id_car,
        start_date,
        end_date,
        final_value,
        limit = 10,
        offset = 0,
      } = req.query;
      const listReservesService = new ListReservesService();
      const reserves = await listReservesService.execute({
        id_user: id_user as string,
        id_car: id_car as string,
        start_date: start_date as string,
        end_date: end_date as string,
        final_value: final_value ? Number(final_value) : undefined,
        limit: Number(limit),
        offset: Number(offset),
      });

      return res.status(200).json({
        reserves: reserves.reserves,
        total: reserves.total,
        limit: reserves.limit,
        offset: reserves.offset,
        offsets: reserves.offsets,
      });
    } catch (error) {
      return handleError(res, error);
    }
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const deleteReserveService = new DeleteReserveService();
      await deleteReserveService.execute(id);
      return res.status(204).send();
    } catch (error) {
      return handleError(res, error);
    }
  }

  public async show(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const showReserveService = new ShowReserveService();
      const reserve = await showReserveService.execute(id);

      if (reserve) {
        reserve.start_date = formatDate(reserve.start_date);
        reserve.end_date = formatDate(reserve.end_date);
      }

      return res.status(200).json(reserve);
    } catch (error) {
      return handleError(res, error);
    }
  }

  public async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const updateReserveService = new UpdateReserveService();
      const reserve = await updateReserveService.execute(id, req.body);

      if (reserve) {
        reserve.start_date = formatDate(reserve.start_date);
        reserve.end_date = formatDate(reserve.end_date);
      }

      return res.status(200).json(reserve);
    } catch (error) {
      return handleError(res, error);
    }
  }
}

export default ReservesController;
