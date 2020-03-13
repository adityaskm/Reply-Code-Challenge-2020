import * as fileHandler from './helpers/filehandler';
import { getIndices } from './helpers/resource-processing';
import { Developer, ProjectManager } from './model/class';
import { PageData } from './model/page-data.class';


// Disable All Console Logs
console.log = () => {};

const processFile = (fileName: string) => {
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

const fileName = 'd_maelstrom.txt';

const data = processFile(fileName);

const finalData = JSON.stringify(getIndices(data))
	.replace('[', '')
	.replace(']', '')
	.replace(/","/g, '\n')
	.replace(/"/g, '')
	.replace(/,/g, ' ');

console.log(finalData);
fileHandler.writeFile(fileName, finalData);
// console.log(JSON.stringify(data.companyMap));
