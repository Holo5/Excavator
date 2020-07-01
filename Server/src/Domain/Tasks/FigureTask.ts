import { container } from 'tsyringe';
import { Task } from './Task';
import { Lib } from '../FigureMap/Lib';
import { HabboFlashExtractor } from '../../Extractor/HabboFlashExtractor';
import { AssetDownloader } from '../../App/Downloader/AssetDownloader';
import { HabboDataExtractor } from '../../Extractor/HabboDataExtractor';
import { HabboDataType } from '../../Extractor/Enum/HabboDataType';
import { ExtractionState } from '../FigureMap/Enum/ExtractionState';
import { SpritesheetBuilder } from '../../App/Builder/SpritesheetBuilder';
import { AvatarAnimationRetriever } from '../../App/Retriever/AvatarAnimationRetriever';
import { SocketServer } from '../../Network/Server/SocketServer';
import { LibExtractionStateChangeComposer } from '../../Network/Outgoing/Figure/FigureMap/LibExtractionStateChangeComposer';
import { Logger } from '../../App/Logger/Logger';

export class FigureTask extends Task {
    private readonly _dataExtractor: HabboDataExtractor;
    private readonly _assetDownloader: AssetDownloader;
    private readonly _flashExtractor: HabboFlashExtractor;
    private readonly _spritesheetBuilder: SpritesheetBuilder;
    private readonly _animationRetriever: AvatarAnimationRetriever;
    private readonly _socketServer: SocketServer;

    private _lib: Lib;

    constructor(lib: Lib) {
        super();

        this._lib = lib;

        this._dataExtractor = container.resolve(HabboDataExtractor);
        this._assetDownloader = container.resolve(AssetDownloader);
        this._flashExtractor = container.resolve(HabboFlashExtractor);
        this._spritesheetBuilder = container.resolve(SpritesheetBuilder);
        this._animationRetriever = container.resolve(AvatarAnimationRetriever);
        this._socketServer = container.resolve(SocketServer);
    }

    async run() {
        if (this._lib.id === 'hh_pets' || this._lib.id === 'hh_people_pool') return;

        const assetLink = `${this._dataExtractor.getHabboData(HabboDataType.FLASH_CLIENT_URL) + this._lib.id}.swf`;

        await this._assetDownloader.download(assetLink);
        await this._flashExtractor.extract(this._lib.id);

        await this._spritesheetBuilder.build(this._lib.id);

        try {
            await this._spritesheetBuilder.retrieveOffsets(this._lib.id);
        } catch (e) {
            Logger.error(`Error retrieving ${this._lib.id} offsets`);
        }

        await this._animationRetriever.retrieve(this._lib.id);

        this._lib.setExtractionState(ExtractionState.EXTRACTED);

        this._socketServer.send(new LibExtractionStateChangeComposer(this._lib));
    }
}
