import {inject, singleton} from 'tsyringe';
import {FSRepository} from '../../Infra/FSRepository';
import {AvatarDirectionAngle} from '../../HabboLogic/Avatar/Enum/AvatarDirectionAngle';
import {HabboAvatarAsset} from '../../HabboLogic/Avatar/HabboAvatarAsset';
import {type} from 'os';

export interface IType {
    gesture: string,
    partType: string,
    layerId: string,
    direction: string,
    frame: string
}

@singleton()
export class AvatarAnimationRetriever {
    private _regExp: RegExp;

    constructor(
        @inject(FSRepository) private _fsRepository: FSRepository,
        @inject(HabboAvatarAsset) private _habboAvatarAsset: HabboAvatarAsset
    ) {

    }

    async retrieve(id: string) {
        let spritesheet = JSON.parse(this._fsRepository.readSpritesheet(id));
        let animations = {};

        let types: IType[] = Object.keys(spritesheet.frames).map(key => {
            let regExp = new RegExp(`(${id})_(.+)\\.`);
            return this.getTypes(key, regExp);
        });

        let layersId = this.findAllLayerId(types);
        let gestures = this.findAllGestures(types);

        layersId.forEach(layerId => {
            gestures.forEach(gesture => {
                let gestureData = AvatarDirectionAngle.GESTURE_DATA[gesture];
                if(gestureData === undefined) {
                    console.error("Gesture not found !", gesture);
                }

                gestureData.direction.forEach(dir => {
                    let frames = [];
                    for(let frame = 0; frame < gestureData.framesCount; frame++) {
                        frames.push(this._habboAvatarAsset.find(id, {direction: dir, layerId: layerId, frame: frame.toString(), gesture: gesture, partType: types[0].partType}, spritesheet));
                    }
                    animations[`${layerId}_${gesture}_${dir}`] = frames;
                });
            });
        })

        spritesheet.animations = animations;
        this._fsRepository.writeSpriteSheet(id, JSON.stringify(spritesheet));
    }

    private findAllGestures(types: IType[]): string[] {
        return Array.from(new Set(types.map(type => type.gesture)));
    }

    private findAllLayerId(types: IType[]): string[] {
        return Array.from(new Set(types.map(type => type.layerId)));
    }

    private getTypes(key: string, regExp: RegExp): IType {
        let result = regExp.exec(key)[2].split('_');

        return {
            gesture: result[1],
            partType: result[2],
            layerId: result[3],
            direction: result[4],
            frame: result[5]
        };
    }
}