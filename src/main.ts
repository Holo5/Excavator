import { Excavator } from './app/Excavator';
import { green } from 'colors';

let excavator = new Excavator();
excavator.execute().then(() => {
    console.log(green('Everything extracted :)'));
});