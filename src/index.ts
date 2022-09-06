import { config } from 'dotenv';
import { app } from './server';

config();

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}...`)
);
