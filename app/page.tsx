"use client"
import { useEffect, useState } from "react";
import { RadioStation } from "./types/radio-station";
import dynamic from "next/dynamic";
import CurrentRadioPlayer from "./components/CurrentRadioPlayer";
import { FeatureCollection } from "./types/CapitalsGeojson";

const Cesium = dynamic(
  () => import('./components/Cesium'),
  { ssr: false }
)

const LS_FAVORITE_RADIOS_NAME = 'favorites-radio'


export default function Home() {
  const [radios, setRadios] = useState<RadioStation[]>([])
  const [currentRadio, setCurrentRadio] = useState<RadioStation | null>(null)
  const [currentRadioIndex, setCurrentRadioIndex] = useState(0)
  const [favoriteRadios, setfavoriteRadios] = useState<string[]>([])

  function pickNextRadio(direction: number) {
    let nextRadio = currentRadioIndex + direction;
    if (nextRadio >= radios.length) nextRadio = 0;
    else if (nextRadio < 0) nextRadio = radios.length - 1;

    setCurrentRadioIndex(nextRadio);
    setCurrentRadio(radios[nextRadio]);
  }

  function toggleFavoriteRadio(radioId: string) {
    console.log("toggleFavoriteRadio");

    if (favoriteRadios.includes(radioId) === false) {
      setfavoriteRadios(prevRadios => [...prevRadios, radioId]);
    } else {
      setfavoriteRadios(prevRadios => prevRadios.filter(radio => radio !== radioId));
    }
  }

  // Store favorites any times favoritesRadio array change
  useEffect(() => {
    localStorage.setItem(LS_FAVORITE_RADIOS_NAME, JSON.stringify(favoriteRadios))
  }, [favoriteRadios])


  useEffect(() => {

    const storedFavorites = localStorage.getItem(LS_FAVORITE_RADIOS_NAME)
    if (storedFavorites) setfavoriteRadios(JSON.parse(storedFavorites))

    // https://api.radio-browser.info/
    fetch('https://at1.api.radio-browser.info/json/stations/search').then(res => res.json())
      .then((fetchedRadios: RadioStation[]) => {
        const shuffledArray = fetchedRadios.sort(() => Math.random() - 0.5);

        setRadios(shuffledArray)

        fetch('/capitals.geojson').then(res => res.json()).then((capitals: FeatureCollection) => {

          // For radios that have a country specified but lack coordinates, assign the coordinates of the capital city of that country. 
          // Also, set the HSL value to 3 to filter out these radios and prevent them from being displayed on the map.
          fetchedRadios
            .filter((r) => r.country && !r.geo_lat)
            .forEach(radio => {

              const cap = capitals.features.find((capital: any) => radio.countrycode === capital.id)
              if (cap) {
                radio.geo_lat = cap.geometry.coordinates[1];
                radio.geo_long = cap.geometry.coordinates[0];
                radio.hls = 3
              }
            })

          setTimeout(() => {
            setCurrentRadio(shuffledArray[0])
          }, 4000);
        })
      });
  }, [])


  return (
    <main className="flex min-h-screen flex-col items-center justify-between relative">

      {<Cesium radios={radios} pickRadio={(pickedRadio: RadioStation) => setCurrentRadio(pickedRadio)} pickedRadio={currentRadio} />}

      {currentRadio &&
        <CurrentRadioPlayer
          currentRadio={currentRadio}
          pickNextRadio={pickNextRadio}
          favoriteRadios={favoriteRadios}
          toggleFavoriteRadio={toggleFavoriteRadio}
        />
      }
    </main >
  );
}
