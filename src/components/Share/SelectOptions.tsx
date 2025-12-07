import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import IconAngleDown from "../Modules/Icons/IconAngleDown";

interface SelectOptionsProps {
    value: { id: number, name: string, description?: string }
    options: { id: number, name: string, [key: string]: any }[]
    handleOnchange: ({ id, name }: { id: number, name: string, [key: string]: any }) => void
}

export default function SelectOptions({ value, options, handleOnchange }: SelectOptionsProps) {

    return (
        <div className="w-full">
            <Listbox value={value} onChange={handleOnchange}>
                <div className="relative">

                    {/* BUTTON */}
                    <Listbox.Button
                        className="
                            h-[38px] relative w-full cursor-pointer rounded-md
                            bg-[rgb(var(--accent-20))] text-[rgb(var(--color))]
                            pl-3 pr-8 text-left 
                            border border-[rgb(var(--accent-30))]
                            transition-all
                            md:text-sm

                            hover:bg-[rgb(var(--accent-30))]
                            focus:outline-none
                            focus:bg-[rgb(var(--accent-10))]
                            focus:border-[rgb(var(--primary))]
                            focus:ring-2 focus:ring-[rgba(37,99,235,0.25)]
                        "
                    >
                        <span className="block truncate">
                            {value?.name}
                            {!!value?.description && ` - ${value?.description}`}
                        </span>

                        {/* ICON */}
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <IconAngleDown size={18} className="fill-[rgb(var(--midTone))]" />
                        </span>
                    </Listbox.Button>

                    {/* OPTIONS DROPDOWN */}
                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Listbox.Options
                            className="
                                z-20 absolute mt-1 max-h-[300px] w-full overflow-auto rounded-md
                                bg-[rgb(var(--accent-20))] text-[rgb(var(--color))]
                                shadow-md border border-[rgb(var(--accent-30))]
                                py-1 text-sm
                                focus:outline-none
                            "
                        >
                            {options.map((option, idx) => (
                                <Listbox.Option
                                    key={idx}
                                    value={option}
                                    className={({ active }) => `
                                        relative cursor-pointer select-none py-2 pl-3 pr-3 rounded 
                                        transition-all

                                        ${
                                            active
                                                ? "bg-[rgb(var(--accent-30))]"
                                                : ""
                                        }
                                    `}
                                >
                                    {({ selected }) => (
                                        <span
                                            className={`block truncate ${
                                                selected ? "font-semibold text-[rgb(var(--primary))]" : ""
                                            }`}
                                        >
                                            {option.name}
                                            {!!option?.description && ` - ${option?.description}`}
                                        </span>
                                    )}
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </Transition>
                </div>
            </Listbox>
        </div>
    );
}
