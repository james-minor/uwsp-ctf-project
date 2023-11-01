import fetchData from '@/api/fetchData';

/**
 * Useful helper function to fetch an array of models, and return the JSON array of model data.
 * @param model The model collection to fetch, for example: 'categories', 'challenges', etc.
 */
export default async function fetchModelArray(model: string): Promise<any>
{
	return await fetchData(model, 'GET')
		.then(async (response) =>
		{
			return (await response.json()).data[model];
		});
}