import { Configuration } from '../../../config';
import { FSRepository } from '../../infra/FSRepository';
import { HabboAvatarAsset } from '../../habbologic/avatar/HabboAvatarAsset';
import { IFurniProperty } from '../../domain/model/interfaces/IFurniProperty';
import { inject, singleton } from 'tsyringe';
import { xml2js } from 'xml-js';

@singleton()
export class FurniVisualizationRetriever {
    constructor(
        @inject(FSRepository) private _fsRepository: FSRepository,
        @inject(HabboAvatarAsset) private _habboAvatarAsset: HabboAvatarAsset,
    ) {
    }

    async buildVisualization(classname: string) {
        const spritesheet: any = JSON.parse(this._fsRepository.readSpritesheet(classname, Configuration.folder.furnis));
        let xmlIndex: any = this._fsRepository.readBinaries(classname, 'index');
        xmlIndex = xml2js(xmlIndex, { compact: true });
        let xmlVisualization: any = this._fsRepository.readBinaries(classname, `${classname}_visualization`);
        xmlVisualization = xml2js(xmlVisualization, { compact: true });
        let xmlLogic: any = this._fsRepository.readBinaries(classname, `${classname}_logic`);
        xmlLogic = xml2js(xmlLogic, { compact: true });

        const furniProperty = this.buildFurniProperty();
        furniProperty.infos.logic = xmlIndex?.object?._attributes?.logic;
        furniProperty.infos.visualization = xmlIndex?.object?._attributes?.visualization;
        furniProperty.dimensions.x = parseInt(xmlLogic?.objectData?.model?.dimensions?._attributes?.x);
        furniProperty.dimensions.y = parseInt(xmlLogic?.objectData?.model?.dimensions?._attributes?.y);
        furniProperty.dimensions.z = xmlLogic?.objectData?.model?.dimensions?._attributes?.z;

        const visualization = xmlVisualization?.visualizationData?.graphics.visualization.filter((vis) => (vis._attributes !== undefined) && (vis._attributes.size !== undefined) && vis._attributes.size === '64').pop();
        furniProperty.visualization.layerCount = visualization?._attributes?.layerCount !== undefined ? parseInt(visualization._attributes.layerCount) : 0;

        if (visualization?.layers !== undefined) {
            this.formatArray(visualization.layers?.layer).forEach((layer) => {
                if (layer?._attributes.id !== undefined) {
                    furniProperty.visualization.layers[parseInt(layer._attributes.id)] = {
                        id: parseInt(layer._attributes?.id),
                        ink: layer._attributes?.ink,
                        alpha: layer._attributes?.alpha !== undefined ? parseInt(layer._attributes?.alpha) : undefined,
                        z: layer._attributes?.z,
                        ignoreMouse: layer._attributes?.ignoreMouse === '1',
                    };
                }
            });
        }

        if (visualization?.directions !== undefined) {
            this.formatArray(visualization?.directions?.direction).forEach((direction) => {
                furniProperty.visualization.directions.push(parseInt(direction._attributes.id));
            });
        }

        if (visualization?.colors !== undefined) {
            this.formatArray(visualization.colors.color).forEach((color) => {
                furniProperty.visualization.colors[parseInt(color._attributes.id)] = {};

                if (color?.colorLayer?.length > 0) {
                    color.colorLayer.forEach((colorLayer) => {
                        furniProperty.visualization.colors[parseInt(color._attributes.id)][parseInt(colorLayer._attributes.id)] = colorLayer._attributes.color;
                    });
                } else if (typeof color?.colorLayer === 'object' && color?.colorLayer?._attributes !== undefined && color?.colorLayer?._attributes.id !== undefined) {
                    furniProperty.visualization.colors[parseInt(color._attributes.id)][parseInt(color?.colorLayer._attributes.id)] = color?.colorLayer._attributes.color;
                }
            });
        }

        if (visualization?.animations !== undefined) {
            this.formatArray(visualization.animations.animation).forEach((animation) => {
                furniProperty.visualization.animation[animation._attributes.id] = {};

                this.formatArray(animation?.animationLayer).forEach((animationLayer) => {
                    const frameSequence = [];

                    this.formatArray(animationLayer?.frameSequence).forEach((fs) => {
                        this.formatArray(fs.frame).forEach((elm) => {
                            frameSequence.push(parseInt(elm._attributes.id));
                        });
                    });

                    furniProperty.visualization.animation[animation._attributes.id][animationLayer._attributes.id] = {
                        frameSequence,
                        loopCount: animationLayer?._attributes?.loopCount !== undefined ? parseInt(animationLayer?._attributes?.loopCount) : undefined,
                        random: animationLayer?._attributes?.random !== undefined ? parseInt(animationLayer?._attributes?.random) : undefined,
                        frameRepeat: animationLayer?._attributes?.frameRepeat !== undefined ? parseInt(animationLayer?._attributes?.frameRepeat) : undefined,
                    };
                });
            });
        }

        spritesheet.furniProperty = furniProperty;
        this._fsRepository.writeSpriteSheet(classname, Configuration.folder.furnis, JSON.stringify(spritesheet));
    }

    formatArray(elm: any) {
        if (elm === undefined) return [];
        return elm.length === undefined ? [elm] : elm;
    }

    private buildFurniProperty(): IFurniProperty {
        return {
            infos: {
                logic: undefined,
                visualization: undefined,
            },
            dimensions: {
                x: undefined,
                y: undefined,
                z: undefined,
            },
            visualization: {
                layerCount: undefined,
                layers: {},
                directions: [],
                colors: {},
                animation: {},
            },
        };
    }
}
