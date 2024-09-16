import { TbExternalLink } from "react-icons/tb";
import { RadioStation } from "../types/radio-station";
import { FaPause, FaPlay } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi2";
import useAppStore from "../stores/store";
import { LS_FAVORITE_RADIOS_NAME } from "../utils/const";

interface CurrentRadioPlayerProps {
    pickNextRadio: (direction: number) => void;
}

export default function CurrentRadioPlayer({ pickNextRadio }: CurrentRadioPlayerProps) {
    const { favoriteRadios, currentRadio, setFavoriteRadios, isPlaying, setIsPlaying } = useAppStore();
    const audioRef = useRef<HTMLAudioElement>(null);

    function toggleFavoriteRadio(radioId: string) {
        let favArray = favoriteRadios
        if (favArray.includes(radioId)) {
            favArray = favArray.filter(radio => radio !== radioId)
        } else {
            favArray = [...favArray, radioId]
        }
        localStorage.setItem(LS_FAVORITE_RADIOS_NAME, JSON.stringify(favArray))
        setFavoriteRadios(favArray)
    }

    useEffect(() => {
        if (isPlaying) {
            audioRef.current?.play();
        } else {
            audioRef.current?.pause();
        }
    }, [isPlaying]);

    const togglePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const handleAddClick = () => {
        if (currentRadio) toggleFavoriteRadio(currentRadio.stationuuid)
    };

    return (
        <div className="backdrop-blur-sm bg-slate-800/90 w-9/12 absolute bottom-4 p-4 rounded-md flex ">
            {currentRadio &&
                <>
                    <img
                        src={currentRadio.favicon !== '' ? currentRadio.favicon : '/radio.webp'}
                        onError={(e) => (e.target as any).src = '/radio.webp'}
                        className="size-20 mr-6"
                    />

                    <div className="flex items-center w-full">
                        <div className="mr-4 flex-1">
                            <a
                                className="flex items-center group"
                                href={currentRadio.homepage}
                                target="_blank"
                                rel="noopener"
                            >
                                <span className="group-hover:underline">
                                    {currentRadio.name}
                                </span>
                                <TbExternalLink className="ml-2 opacity-0 group-hover:opacity-50 transition-opacity duration-200" />
                            </a>

                            <span className="block text-gray-400">
                                {currentRadio.country}
                            </span>
                            {currentRadio.tags && (
                                <div className="text-gray-400 text-xs capitalize truncate overflow-hidden max-w-xl">
                                    {currentRadio.tags.split(',').join(' ')}
                                </div>
                            )}
                        </div>

                        <div
                            className="opacity-70 hover:opacity-100 transition-opacity duration-300"
                            onClick={() => pickNextRadio(-1)}>
                            <HiOutlineChevronLeft className="size-12 cursor-pointer" />
                        </div>

                        <div onClick={togglePlayPause} className="opacity-70 hover:opacity-100 transition duration-500 mx-16 cursor-pointer hover:scale-110"
                        >
                            {isPlaying ? <FaPause className="size-8" /> : <FaPlay className="size-8" />}
                        </div>

                        <div
                            className="mr-20 opacity-70 hover:opacity-100 transition-opacity duration-300"
                            onClick={() => pickNextRadio(1)}>
                            <HiOutlineChevronRight className="size-12 cursor-pointer" />
                        </div>
                        <audio ref={audioRef} src={currentRadio.url_resolved.replace('http://', 'https://')} autoPlay className="hidden"></audio>
                    </div>
                </>
            }

            {currentRadio && favoriteRadios.includes(currentRadio.stationuuid) ?
                <GoHeartFill
                    onClick={handleAddClick}
                    className="absolute top-2 right-2 text-red-600 cursor-pointer size-5 " />
                :
                <GoHeart
                    onClick={handleAddClick}
                    className="absolute top-2 right-2 text-white cursor-pointer size-5"
                />
            }

        </div>
    );
}
