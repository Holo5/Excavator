import { singleton } from 'tsyringe';
import { yellow } from 'colors';
import * as Path from 'path';
import * as fs from 'fs';
import * as fse from 'fs-extra';
import { Parser } from 'xml2js';
import { Configuration } from '../../Config';
import { Logger } from '../App/Logger/Logger';

@singleton<FSRepository>()
export class FSRepository {
    private _tmpPath: string;
    private _buildPath: string;
    private _swfPath: string;
    private _extractedPath: string;
    private _xmlParser: Parser;
    private _assetExtractor: string;

    constructor() {
        this._tmpPath = Configuration.tmpDir;
        this._buildPath = Path.resolve(this._tmpPath, 'built');
        this._swfPath = Path.resolve(this._tmpPath, 'swf');
        this._extractedPath = Path.resolve(this._tmpPath, 'extracted');
        this._assetExtractor = Configuration.assetExtractorPath;
        this._xmlParser = new Parser();
    }

    public init() {
        Logger.info(`Initializing ${yellow(this.constructor.name)}`);

        this.createArch();
    }

    private static mkdir(path: string, name: string): void {
        if (!fs.existsSync(path)) {
            Logger.info(`Creating ${name} path...`);

            fs.mkdirSync(path, { recursive: true });
        }
    }

    private createArch() {
        Logger.info('Preparing directories...');

        FSRepository.mkdir(this._tmpPath, 'tmp');
        FSRepository.mkdir(this._buildPath, 'build');
        FSRepository.mkdir(this._swfPath, 'swf');
        FSRepository.mkdir(this._extractedPath, 'extracted swf');

        FSRepository.mkdir(Path.resolve(this._buildPath, Configuration.folder.figures), "figure's folder");
        FSRepository.mkdir(Path.resolve(this._buildPath, Configuration.folder.furnis), "figure's folder");
        FSRepository.mkdir(Path.resolve(this._buildPath, Configuration.folder.furniIcons), "furni icon's folder");

        Logger.info('Folder tree created!');
    }

    cleanExtratedRepository() {
        fse.emptyDirSync(this._extractedPath);
        fse.emptyDirSync(this._swfPath);
    }

    writeInExtractedFolder(filename: string, data: any) {
        fs.writeFileSync(Path.resolve(this._extractedPath, filename), data, { encoding: 'utf8', flag: 'w+' });
    }

    writeInBuildFolder(filename: string, folder: string, data: any) {
        fs.writeFileSync(Path.resolve(this._buildPath, folder, filename), data, { encoding: 'utf8', flag: 'w+' });
    }

    writeInTmpFolder(filename: string, data: any) {
        fs.writeFileSync(Path.resolve(this._tmpPath, filename), data, { encoding: 'utf8', flag: 'w+' });
    }

    writeInSwfFolder(filename: string, data: any) {
        fs.writeFileSync(Path.resolve(this._swfPath, filename), data, { encoding: 'utf8', flag: 'w+' });
    }

    existInExtractedFolder(filename: string) {
        return fs.existsSync(Path.resolve(this._extractedPath, filename));
    }

    readInExtractedFolder(filename: string) {
        return fs.readFileSync(Path.resolve(this._extractedPath, filename));
    }

    readInTmpFolder(filename: string): any | false {
        try {
            return fs.readFileSync(Path.resolve(this._tmpPath, filename));
        } catch (e) {
            return false;
        }
    }

    readInSwfFolder(filename: string): any | false {
        try {
            return fs.readFileSync(Path.resolve(this._swfPath, filename));
        } catch (e) {
            return false;
        }
    }

    readSpritesheet(filename: string, type: string): any | false {
        try {
            return fs.readFileSync(Path.resolve(this._buildPath, type, filename, `${filename}.json`));
        } catch (e) {
            return false;
        }
    }

    writeSpriteSheet(filename: string, folder: string, data: string) {
        fs.writeFileSync(Path.resolve(this._buildPath, folder, filename, `${filename}.json`), data, { encoding: 'utf8', flag: 'w+' });
    }

    readBinaries(filename: string, type?: string): any | false {
        try {
            if (type !== undefined) {
                return fs.readFileSync(Path.resolve(this._extractedPath, filename, 'binaries', `${filename}_${type}.bin`));
            }
            return fs.readFileSync(Path.resolve(this._extractedPath, filename, 'binaries', `${filename}.bin`));
        } catch (e) {
            return false;
        }
    }

    checkFileExtracted(filename: string): boolean {
        if (!fse.existsSync(Path.resolve(this._extractedPath, filename))) {
            return false;
        }
        return fse.readdirSync(Path.resolve(this._extractedPath, filename, 'images')).length > 0
            && fse.readdirSync(Path.resolve(this._extractedPath, filename, 'binaries')).length > 0;
    }

    get xmlParser(): Parser {
        return this._xmlParser;
    }

    get assetExtractor(): string {
        return this._assetExtractor;
    }

    get swfPath(): string {
        return this._swfPath;
    }

    get buildPath(): string {
        return this._buildPath;
    }

    get extractedPath(): string {
        return this._extractedPath;
    }
}
