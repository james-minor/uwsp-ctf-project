/**
 * Creates a prettified placeholder string, splitting the name at any '-' or capital characters.
 *
 * @param value The string value to prettify.
 * @returns The prettified string value.
 */
export default function getPrettyPlaceholderString(value: string): string
{
	const words = value.split(/(?=[A-Z-])/).map(word => word.replace('-', ''));

	let placeholder = '';
	for (let word of words)
	{
		placeholder += word[0].toUpperCase() + word.substring(1) + ' ';
	}

	return placeholder.substring(0, placeholder.length - 1);
}