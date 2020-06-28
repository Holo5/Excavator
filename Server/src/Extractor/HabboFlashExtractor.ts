import { inject, singleton } from 'tsyringe';
import { exec } from 'child_process';
import * as Path from 'path';
import { red } from 'colors';
import { FSRepository } from '../Infra/FSRepository';

@singleton()
export class HabboFlashExtractor {
  private _executablePath: string;

  constructor(
    @inject(FSRepository) private _fsRepository: FSRepository,
  ) {
    this._executablePath = Path.resolve(__dirname, '..', '..', 'binaries', 'HabboAssetExtractor', 'Holo5Extractor.php');
  }

  async extract(assetName: string) {
    if (this._fsRepository.readInSwfFolder(`${assetName}.swf`)) {
      const assetPath = Path.resolve(this._fsRepository.swfPath, `${assetName}.swf`);
      const extractedPath = Path.resolve(this._fsRepository.extractedPath, assetName);
      await new Promise((resolve) => {
        exec(`php ${this._executablePath} ${assetPath} ${extractedPath}`, resolve);
      });
    } else {
      console.log(red(`Can't extract the file ${assetName}.swf, the file doesn't exist.`));
    }
  }
}