import { useMemo, useState } from "react";
import { FaMagnifyingGlass, FaPause, FaPlay, FaXmark } from "react-icons/fa6";
import { HiOutlinePlusCircle, HiOutlineSpeakerWave } from "react-icons/hi2";
import useAppStore from "../stores/store";
import RadioSmallCard from "./RadioSmallCard";

export default function SearchRadio() {
    const { radios, currentRadio, isPlaying, setIsPlaying } = useAppStore();
    const [isOpen, setIsOpen] = useState(false);
    const [visibleRadiosQty, setVisibleRadiosQty] = useState(20);
    const [searchResultInputValue, setSearchResultInputValue] = useState('');

    const togglePopup = () => {
        setIsOpen(!isOpen);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchResultInputValue(event.target.value);
    };

    const popularRadios = useMemo(() => {
        return [...radios].sort((a, b) => b.votes - a.votes).slice(0, visibleRadiosQty);
    }, [radios, visibleRadiosQty]);

    const searchRadiosResults = useMemo(() => {
        setVisibleRadiosQty(20) // reset the visible qty of radio any time user type something 
        if (searchResultInputValue === "") return [] // for performance return empty array when the input value is empty
        return [...radios].filter(r => r.name.toLowerCase().includes(searchResultInputValue.toLowerCase())).sort((a, b) => b.votes - a.votes);
    }, [radios, searchResultInputValue]);

    const searchRadiosResultsTruncate = useMemo(() => {
        return searchRadiosResults.slice(0, visibleRadiosQty);
    }, [searchRadiosResults, visibleRadiosQty]);


    return (
        <>
            <div
                className="bg-white flex items-center justify-center p-1 w-8 h-8 rounded-full cursor-pointer"
                onClick={togglePopup}
            >
                <FaMagnifyingGlass className="size-5 text-gray-800 hover:text-gray-900" />
            </div>

            {isOpen &&
                <div className="fixed w-full h-full top-0 left-0 backdrop-blur-sm bg-black/70 flex flex-col justify-center items-center">
                    <FaXmark
                        className="color-white absolute top-5 right-5 size-6 cursor-pointer"
                        onClick={togglePopup}
                    />

                    <div className="flex items-center rounded-md w-2/4 bg-slate-600/60 relative mt-16" >
                        <input type="text" className="flex-1 h-12 bg-transparent px-4 pr-12" placeholder="Type radio name"

                            value={searchResultInputValue}
                            onChange={handleInputChange}
                        />
                        <FaMagnifyingGlass className="size-8 text-white absolute right-0 pr-4" />
                    </div>
                    <div className="w-3/4 flex-1">
                        {searchResultInputValue.length ?
                            <>
                                <h3 className="pb-2 my-8  border-b flex">
                                    Search results for "{searchResultInputValue}"
                                    <span className="ml-auto">{searchRadiosResults.length} result{searchRadiosResults.length > 1 && 's'}</span>
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4  max-h-[620px] overflow-auto pb-4 pr-4">
                                    {
                                        searchRadiosResultsTruncate.map((radio) => <RadioSmallCard radio={radio} key={radio.stationuuid} />)
                                    }
                                    {
                                        searchRadiosResultsTruncate.length < searchRadiosResults.length &&
                                        <div className="flex justify-center col-span-full">
                                            <HiOutlinePlusCircle className="size-8 cursor-pointer" onClick={() => setVisibleRadiosQty(c => c += 20)} />
                                        </div>
                                    }
                                </div>
                            </>
                            :
                            <>
                                <h3 className="pb-2 my-8 border-b">Popular radios</h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4  max-h-[620px] overflow-auto pb-4 pr-4">
                                    {
                                        popularRadios.map((radio) => <RadioSmallCard radio={radio} key={radio.stationuuid} />)
                                    }
                                    {
                                        popularRadios.length < radios.length &&
                                        <div className="flex justify-center col-span-full">
                                            <HiOutlinePlusCircle className="size-8 cursor-pointer" onClick={() => setVisibleRadiosQty(c => c += 20)} />
                                        </div>
                                    }
                                </div></>
                        }
                    </div>

                    {currentRadio && <div className="absolute bottom-5 right-5 flex items-center gap-2">
                        <HiOutlineSpeakerWave className="size-5" />
                        <span className="max-w-xl truncate">
                            {currentRadio.name}
                        </span>

                        <div onClick={() => setIsPlaying(!isPlaying)}
                            className="opacity-70 hover:opacity-100 transition duration-500 ml-2 cursor-pointer"
                        >
                            {isPlaying ? <FaPause className="size-4" /> : <FaPlay className="size-4" />}
                        </div>
                    </div>
                    }
                </div >
            }
        </>
    );
}
