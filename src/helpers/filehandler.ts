import fs from 'fs';
import { CONSTANTS } from './constants';

export function readFile(fileName: string) {
	return fs.readFileSync(CONSTANTS.INPUT_FILE_BASE + fileName, 'utf8');
}

export function writeFile(fileName: string, data: any) {
	return fs.writeFileSync(CONSTANTS.OUTPUT_FILE_BASE + fileName, data);
}
