import {inject, singleton} from 'tsyringe';
import {FSRepository} from '../Infra/FSRepository';

@singleton()
export class Holo5Excavator {
    constructor(
        @inject(FSRepository) private _fsRepository: FSRepository
    ) {}

    init() {
        this._fsRepository.init();

    }
}