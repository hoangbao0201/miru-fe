import {
    useState,
    useRef,
    ChangeEvent,
    Dispatch,
    SetStateAction,
    useMemo,
    KeyboardEvent,
} from "react";

import classNames from "@/utils/classNames";
import IconClose from "@/components/Modules/Icons/IconClose";
import IconPlus from "@/components/Modules/Icons/IconPlus";
import { GetListTagsBookResType } from "@/store/book/book.type";

interface TagSelectorProps {
    listTags: GetListTagsBookResType["data"];
    listTagsSelect: Set<string>;
    setListTagsSelect: Dispatch<SetStateAction<Set<string>>>;
}

export default function TagSelector({
    listTags,
    listTagsSelect,
    setListTagsSelect,
}: TagSelectorProps) {
    const inputSearchRef = useRef<HTMLInputElement>(null);
    const [valueSearchTag, setValueSearchTag] = useState<string>("");

    const handleAddTag = (tagId: string) => {
        if (listTagsSelect.size >= 10) {
            alert("Chỉ có thể chọn tối đa 10 thể loại");
            return;
        }
        const updatedSet = new Set(listTagsSelect);
        updatedSet.add(tagId);

        setListTagsSelect(updatedSet);
        setValueSearchTag("");
        inputSearchRef.current?.focus();
    };

    const handleAddNewTag = () => {
        const trimmedValue = valueSearchTag.trim();
        if (!trimmedValue) {
            return;
        }

        // Kiểm tra tag đã được chọn chưa
        const alreadySelected = Array.from(listTagsSelect).some(
            (selected) => selected.toLowerCase() === trimmedValue.toLowerCase()
        );

        if (alreadySelected) {
            alert("Tag này đã được chọn!");
            setValueSearchTag("");
            return;
        }

        if (listTagsSelect.size >= 10) {
            alert("Chỉ có thể chọn tối đa 10 thể loại");
            return;
        }

        // Kiểm tra tag đã tồn tại trong danh sách chưa (theo tên, không phân biệt hoa thường)
        const existingTag = listTags?.find(
            (tag) => tag.name.toLowerCase() === trimmedValue.toLowerCase()
        );

        if (existingTag) {
            // Nếu tag đã tồn tại, chọn tag đó bằng tagId
            const updatedSet = new Set(listTagsSelect);
            updatedSet.add(existingTag.metaId);
            setListTagsSelect(updatedSet);
        } else {
            // Nếu tag chưa tồn tại, thêm tag mới (sử dụng tên tag để backend tự động tạo)
            const updatedSet = new Set(listTagsSelect);
            updatedSet.add(trimmedValue);
            setListTagsSelect(updatedSet);
        }

        setValueSearchTag("");
        inputSearchRef.current?.focus();
    };

    const handleRemoveTag = (tagId: string) => {
        const updatedSet = new Set(listTagsSelect);
        updatedSet.delete(tagId);

        setListTagsSelect(updatedSet);
    };

    const handleSearchTag = (e: ChangeEvent<HTMLInputElement>) => {
        setValueSearchTag(e.target.value);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddNewTag();
        }
    };

    // Tách tags đã chọn thành 2 loại: tagId (có trong listTags) và tag mới (tên tag)
    const selectedTagIds = useMemo(() => {
        return Array.from(listTagsSelect).filter((selected) => {
            return listTags?.some((tag) => tag.metaId === selected);
        });
    }, [listTagsSelect, listTags]);

    const selectedNewTags = useMemo(() => {
        return Array.from(listTagsSelect).filter((selected) => {
            return !listTags?.some((tag) => tag.metaId === selected);
        });
    }, [listTagsSelect, listTags]);

    const filteredTagsSelect = listTags?.filter((tag) => {
        return selectedTagIds.includes(tag?.metaId);
    });

    const filteredTagsNotSelect = listTags?.filter((tag) => {
        return (
            !listTagsSelect.has(tag?.metaId) &&
            tag?.name.toLowerCase().includes(valueSearchTag.toLowerCase())
        );
    });

    // Kiểm tra có tag mới nào khớp với search không
    const hasMatchingNewTag =
        valueSearchTag.trim() &&
        !filteredTagsNotSelect?.some(
            (tag) =>
                tag.name.toLowerCase() === valueSearchTag.trim().toLowerCase()
        ) &&
        !selectedNewTags.some(
            (tag) => tag.toLowerCase() === valueSearchTag.trim().toLowerCase()
        );

    return (
        <div>
            <h3 className="font-semibold text-base mb-2">Thể loại</h3>

            <div className="mb-4 text-sm">
                {/* Selected Tags */}
                <div className="flex flex-wrap bg-accent-10 p-2 gap-2">
                    <div className="flex-1 flex flex-wrap gap-1 items-center border-b pb-2 mb-2 select-none">
                        {/* Hiển thị tags đã chọn từ danh sách */}
                        {filteredTagsSelect && filteredTagsSelect.length > 0 && (
                            <>
                                {filteredTagsSelect.map((tag) => (
                                    <span
                                        key={tag?.metaId}
                                        onClick={() => handleRemoveTag(tag?.metaId)}
                                        className="flex items-center overflow-hidden bg-accent-20 text-white rounded-sm pl-2 cursor-pointer whitespace-nowrap leading-8"
                                    >
                                        {tag?.name}
                                        <IconClose className="w-8 h-8 p-2 ml-2 fill-white bg-red-700" />
                                    </span>
                                ))}
                            </>
                        )}

                        {/* Hiển thị tags mới được thêm */}
                        {selectedNewTags.length > 0 && (
                            <>
                                {selectedNewTags.map((newTag) => (
                                    <span
                                        key={newTag}
                                        onClick={() => handleRemoveTag(newTag)}
                                        className="flex items-center overflow-hidden bg-blue-800 hover:bg-blue-700 text-white rounded-sm pl-2 cursor-pointer whitespace-nowrap leading-8"
                                    >
                                        {newTag}
                                        <span className="text-xs ml-1 px-1 bg-blue-600 rounded">
                                            Mới
                                        </span>
                                        <IconClose className="w-8 h-8 p-2 ml-2 fill-white bg-red-700" />
                                    </span>
                                ))}
                            </>
                        )}

                        {filteredTagsSelect?.length === 0 &&
                            selectedNewTags.length === 0 && (
                                <span className="px-2 leading-8">
                                    Bạn chưa chọn thể loại nào!
                                </span>
                            )}
                    </div>

                    {/* Search Input với nút thêm tag mới */}
                    <div className="w-full flex gap-2">
                        <input
                            ref={inputSearchRef}
                            value={valueSearchTag}
                            onChange={handleSearchTag}
                            onKeyDown={handleKeyDown}
                            placeholder="Tìm kiếm tag hoặc nhập tag mới (Enter để thêm)"
                            className="flex-1 h-10 px-2 py-1 rounded-md"
                        />
                        {hasMatchingNewTag && (
                            <button
                                onClick={handleAddNewTag}
                                className="px-3 h-10 rounded-md bg-blue-600 hover:bg-blue-700 text-white rounded-sm flex items-center gap-1 whitespace-nowrap"
                                title="Thêm tag mới"
                            >
                                <IconPlus className="w-4 h-4 fill-white" />
                                <span className="text-sm">Thêm</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Suggested Tags */}
                <div className="bg-accent-10 font-semibold px-3 pt-2 pb-2 mt-2 border-b border-accent-20">
                    Gợi ý
                </div>

                <div className="bg-accent-10 p-3 h-[150px] overflow-y-auto">
                    <div className="flex flex-wrap gap-1">
                        {filteredTagsNotSelect && filteredTagsNotSelect.length > 0 ? (
                            filteredTagsNotSelect.map((tag) => (
                                <div
                                    key={tag?.metaId}
                                    onClick={() => handleAddTag(tag?.metaId)}
                                    className={classNames(
                                        "text-white bg-accent-20 hover:bg-accent-20-hover rounded-sm px-2 text-sm leading-7 cursor-pointer whitespace-nowrap select-none"
                                    )}
                                >
                                    {tag?.name}
                                </div>
                            ))
                        ) : (
                            <div className="text-sm">
                                {valueSearchTag.trim()
                                    ? "Không có thẻ nào phù hợp. Nhấn Enter hoặc nút 'Thêm' để tạo tag mới."
                                    : "Không có thẻ nào phù hợp"}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
