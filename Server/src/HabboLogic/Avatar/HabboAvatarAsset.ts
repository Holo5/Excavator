/* eslint-disable no-mixed-operators */
import { singleton } from 'tsyringe';
import { IType } from '../../App/Retriever/AvatarAnimationRetriever';
import { AvatarDirectionAngle } from './Enum/AvatarDirectionAngle';
import { AvatarFigurePartType } from './Enum/AvatarFigurePartType';

@singleton()
export class HabboAvatarAsset {
  find(id: string, type: IType, spritesheet: any): string {
    const { gesture, partType, layerId, frame } = type;
    let { direction } = type;

    const missingAngle: boolean = AvatarDirectionAngle.MISSING_ANGLE[type.direction];

    if (
      missingAngle
      && !(gesture === 'wav'
      && (partType === AvatarFigurePartType.LEFT_HAND
          || partType === AvatarFigurePartType.LEFT_SLEEVE
          || partType === AvatarFigurePartType.LEFT_COAT_SLEEVE)
      || gesture === 'drk'
      && (partType === AvatarFigurePartType.RIGHT_HAND
          || partType === AvatarFigurePartType.RIGHT_SLEEVE
          || partType === AvatarFigurePartType.RIGHT_COAT_SLEEVE)
      || gesture === 'blw'
      && partType === AvatarFigurePartType.RIGHT_HAND
      || gesture === 'sig'
      && partType === AvatarFigurePartType.LEFT_HAND
      || gesture === 'respect'
      && partType === AvatarFigurePartType.LEFT_HAND
      || partType === AvatarFigurePartType.RIGHT_HAND_ITEM
      || partType === AvatarFigurePartType.LEFT_HAND_ITEM
      || partType === AvatarFigurePartType.CHEST_PRINT)
    ) {
      if (type.direction !== '4') {
        if (type.direction === '5') {
          direction = '1';
        } else if (type.direction === '6') {
          direction = '0';
        }
      }
    } else {
      direction = '2';
    }

    let frameName = `${id}_h_${gesture}_${partType}_${layerId}_${direction}_${frame}.png`;

    const asset = spritesheet.frames[frameName];
    if (asset === undefined) {
      frameName = `${id}_h_std_${partType}_${layerId}_${direction}_0.png`;
    }

    return frameName;
  }
}
