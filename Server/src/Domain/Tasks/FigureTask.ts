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
        if (this._lib.id === 'hh_pets'
            || this._lib.id === 'hh_people_pool'
            || this._lib.id === 'jacket_U_snowwar4_team1'
            || this._lib.id === 'jacket_U_snowwar4_team2'
            || this._lib.id === 'hh_human_fx') return;

        const assetLink = `${this._dataExtractor.getHabboData(HabboDataType.FLASH_CLIENT_URL) + this._lib.id}.swf`;

        try {
            await this._assetDownloader.download(assetLink);
        } catch (e) {
            Logger.error(`Flash file ${this._lib.id} can't be downloaded.`);
            Logger.debug(`Link: ${assetLink}`);
            return;
        }

        try {
            await this._flashExtractor.extract(this._lib.id);
        } catch (e) {
            Logger.error(`Flash file ${this._lib.id} can't be extracted.`);
        }

        try {
            await this._spritesheetBuilder.build(this._lib.id);
        } catch (e) {
            Logger.error(`Error creating ${this._lib.id}'s spritesheet`);
        }

        try {
            await this._spritesheetBuilder.retrieveOffsets(this._lib.id);
        } catch (e) {
            Logger.error(`Error retrieving ${this._lib.id}'s offsets`);
        }

        try {
            await this._animationRetriever.retrieve(this._lib.id);
        } catch (e) {
            Logger.error(`Can't retrieve ${this._lib.id}'s animations`);
        }

        this._lib.setExtractionState(ExtractionState.EXTRACTED);

        this._socketServer.send(new LibExtractionStateChangeComposer(this._lib));
    }
}
