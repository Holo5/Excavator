import { Configuration } from '../../../conf';
import { Downloader } from '../../utilities/Downloader';
import { Task } from '../../tasks/Task';
import fs from 'fs';
import path from 'path';

export class GameData extends Task {

    async execute(): Promise<void> {
        const destFolder = path.resolve(Configuration.tmpFolder, 'gamedata');
        fs.mkdirSync(destFolder, { recursive: true });

        await Downloader.getFile('https://www.habbo.fr/gamedata/external_variables/0', `${destFolder}`, 'external_variables.txt');

        await Downloader.getFile('https://www.habbo.fr/gamedata/external_variables/0', destFolder, 'external_variables.txt');
        await Downloader.getFile('https://www.habbo.fr/gamedata/external_flash_texts/0', destFolder, 'external_flash_texts.txt');
        await Downloader.getFile('https://www.habbo.fr/gamedata/override/external_override_variables/0', destFolder, 'override/external_override_variables.txt');
        await Downloader.getFile('https://www.habbo.fr/gamedata/override/external_flash_override_texts/0', destFolder, 'override/external_flash_override_texts.txt');
        await Downloader.getFile('https://www.habbo.fr/gamedata/furnidata_json/0', destFolder, 'furnidata.json');
        await Downloader.getFile('https://www.habbo.fr/gamedata/furnidata_xml/0', destFolder, 'furnidata.xml');
        await Downloader.getFile('https://www.habbo.fr/gamedata/furnidata/0', destFolder, 'furnidata.txt');
        await Downloader.getFile('https://www.habbo.fr/gamedata/productdata_json/0', destFolder, 'productdata.json');
        await Downloader.getFile('https://www.habbo.fr/gamedata/productdata_xml/0', destFolder, 'productdata.xml');
        await Downloader.getFile('https://www.habbo.fr/gamedata/productdata/0', destFolder, 'productdata.txt');
        await Downloader.getFile('https://www.habbo.fr/gamedata/figuredata/0', destFolder, 'figuredata.xml');


        // { src: `https://images.habbo.com/gordon/${config.prod}/figuremap.xml`, dst: 'gamedata/figuremap.xml' },
        // { src: `https://images.habbo.com/gordon/${config.prod}/effectmap.xml`, dst: 'gamedata/effectmap.xml' },

        this.success();
    }
}