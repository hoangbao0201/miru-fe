import { ILevelType } from "@/constants/type";
import calculateRank from "@/utils/calculateRank";
import { LEVELS } from "@/constants/levelConfig";

export const getLevelByRank = (rank: number): ILevelType | null => {
    const { level } = calculateRank(rank);
    return LEVELS[level] || null;
};

export const getLevelsByType = (typeId: string): ILevelType[] => {
    return Object.values(LEVELS).filter((level) => level.type === typeId);
};

export const getGroupedLevels = (): Record<string, ILevelType[]> => {
    const grouped: Record<string, ILevelType[]> = {};
    Object.values(LEVELS).forEach((level) => {
        if (!grouped[level.type]) grouped[level.type] = [];
        grouped[level.type].push(level);
    });
    return grouped;
};
