import { Router } from 'express';
import { celebrate } from 'celebrate';
import ReservesController from '../controllers/ReservesController';
import {
  createReserveSchema,
  deleteReserveSchema,
  showReserveSchema,
  updateReserveSchema,
} from '../../../shared/middlewares/validations/reserveSchemaValidation';

const reservesRouter = Router();
const reservesController = new ReservesController();

reservesRouter.post(
  '/',
  celebrate(createReserveSchema),
  reservesController.create,
);
reservesRouter.get('/', reservesController.list);
reservesRouter.get(
  '/:id',
  celebrate(showReserveSchema),
  reservesController.show,
);
reservesRouter.put(
  '/:id',
  celebrate(updateReserveSchema),
  reservesController.update,
);
reservesRouter.delete(
  '/:id',
  celebrate(deleteReserveSchema),
  reservesController.delete,
);

export default reservesRouter;
