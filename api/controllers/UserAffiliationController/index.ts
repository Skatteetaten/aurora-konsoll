import * as express from 'express';
import { getUserAndAffiliations } from './getUserAndAffiliations';

const userAffiliationController = express.Router();

userAffiliationController.get('/api/user', getUserAndAffiliations);

export { userAffiliationController };
