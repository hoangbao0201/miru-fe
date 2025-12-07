import { ChangeEventHandler } from "react";

interface InputFormProps {
    title: string
    type: string
    placehoder?: string
    data?: string
    setData?: ChangeEventHandler<HTMLInputElement>
    error?: string
    disabled?: boolean
}

const InputForm = ({ title, type, placehoder, data, setData, error, disabled = false }: InputFormProps) => {
    // Map type to HTML input type
    const getInputType = (type: string): string => {
        const typeMap: { [key: string]: string } = {
            email: "email",
            password: "password",
            rePassword: "password",
            name: "text",
            text: "text",
        };
        return typeMap[type] || "text";
    };

    return (
        <div className="relative">
            <div className="pb-[20px]">
                <label
                    htmlFor={`formRegisterInput${type}`}
                    className="select-none cursor-pointer mb-1 block font-semibold"
                >
                    {title}
                </label>

                <input
                    id={`formRegisterInput${type}`}
                    name={type}
                    type={getInputType(type)}
                    placeholder={placehoder}
                    value={data}
                    onChange={setData}
                    disabled={disabled}
                    className={`${disabled && "pointer-events-none"} h-11 py-2 px-4 rounded-md w-full transition-all bg-slate-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
            </div>
            {error && <div className="text-red-500 line-clamp-none text-end text-[14px] absolute left-0 -bottom-1">{error}</div>}
        </div>
    )
}

export default InputForm;