import { Developer, CompanyMap, ProjectManager } from './class';

export class PageData {
	metaData: MetaData = { W: 0, H: 0 };
	developers: Developer[] = [];
	projectManagers: ProjectManager[] = [];
	companyMap: CompanyMap = [];
	constructor(
		metaData: MetaData,
		developers: Developer[],
		projectManagers: ProjectManager[],
		companyMap: CompanyMap
	) {
		this.metaData = metaData;
		this.developers = developers;
		this.projectManagers = projectManagers;
		this.companyMap = companyMap;
	}
}

export interface MetaData {
	W: number;
	H: number;
}
