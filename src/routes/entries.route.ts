import { Router } from 'express';
import {
  createEntry,
  deleteEntry,
  getAllEntriesFromUser,
  getEntryFromUser,
  updateEntry,
} from '../controllers/entriesController';
import { auth } from '../middlewares/auth';
import { validate } from '../middlewares/validationMiddleware';
import {
  createEntrySchema,
  updateEntrySchema,
} from '../validations/entryValidation';

const entriesRoutes = Router();

entriesRoutes.get('/entries', auth, getAllEntriesFromUser);
entriesRoutes.get('/entries/:id', auth, getEntryFromUser);
entriesRoutes.post('/entries', auth, validate(createEntrySchema), createEntry);
entriesRoutes.put(
  '/entries/:id',
  auth,
  validate(updateEntrySchema),
  updateEntry
);
entriesRoutes.delete('/entries/:id', auth, deleteEntry);

export { entriesRoutes };
