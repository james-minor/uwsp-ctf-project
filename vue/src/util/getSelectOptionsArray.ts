import type { SelectOption } from '@/types/SelectOption';
import fetchModelArray from '@/api/fetchModelArray';

/**
 * Helper function that generates a SelectOption array from fetched API data.
 *
 * @param model The model collection endpoint to fetch data for. This should be pluralized, for example
 * to fetch a collection for the Team model, model should equal 'teams'.
 *
 * @param key The attribute of the model to set as the value for the select option. This is typically
 * the Model's ID.
 * 
 * @param text The attribute of the model to set as the displayed text for the select option.
 */
export default async function getSelectOptionsArray(
	model: string,
	key: string,
	text: string
): Promise<SelectOption[]>
{
	let output: SelectOption[] = [];

	let modelCollection = await fetchModelArray(model);
	for (let model: any of modelCollection)
	{
		output.push({
			value: String(model[key]),
			text: String(model[text]),
		});
	}

	return output;
}
