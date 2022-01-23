import download from 'download';

export class Downloader {
    public static async getFile(url: string, dest: string, filename?: string) {
        await download(url, dest, { filename: filename });
    }
}