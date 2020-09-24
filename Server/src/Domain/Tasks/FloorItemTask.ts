import { container } from 'tsyringe';
import { Task } from './Task';
import { HabboFlashExtractor } from '../../Extractor/HabboFlashExtractor';
import { AssetDownloader } from '../../App/Downloader/AssetDownloader';
import { HabboDataExtractor } from '../../Extractor/HabboDataExtractor';
import { SpritesheetBuilder } from '../../App/Builder/SpritesheetBuilder';
import { AvatarAnimationRetriever } from '../../App/Retriever/AvatarAnimationRetriever';
import { SocketServer } from '../../Network/Server/SocketServer';
import {FloorItem} from '../FurniData/FloorItem';
import {HabboDataType} from '../../Extractor/Enum/HabboDataType';
import {Logger} from '../../App/Logger/Logger';
import {Configuration} from '../../../Config';

export class FloorItemTask extends Task {
    private readonly _dataExtractor: HabboDataExtractor;
    private readonly _assetDownloader: AssetDownloader;
    private readonly _flashExtractor: HabboFlashExtractor;
    private readonly _spritesheetBuilder: SpritesheetBuilder;
    private readonly _animationRetriever: AvatarAnimationRetriever;
    private readonly _socketServer: SocketServer;

    private _floorItem: FloorItem;

    constructor(floorItem: FloorItem) {
        super();

        this._floorItem = floorItem;

        this._dataExtractor = container.resolve(HabboDataExtractor);
        this._assetDownloader = container.resolve(AssetDownloader);
        this._flashExtractor = container.resolve(HabboFlashExtractor);
        this._spritesheetBuilder = container.resolve(SpritesheetBuilder);
        this._animationRetriever = container.resolve(AvatarAnimationRetriever);
        this._socketServer = container.resolve(SocketServer);
    }

    async run() {

        const className = this._floorItem.className.includes('*') ? this._floorItem.className.split('*')[0] : this._floorItem.className;
        const assetLink = `${this._dataExtractor.getHabboData(HabboDataType.FURNI_URL)}${this._floorItem.revision}/${className}.swf`;

        try {
            await this._assetDownloader.download(assetLink);
        } catch (e) {
            Logger.error(`Flash file ${this._floorItem.id} can't be downloaded.`);
            Logger.debug(`Link: ${assetLink}`);
            return;
        }

        try {
            await this._flashExtractor.extract(this._floorItem.className);
        } catch (e) {
            Logger.error(`Flash file ${this._floorItem.id} can't be extracted.`);
        }

        try {
            await this._spritesheetBuilder.build(className, Configuration.folder.furnis);
        } catch (e) {
            Logger.error(`Error creating ${this._floorItem.id}'s spritesheet`);
        }

        /*
        try {
            await this._spritesheetBuilder.retrieveOffsets(className, Configuration.folder.furnis);
        } catch (e) {
            Logger.error(`Error retrieving ${className}'s offsets`);
        }

        try {
            await this._animationRetriever.retrieve(this._lib.id);
        } catch (e) {
            Logger.error(`Can't retrieve ${this._lib.id}'s animations`);
        }

        */
    }
}
