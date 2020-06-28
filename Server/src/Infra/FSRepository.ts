import {singleton} from "tsyringe";
import {blue, cyan, magenta, yellow} from 'colors';
import * as Path from "path";
import * as fs from "fs";
import * as fse from "fs-extra";
import {Parser} from "xml2js";
import {Configuration} from '../../Config';

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
        this._buildPath = Path.resolve(this._tmpPath, "built");
        this._swfPath = Path.resolve(this._tmpPath, "swf");
        this._extractedPath = Path.resolve(this._tmpPath, "extracted");
        this._assetExtractor = Configuration.assetExtractorPath;
        this._xmlParser = new Parser();
    }

    public init() {
        console.log(cyan("Initing ") + yellow("FSRepository"));

        this.createArch();
    }

    private createArch() {
        console.log(blue("Preparing directories..."));

        if (!fs.existsSync(this._tmpPath)) {
            console.log(magenta("Creating tmp path..."));
            fs.mkdirSync(this._tmpPath, {recursive: true});
        }

        if (!fs.existsSync(this._buildPath)) {
            console.log(magenta("Creating build path..."));
            fs.mkdirSync(this._buildPath, {recursive: true});
        }


        if (!fs.existsSync(this._swfPath)) {
            console.log(magenta("Creating swf path..."));
            fs.mkdirSync(this._swfPath, {recursive: true});
        }

        if (!fs.existsSync(this._extractedPath)) {
            console.log(magenta("Creating extracted swf path..."));
            fs.mkdirSync(this._extractedPath, {recursive: true});
        }

        console.log(blue("Folder tree created !"));
    }

    cleanExtratedRepository() {
        fse.emptyDirSync(this._extractedPath);
        fse.emptyDirSync(this._swfPath);
    }

    getFurniData() {
        return fs.readFileSync(Path.resolve(this._extractedPath, "furnidata.xml"));
    }

    writeInExtractedFolder(filename: string, data: any) {
        fs.writeFileSync(Path.resolve(this._extractedPath, filename), data, {encoding: "utf8", flag: "w+"});
    }

    writeInTmpFolder(filename: string, data: any) {
        fs.writeFileSync(Path.resolve(this._tmpPath, filename), data, {encoding: "utf8", flag: "w+"});
    }

    writeInSwfFolder(filename: string, data: any) {
        fs.writeFileSync(Path.resolve(this._swfPath, filename), data, {encoding: "utf8", flag: "w+"});
    }

    existInSwfFolder(filename: string) {
        return fs.existsSync(Path.resolve(this._swfPath, filename, '.swf'));
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

    readSpritesheet(filename: string): any | false {
        try {
            return fs.readFileSync(Path.resolve(this._buildPath, filename, filename + '.json'));
        } catch (e) {
            return false;
        }
    }

    writeSpriteSheet(filename: string, data: string) {
        fs.writeFileSync(Path.resolve(this._buildPath, filename, filename + '.json'), data, {encoding: "utf8", flag: "w+"});
    }

    readBinaries(filename: string, type?: string): any | false {
        try {
            if(type !== undefined) {
                return fs.readFileSync(Path.resolve(this._extractedPath, filename, "binaries", filename + "_" + type + '.bin'));
            } else {
                return fs.readFileSync(Path.resolve(this._extractedPath, filename, "binaries", filename + '.bin'));
            }
        } catch (e) {
            return false;
        }
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

    /*
    releaseFurni(furniType: FurniType) {
        if (!fs.existsSync(Path.resolve(this._buildPath, furniType.realClassName))) {
            fs.mkdirSync(Path.resolve(this._buildPath, furniType.realClassName));
        }
        fs.copyFileSync(
            Path.resolve(this._buildPath, furniType.realClassName + ".json"),
            Path.resolve(this._buildPath, furniType.realClassName, furniType.realClassName + ".json"),
        );
        fs.unlinkSync(Path.resolve(this._buildPath, furniType.realClassName + ".json"));
        fs.copyFileSync(
            Path.resolve(this._extractedPath, furniType.realClassName, "sprites", furniType.realClassName + "_sprite.png"),
            Path.resolve(this._buildPath, furniType.realClassName, furniType.realClassName + "_sprite.png"),
        );
    }

    existingImages(furniType: FurniType) {
        if(fs.existsSync(Path.resolve(this.extractedPath, furniType.realClassName, "images"))) {
            let files = fs.readdirSync(Path.resolve(this.extractedPath, furniType.realClassName, "images"))
            if(files.length > 1) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
   */

}
