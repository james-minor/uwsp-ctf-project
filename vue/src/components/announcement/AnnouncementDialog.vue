<script setup lang="ts">
import { useAnnouncementStore } from '@/stores/announcement';

const announcementStore = useAnnouncementStore();
</script>

<template>
	<div class="dialog-container">
		<div role="dialog" class="dialog__backdrop" @click="$emit('clicked-backdrop')"></div>
		<div class="dialog__content">
			<div
				v-if="announcementStore.announcements.length > 0"
				v-for="announcement in announcementStore.announcements"

				:key="announcement['id']"

				class="announcement"
			>
				<p class="announcement__body">
					{{ announcement['body'] }}
				</p>

				<div class="announcement__metadata">
					<span>{{ announcement['author']['username'] }}</span>
					<span>
						{{ new Date(announcement['creationDate']).toISOString() }}
					</span>
				</div>


				<hr>
			</div>
			<span v-else class="announcement--empty">No Announcements Posted</span>
		</div>
	</div>
</template>

<style scoped>
	.dialog-container {
		position: fixed;
		z-index: 10000;
	}

	.dialog__backdrop {
		position: fixed;
		top: 0;
		left: 0;

		height: 100%;
		width: 100%;

		background-color: rgba(0, 0, 0, 0.6);
	}

	.dialog__content {
		position: fixed;
		top: 0;
		right: 0;

		height: 100%;
		width: min(600px, 100%);
		background-color: var(--col-body-dark-100);

		border-left: solid 2px var(--col-body-dark-200);

		overflow-y: scroll;

		display: flex;
		flex-direction: column;

		padding-top: 1rem;
		padding-bottom: 1rem;
	}

	.announcement {
		display: flex;
		flex-direction: column;

		margin-left: 5%;
		margin-right: 5%;
	}

	.announcement__body {
		margin-top: 1rem;
		margin-bottom: 1rem;
	}

	.announcement__metadata {
		display: grid;
		grid-template-columns: repeat(2, 1fr);

		width: 100%;

		font-size: 0.85rem;
		opacity: 0.7;
	}

	.announcement__metadata span:nth-child(1) {
		text-align: left;
	}

	.announcement__metadata span:nth-child(2) {
		text-align: right;
	}

	hr {
		margin-top: 1rem;
		height: 1px;
		margin-bottom: 1rem;
		opacity: 0.1;
		width: 100%;
		align-self: center;

		border: none;
		background-color: var(--col-text-dark);
	}

	.announcement:last-of-type hr {
		position: absolute;
		opacity: 0;
	}

	.announcement--empty {
		display: flex;
		justify-content: center;
		align-items: center;

		height: 100%;
	}
</style>