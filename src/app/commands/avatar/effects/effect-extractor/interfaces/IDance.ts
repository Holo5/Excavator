export interface IDance {
    frames: IDanceFrame[]
}

export interface IDanceFrame {
    bodyParts: IDanceBodyPart[]
}

export interface IDanceBodyPart {
    id: string,
    action: string,
    frame: number,
    dx: number,
    dy: number,
    dd: number
}