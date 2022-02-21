export type IDance = Array<IDanceFrame>;
export type IDanceFrame = Array<IDanceBodyPart>;

export interface IDanceBodyPart {
    id: string,
    action: string,
    frame: number,
    dx: number,
    dy: number,
    dd: number
}