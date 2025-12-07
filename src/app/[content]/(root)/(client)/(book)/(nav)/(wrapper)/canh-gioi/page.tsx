import { Env } from "@/config/Env";
import { getGroupedLevels } from "@/lib/level-utils";
import BoxHeading from "@/components/Share/BoxHeading";
import { LEVEL_TYPES, LEVELS } from "@/constants/levelConfig";

// Component usage example
const CanhGioiPage = () => {
    const { NEXT_PUBLIC_TITLE_SEO } = Env;
    const groupedLevels = getGroupedLevels();

    return (
        <div className="py-5">
            <div className="bg-accent px-2 py-3 [&>div>h2]:font-semibold [&>div>h2]:text-lg [&>div>h2]:mb-5">
                <h1 className="text-2xl font-extrabold mb-7">
                    CẢNH GIỚI TU TIÊN TRONG {NEXT_PUBLIC_TITLE_SEO}
                </h1>

                {Object.entries(LEVEL_TYPES).map(([typeId, typeInfo]) => {
                    const levels = groupedLevels[typeId] || [];

                    return (
                        <div
                            key={typeId}
                            className="mb-3"
                        >
                            <BoxHeading
                                title={`${typeInfo.title} (${typeInfo.description})`}
                                heading="2"
                            />

                            {levels.map((level) => (
                                <div
                                    key={level.id}
                                    className="bg-accent-20 px-4 py-3 mb-3"
                                >
                                    <h3 className="mb-2 pl-2 text-[16px] leading-[20px] font-semibold border-l-4 border-blue-500">
                                        Cấp {level.id}
                                    </h3>
                                    <LevelBox
                                        level={level.id}
                                        imageUrl={level.imageUrl}
                                        levelName={level.name}
                                    />
                                    <p>{level.description}</p>
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CanhGioiPage;

// Updated LevelBox component
const LevelBox = ({
    level,
    imageUrl,
    levelName,
    percentage = 80,
}: {
    level: number;
    imageUrl: string;
    levelName: string;
    percentage?: number;
}) => {
    return (
        <div className="flex items-center">
            <div
                className={`flex items-end text-base bg-clip-text whitespace-nowrap overflow-hidden relative ${
                    level > 0 && level < 32
                        ? "font-extrabold text-black/10"
                        : ""
                }`}
                style={{
                    backgroundImage:
                        level > 0 && level < 32
                            ? `url("${imageUrl}")`
                            : undefined,
                }}
            >
                <div className="mr-1">No Name</div>
            </div>
            <div className="relative ml-1 font-bold text-[10px] text-[#22f2ff] border px-[3px] py-[2px] rounded-sm bg-[url('/static/images/level/bg-rank.gif')]">
                <span>{levelName}</span>
                <span
                    style={{ right: `calc(100% - ${percentage}%)` }}
                    className="absolute top-0 bottom-0 left-0 bg-[#22f2ff]/25"
                ></span>
            </div>
        </div>
    );
};
