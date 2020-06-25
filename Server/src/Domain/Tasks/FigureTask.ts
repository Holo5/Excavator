import {Task} from './Task';
import {Lib} from '../FigureMap/Lib';
import {container} from 'tsyringe';
import {HabboFlashExtractor} from '../../Extractor/HabboFlashExtractor';
import {AssetDownloader} from '../../App/Downloader/AssetDownloader';
import {HabboDataExtractor} from '../../Extractor/HabboDataExtractor';
import {HabboDataType} from '../../Extractor/Enum/HabboDataType';
import {ExtractionState} from "../FigureMap/Enum/ExtractionState";
import {SpritesheetBuilder} from '../../App/Builder/SpritesheetBuilder';

export class FigureTask extends Task {
    private _lib: Lib;

    constructor(lib: Lib) {
        super();

        this._lib = lib;
    }

    async run() {
        let assetLink = container.resolve(HabboDataExtractor).getHabboData(HabboDataType.FLASH_CLIENT_URL) + this._lib.id + ".swf";
        await container.resolve(AssetDownloader).download(assetLink);
        await container.resolve(HabboFlashExtractor).extract(this._lib.id);
        await container.resolve(SpritesheetBuilder).build(this._lib.id);

        this._lib.setExtractionState(ExtractionState.EXTRACTED);
    }
}
