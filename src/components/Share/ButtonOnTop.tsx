import { useEffect, useRef, useState } from "react";
import IconArrowUp from "../Modules/Icons/IconArrowUp";

const ButtonOnTop = () => {
    const buttonRef = useRef<any>(null);
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        window.onscroll = () => {
            if (document.documentElement.scrollTop > 150) {
                setShowButton(true);
            } else {
                setShowButton(false);
            }
        };
    }, []);

    const eventOnTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <>
            {showButton ? (
                <button
                    ref={buttonRef}
                    title="Nút cuộn lên"
                    onClick={eventOnTop}
                    className="w-10 h-10 shadow-md border border-gray-300 rounded-lg bg-white"
                >
                    <IconArrowUp className="fill-black w-10 h-10 p-3" />
                </button>
            ) : (
                <span></span>
            )}
        </>
    );
};

export default ButtonOnTop;
