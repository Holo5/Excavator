import {Task} from './Task';
import {Lib} from '../FigureMap/Lib';
import {container} from 'tsyringe';
import {HabboFlashExtractor} from '../../Extractor/HabboFlashExtractor';
import {AssetDownloader} from '../../App/Downloader/AssetDownloader';
import {HabboDataExtractor} from '../../Extractor/HabboDataExtractor';
import {HabboDataType} from '../../Extractor/Enum/HabboDataType';
import * as SpriteSheet from 'spritesheet-js';
import * as Path from "path";
import {FSRepository} from "../../Infra/FSRepository";
import {ExtractionState} from "../FigureMap/Enum/ExtractionState";

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
        let test = Path.resolve(container.resolve(FSRepository).extractedPath, this._lib.id, 'images');

        SpriteSheet(test + '/*.png', {format: 'pixi.js', trim: false, 'path': Path.resolve(container.resolve(FSRepository).buildPath, this._lib.id)}, function (err) {
        });

        this._lib.setExtractionState(ExtractionState.EXTRACTED);
    }
}
