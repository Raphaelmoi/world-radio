import { GoHeartFill } from "react-icons/go";
import useAppStore from "../stores/store";
import { RadioStation } from "../types/radio-station"
import { HiOutlineSpeakerWave } from "react-icons/hi2";

interface RadioSmallCardProps {
    radio: RadioStation
}

export default function RadioSmallCard({ radio }: RadioSmallCardProps) {
    const { currentRadio, setCurrentRadio, favoriteRadios } = useAppStore();

    return <div
        onClick={() => setCurrentRadio(radio)}
        className="p-3 bg-slate-100/20 backdrop-blur-sm rounded-md cursor-pointer
               hover:bg-slate-100/30 transition">
        <div className="flex overflow-hidden items-center">
            <img
                src={radio.favicon !== '' ? radio.favicon : '/radio.webp'}
                onError={(e) => (e.target as any).src = '/radio.webp'}
                alt={radio.name}
                className="w-16 h-16 object-cover mr-4 rounded-md"
            />
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold truncate pr-2">{radio.name}</h2>
                    <div className="flex gap-1 items-center flex-shrink-0">
                        {
                            currentRadio?.stationuuid === radio.stationuuid &&
                            <HiOutlineSpeakerWave className="size-5" />
                        }
                        {
                            favoriteRadios.includes(radio.stationuuid) &&
                            <GoHeartFill
                                className="text-red-600 size-5" />
                        }
                    </div>
                </div>
                <p className="text-gray-500 truncate">{radio.country}</p>
            </div>
        </div>
    </div>

}