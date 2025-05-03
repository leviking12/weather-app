import { Router } from 'express';
import weatherRoutes from './weatherRoutes.js';

const apiRouter = Router();
apiRouter.use('/weather', weatherRoutes);

export default apiRouter;
