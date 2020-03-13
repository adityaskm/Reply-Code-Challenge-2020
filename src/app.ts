import * as fileHandler from './helpers/filehandler';
import { getFileData } from './helpers/parse-file';
import { getOutputBuffer } from './helpers/misc';

const start = (fileName: string, debug?: boolean) => {
	if (!debug) {
		// Disable All Console Logs
		console.log = () => {};
	}
	const data = getFileData(fileName);
	fileHandler.writeFile(fileName, getOutputBuffer(data));
};

const inputFile = 'a_solar.txt';
start(inputFile);
