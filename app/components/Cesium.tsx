import { Color, DistanceDisplayCondition, EntityCluster, OpenStreetMapImageryProvider, UrlTemplateImageryProvider } from 'cesium';
import { BillboardGraphics, CameraFlyTo, CesiumComponentRef, CustomDataSource, Entity, GeoJsonDataSource, Globe, ImageryLayer, Viewer } from 'resium'
import { Cartesian3 } from "cesium";
import { useEffect, useRef, useState } from 'react';
import useAppStore from '../stores/store';
import { Viewer as CesiumViewer } from "cesium";
import { RadioStation } from '../types/radio-station';

interface GlobeComponentProps { }

export default function Cesium({ }: GlobeComponentProps) {
    const [radioEntities, setRadioEntities] = useState<JSX.Element[]>([]);
    const [pickedRadioEntities, setPickedRadioEntities] = useState<JSX.Element>();
    const { mapLayerOpacity, pickedMapLayer, radios, currentRadio, setCurrentRadio, currentTheme, changeRadioFromOutsideGlobe } = useAppStore();

    const ref = useRef<CesiumComponentRef<CesiumViewer>>(null);

    function pickRadioStation(stationId: string) {
        const r = radios.findIndex((radio) => radio.stationuuid === stationId)
        if (r !== -1) {
            setCurrentRadio(radios[r])
            zoomToRadio(radios[r])
        }
    }

    const zoomToRadio = (radio: RadioStation) => {
        const viewer = ref.current?.cesiumElement;
        if (viewer) {
            const camera = viewer.camera;

            const currentHeight = camera.positionCartographic.height;
            const targetHeight = 1_000_000;

            if (radio) {
                camera.flyTo({
                    destination: Cartesian3.fromDegrees(radio.geo_long || 0, radio.geo_lat || 0, Math.min(targetHeight, currentHeight)),
                    duration: 3,
                });
            }
        };
    }

    useEffect(() => {
        if (currentRadio) zoomToRadio(currentRadio)
    }, [changeRadioFromOutsideGlobe]);


    useEffect(() => {
        if (radios.length) {
            const entities: JSX.Element[] = radios.filter(r => r.hls !== 3 && r.geo_lat && r.geo_long)
                .map((r) => {
                    const position = Cartesian3.fromDegrees(r.geo_long!, r.geo_lat!, 3);
                    const pointGraphics = {
                        pixelSize: 6,
                        color: Color.fromCssColorString(currentTheme.color),
                        outlineWidth: 0
                    };

                    return (
                        <Entity
                            key={r.stationuuid}
                            position={position}
                            point={pointGraphics}
                            onClick={() => pickRadioStation(r.stationuuid)}
                        />
                    );
                });
            setRadioEntities(entities);
        }

    }, [radios]);


    useEffect(() => {
        if (currentRadio && currentRadio.geo_long && currentRadio.geo_lat) {
            const position = Cartesian3.fromDegrees(currentRadio.geo_long!, currentRadio.geo_lat!, 5);

            setPickedRadioEntities(
                <Entity
                    position={position}
                    point={{
                        pixelSize: 10,
                        color: Color.RED,
                        outlineWidth: 0
                    }}
                >
                    {/* <BillboardGraphics
                        image={"/pin.png"}
                        width={64}
                        height={64}
                        distanceDisplayCondition={new DistanceDisplayCondition(0, 50_000_000)}
                    /> */}
                </Entity>)
        }
    }, [currentRadio])

    return (
        <Viewer
            ref={ref}
            full
            timeline={false}
            animation={false}
            baseLayerPicker={false}
            geocoder={true}
            homeButton={false}
            sceneModePicker={false}
            navigationHelpButton={false}
            infoBox={false}
            selectionIndicator={false}
            skyBox={currentTheme.stars}
        >
            {/* <ImageryLayer
                imageryProvider={new UrlTemplateImageryProvider({
                    url: 'https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg',
                    credit: 'Map tiles by Stamen Design, under CC BY 3.0. Data by OpenStreetMap, under ODbL.',

                })}
            /> */}

            {/* {pickedMapLayer &&
                <ImageryLayer
                    alpha={mapLayerOpacity}
                    imageryProvider={new OpenStreetMapImageryProvider({
                        url: pickedMapLayer.url
                    })}
                />
            } */}

            {currentTheme.id === 1 &&
                <>
                    {/* <Globe
                        baseColor={Color.DARKMAGENTA}
                    /> */}

                    <GeoJsonDataSource
                        data={"/custom.geo.json"}
                        stroke={Color.WHITE}
                        fill={Color.TRANSPARENT}
                    />

                    {/* <ImageryLayer
                        imageryProvider={new OpenStreetMapImageryProvider({
                            url: "https://basemaps.cartocdn.com/rastertiles/voyager_only_labels_no_buildings/"
                        })}
                    /> */}
                </>
            }

            {/* {currentRadio ?
                <CameraFlyTo
                    duration={2}
                    destination={Cartesian3.fromDegrees(currentRadio?.geo_long || 0, currentRadio?.geo_lat || 0, 10_000_000)}
                /> :
                <CameraFlyTo
                    duration={5}
                    destination={Cartesian3.fromDegrees(0, 0, 10_000_000)}
                />
            } */}

            {/* Picked Radio */}
            {pickedRadioEntities}

            {/* All the others radio */}
            <CustomDataSource
                clustering={
                    new EntityCluster({
                        enabled: false,
                        pixelRange: 30,
                        minimumClusterSize: 6,
                        clusterPoints: true,
                    })
                }>
                {
                    radioEntities.map(r => {
                        return r
                    })
                }

            </CustomDataSource>
        </Viewer>
    )
}