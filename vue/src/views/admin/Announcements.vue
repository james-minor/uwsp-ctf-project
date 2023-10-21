<script setup lang="ts">
import AnnouncementEditor from '@/components/admin/AnnouncementEditor.vue';
import { ref } from 'vue';
import fetchData from '@/api/fetchData';
import { useAnnouncementStore } from '@/stores/announcement';

const announcementStore = useAnnouncementStore();

const announcementBody = ref<string>('');

async function postAnnouncement()
{
	await fetchData('announcements', 'POST', { body: announcementBody.value })
		.then(async () =>
		{
			// TODO: maybe make sure it posted correctly, popup some sort of error if it didnt?
		});

	announcementBody.value = '';
	await announcementStore.fetchAnnouncements();
}
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

	<AnnouncementEditor
		v-if="announcementStore.announcements.length > 0"
		v-for="(announcement) in announcementStore.announcements"
		:key="announcement['id']"

		:id="announcement['id']"
		:author-username="announcement['author']['username']"
		:body="announcement['body']"
		:creation-date="announcement['creationDate']"

		@update="announcementStore.fetchAnnouncements()"
		@delete="announcementStore.fetchAnnouncements()"
	/>
	<span class="announcements-empty" v-else>No Posted Announcements</span>
</template>

<style scoped>
h1 {
	align-self:    start;
	margin-left:   5%;
	margin-bottom: 1rem;
}

li {
	list-style-type: none;
}

.announcements-empty {
	width:      100%;
	text-align: center;
}

form {
	display:        flex;
	flex-direction: column;
	width:          90%;

	margin-bottom:  2rem;
}

input[type="submit"] {
	align-self: end;
	padding:    0.5rem 1rem;
}

textarea {
	resize:           none;

	padding:          0.5rem;
	background-color: transparent;
	color:            var(--col-text-dark);

	border:           thin solid currentColor;
	border-radius:    5px;

	height:           10rem;
	width:            100%;
}

.character-count {
	height: 0.85rem;
}

.character-count > span {
	font-size:   0.85rem;
	font-family: monospace;
}
</style>