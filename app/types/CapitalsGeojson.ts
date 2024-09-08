export type PointGeometry = {
    type: "Point";
    coordinates: [number, number];
};

export type Feature = {
    type: "Feature";
    properties: {
        country: string;
        city: string;
        tld: string;
        iso3: string;
        iso2: string;
    };
    geometry: PointGeometry;
    id: string;
};

export type FeatureCollection = {
    type: "FeatureCollection";
    features: Feature[];
};