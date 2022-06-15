import { Constructor } from '../tasks/types/Constructor';
import { Task } from '../tasks/Task';

export interface IConfiguration {
    https: boolean,
    externalVariablesUrl: string,
    externalTextsUrl?: string,
    tasks: Constructor<Task>[],
    tmpFolder: string,
    distFolder: string,
    overrideExternalVariables?: string[]
}