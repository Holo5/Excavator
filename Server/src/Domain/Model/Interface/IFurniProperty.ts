export interface IFurniProperty {
    infos: {
        logic: string,
        visualization: string,
    }
    dimensions: {
        x: number,
        y: number,
        z: string,
    },
    visualization: {
        layerCount: number,
        layers: {
            [id: number]: {
                id: number,
                ink?: string,
                alpha?: number,
                z?: string,
                ignoreMouse?: boolean,
            }
        },
        directions: number[],
        colors: {
            [colorId: number]: {
                [layerId: number]: {
                    color: string,
                }
            }
        },
        animation: {
            [animationId: number]: {
                [layerId: number]: {
                    loopCount?: number,
                    frameRepeat?: number,
                    random?: number,
                    frameSequence: number[],
                }
            }
        }
    }
}
