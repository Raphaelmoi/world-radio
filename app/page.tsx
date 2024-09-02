"use client"
import { useEffect, useState } from "react";
import GlobeGl from "./components/Globe";
import { RadioStation } from "./types/radio-station";
import { TbExternalLink } from "react-icons/tb";

export default function Home() {
  const [radios, setRadios] = useState<RadioStation[]>([])
  const [currentRadio, setCurrentRadio] = useState<RadioStation | null>(null)

  function getRandomInt(array: any[]): number {
    return Math.floor(Math.random() * array.length);
  }

  function pickRandomRadio() {
    setCurrentRadio(radios[getRandomInt(radios)])
  }

  useEffect(() => {
    // https://api.radio-browser.info/
    fetch('https://at1.api.radio-browser.info/json/stations/search').then(res => res.json())
      .then((fetchedRadios: RadioStation[]) => {

        fetchedRadios.map(r => r.url_resolved.replace('http://', 'https://'))

        console.log(fetchedRadios);

        // const hsl = fetchedRadios.filter(r => r.hls === 1)
        // console.log("hsl", hsl);

        setRadios(fetchedRadios)

        const r = getRandomInt(fetchedRadios)
        setCurrentRadio(fetchedRadios[r])

      });
  }, [])


  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <GlobeGl radios={radios} pickRadio={(pickedRadio: RadioStation) => setCurrentRadio(pickedRadio)} pickedRadio={currentRadio} />

      {currentRadio &&
        <div className="bg-slate-800 w-9/12 absolute bottom-4 p-4 rounded-md flex">

          <img src={currentRadio.favicon} className="size-16 mr-2" onClick={() => pickRandomRadio()} />

          <div className="flex items-center w-full">
            <div className="mr-4 flex-1">
              <div className="flex w-full items-center justify-between">
                <h3>
                  {currentRadio.name}
                </h3>
                <a href={currentRadio.homepage} target="_blank" rel="noopener" className="flex items-center" >
                  <TbExternalLink />
                  Visit page
                </a>
              </div>
              <span className="text-gray-400  ">
                {currentRadio.country}
              </span>

              <span className="text-gray-400  ">
                {currentRadio.geo_lat}, {currentRadio.geo_long}
              </span>
            </div>

            <audio controls src={currentRadio.url_resolved} autoPlay className=""></audio>

          </div>
        </div>
      }
    </main>
  );
}
