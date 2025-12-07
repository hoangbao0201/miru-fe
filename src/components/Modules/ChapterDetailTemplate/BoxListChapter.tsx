import {
    useRef,
    useMemo,
    useState,
    Dispatch,
    useEffect,
    useCallback,
    ChangeEvent,
    SetStateAction,
    Fragment,
} from "react";
import { useDebounceValue } from "usehooks-ts";
import { ContentPageEnum } from "@/common/data.types";
import { Dialog, Transition } from "@headlessui/react";
import { VirtuosoGrid, VirtuosoHandle } from "react-virtuoso";
import {
    GetChaptersAdvancedProps,
    GetChaptersBasicProps,
} from "@/services/chapter.services";
import Link from "next/link";
import Image from "next/image";
import IconEye from "../Icons/IconEye";
import convertTime from "@/utils/convertTime";
import IconSearch from "../Icons/IconSearch";

interface BoxListChapterProps {
    slug: string;
    bookId: number;
    content: ContentPageEnum;
    chapters: GetChaptersAdvancedProps[];
    chapterCurrent: {
        num: string;
        chapterNumber: number;
    };
    isShow: boolean;
    setIsShow: Dispatch<SetStateAction<boolean>>;
}

const BoxListChapter = ({
    isShow,
    setIsShow,
    slug,
    bookId,
    content,
    chapters,
    chapterCurrent,
}: BoxListChapterProps) => {
    const virtuosoRef = useRef<VirtuosoHandle>(null);
    const [chapterSearch, setChapterSearch] = useState<string>("");

    const handleSearchChapter = useCallback(() => {
        const chapterNum = chapterSearch.trim();
        const findIndex = chapters.findIndex(
            (chap) => chap?.num === chapterNum
        );

        if (virtuosoRef.current && findIndex !== -1) {
            virtuosoRef.current.scrollToIndex({
                index: findIndex,
                align: "center",
                behavior: "auto",
            });
        }
    }, [chapterSearch, chapters]);

    const [valueSearchDebouce] = useDebounceValue(chapterSearch, 500);

    useEffect(() => {
        if (valueSearchDebouce === chapterSearch) {
            handleSearchChapter();
        }
    }, [valueSearchDebouce, handleSearchChapter, chapterSearch]);

    const getClassNameForChapter = useMemo(
        () => (chap: GetChaptersBasicProps) => {
            if (chap?.num === String(chapterCurrent?.num)) {
                return "border-primary bg-primary/20";
            }
            if (chap?.num === chapterSearch.trim()) {
                return "bg-primary/30 border-primary/50";
            }
            return "hover:bg-accent-10 border-transparent";
        },
        [chapterSearch, chapterCurrent]
    );

    return (
        <div>
            <Transition appear show={isShow} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-[5000]"
                    onClose={() => {}}
                >
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

                    <div className="fixed flex flex-col top-0 left-0 right-0 bottom-0 h-screen w-screen md:pt-10 md:pb-10 py-5 px-3">
                        <Transition.Child as={Fragment}>
                            <Dialog.Panel
                                className={
                                    "relative overflow-hidden border border-accent-20 flex flex-col min-h-0 w-full mx-auto transform rounded-xl shadow-2xl transition-all pb-4 max-w-xl bg-accent"
                                }
                            >
                                <div className="mb-3 py-3 px-4 flex items-center border-b border-accent-20 bg-accent-10">
                                    <IconSearch className="w-7 h-7 p-2 fill-muted-foreground" />
                                    <input
                                        onChange={(
                                            e: ChangeEvent<HTMLInputElement>
                                        ) => setChapterSearch(e.target.value)}
                                        placeholder="Nhập số chap, ví dụ: 100"
                                        className="flex-1 w-full px-4 py-1 h-10"
                                    />
                                </div>
                                {/* {JSON.stringify(chapters)} */}
                                <div className="flex flex-col overflow-y-auto px-2">
                                    <VirtuosoGrid
                                        data={chapters}
                                        ref={virtuosoRef}
                                        style={{ height: "400px" }}
                                        initialTopMostItemIndex={
                                            Number(chapters?.length - chapterCurrent?.chapterNumber) - 1
                                        }
                                        itemContent={(_, chapter) => {
                                            return (
                                                <Link
                                                    title=""
                                                    prefetch={false}
                                                    key={chapter?.chapterNumber}
                                                    id={`chapter-${chapter?.chapterNumber}`}
                                                    href={`/${content}/books/${slug}-${bookId}/chapter-${chapter?.num}-${chapter?.chapterNumber}`}
                                                    className={`${getClassNameForChapter(chapter)} border rounded-lg px-4 py-2 flex cursor-pointer relative text-foreground transition-colors`}
                                                >
                                                    <div className="w-[80px] h-[55px] rounded overflow-hidden flex items-center justify-center border border-accent-20">
                                                        {chapter?.thumbnail ? (
                                                            <Image
                                                                alt=""
                                                                width={90}
                                                                height={68}
                                                                unoptimized
                                                                loading="lazy"
                                                                className="w-[80px] h-[55px] object-cover"
                                                                src={`https://phinf.pstatic.net/memo${chapter.thumbnail}`}
                                                            />
                                                        ) : (
                                                            <IconEye className="fill-primary" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 pl-2 pr-2">
                                                        <div className="line-clamp-1 mb-2">
                                                            <span
                                                                className={`font-semibold text-foreground`}
                                                            >
                                                                #{chapter?.num}
                                                            </span>{" "}
                                                            <span className="text-[15px] text-muted-foreground">
                                                                {chapter?.title
                                                                    ? ` - ${chapter?.title}`
                                                                    : ""}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center justify-between whitespace-nowrap text-sm text-muted-foreground">
                                                            <span>
                                                                Lượt xem:{" "}
                                                                {chapter?.viewsCount ||
                                                                    0}
                                                            </span>
                                                            <time className="text-sm italic">
                                                                {convertTime(
                                                                    chapter?.createdAt
                                                                )}
                                                            </time>
                                                        </div>
                                                    </div>
                                                </Link>
                                            );
                                        }}
                                    />
                                </div>

                                <div className="flex mt-3 px-4">
                                    <button
                                        title="Thoát danh sách chương"
                                        onClick={() => setIsShow(false)}
                                        className="outline-none font-semibold text-foreground bg-accent-10 hover:bg-accent-10-hover rounded-full w-full text-lg h-[45px] leading-[45px] transition-colors"
                                    >
                                        Thoát
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default BoxListChapter;
