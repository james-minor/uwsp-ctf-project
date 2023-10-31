import { useSessionStore } from '@/stores/session';
import router from '@/router/router';

/**
 * Handles the HTTP Response object received from the API. Validates that we have a good response. If we have a 403,
 * 404, 500+ response status code, we'll redirect to the appropriate page. Otherwise, we return the Response.
 */
export default async function handleResponse(response: Response)
{
	if (response.status >= 500)
	{
		alert('INTERNAL SERVER ERROR');
	}
	else if(response.status === 403)
	{
		const sessionStore = useSessionStore();
		await sessionStore.logout();
		await router.push({ path: '/login' });
	}

	return response;
}