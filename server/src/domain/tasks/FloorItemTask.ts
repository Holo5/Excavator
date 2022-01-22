import { AssetDownloader } from '../../App/Downloader/AssetDownloader';
import { AvatarAnimationRetriever } from '../../App/Retriever/AvatarAnimationRetriever';
import { Configuration } from '../../../config';
import { FloorItem } from '../FurniData/FloorItem';
import { FurniVisualizationRetriever } from '../../App/Retriever/FurniVisualizationRetriever';
import { HabboDataExtractor } from '../../Extractor/HabboDataExtractor';
import { HabboDataType } from '../../Extractor/Enum/HabboDataType';
import { HabboFlashExtractor } from '../../Extractor/HabboFlashExtractor';
import { Logger } from '../../App/Logger/Logger';
import { SocketServer } from '../../Network/Server/SocketServer';
import { SpritesheetBuilder } from '../../app/builder/SpritesheetBuilder';
import { Task } from './Task';
import { container } from 'tsyringe';

export class FloorItemTask extends Task {
    private readonly _dataExtractor: HabboDataExtractor;
    private readonly _assetDownloader: AssetDownloader;
    private readonly _flashExtractor: HabboFlashExtractor;
    private readonly _spritesheetBuilder: SpritesheetBuilder;
    private readonly _animationRetriever: AvatarAnimationRetriever;
    private readonly _furniVisualizationRetriever: FurniVisualizationRetriever;
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
        this._furniVisualizationRetriever = container.resolve(FurniVisualizationRetriever);
        this._socketServer = container.resolve(SocketServer);
    }

    async run() {
        const className = this._floorItem.className.split('*')[0];
        let assetLink = `${this._dataExtractor.getHabboData(HabboDataType.FURNI_URL)}${this._dataExtractor.getHabboData(HabboDataType.FURNI_LINK_TEMPLATE)}`;

        if (className === 'TileCursor') {
            assetLink = `${this._dataExtractor.getHabboData(HabboDataType.FLASH_CLIENT_URL)}${className}.swf`;
        } else {
            assetLink = assetLink.replace('%revision%', this._floorItem.revision.toString());
            assetLink = assetLink.replace('%typeid%', className);
        }

        if (className === 'tickets' || className === 'floortile') return;

        try {
            await this._assetDownloader.download(assetLink, className);
        } catch (e) {
            Logger.error(`Flash file ${this._floorItem.id} can't be downloaded.`);
            Logger.debug(`Link: ${assetLink}`);
            return;
        }

        try {
            await this._flashExtractor.extract(className, true);
        } catch (e) {
            Logger.error(`Flash file ${this._floorItem.id} can't be extracted.`);
        }

        if (!this._flashExtractor.checkIsExtracted(className)) {
            return;
        }

        try {
            await this._spritesheetBuilder.build(className, Configuration.folder.furnis);
        } catch (e) {
            Logger.error(`Error creating ${this._floorItem.id}'s spritesheet`);
        }

        try {
            await this._spritesheetBuilder.retrieveFurniOffset(className);
        } catch (e) {
            Logger.error(e);
            Logger.error(`Error retrieving ${className}'s offsets`);
        }

        try {
            await this._furniVisualizationRetriever.buildVisualization(className);
        } catch (e) {
            Logger.error(e);
            Logger.error(`Can't retrieve ${className}'s visualization... :(`);
        }
    }
}
