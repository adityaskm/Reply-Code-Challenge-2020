import { PageData } from '../model/page-data.class';
import { placeResources } from './resource-processing';

export const getOutputBuffer = (data: PageData) => {
	return JSON.stringify(placeResources(data))
		.replace('[', '')
		.replace(']', '')
		.replace(/","/g, '\n')
		.replace(/"/g, '')
		.replace(/,/g, ' ');
};
