import { Ship, getAllShips } from "./api";

let shipCache: Ship[] | null = null;

export async function getCachedShips(): Promise<Ship[]> {
    if (shipCache) return shipCache;
    shipCache = await getAllShips();
    return shipCache;
}