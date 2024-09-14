import { IoCog } from "react-icons/io5";
import { LiaGlobeEuropeSolid } from "react-icons/lia";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import useAppStore from "../stores/store";

export default function SelectMapLayers() {

    const { mapLayers, setPickedMapLayer, mapLayerOpacity, setOpacity, pickedMapLayer } = useAppStore();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setOpacity(Number(event.target.value)); // Convertir la valeur en nombre
    };

    return <div className="bg-white/10 flex items-center justify-center p-1 rounded-full cursor-pointer">
        <Menu>
            <MenuButton>
                <LiaGlobeEuropeSolid className="size-6 text-gray-100 hover:text-white" />
            </MenuButton>
            <MenuItems anchor="bottom end"
                className="mt-1 w-60 origin-top-right rounded-xl border border-white/5 bg-black/50 p-1 text-sm/6 
        text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
            >
                <MenuItem >
                    <button
                        onClick={() => setPickedMapLayer(null)}
                        className="group flex w-full items-center gap-2 rounded-lg py-1 px-3 data-[focus]:bg-white/10">
                        <img src="/map/satellite.jpg" className="w-12 h-12 object-cover" />
                        Satellite
                    </button>
                </MenuItem>
                {mapLayers.map(map =>
                    <MenuItem key={map.name} >
                        <button
                            onClick={() => setPickedMapLayer(map)}
                            className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10 text-left">
                            <img src={map.img} className="w-12 h-12 object-cover" />
                            <span >{map.name}</span>
                        </button>
                    </MenuItem>
                )}

                {pickedMapLayer && <MenuItem >
                    <div className="mt-6 pt-2 border-t border-gray-500">
                        Set layer opacity
                        <button
                            className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={mapLayerOpacity}
                                onChange={handleChange}
                                className="w-full"
                            />
                        </button>
                    </div>
                </MenuItem>
                }

            </MenuItems>
        </Menu>
    </div>
}