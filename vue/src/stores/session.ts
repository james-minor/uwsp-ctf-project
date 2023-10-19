import { defineStore } from 'pinia';
import { ref } from 'vue';
import fetchData from '@/api/fetchData';

/**
 * Store to handle user application sessions.
 */
export const useSessionStore = defineStore('session', () =>
{
	/* Ref that holds the user session token string.
	 */
	const session = ref<undefined | string>(undefined);

	/* Ref that defines whether the user session has elevated privileges.
	 */
	const hasElevatedPrivileges = ref<boolean>(false);

	/* Pulling state data from sessionStorage, if it exists.
	 */
	if (sessionStorage.getItem('session'))
	{
		const savedSession = JSON.parse(`${sessionStorage.getItem('session')}`);

		session.value = savedSession.session;
		hasElevatedPrivileges.value = savedSession.hasElevatedPrivileges;
	}

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
		await fetchData('session', 'DELETE');

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