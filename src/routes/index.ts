import { Router } from 'express';
import { entriesRoutes } from './entries.route';
import { sessionRoutes } from './session.route';
import { usersRoutes } from './users.route';

const routes = Router();

routes.use(sessionRoutes);
routes.use(usersRoutes);
routes.use(entriesRoutes);

export { routes };
