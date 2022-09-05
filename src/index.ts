import { config } from 'dotenv';
import { app } from './server';

config();

app.listen(3333, () => console.log('Server running on port 3333...'));
