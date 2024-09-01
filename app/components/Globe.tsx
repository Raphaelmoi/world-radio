'use client'
import { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl'
import { RadioStation } from '../types/radio-station';

const GlobeComponent = () => {
    const globeEl = useRef()
    const [countries, setCountries] = useState([])
    const [radios, setRadios] = useState<RadioStation[]>([])
    const electricBlue = "#2c75ff";
    const transparent = "#00000000"

    useEffect(() => {
        // if (globeEl && globeEl.current) {
        // Auto-rotate
        // globeEl.current.controls().autoRotate = true;
        // globeEl.current.controls().autoRotateSpeed = 1;
        // globeEl.current.controls().enableZoom = false;
        // globeEl.current.pointOfView({
        //     lat: 23.5,
        //     lng: 0,
        //     altitude: 2.5,
        // })
        // }

        fetch('/ne_110m_admin_0_countries.geojson').then(res => res.json()).then(countries => {
            setCountries(countries.features)
        });

        fetch('/radio-stations.json').then(res => res.json()).then(stations => {
            setRadios(stations.data.list)
        });


    }, [])

    return (
        <Globe
            ref={globeEl}
            polygonCapColor={() => transparent}
            polygonStrokeColor={() => electricBlue}
            polygonSideColor={() => electricBlue}
            polygonsData={countries}
            polygonAltitude={0.002}
            pointsData={radios}
            pointLat={(p) => (p as RadioStation).geo[1]}
            pointLng={(p) => (p as RadioStation).geo[0]}
            pointColor={() => '#ee0000'}
            pointAltitude={0.002}
            pointRadius={0.1}
            onPointHover={(point) => { console.log('hover ', point) }}
        />
    )
};

export default GlobeComponent;