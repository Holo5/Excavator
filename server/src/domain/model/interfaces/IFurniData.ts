import { FloorItem } from '../../FurniData/FloorItem';
import { WallItem } from '../../FurniData/WallItem';

export interface IFurniData {
    floorItems: {
        [id: number]: FloorItem
    },
    wallItems: {
        [id: number]: WallItem
    }
}
