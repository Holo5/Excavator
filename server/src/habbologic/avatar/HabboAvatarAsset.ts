/* eslint-disable no-mixed-operators */
/* eslint-disable @typescript-eslint/naming-convention */
import { AvatarDirectionAngle } from './enums/AvatarDirectionAngle';
import { AvatarFigurePartType } from './enums/AvatarFigurePartType';
import { IType } from '../../app/retriever/AvatarAnimationRetriever';
import { singleton } from 'tsyringe';

@singleton()
export class HabboAvatarAsset {
    find(id: string, type: IType, spritesheet: any): string {
        let _local_6 = type.direction;
        let _local_8 = false;
        const _local_10 = type.gesture;
        const _local_20 = type.partType;
        const _local_21 = type.layerId;
        const _local_23 = type.frame;
        const _local_7: boolean = AvatarDirectionAngle.MISSING_ANGLE[type.direction];
        let _local_24: string = '';

        if (_local_7) {
            if (((_local_10 === 'wav') && (((_local_20 === AvatarFigurePartType.LEFT_HAND) || (_local_20 === AvatarFigurePartType.LEFT_SLEEVE)) || (_local_20 === AvatarFigurePartType.LEFT_COAT_SLEEVE)))) {
                _local_8 = true;
            } else if (((_local_10 === 'drk') && (((_local_20 === AvatarFigurePartType.RIGHT_HAND) || (_local_20 === AvatarFigurePartType.RIGHT_SLEEVE)) || (_local_20 === AvatarFigurePartType.RIGHT_COAT_SLEEVE)))) {
                _local_8 = true;
            } else if (((_local_10 === 'blw') && (_local_20 === AvatarFigurePartType.RIGHT_HAND))) {
                _local_8 = true;
            } else if (((_local_10 === 'sig') && (_local_20 === AvatarFigurePartType.LEFT_HAND))) {
                _local_8 = true;
            } else if (((_local_10 === 'respect') && (_local_20 === AvatarFigurePartType.LEFT_HAND))) {
                _local_8 = true;
            } else if (_local_20 === AvatarFigurePartType.RIGHT_HAND_ITEM) {
                _local_8 = true;
            } else if (_local_20 === AvatarFigurePartType.LEFT_HAND_ITEM) {
                _local_8 = true;
            } else if (_local_20 === AvatarFigurePartType.CHEST_PRINT) {
                _local_8 = true;
            } else if (type.direction === 4) {
                _local_6 = 2;
            } else if (type.direction === 5) {
                _local_6 = 1;
            } else if (type.direction === 6) {
                _local_6 = 0;
            }
        }

        _local_24 = `${id}_h_${_local_10}_${_local_20}_${_local_21}_${_local_6}_${_local_23}`;
        const asset = spritesheet.frames[_local_24];
        if (asset === undefined) {
            _local_24 = `${id}_h_std_${_local_20}_${_local_21}_${_local_6}_0`;
        }

        return _local_24;
    }
}
