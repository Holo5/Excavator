export class WallItem {
    public id: number;
    public className: string;
    public revision: number;
    public name: string;
    public description: string;
    public adurl: number;
    public offerid: number;
    public buyout: number;
    public rentofferid: number;
    public rentbuyout: number;
    public bc: number;
    public excludeddynamic: boolean;
    public specialtype: string;
    public furniline: string;
    public environment: string;
    public rare: boolean;

    constructor(
        id: number,
        className: string,
        revision: number,
        name: string,
        description: string,
        adurl: number,
        offerid: number,
        buyout: number,
        rentofferid: number,
        rentbuyout: number,
        bc: number,
        excludeddynamic: boolean,
        specialtype: string,
        furniline: string,
        environment: string,
        rare: boolean
    ) {
        this.id = id;
        this.className = className;
        this.revision = revision;
        this.name = name;
        this.description = description;
        this.adurl = adurl;
        this.offerid = offerid;
        this.buyout = buyout;
        this.rentofferid = rentofferid;
        this.rentbuyout = rentbuyout;
        this.bc = bc;
        this.excludeddynamic = excludeddynamic;
        this.specialtype = specialtype;
        this.furniline = furniline;
        this.environment = environment;
        this.rare = rare;
    }
}