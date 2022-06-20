export interface IFigureLib {
    id: string,
    revision: string,
    parts: IFigureLibPart[],
}

export interface IFigureLibPart {
    id: string,
    type: string,
}