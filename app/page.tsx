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
import { get_radiobrowser_base_url_random , get_radiobrowser_server_config} from "./utils/api-radio-browser";
import {  FaPlay } from "react-icons/fa";

const Cesium = dynamic(
  () => import('./components/Cesium'),
  { ssr: false }
)

export default function Home() {
  const { setFavoriteRadios, radios, setRadios, currentRadio, setCurrentRadio, themes, setCurrentTheme, setNewRadioKey } = useAppStore();
  const [currentRadioIndex, setCurrentRadioIndex] = useState(0)
  const [ showWelcomePanel, setShowWelcomePanel ] = useState(true)

  function pickNextRadio(direction: number) {
    let nextRadio = currentRadioIndex + direction;
    if (nextRadio >= radios.length) nextRadio = 0;
    else if (nextRadio < 0) nextRadio = radios.length - 1;

    setCurrentRadioIndex(nextRadio);
    setCurrentRadio(radios[nextRadio]);

    setNewRadioKey()
  }

  useEffect(() => {
    setCurrentTheme(themes[0])
    document.documentElement.style.setProperty('--theme-color', themes[0].color);

    const storedFavorites = localStorage.getItem(LS_FAVORITE_RADIOS_NAME);
    if (storedFavorites) {
      setFavoriteRadios(JSON.parse(storedFavorites));
    }


    const fetchData = async () => {
      const apiLink : string = await get_radiobrowser_base_url_random()

      const fetchedRadios: RadioStation[] = await fetch(apiLink + '/json/stations/search')
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
    };

    fetchData();
  }, []);

function runRadio() {
  setShowWelcomePanel(false)
  pickNextRadio(1)
}

  return (
    <main className="flex min-h-screen flex-col items-center justify-between relative">
      {/* 
      rajouter : 
      - shazam ?
      - animation wave du son
      - loading d'une radio ?
      - recherche par type / pays
      - responsive
      - bouton voir details ?
      - recuperation du bon endpoint pour la liste des radios
      */}

      { showWelcomePanel && <div className="fixed inset-0 flex items-center justify-center z-40 bg-gray-950/60">
        <div className="rounded-xl py-8 px-16 backdrop-blur-sm bg-gray-950/90">
          <h1 className="text-4xl font-bold text-white">Radio Monde</h1>
          
            <div className="mt-4 flex items-center gap-2 rounded-full bg-yellow-500 px-4 py-2 cursor-pointer" onClick={() => runRadio()}>
              <FaPlay className="size-8" />
              <span>Let&apos;s start !</span>
            </div>
        </div>
      </div>
      }

      <Cesium />

      {currentRadio && <CurrentRadioPlayer pickNextRadio={pickNextRadio} />}

      <div className="absolute top-6 right-6 flex gap-2">
        <SearchRadio />
        <SelectFavoriteRadio />
        {/* <SelectMapLayers /> */}
      </div>


    </main >
  );
}
