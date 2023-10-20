import { defineStore } from 'pinia';
import { inject, ref } from 'vue';
import fetchData from '@/api/fetchData';

/**
 * Store to handle announcements and announcement notification status.
 */
export const useAnnouncementStore = defineStore('announcement', () =>
{
	/* The announcements pulled from the database.
	 */
	const announcements = ref<[]>([]);

	/* The amount of announcements that have been read.
	 */
	const readAnnouncements = ref<number>(0);

	/* We fetch an initial list of announcements before we start polling, as polling takes a few seconds to initialize.
	 * This prevents users from seeing an empty list of announcements before the polling connection has started.
	 */
	fetchAnnouncements();

	/* Starting up a server-sent events data source. This allows for live-reloading of announcements from the API, without
	 * having to constantly poll for data.
	 */
	let source = new EventSource(`${inject('apiBaseURL')}/v1/announcements/poll`,
		{
			withCredentials: true,
		});
	source.onmessage = (event) =>
	{
		announcements.value = JSON.parse(event.data);
	}

	/**
	 * Fetches the announcements array from the database. This is useful for when we want a quicker update vs waiting
	 * for the EventSource to receive a message from the API.
	 */
	function fetchAnnouncements()
	{
		fetchData('announcements', 'GET')
			.then(async (response) =>
			{
				let json = await response.json();
				announcements.value = json.data['announcements'];
			});
	}

	/**
	 * Sets the amount of read announcements as the amount of total announcements, marking the announcements as "read".
	 */
	function markAsRead()
	{
		readAnnouncements.value = announcements.value.length;
	}

	/**
	 * Checks if there are any unread announcements.
	 *
	 * @returns True if there are unread announcements, false otherwise.
	 */
	function hasUnreadAnnouncements(): boolean
	{
		return readAnnouncements.value < announcements.value.length;
	}

	return {
		announcements,
		fetchAnnouncements,
		markAsRead,
		hasUnreadAnnouncements,
	}
});