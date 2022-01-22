import 'reflect-metadata';
import { container } from 'tsyringe';
import { Holo5Excavator } from './src/app/Holo5Excavator';

const app = container.resolve(Holo5Excavator);
app.init();
