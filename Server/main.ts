import 'reflect-metadata';
import {container} from 'tsyringe';
import {Holo5Excavator} from './src/App/Holo5Excavator';

let app = container.resolve(Holo5Excavator);
app.init();