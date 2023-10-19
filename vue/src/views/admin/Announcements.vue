<script setup lang="ts">
import AnnouncementForm from '@/components/admin/AnnouncementForm.vue';
import { inject, ref } from 'vue';
import { useSessionStore } from '@/stores/session';

const apiBaseUrl = inject('apiBaseURL');
const sessionStore = useSessionStore();

const announcements = ref<[]>([]);

const announcementBody = ref<string>('');

async function fetchAnnouncements()
{
	await fetch(`${apiBaseUrl}/v1/announcements`,
		{
			method: 'GET',
			headers: {
				'Accept': 'application/json',
			},
		})
		.then(async (response) =>
		{
			let json = await response.json();
			announcements.value = json.data['announcements'];
		});
}

async function postAnnouncement()
{
	await fetch(`${apiBaseUrl}/v1/announcements`,
		{
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Authorization': `Bearer ${sessionStore.session}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				body: announcementBody.value
			}),
		})
		.then(async (response) =>
		{
			// TODO: maybe make sure it posted correctly, popup some sort of error if it didnt?
			// TODO: client side validation.
		});

	announcementBody.value = '';
	await fetchAnnouncements();
}

fetchAnnouncements();
</script>

<template>
	<h1>Manage Announcements</h1>
	<form>
		<textarea
			v-model="announcementBody"
			maxlength="1000"
		></textarea>
		<div class="character-count">
			<span>{{ announcementBody.length }}/1000</span>
		</div>

		<input
			:disabled="announcementBody.length === 0"
			type="submit"
			value="POST"
			@click.prevent="postAnnouncement"
		>
	</form>

	<AnnouncementForm
		v-if="announcements.length > 0"
		v-for="(announcement) in announcements"
		:key="announcement['id']"

		:id="announcement['id']"
		:author-username="announcement['author']['username']"
		:body="announcement['body']"
		:creation-date="announcement['creationDate']"

		@delete="fetchAnnouncements"
	/>
	<span v-else>No Posted Announcements</span>
</template>

<style scoped>
	h1 {
		align-self: start;
		margin-left: 5%;
		margin-bottom: 1rem;
	}

	li {
		list-style-type: none;
	}

	span {
		width: 100%;
		text-align: center;

		opacity: 0.5;
	}

	form {
		display: flex;
		flex-direction: column;
		width: 90%;

		margin-bottom: 2rem;
	}

	input[type="submit"] {
		align-self: end;
		padding-left: 1rem;
		padding-right: 1rem;
		padding-top: 0.5rem;
		padding-bottom: 0.5rem;
	}

	textarea {
		resize:           none;

		padding:          0.5rem;
		background-color: transparent;
		color:            var(--col-text-dark);

		border-style: solid;
		border-width: thin;
		border-color: currentColor;
		border-radius: 5px;

		height: 10rem;
		width: 100%;
	}

	.character-count {
		height:  0.85rem;
		opacity: 0.5;
	}

	.character-count > span {
		font-size:   0.85rem;
		font-family: monospace;
	}
</style>