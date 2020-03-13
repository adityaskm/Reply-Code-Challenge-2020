import { Developer, CompanyMap, ProjectManager } from './class';

/**
 * We Define a CLass named Page Data to hold the data of our Input File.
 */
export class PageData {
	officeDimensions: OfficeDimensions = { W: 0, H: 0 };
	developers: Developer[] = [];
	projectManagers: ProjectManager[] = [];
	companyMap: CompanyMap = [];
	constructor(
		officeDimensions: OfficeDimensions,
		developers: Developer[],
		projectManagers: ProjectManager[],
		companyMap: CompanyMap
	) {
		this.officeDimensions = officeDimensions;
		this.developers = developers;
		this.projectManagers = projectManagers;
		this.companyMap = companyMap;
	}
}

export interface OfficeDimensions {
	W: number;
	H: number;
}
