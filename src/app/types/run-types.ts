export interface Exercise {
    id: number;
    name: string;
    description: string;
    duration: number;
    repetitions: number;
}

export interface Upgrade {
    id: number;
    name: string;
    description: string;
    completed: boolean;
    dropsNeededToUpgrade: number;
    aditionalPercentage?: number;
    aditionalSeconds?: number;
    dropsUsedToUpgrade: number;
}