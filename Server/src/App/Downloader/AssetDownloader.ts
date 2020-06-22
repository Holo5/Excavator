import {inject, singleton} from 'tsyringe';
import {FSRepository} from '../../Infra/FSRepository';
import * as download from 'download';

@singleton()
export class AssetDownloader {
    constructor(
        @inject(FSRepository) private _fsRepository: FSRepository
    ) {}

    async download(assetLink: string) {
        await download(assetLink, this._fsRepository.swfPath);
    }
}