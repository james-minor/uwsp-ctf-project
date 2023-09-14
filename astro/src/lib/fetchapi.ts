export default async function fetchAPI<T>(
	endpoint: string,
): Promise<T | undefined>
{
	/* While we should generally use HTTPS instead of HTTP, in this case in production our API requests only go through
	 * the Docker service network, and should not be sent out through the cloud. Not having to use SSL both reduces
	 * latency and development overhead.
	 */
	const url: string = `http://express:8000/api/v1${endpoint}`;

	try
	{
		const response = await fetch(url);

		if(response.ok)
		{
			return await response.json();
		}
	}
	catch (error)
	{
		console.warn(error);
		return undefined;
	}
}