export class FloorItem {
    public id: number;
    public className: string;
    public revision: number;
    public category: string;
    public defaultdir: number;
    public xdim: number;
    public ydim: number;
    public partcolors: string[];
    public name: string;
    public description: string;
    public adurl: string;
    public offerid: number;
    public buyout: number;
    public rentofferid: number;
    public rentbuyout: number;
    public bc: number;
    public excludeddynamic: boolean;
    public customparams: string;
    public specialtype: string;
    public canstandon: boolean;
    public cansiton: boolean;
    public canlayon: boolean;
    public furniline: string;
    public environment: string;
    public rare: boolean;

    constructor(
        id: number,
        className: string,
        revision: number,
        category: string,
        defaultdir: number,
        xdim: number,
        ydim: number,
        partcolors: string[],
        name: string,
        description: string,
        adurl: string,
        offerid: number,
        buyout: number,
        rentofferid: number,
        rentbuyout: number,
        bc: number,
        excludeddynamic: boolean,
        customparams: string,
        specialtype: string,
        canstandon: boolean,
        cansiton: boolean,
        canlayon: boolean,
        furniline: string,
        environment: string,
        rare: boolean,
    ) {
        this.id = id;
        this.className = className;
        this.revision = revision;
        this.category = category;
        this.defaultdir = defaultdir;
        this.xdim = xdim;
        this.ydim = ydim;
        this.partcolors = partcolors;
        this.name = name;
        this.description = description;
        this.adurl = adurl;
        this.offerid = offerid;
        this.buyout = buyout;
        this.rentofferid = rentofferid;
        this.rentbuyout = rentbuyout;
        this.bc = bc;
        this.excludeddynamic = excludeddynamic;
        this.customparams = customparams;
        this.specialtype = specialtype;
        this.canstandon = canstandon;
        this.cansiton = cansiton;
        this.canlayon = canlayon;
        this.furniline = furniline;
        this.environment = environment;
        this.rare = rare;
    }

    static tileCursor() {
        return new FloorItem(0,
            'TileCursor',
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined);
    }
}
