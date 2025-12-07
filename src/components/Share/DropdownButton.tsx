import { Dispatch, ReactNode, useRef } from 'react';
import { useOnClickOutside } from 'usehooks-ts';


interface DropdownButtonProps {
    isOptions: boolean
    setIsOptions: Dispatch<React.SetStateAction<boolean>>
    children: ReactNode
    content: ReactNode
    className?: string
    placement?: string
}
export interface DropdownButtonRef {
    hiddentOptions: () => void;
};
const DropdownButton = ({ isOptions, setIsOptions, children, content, placement, className }: DropdownButtonProps) => {

    const optionRef = useRef<HTMLDivElement>(null)
    
    useOnClickOutside(optionRef, () => setIsOptions(false));
      
    return (
        <div ref={optionRef} className='relative'>
            <span title='Nút ẩn/hiện' onClick={() => setIsOptions(value => !value)}>
                {children}
            </span>
            {
                isOptions && (
                    <div className={`absolute z-10 ${className} dropdown-button-bf`}>
                        {content}
                    </div>
                )
            }
        </div>
    )
};

export default DropdownButton;