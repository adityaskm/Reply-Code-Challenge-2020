import { Resource, Developer, CompanyMap } from '../model/class';
import { PageData } from '../model/page-data.class';

const getCommonAndUniqueArrayElements = (arr1: string[], arr2: string[]) => {
	const common = [];
	const unique = [];
	let i = 0;
	let j = 0;
	let k = 0;
	const n1 = arr1.length;
	const n2 = arr2.length;
	while (i < n1 && j < n2) {
		if (arr1[i] < arr2[j]) {
			unique.push(arr1[i]);
			i = i + 1;
			k = k + 1;
		} else if (arr2[j] < arr1[i]) {
			unique.push(arr2[j]);
			k = k + 1;
			j = j + 1;
		} else {
			common.push(arr1[i]);
			i = i + 1;
			j = j + 1;
		}
	}
	while (i < n1) {
		unique.push(arr1[i]);
		i = i + 1;
		k = k + 1;
	}
	while (j < n2) {
		unique.push(arr2[j]);
		j = j + 1;
		k = k + 1;
	}
	return [common, unique];
};

/**
 * Calculate the Work Potential Between Two Resources
 */
const calculateWorkPotential = (resource1: Resource, resource2: Resource) => {
	if ('skills' in resource1 && 'skills' in resource2) {
		const [commonSkills, differentSkills] = getCommonAndUniqueArrayElements(resource1.skills, resource2.skills);
		return commonSkills.length * differentSkills.length;
	} else {
		return 0;
	}
};

/**
 * Calculate the Bonus Points between 2 resources
 */
const calculateBonusPoints = (resource1: Resource, resource2: Resource) => {
	return resource1.company === resource2.company ? resource1.bonusPoints * resource2.bonusPoints : 0;
};

/**
 * Calculate the Total Potential Between Two Resources, according to the Formula: TP(Ri,Rj) = WP(Ri,Rj).BP(Ri,Rj)
 */
const calculatePotentialOfResources = (resource1: Resource, resource2: Resource) => {
	return calculateWorkPotential(resource1, resource2) + calculateBonusPoints(resource1, resource2);
};

/**
 * Initially, in our Greedy Strategy, we estimate the Score of a resource by the skill count of that resource and his bonus points
 */
const getScoreOfResource = (resource: Developer) => {
	return resource.bonusPoints + ('skills' in resource ? resource.skills.length : 0);
};

/**
 * When we encounter a disconnected empty space for the first time, we allocate a resource to it based on the highest score as calculated by getScoreOfResource()
 */
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

/**
 * Get the First available Disconnected Place. The Places would be More than one in case of separated blocks. In this case, this function would be called multiple times during the recursion.
 */
const getFirstAvailablePlace = (data: PageData) => {
	for (let i = 0; i < data.officeDimensions.H; i++) {
		for (let j = 0; j < data.officeDimensions.W; j++) {
			if (['_', 'M'].includes(data.companyMap[i][j] as any)) {
				return [i, j];
			}
		}
	}
};

/**
 * For a placed Resource, calculate the max Potential Resource that can be placed adjacent to it.
 */
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

/**
 * Check if the Position at the specified indices in the company Map is open to be placed by a Developer/project Manager
 */
const checkIfCompanyMapPositionOpen = (i: number, j: number, companyMap: CompanyMap) => {
	return typeof companyMap[i][j] === 'string' && ['_', 'M'].includes(companyMap[i][j] as any)
		? (companyMap[i][j] as string)
		: false;
};

/**
 * Place the Highest Potential Resource Adjacent to the resource provided at the Provided indices: i,j
 */
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

/**
 * Place resources adjacent to the resource at the indices provided if the positions are free.
 * @param i The Position of the current Resource
 * @param j
 * @param data The Page Data
 */
const placeAdjacentResources = (i: number, j: number, data: PageData) => {
	const currentResource = data.companyMap[i][j] as Resource;
	if (i < data.officeDimensions.H - 1) {
		placePotentialResource(currentResource, i + 1, j, data);
	}
	if (j < data.officeDimensions.W - 1) {
		placePotentialResource(currentResource, i, j + 1, data);
	}
	if (j > 0) {
		placePotentialResource(currentResource, i, j - 1, data);
	}
	if (i > 0) {
		placePotentialResource(currentResource, i - 1, j, data);
	}
};

/**
 * After Placing all the resources in the Company Map, we get the index of each placed resource
 * @param resource The Resource for whom we need the placed index
 * @param data The Page Data from the file
 */
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

/**
 * The Entry Point of all the Calculation.
 * This Function gets the next available isolated block in the map and starts filling it. If the block was found, it calls itself again to fetch the next available block, if any and fill it.
 * @param data The Page Data
 */
export const processPage = (data: PageData) => {
	const getFirstPlaceableIndex = getFirstAvailablePlace(data);
	if (getFirstPlaceableIndex) {
		const maxResource =
			data.companyMap[getFirstPlaceableIndex[0]][getFirstPlaceableIndex[1]] === '_'
				? getMaxAvailableResource(data.developers)
				: getMaxAvailableResource(data.projectManagers);
		console.log('position', maxResource, getFirstPlaceableIndex);
		if (maxResource) {
			data.companyMap[getFirstPlaceableIndex[0]][getFirstPlaceableIndex[1]] = maxResource;
			maxResource.placed = true;
			console.log(data.companyMap, getFirstPlaceableIndex);
			placeAdjacentResources(getFirstPlaceableIndex[0], getFirstPlaceableIndex[1], data);
			processPage(data);
		}
	}
};

/**
 * The Entry Point of this file.
 * This function calls Process Page which Places the Resources in the Company Map, and then calls getResourceIndex on each resource to get his placed Index
 * @param data The Page Data from the File.
 */
export const placeResources = (data: PageData) => {
	processPage(data);
	return [...data.developers, ...data.projectManagers].map(resource =>
		getResourceIndex(resource, data)
			.reverse()
			.toString()
			.toString()
	);
};
