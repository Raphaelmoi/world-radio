import { Color, EntityCluster, IonImageryProvider, OpenStreetMapImageryProvider } from 'cesium';
import { CameraFlyTo, CustomDataSource, Entity, GeoJsonDataSource, ImageryLayer, Viewer } from 'resium'
import { Cartesian3 } from "cesium";
import { RadioStation } from '../types/radio-station';
import { useEffect, useState } from 'react';
import useAppStore from '../stores/store';

interface GlobeComponentProps {
    radios: RadioStation[];
    pickedRadio: RadioStation | null;
    pickRadio: (radio: RadioStation) => void
}

const electricBlue = "#2c75ff";

export default function Cesium({ radios, pickedRadio, pickRadio }: GlobeComponentProps) {
    const [radioEntities, setRadioEntities] = useState<JSX.Element[]>([]);

    const { mapLayerOpacity, pickedMapLayer } = useAppStore();


    function pickRadioStation(stationId: string) {
        const r = radios.findIndex((radio) => radio.stationuuid === stationId)
        if (r !== -1) {
            pickRadio(radios[r])
        }
    }
    useEffect(() => {
        if (radios.length) {
            const entities: JSX.Element[] = radios.filter(r => r.hls !== 3 && r.geo_lat && r.geo_long)
                .map((r) => {
                    const position = Cartesian3.fromDegrees(r.geo_long!, r.geo_lat!, 0);
                    const pointGraphics = {
                        pixelSize: 6,
                        color: pickedRadio && pickedRadio.stationuuid === r.stationuuid ? Color.WHEAT : Color.TURQUOISE,
                        // outlineColor: Color.TRANSPARENT, 
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
    }, [radios, pickRadio]);


    return (
        <Viewer full
            // terrainProvider={createWorldTerrainAsync()}
            timeline={false}
            animation={false}
            baseLayerPicker={false}
            geocoder={false}
            homeButton={false}
            sceneModePicker={false}
            navigationHelpButton={false}
            infoBox={false}
            selectionIndicator={false}
        >
            {pickedMapLayer &&
                <ImageryLayer
                    alpha={mapLayerOpacity}
                    imageryProvider={new OpenStreetMapImageryProvider({
                        url: pickedMapLayer.url
                    })}
                />
            }

            {/* <SkyAtmosphere /> */}
            {/* <Globe
            // enableLighting={true}
            // baseColor={Color.DARKSLATEGRAY}
            /> */}
            {/* <Scene /> */}

            <GeoJsonDataSource
                data={"/ne_110m_admin_0_countries.geojson"}
                stroke={Color.WHITE}
            />

            {pickedRadio ?
                <CameraFlyTo
                    duration={5}
                    destination={Cartesian3.fromDegrees(pickedRadio?.geo_long || 0, pickedRadio?.geo_lat || 0, 1_000_000)}
                /> :
                <CameraFlyTo
                    duration={5}
                    destination={Cartesian3.fromDegrees(0, 0, 10_000_000)}
                />
            }

            <CustomDataSource
                clustering={
                    new EntityCluster({
                        enabled: true,
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