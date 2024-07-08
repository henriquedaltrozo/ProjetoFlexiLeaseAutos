import { Router } from 'express';
import CarsController from '../controllers/CarsController';
import { celebrate } from 'celebrate';
import {
  createCarSchema,
  updateCarSchema,
  showCarSchema,
  deleteCarSchema,
  modifyAccessorySchema,
} from '../../../shared/middlewares/validations/carSchemaValidation';

const carsRouter = Router();
const carsController = new CarsController();

carsRouter.post('/', celebrate(createCarSchema), carsController.create);
carsRouter.get('/', carsController.list);
carsRouter.get('/:id', celebrate(showCarSchema), carsController.show);
carsRouter.put('/:id', celebrate(updateCarSchema), carsController.update);
carsRouter.delete('/:id', celebrate(deleteCarSchema), carsController.delete);
carsRouter.patch(
  '/:id/accessories/:accessoryId',
  celebrate(modifyAccessorySchema),
  carsController.modify,
);

export default carsRouter;
