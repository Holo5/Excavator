import * as Path from 'path';
import { FSRepository } from '../infra/FSRepository';
import { Logger } from '../app/logger/Logger';
import { exec } from 'child_process';
import { inject, singleton } from 'tsyringe';

@singleton()
export class HabboFlashExtractor {
    private _executablePath: string;

    constructor(
        @inject(FSRepository) private _fsRepository: FSRepository,
    ) {
        this._executablePath = Path.resolve(__dirname, '..', '..', 'binaries', 'HabboAssetExtractor', 'Holo5Extractor.php');
    }

    async extract(assetName: string, extractFlippedImages: boolean = false) {
        if (this._fsRepository.readInSwfFolder(`${assetName}.swf`)) {
            const assetPath = Path.resolve(this._fsRepository.swfPath, `${assetName}.swf`);
            const extractedPath = Path.resolve(this._fsRepository.extractedPath, assetName);
            await new Promise((resolve) => {
                exec(`php ${this._executablePath} ${assetPath} ${extractedPath}${extractFlippedImages === true ? ' --extract-flipped-images' : ''}`, resolve);
            });
        } else {
            Logger.error(`Can't extract the file ${assetName}.swf, the file doesn't exist.`);
        }
    }

    checkIsExtracted(id: string): boolean {
        return this._fsRepository.checkFileExtracted(id);
    }
}
