export const nationalityMap: Record<number, string> = {
    1: "白鷹",
    2: "皇家",
    3: "重櫻",
    4: "鐵血",
    5: "東煌",
    6: "薩丁帝國",
    7: "北方聯合",
    8: "自由鳶尾",
    9: "維希教廷",
};

export function getNationalityName(value: number): string {
    return nationalityMap[value] ?? `未知 (${value})`;
}