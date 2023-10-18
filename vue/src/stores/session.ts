import { defineStore } from 'pinia';
import { inject, ref } from 'vue';

/**
 * Store to handle user application sessions.
 */
export const useSessionStore = defineStore('session', () => {
	const apiBaseUrl = inject('apiBaseURL');
	const session = ref<undefined | string>(undefined);

	/**
	 * Receives a session token and stores it in the sessionStore.
	 * @param token The session token.
	 */
	function login(token: string)
	{
		session.value = token;
	}

	/**
	 * Logs the user out of the application. This will both delete the local user session, and request
	 * that the backend API deletes the session record as well.
	 */
	async function logout()
	{
		await fetch(`${apiBaseUrl}/v1/session`,
			{
				method: 'DELETE',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${session.value}`
				}
			}
		);

		session.value = undefined;
	}

	return { session, login, logout };
});