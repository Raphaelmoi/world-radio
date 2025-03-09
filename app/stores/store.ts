// stores/store.ts
import { create } from 'zustand';
import { RadioStation } from '../types/radio-station';
import { FeatureCollection } from '../types/CapitalsGeojson';

interface MapLayer {
    name: string;
    url: string;
    img: string;
}

interface Theme {
    id: number
    name: string
    color: string
    stars: false | undefined
}

interface AppState {
    radios: RadioStation[];
    capitals: FeatureCollection | null;
    currentRadio: null | RadioStation;
    favoriteRadios: string[];
    isPlaying: boolean;
    mapLayerOpacity: number;
    mapLayers: MapLayer[];
    pickedMapLayer: MapLayer | null;
    volume: number;
    currentTheme: Theme;
    themes: Theme[];
    changeRadioFromOutsideGlobe: number;

    setPickedMapLayer: (picked: MapLayer | null) => void;
    setOpacity: (opacity: number) => void;
    setRadios: (radios: RadioStation[]) => void;
    setFavoriteRadios: (radios: string[]) => void;
    setCurrentRadio: (radio: null | RadioStation) => void;
    setIsPlaying: (play: boolean) => void;
    setVolume: (volume: number) => void;
    setCurrentTheme: (theme: Theme) => void;
    setNewRadioKey: () => void
    setCapitals: (capitals: FeatureCollection) => void
}

const useAppStore = create<AppState>(set => ({
    radios: [],
    currentRadio: null,
    capitals: null,
    favoriteRadios: [],
    isPlaying: false,
    mapLayerOpacity: 1,
    mapLayers: [
        { name: "OSM", url: "https://tile.openstreetmap.org/", img: "/map/osm.jpg" },
        { name: "Wikimedia", url: "https://maps.wikimedia.org/osm-intl/", img: "/map/wikimedia.jpg" },
        { name: "OSM humanitarian", url: "https://{s}.tile.openstreetmap.fr/hot/", img: "/map/osm-humanitarian.jpg" },
        { name: "Dark map", url: "https://basemaps.cartocdn.com/dark_all/", img: "/map/dark.jpg" },
        { name: "Light map", url: "https://basemaps.cartocdn.com/light_all/", img: "/map/light.jpg" },
        { name: "Satellite with places name", url: "https://basemaps.cartocdn.com/rastertiles/voyager_only_labels_no_buildings/", img: "/map/label.jpg" },
        { name: "Satellite with places name dark", url: "https://basemaps.cartocdn.com/dark_only_labels/", img: "/map/darklabel.jpg" },
        { name: "OSM 2", url: "https://{s}.tile.openstreetmap.fr/osmfr/", img: "/map/osm2.jpg" },
    ],
    pickedMapLayer: null,
    volume: 100,
    changeRadioFromOutsideGlobe: 0,
    setNewRadioKey: () => set(state => ({ changeRadioFromOutsideGlobe: state.changeRadioFromOutsideGlobe += 1 })),

    setPickedMapLayer: (picked: MapLayer | null) => set(state => ({ pickedMapLayer: picked })),
    setOpacity: (opacity: number) => set(state => ({ mapLayerOpacity: opacity })),
    setFavoriteRadios: (radios: string[]) => set(state => ({ favoriteRadios: radios })),
    setRadios: (radios) => set(state => ({ radios })),
    setCurrentRadio: (currentRadio) => set(state => ({ currentRadio, isPlaying: true })),
    setIsPlaying: (isPlaying) => set(state => ({ isPlaying })),
    setVolume: (volume: number) => set(state => ({ volume })),
    setCapitals: (capitals : FeatureCollection) => set(state => ({capitals})),
 
    themes: [
        {
            id: 1,
            name: 'dark and gold',
            color: "#ffd700",
            stars: false,
        }
    ],
    currentTheme: { color: '#ffffff' } as Theme,
    setCurrentTheme: (currentTheme: Theme) => set(state => ({ currentTheme })),

}));

export default useAppStore;
