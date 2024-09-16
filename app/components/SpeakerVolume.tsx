import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import Slider from "rc-slider";
import { HiOutlineSpeakerWave } from "react-icons/hi2";
import 'rc-slider/assets/index.css';
import useAppStore from "../stores/store";
import { HiOutlineVolumeOff } from "react-icons/hi";

export function SpeakerVolume({ iconSize = "size-6" }: { iconSize?: string }) {
    const { volume, setVolume } = useAppStore();

    const handleVolumeChange = (event: number | number[]) => {
        setVolume(event as number)
    };

    return <Menu>
        <MenuButton>
            {volume !== 0 ?
                <HiOutlineSpeakerWave className={iconSize + ' text-white hover:text-gray-100'} />
                :
                <HiOutlineVolumeOff className={iconSize + ' text-white hover:text-gray-100'} />
            }

        </MenuButton>
        <MenuItems anchor="bottom"
            className="mb-2 origin-bottom-right rounded-xl border
                    border-white/5 bg-black/50 p-1 text-sm/6 
                    text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] 
                    focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
        >
            <MenuItem >
                <div className="h-48 p-2" >
                    <Slider
                        min={0}
                        max={100}
                        defaultValue={volume}
                        vertical={true}
                        step={1}
                        onChange={handleVolumeChange}
                        styles={{
                            track: {
                                background: `#2c75ff`,
                            },
                        }}
                    />
                </div>
            </MenuItem>
        </MenuItems>
    </Menu>
}