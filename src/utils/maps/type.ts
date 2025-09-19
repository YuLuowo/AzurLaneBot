export const shipTypeMap: Record<number, string> = {
    1: "驅逐",
    2: "輕巡",
    3: "重巡",
    4: "戰巡",
    5: "戰列",
    6: "輕航",
    7: "航母",
    8: "潛艇",
    9: "UNKNOWN",
    10: "航戰",
    11: "UNKNOWN",
    12: "維修",
    13: "重砲",
    14: "UNKNOWN",
    15: "UNKNOWN",
    16: "UNKNOWN",
    17: "潛母",
    18: "超巡",
    19: "運輸",
    20: "前導驅逐",
    21: "後導驅逐",
    22: "風帆",
    23: "風帆",
    24: "風帆",
};

export const equipTypeMap: Record<number, string> = {
    1: "驅逐炮",
    2: "輕巡炮",
    3: "重巡炮",
    4: "戰列炮",
    5: "水面魚雷",
    6: "防空炮",
    7: "戰鬥機",
    8: "魚雷機",
    9: "轟炸機",
    10: "設備",
    11: "超巡炮",
    12: "水上機",
    13: "潛艇魚雷",
    14: "設備 (反潛)",
    15: "反潛機",
    17: "設備",
    18: "設備",
    20: "導彈",
    21: "防空炮",
};

export function getShipTypeName(value: number): string {
    return shipTypeMap[value] ?? `未知 (${value})`;
}

export function getEquipTypeName(value: number): string {
    return equipTypeMap[value] ?? `未知 (${value})`;
}