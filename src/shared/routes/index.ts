import { Router } from 'express';
import carsRouter from '../../modules/cars/routes/cars.routes';
import usersRouter from '../../modules/users/routes/users.routes';
import reservesRouter from '../../modules/reserves/routes/reserves.routes';
import authRouter from '../../modules/users/routes/auth.routes';
import { isAuthenticated } from '../middlewares/authentication/isAuthenticated';

const routes = Router();

routes.use('/authenticate', authRouter);
routes.use('/car', isAuthenticated, carsRouter);
routes.use('/user', usersRouter);
routes.use('/reserve', isAuthenticated, reservesRouter);

export default routes;
