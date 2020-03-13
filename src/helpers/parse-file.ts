import * as fileHandler from './filehandler';
import { Developer, ProjectManager } from '../model/class';
import { PageData } from '../model/page-data.class';

/**
 * This Function parses the file and returns the output in the object of the PageData Class
 * @param fileName The Name of the Input File
 */
export const getFileData = (fileName: string) => {
	const fileContents = fileHandler
		.readFile(fileName)
		.split('\n')
		.map(line => line.replace('\r', ''));
	const [W, H] = fileContents[0].split(' ').map(value => parseInt(value, 10));
	const companyMap = fileContents.slice(1, H + 1).map(line => line.split(''));
	const developerCount = parseInt(fileContents[H + 1], 10);
	const developers: Developer[] = [];
	for (let i = 0; i < developerCount; i++) {
		const [company, bonusPoints, skillCount, skills] = fileContents[i + H + 2].split(' ').map((value, index) => {
			return [1, 2].includes(index) ? parseInt(value, 10) : value;
		});
		developers.push({ company, bonusPoints, skillCount, skills, placed: false } as any);
	}
	const projectManagerCount = parseInt(fileContents[H + developerCount + 2], 10);
	const projectManagers: ProjectManager[] = [];

	for (let i = 0; i < projectManagerCount; i++) {
		const [company, bonusPoints] = fileContents[i + H + 3 + developerCount].split(' ').map((value, index) => {
			return index === 1 ? parseInt(value, 10) : value;
		});
		projectManagers.push({ company, bonusPoints, placed: false } as any);
	}
	return new PageData({ W, H }, developers, projectManagers, companyMap);
};
