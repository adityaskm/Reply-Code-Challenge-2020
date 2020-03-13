import { PageData } from '../model/page-data.class';
import { placeResources } from './resource-processing';

/**
 * This function calls PlaceResources to Place Resources in the Company Map and the Modifies its output to match the required output
 * @param data The Page Data from the Input File
 */
export const getOutputBuffer = (data: PageData) => {
	return JSON.stringify(placeResources(data))
		.replace('[', '')
		.replace(']', '')
		.replace(/","/g, '\n')
		.replace(/"/g, '')
		.replace(/,/g, ' ');
};
