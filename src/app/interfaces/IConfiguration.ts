import { Task } from '../tasks/Task';

export interface IConfiguration {
    https: boolean,
    externalVariablesUrl: string,
    commands: typeof Task[],
    tmpFolder: string,
    overrideExternalVariables?: string[]
}