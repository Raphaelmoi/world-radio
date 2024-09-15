import { Menu, MenuButton, MenuItems, MenuItem, MenuSeparator, MenuHeading } from "@headlessui/react";
import { GoHeartFill } from "react-icons/go";
import useAppStore from "../stores/store";
import { RadioStation } from "../types/radio-station";

interface SelectFavoriteRadioProps {
    radios: RadioStation[];
    pickRadio: (radio: RadioStation) => void
}
export default function SelectFavoriteRadio({ radios, pickRadio }: SelectFavoriteRadioProps) {
    const { favoriteRadios } = useAppStore();

    function getRadio(radioUuid: string) {
        const r = radios.find(r => r.stationuuid === radioUuid)
        if (r) return r
        return null
    }

    return <div className="bg-white flex items-center justify-center p-1 w-8 h-8 rounded-full cursor-pointer">
        {favoriteRadios.length &&
            <Menu>
                <MenuButton>
                    <GoHeartFill className="size-5 text-gray-800 hover:text-gray-900" />
                </MenuButton>

                <MenuItems anchor="bottom end"
                    className="mt-2 w-60 origin-top-right rounded-xl 
                        border border-white/5 bg-black/50 p-1 text-sm/6 
                        text-white transition duration-100 ease-out 
                        [--anchor-gap:var(--spacing-1)] focus:outline-none 
                        data-[closed]:scale-95 data-[closed]:opacity-0"
                >
                    <MenuItem>
                        <a className="font-bold mx-3 py-1 pb-2 border-b">
                            Favorites
                        </a>
                    </MenuItem>
                    <MenuSeparator className="my-4" />
                    {favoriteRadios.map(radio =>
                        <MenuItem key="radio">
                            <button
                                onClick={() => pickRadio(getRadio(radio)!)}
                                className="group flex w-full items-center gap-2 rounded-lg py-1 px-3 data-[focus]:bg-white/10 truncate">
                                {getRadio(radio)?.name}
                            </button>
                        </MenuItem>
                    )}
                </MenuItems>
            </Menu>
        }
    </div>
}