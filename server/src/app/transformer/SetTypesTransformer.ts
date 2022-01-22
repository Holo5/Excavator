/* eslint-disable @typescript-eslint/naming-convention */
import { Element } from 'xml-js';
import { SetType } from '../../domain/figuredata/SetType';
import { Set } from '../../domain/figuredata/Set';
import { Part } from '../../domain/figuredata/Part';
import { HiddenPart } from '../../domain/figuredata/HiddenPart';
import { StringAttributes } from './XML/StringAttributes';

export class SetTypesTransformer {
    public static transform(xmlArray: Element[]): SetType[] {
        const setTypes: SetType[] = [];

        for (let i = 0; i < xmlArray.length; i++) {
            setTypes[i] = this.transformSetType(xmlArray[i]);
        }

        return setTypes;
    }

    private static transformSetType(xmlSet: Element): SetType {
        const {
            type,
            paletteid,
            mand_m_0,
            mand_f_0,
            mand_m_1,
            mand_f_1,
        } = xmlSet.attributes as StringAttributes;

        const sets = this.transformSets(xmlSet.elements);

        return new SetType(type, paletteid, mand_m_0, mand_f_0, mand_m_1, mand_f_1, sets);
    }

    private static transformSets(xmlSets: Element[]): Set[] {
        const sets: Set[] = [];

        for (let i = 0; i < xmlSets.length; i++) {
            sets[i] = this.transformSet(xmlSets[i]);
        }

        return sets;
    }

    private static transformSet(xmlSet: Element): Set {
        const {
            id,
            gender,
            club,
            colorable,
            selectable,
            preselectable,
            sellable,
        } = xmlSet.attributes as StringAttributes;

        const parts = this.transformParts(xmlSet.elements.filter((e) => e.name === 'part'));
        const hiddenParts = this.transformHiddenParts(xmlSet.elements.filter((e) => e.name === 'hiddenlayers')[0]);

        return new Set(id, gender, club, colorable, selectable, preselectable, sellable, parts, hiddenParts);
    }

    private static transformParts(xmlParts: Element[]): Part[] {
        const parts: Part[] = [];

        for (let i = 0; i < xmlParts.length; i++) {
            parts[i] = this.transformPart(xmlParts[i]);
        }

        return parts;
    }

    private static transformPart(xmlPart: Element): Part {
        const {
            id,
            type,
            colorable,
            index,
            colorindex,
        } = xmlPart.attributes as StringAttributes;

        return new Part(id, type, colorable, index, colorindex);
    }

    private static transformHiddenParts(xmlHiddenParts: Element): HiddenPart[] {
        if (!xmlHiddenParts) return [];

        const hiddenParts: HiddenPart[] = [];
        const xmlHiddenPartElements = xmlHiddenParts.elements;

        for (let i = 0; i < xmlHiddenPartElements.length; i++) {
            hiddenParts[i] = this.transformHiddenPart(xmlHiddenPartElements[i]);
        }

        return hiddenParts;
    }

    private static transformHiddenPart(xmlHiddenPart: Element): HiddenPart {
        const partType = xmlHiddenPart.attributes.parttype as string;

        return new HiddenPart(partType);
    }
}
