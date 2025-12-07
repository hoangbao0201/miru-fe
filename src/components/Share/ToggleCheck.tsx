interface ToggleCheckProps {
    checked: boolean;
    handleChecked: any;
}
const ToggleCheck = ({ checked, handleChecked }: ToggleCheckProps) => {
    return (
        <div
            onClick={handleChecked}
            className={`cursor-pointer relative transition-all duration-200 w-12 h-[24px] px-[2px] rounded-full ${
                checked
                    ? "[&>div]:translate-x-[24px] bg-blue-500"
                    : "[&>div]:translate-x-[2px] bg-gray-300"
            }`}
        >
            <div
                className={`absolute transition-all duration-200 top-[3px] w-[18px] h-[18px] border bg-white rounded-full`}
            ></div>
        </div>
    );
};

export default ToggleCheck;
