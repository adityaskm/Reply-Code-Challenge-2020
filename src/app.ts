import * as fileHandler from './helpers/filehandler';
import { getFileData } from './helpers/parse-file';
import { getOutputBuffer } from './helpers/misc';

/**
 * This is the Entry point of the Code. Call this function with the input filename to get the result.
 * The Result is Placed under the outputs folder in the same filename as the input
 * @param fileName The Name of the Input File
 * @param debug Remove Console Logs if Debug is not true
 */
const start = (fileName: string, debug?: boolean) => {
	if (!debug) {
		// Disable All Console Logs
		console.log = () => {};
	}
	const data = getFileData(fileName);
	fileHandler.writeFile(fileName, getOutputBuffer(data));
	console.log('data', data, JSON.stringify(data.companyMap));
};

const inputFile = 'c_soup.txt';
start(inputFile);
