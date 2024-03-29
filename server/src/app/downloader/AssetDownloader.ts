import * as download from 'download';
import { FSRepository } from '../../infra/FSRepository';
import { inject, singleton } from 'tsyringe';

@singleton()
export class AssetDownloader {
    constructor(
        @inject(FSRepository) private _fsRepository: FSRepository,
    ) {}

    async download(assetLink: string, filename: string) {
        if (this._fsRepository.readInSwfFolder(`${filename}.swf`) === false) {
            await download(assetLink, this._fsRepository.swfPath);
        }
    }
}
