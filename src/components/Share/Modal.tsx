import { Dispatch, Fragment, MutableRefObject, ReactNode, SetStateAction } from "react";

import clsx from "clsx";
import { Dialog, Transition } from "@headlessui/react";
import IconClose from "../Modules/Icons/IconClose";

interface ModalProps {
    refFocus?: MutableRefObject<HTMLElement | null>
    title?: string
    children: ReactNode
    isOpen: boolean
    noAnimation?: boolean
    className?: string
    size?: "small" | "medium" | "large" | "extra" | "full";
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}
const Modal = ({
    title,
    refFocus,
    children,
    isOpen,
    setIsOpen,
    noAnimation,
    className = "",
    size = "medium",
}: ModalProps) => {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-40" onClose={setIsOpen} initialFocus={refFocus}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed flex flex-col top-0 left-0 right-0 bottom-0 h-screen w-screen md:pt-20 md:pb-10 py-5 px-3">
                    <Transition.Child
                        as={Fragment}
                        enter={noAnimation ? "" : "ease-out duration-300"}
                        enterFrom={noAnimation ? "" : "opacity-0 scale-95"}
                        enterTo={noAnimation ? "" : "opacity-100 scale-100"}
                        leave={noAnimation ? "" : "ease-in duration-200"}
                        leaveFrom={noAnimation ? "" : "opacity-100 scale-100"}
                        leaveTo={noAnimation ? "" : "opacity-0 scale-95"}
                    >
                        <Dialog.Panel
                            className={clsx(
                                "relative flex flex-col min-h-0 w-full mx-auto transform bg-accent border border-accent-20 rounded-xl overflow-hidden shadow-2xl transition-all pb-4",
                                {
                                    "max-w-md": size === "small",
                                    "max-w-xl": size === "medium",
                                    "max-w-3xl": size === "large",
                                    "max-w-7xl": size === "extra",
                                    "max-w-full h-full": size === "full"
                                }
                            )}
                        >
                            <div className={`relative font-semibold md:text-xl text-lg h-14 text-center border-b border-accent-20 bg-accent-10`}>
                                <Dialog.Title className={"leading-[56px] text-foreground"}>{title}</Dialog.Title>
                                <button
                                    title="Nút thoát"
                                    onClick={() => setIsOpen(false)}
                                    className="absolute right-4 top-0 translate-y-[12px] bg-accent-10 hover:bg-accent-20 rounded-full outline-none transition-colors"
                                >
                                    <IconClose size={32} className="p-[6px]"/>
                                </button>
                            </div>
                            <div className="relative md:px-10 px-3 py-4 flex flex-col overflow-y-auto">{children}</div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
};

export default Modal;
