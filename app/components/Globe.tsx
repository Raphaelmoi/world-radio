'use client'
import { useEffect, useRef, useState } from 'react';
import { RadioStation } from '../types/radio-station';
import dynamic from 'next/dynamic';

const Globe = dynamic(() => import('react-globe.gl'), { ssr: false })

const electricBlue = "#2c75ff";
const transparent = "#00000000"

interface GlobeComponentProps {
    radios: RadioStation[];
    pickedRadio: RadioStation | null;
    pickRadio: (radio: RadioStation) => void
}

const GlobeComponent = ({ radios, pickedRadio, pickRadio }: GlobeComponentProps) => {
    const [countries, setCountries] = useState([])
    const globeRef = useRef()

    useEffect(() => {
        fetch('/ne_110m_admin_0_countries.geojson').then(res => res.json()).then(countries => {
            setCountries(countries.features)
        });

        radios.forEach((r) => {
            if (r.geo_lat === null) {
                r.geo_lat = 90
                r.geo_long = 90
            }
        })
    }, [])

    const radiusByPopularity = (nbrOfVotes: number) => Math.max(0.1, Math.min(0.3, nbrOfVotes * 0.0001));

    function setPointColor(station: RadioStation) {
        return pickedRadio && pickedRadio.stationuuid === station.stationuuid ? '#00ffff' : '#ee0000'
    }
    function setPointAltitude(station: RadioStation) {
        return pickedRadio && pickedRadio.stationuuid === station.stationuuid ? 0.02 : 0.002
    }

    return (
        <Globe
            ref={globeRef}
            polygonCapColor={() => transparent}
            polygonStrokeColor={() => electricBlue}
            polygonSideColor={() => electricBlue}
            polygonsData={countries}
            polygonAltitude={0.002}
            pointsData={radios}
            pointLat={(p) => (p as RadioStation).geo_lat ?? 0}
            pointLng={(p) => (p as RadioStation).geo_long ?? 0}
            pointColor={(p) => setPointColor(p as RadioStation)}
            // pointsMerge={true}
            pointAltitude={(p) => setPointAltitude(p as RadioStation)}
            pointRadius={(p) => radiusByPopularity((p as RadioStation).votes)}
            onPointClick={(radio) => { if (radio) pickRadio(radio as RadioStation) }}
        />
    )
};

export default GlobeComponent;