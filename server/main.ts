import 'reflect-metadata';
import { Holo5Excavator } from './src/app/Holo5Excavator';
import { container } from 'tsyringe';

const app = container.resolve(Holo5Excavator);
app.init();
