import { apiBaseURL } from '@/APIBaseURL';

/**
 * Checks if client is a user.
 * @param session The user session token.
 */
export default function isUser(session: string | undefined): boolean
{
	if (!session)
	{
		return false;
	}

	fetch(`${apiBaseURL}/v1/session/isUser`,
		{
			method: 'GET',
			headers: {
				Authorization: `Bearer ${session}`,
				'Content-Type': 'application/json',
			}
		})
		.then((res) =>
		{
			return res.json();
		})
		.then((res) =>
		{
			if (res.success && 'authorized' in res.data)
			{
				if (res.data['authorized'] === true)
				{
					return true;
				}
			}
		});

	return false;
}