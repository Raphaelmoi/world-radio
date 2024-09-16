"use client"
import { useEffect, useState } from "react";
import { RadioStation } from "./types/radio-station";
import dynamic from "next/dynamic";
import CurrentRadioPlayer from "./components/CurrentRadioPlayer";
import { FeatureCollection } from "./types/CapitalsGeojson";
import SelectMapLayers from "./components/SelectMapLayers";
import SelectFavoriteRadio from "./components/SelectFavoriteRadio";
import useAppStore from "./stores/store";
import SearchRadio from "./components/SearchRadio";
import { LS_FAVORITE_RADIOS_NAME } from "./utils/const";

const Cesium = dynamic(
  () => import('./components/Cesium'),
  { ssr: false }
)

export default function Home() {
  const { setFavoriteRadios, radios, setRadios, currentRadio, setCurrentRadio } = useAppStore();
  const [currentRadioIndex, setCurrentRadioIndex] = useState(0)

  function pickNextRadio(direction: number) {
    let nextRadio = currentRadioIndex + direction;
    if (nextRadio >= radios.length) nextRadio = 0;
    else if (nextRadio < 0) nextRadio = radios.length - 1;

    setCurrentRadioIndex(nextRadio);
    setCurrentRadio(radios[nextRadio]);
  }

  useEffect(() => {
    const storedFavorites = localStorage.getItem(LS_FAVORITE_RADIOS_NAME);
    if (storedFavorites) {
      setFavoriteRadios(JSON.parse(storedFavorites));
    }

    const fetchData = async () => {
      const fetchedRadios: RadioStation[] = await fetch('https://at1.api.radio-browser.info/json/stations/search')
        .then(res => res.json());

      const capitals: FeatureCollection = await fetch("/capitals.geojson").then(res => res.json());

      fetchedRadios
        .filter(r => r.country && !r.geo_lat)
        .forEach(radio => {
          const capital = capitals.features.find(cap => radio.countrycode === cap.id);
          if (capital) {
            radio.geo_lat = capital.geometry.coordinates[1];
            radio.geo_long = capital.geometry.coordinates[0];
            radio.hls = 3; // Filter these out on the map
          }
        });

      const shuffledRadios = fetchedRadios.sort(() => Math.random() - 0.5);
      setRadios(shuffledRadios);
      setCurrentRadio(shuffledRadios[0]);
    };

    fetchData();
  }, []);


  return (
    <main className="flex min-h-screen flex-col items-center justify-between relative">

      <Cesium />

      {currentRadio && <CurrentRadioPlayer pickNextRadio={pickNextRadio} />}

      <div className="absolute top-6 right-6 flex gap-2">
        <SearchRadio />
        <SelectFavoriteRadio />
        <SelectMapLayers />
      </div>
    </main >
  );
}
