export interface IFigureData {
  setTypes: SetTypes
}

export interface SetTypes {
  [type: string]: SetType
}

interface SetType {
  paletteid: string,
  mand_m_0: string,
  mand_f_0: string,
  mand_m_1: string,
  mand_f_1: string,
  sets: {
    [id: string]: Set
  }
}

interface Set {
  gender: string,
  club: string,
  colorable: string,
  selectable: string,
  preselectable: string,
  sellable: string,
  parts: Part[],
  hiddenparts: HiddenPart[]
}

interface Part {
  id: string,
  type: string,
  colorable: string,
  index: string,
  colorindex: string,
  assetname: string,
}

interface HiddenPart {
  partType: string
}
