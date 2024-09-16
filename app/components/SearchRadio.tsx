import { useState } from "react";
import { FaMagnifyingGlass, FaXmark } from "react-icons/fa6";

export default function SearchRadio() {
    const [isOpen, setIsOpen] = useState(false);

    const togglePopup = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <div
                className="bg-white flex items-center justify-center p-1 w-8 h-8 rounded-full cursor-pointer"
                onClick={togglePopup}
            >
                <FaMagnifyingGlass className="size-5 text-gray-800 hover:text-gray-900" />
            </div>

            {isOpen && (
                <div className="fixed w-full h-full top-0 left-0 backdrop-blur-sm bg-black/70 flex flex-col justify-center items-center">
                    <FaXmark
                        className="color-white absolute top-5 right-5 size-6 cursor-pointer"
                        onClick={togglePopup}
                    />

                    <div className="flex items-center rounded-md w-2/4 bg-slate-600/60 relative" >
                        <input type="text" className="flex-1 h-12 bg-transparent px-4 pr-12" placeholder="Type radio name" />
                        <FaMagnifyingGlass className="size-8 text-white absolute right-0 pr-4" />
                    </div>

                </div>
            )}
        </>
    );
}
