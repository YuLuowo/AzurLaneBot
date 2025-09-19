export const rarityMap: Record<number, string> = {
    2: "普通",
    3: "稀有",
    4: "精銳",
    5: "超稀有",
    6: "海上傳奇",
};

export function getRarityName(value: number, tags: string[] = []): string {
    if (tags.includes("Plan-Class")) {
        if (value === 5) return "最高方案";
        if (value === 6) return "決戰方案";
    }
    return rarityMap[value] ?? `未知 (${value})`;
}