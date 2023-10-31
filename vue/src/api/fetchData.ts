import { apiBaseURL } from '@/APIBaseURL';
import { useSessionStore } from '@/stores/session';
import handleResponse from '@/api/handleResponse';

/**
 * Function to remove a lot of the redundant boilerplate code being written to fetch data from our backend API.
 *
 * @param endpoint The api endpoint being requested. The endpoint does not require a leading forward slash; however,
 * if one is provided it will be parsed out within the function.
 * @param method The HTTP method to send to the API.
 * @param body The optional Request body string. If passed an object value, will Stringify the body into a JSON string.
 * If passed a string, will skip stringify step, and pass the string directly to the Request body.
 */
export default async function fetchData(
	endpoint: string,
	method: 'GET' | 'POST' | 'PUT' | 'DELETE',
	body?: any
)
{
	const sessionStore = useSessionStore();

	/* Defining the HTTP Request headers.
	 */
	const requestHeaders: HeadersInit = {
		'Accept': 'application/json',
		'Authorization': `Bearer ${sessionStore.session}`,
		'Content-Type': 'application/json',
	}

	/* Removing the leading forward-slash from the endpoint.
	 */
	let parsedEndpoint = endpoint;
	if (endpoint.charAt(0) === '/')
	{
		parsedEndpoint = endpoint.substring(1);
	}

	/* Parsing the body, if it is not already a string.
	 */
	let parsedBody = body;
	if (typeof body !== 'string')
	{
		parsedBody = JSON.stringify(body);
	}

	if (method === 'GET')
	{
		return await fetch(`${apiBaseURL}/v1/${parsedEndpoint}`, {
			method: method,
			headers: requestHeaders,
		}).then((response) =>
		{
			return handleResponse(response);
		});
	}
	else
	{
		return await fetch(`${apiBaseURL}/v1/${parsedEndpoint}`, {
			method: method,
			headers: requestHeaders,
			body: parsedBody ? parsedBody : '',
		}).then((response) =>
		{
			return handleResponse(response);
		});
	}
}

