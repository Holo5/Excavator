import { Lib } from '../../../../Domain/FigureMap/Lib';
import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';

export interface ILibExtractionStateChangeMessage {
  lib: Lib
}

export class LibExtractionStateChangeComposer extends Outgoing<ILibExtractionStateChangeMessage> {
  private _lib: Lib;

  constructor(lib: Lib) {
    super(OutgoingHeader.LIB_EXTRACTION_STATE_CHANGED);

    this._lib = lib;
    this.log(this._lib.id);
  }

  process() {
    this._data = {
      lib: this._lib,
    };
  }
}
