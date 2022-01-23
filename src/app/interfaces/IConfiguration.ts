import { Task } from '../tasks/Task';

export interface IConfiguration {
    https: boolean,
    externalVariablesUrl: string,
    externalTextsUrl?: string,
    commands: typeof Task[],
    tmpFolder: string,
    distFolder: string,
    overrideExternalVariables?: string[]
}