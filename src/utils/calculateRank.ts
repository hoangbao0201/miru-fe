import { ILevelType } from "@/constants/type";
import { LEVELS } from "@/constants/levelConfig";

const calculateRank = (
    rank: number
): { level: number; percentage: number, data: ILevelType | null } => {
    for (const [levelId, levelData] of Object.entries(LEVELS)) {
        const [min, max] = levelData.rankRange;
        if (rank >= min && rank < max) {
            return {
                level: parseInt(levelId),
                data: levelData || null,
                percentage: ((rank - min) / (max - min)) * 100,
            };
        }
    }

    // Nếu rank >= max của level cuối cùng
    const maxLevel = Math.max(...Object.keys(LEVELS).map(Number));


    return { level: maxLevel, percentage: 100, data: LEVELS[maxLevel] || null };
};

export default calculateRank;
