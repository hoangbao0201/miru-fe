import { Fragment, useState } from "react";
import IconCheck from "../Modules/Icons/IconCheck";
import IconArrowUp from "../Modules/Icons/IconArrowUp";
import { Listbox, Transition } from "@headlessui/react";
import IconAngleDown from "../Modules/Icons/IconAngleDown";

interface BoxOptionsProps {
    value: { id: number; name: string };
    options: { id: number; name: string }[];
    handleOnchange: ({ id, name }: { id: number; name: string }) => void;
}
const BoxOptions = ({ value, options, handleOnchange }: BoxOptionsProps) => {
    return (
        <div className="">
            <Listbox value={value} onChange={handleOnchange}>
                <div className="relative">
                    <div className="relative w-full cursor-pointer rounded-md bg-white dark:bg-slate-600 py-2 pl-3 pr-10 text-left border focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                        <span className="block truncate w-full">
                            {value?.name}
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <IconAngleDown
                                size={18}
                                className="fill-gray-500"
                            />
                        </span>
                    </div>
                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="z-10 absolute mt-1 max-h-[300px] w-full overflow-auto rounded-md bg-white dark:bg-slate-600 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                            {options.map((option, personIdx) => (
                                <div
                                    key={personIdx}
                                    className={`relative cursor-pointer select-none py-2 pl-3 pr-3 ${
                                        value?.id === option?.id
                                            ? "bg-slate-500 text-gray-100"
                                            : "text-gray-900 dark:text-gray-100"
                                    }`}
                                >
                                    <span
                                        className={`block truncate ${
                                            value?.id === option?.id
                                                ? "font-medium"
                                                : "font-normal"
                                        }`}
                                    >
                                        {option?.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Transition>
                </div>
            </Listbox>
        </div>
    );
};

export default BoxOptions;
