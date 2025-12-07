import { IconProps } from "@/lib/types";

const Icon404: React.FC<IconProps> = ({
    size = "20",
    color = "currentColor",
    ...attributes
}) => {
    return (
        <>
            <svg
                width={size}
                height={size}
                {...attributes}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 443 143"
            >
                <path
                    fill-rule="evenodd"
                    d="M293 100v3c0 22.091-17.909 40-40 40h-63c-22.091 0-40-17.909-40-40v-3h143zm150 0v39a4 4 0 0 1-4 4h-35a4 4 0 0 1-4-4v-39h43zm-300 0v39a4 4 0 0 1-4 4h-35a4 4 0 0 1-4-4v-39h43zm76.879-46.703l20.506 20.506c4.49 4.491 4.49 11.773 0 16.264-4.491 4.49-11.773 4.49-16.264 0L203.615 69.56c-4.49-4.491-4.49-11.773 0-16.264 4.491-4.49 11.773-4.49 16.264 0zM193 50v43h-43V50h43zm100 0v43h-43V50h43zm150 0v43H340c-22.091 0-40-17.909-40-40v-3h143zm-300 0v43H40C17.909 93 0 75.091 0 53v-3h143zM39 0a4 4 0 0 1 4 4v39H0V4a4 4 0 0 1 4-4h35zm214 0c22.091 0 40 17.909 40 40v3H150v-3c0-22.091 17.909-40 40-40zm86 0a4 4 0 0 1 4 4v39h-43V4a4 4 0 0 1 4-4h35zm100 0a4 4 0 0 1 4 4v39h-43V4a4 4 0 0 1 4-4h35zM139 0a4 4 0 0 1 4 4v39h-43V4a4 4 0 0 1 4-4h35z"
                />
            </svg>
        </>
    );
};

export default Icon404;
