import { inject, singleton } from 'tsyringe';
import * as download from 'download';
import { FSRepository } from '../../Infra/FSRepository';

@singleton()
export class AssetDownloader {
    constructor(
        @inject(FSRepository) private _fsRepository: FSRepository,
    ) {}

    async download(assetLink: string) {
        await download(assetLink, this._fsRepository.swfPath);
    }
}
