export abstract class Task {
    async abstract run(): Promise<any>;
}
