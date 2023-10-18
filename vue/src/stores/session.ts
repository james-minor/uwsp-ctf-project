import { defineStore } from 'pinia';
import { inject, ref } from 'vue';

/**
 * Store to handle user application sessions.
 */
export const useSessionStore = defineStore('session', () => {
	const apiBaseUrl = inject('apiBaseURL');

	/* Ref that holds the user session token string.
	 */
	const session = ref<undefined | string>(undefined);

	/* Ref that defines whether the user session has elevated privileges.
	 */
	const hasElevatedPrivileges = ref<boolean>(false);

	/**
	 * Receives a session token and stores it in the sessionStore.
	 * @param token The session token.
	 * @param admin Does the user session have elevated privileges.
	 */
	function login(token: string, admin: boolean)
	{
		session.value = token;
		hasElevatedPrivileges.value = admin;
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
		hasElevatedPrivileges.value = false;
	}

	/**
	 * Validates that the client session is validated.
	 * @param checkElevatedPrivileges If true, checks if the client session is also an admin.
	 */
	function isAuthenticated(checkElevatedPrivileges: boolean = false): boolean
	{
		if (checkElevatedPrivileges)
		{
			return hasElevatedPrivileges.value === true && typeof session.value === 'string';
		}
		else
		{
			return session.value !== undefined;
		}
	}

	return { session, hasElevatedPrivileges, isAuthenticated, login, logout };
});