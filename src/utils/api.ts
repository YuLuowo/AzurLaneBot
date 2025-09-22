export interface Ship {
    name: string;
    painting: string;
    nationality: number;
    rarity: number;
    type: number;
    tag_list: string[];
}

export interface Skill {
    id: number;
    name: string;
    desc: string;
}

export interface ShipSkill {
    shipName: string;
    group_type: number;
    skills: Skill[];
    trans_skills: Skill[];
}

const API_BASE = 'https://api.imagineyuluo.com/api';

async function fetchJSON<T>(endpoint: string): Promise<T> {
    const response = await fetch(API_BASE + endpoint);
    if (!response.ok) {
        throw new Error("API request failed: " + response.statusText);
    }
    return await response.json() as Promise<T>;
}

export async function getAllShips(): Promise<Ship[]> {
    return fetchJSON<Ship[]>("/ship");
}

export async function getShipSkills(shipName: string): Promise<ShipSkill> {
    return fetchJSON<ShipSkill>(`/ship/${encodeURIComponent(shipName)}/skills`);
}