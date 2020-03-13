export interface ProjectManager {
	company: string;
	bonusPoints: number;
	placed: boolean;
}

export interface Developer  {
	company: string;
	bonusPoints: number;
	skillCount: number;
	skills: string[];
	placed: boolean;
}

export type CompanyMap = (string | Resource)[][];

export type Resource = Developer | ProjectManager;
