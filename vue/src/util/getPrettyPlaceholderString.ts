/**
 * Creates a prettified placeholder string, splitting the name at any '-' or capital characters.
 *
 * @param value The string value to prettify.
 * @returns The prettified string value.
 */
export default function getPrettyPlaceholderString(value: string): string
{
	const words = value.replace('-', ' ').split(/(?=[A-Z])/);

	let placeholder = '';
	for (let word of words)
	{
		placeholder += word[0].toUpperCase() + word.substring(1) + ' ';
	}

	return placeholder;
}