import { Resource, Developer, CompanyMap } from '../model/class';
import { PageData } from '../model/page-data.class';

const getCommonElementsOfArray = (array1: any[], array2: any[]) => {
	return [...array1, ...array2]
		.filter((element, index, array) => array.indexOf(element) === index)
		.filter(element => array1.includes(element) && array2.includes(element));
};

const getDifferentElements = (array1: any[], array2: any[]) => {
	return [...array1, ...array2]
		.filter((element, index, array) => array.indexOf(element) === index)
		.filter(
			element =>
				!(array1.includes(element) && array2.includes(element)) &&
				(array1.includes(element) || array2.includes(element))
		);
};

const calculateWorkPotential = (resource1: Resource, resource2: Resource) => {
	if ('skills' in resource1 && 'skills' in resource2) {
		const commonSkills = getCommonElementsOfArray(resource1.skills, resource2.skills);
		const differentSkills = getDifferentElements(resource1.skills, resource2.skills);
		return commonSkills.length * differentSkills.length;
	} else {
		return 0;
	}
};

const calculateBonusPoints = (resource1: Resource, resource2: Resource) => {
	return resource1.company === resource2.company ? resource1.bonusPoints * resource2.bonusPoints : 0;
};

const calculatePotentialOfResources = (resource1: Resource, resource2: Resource) => {
	return calculateWorkPotential(resource1, resource2) + calculateBonusPoints(resource1, resource2);
};

const getScoreOfResource = (resource: Developer) => {
	return resource.bonusPoints + ('skills' in resource ? resource.skills.length : 0);
};

const getMaxAvailableResource = (resources: Resource[]) => {
	let resource = resources.find(res => !res.placed);
	if (resource) {
		let resourceScore = getScoreOfResource(resource as any);
		resources
			.filter(res => !res.placed)
			.forEach(res => {
				const resScore = getScoreOfResource(res as any);
				if (resScore > resourceScore) {
					resource = res;
					resourceScore = resScore;
				}
			});
	}

	return resource;
};

const getFirstAvailablePlace = (data: PageData) => {
	for (let i = 0; i < data.metaData.H; i++) {
		for (let j = 0; j < data.metaData.W; j++) {
			if (['_', 'M'].includes(data.companyMap[i][j] as any)) {
				return [i, j];
			}
		}
	}
};

const calculatePotentialMaxResource = (resource: Resource, data: PageData, type: 'MANAGER' | 'DEVELOPER') => {
	const availableResources =
		type === 'DEVELOPER'
			? data.developers.filter(res => !res.placed)
			: data.projectManagers.filter(res => !res.placed);
	if (availableResources.length > 0) {
		let maxPotentialResource = availableResources[0];
		let potential = calculatePotentialOfResources(resource, maxPotentialResource);
		availableResources.forEach(res => {
			const newPotential = calculatePotentialOfResources(resource, res);
			if (newPotential > potential) {
				maxPotentialResource = res;
				potential = newPotential;
			}
		});
		return maxPotentialResource;
	} else {
		return null;
	}
};

const checkIfCompanyMapPositionOpen = (i: number, j: number, companyMap: CompanyMap) => {
	return typeof companyMap[i][j] === 'string' && ['_', 'M'].includes(companyMap[i][j] as any)
		? (companyMap[i][j] as string)
		: false;
};

const placePotentialResource = (resource: Resource | null, i: number, j: number, data: PageData) => {
	if (resource) {
		const availablePlace = checkIfCompanyMapPositionOpen(i, j, data.companyMap);
		if (availablePlace) {
			const potentialResource = calculatePotentialMaxResource(
				resource,
				data,
				availablePlace === '_' ? 'DEVELOPER' : 'MANAGER'
			);
			if (potentialResource) {
				data.companyMap[i][j] = potentialResource;
				potentialResource.placed = true;
				placeAdjacentResources(i, j, data);
			}
		}
	}
};

const placeAdjacentResources = (i: number, j: number, data: PageData) => {
	const currentResource = data.companyMap[i][j] as Resource;
	if (i < data.metaData.H - 1) {
		placePotentialResource(currentResource, i + 1, j, data);
	}
	if (j < data.metaData.W - 1) {
		placePotentialResource(currentResource, i, j + 1, data);
	}
	if (j > 0) {
		placePotentialResource(currentResource, i, j - 1, data);
	}
	if (i > 0) {
		placePotentialResource(currentResource, i - 1, j, data);
	}
};

const getResourceIndex = (resource: Resource, data: PageData) => {
	let indices = ['X'];
	// We use array.some for stopping the loop. We can also use For Loop instead of forEach
	const result = data.companyMap.some((row, i) =>
		row.some((cell, j) => {
			if (cell === resource) {
				indices = [i, j] as any;
				return true;
			}
		})
	);
	return indices;
};

let counter = 0;
export const processPage = (data: PageData) => {
	const getFirstPlaceableIndex = getFirstAvailablePlace(data);
	if (getFirstPlaceableIndex) {
		const maxResource =
			data.companyMap[getFirstPlaceableIndex[0]][getFirstPlaceableIndex[1]] === '_'
				? getMaxAvailableResource(data.developers)
				: getMaxAvailableResource(data.projectManagers);
		console.log('position', maxResource, getFirstPlaceableIndex, counter++);
		if (maxResource) {
			data.companyMap[getFirstPlaceableIndex[0]][getFirstPlaceableIndex[1]] = maxResource;
			maxResource.placed = true;
			console.log(data.companyMap, getFirstPlaceableIndex);
			placeAdjacentResources(getFirstPlaceableIndex[0], getFirstPlaceableIndex[1], data);
			processPage(data);
		}
	}
};

export const placeResources = (data: PageData) => {
	processPage(data);
	return [...data.developers, ...data.projectManagers].map(resource =>
		getResourceIndex(resource, data)
			.reverse()
			.toString()
			.toString()
	);
};
