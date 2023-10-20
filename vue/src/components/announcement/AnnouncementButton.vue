<script setup lang="ts">
import { ref } from 'vue';
import feather from 'feather-icons';

import AnnouncementDialog from './AnnouncementDialog.vue';
import { useAnnouncementStore } from '@/stores/announcement';

const announcementStore = useAnnouncementStore();

const showAnnouncementDialog = ref<boolean>(false);
const iconSvg = feather.icons.bell.toSvg({ stroke: 'white', width: 24, height: 24 });
</script>

<template>
	<div>
		<button @click="showAnnouncementDialog=true; announcementStore.markAsRead()">
			<i
				:class="{ 'icon__bell': true, 'icon__bell--active' : announcementStore.hasUnreadAnnouncements() }"
				v-html="iconSvg"
			/>
		</button>

		<AnnouncementDialog
			v-show="showAnnouncementDialog"
			@clicked-backdrop="showAnnouncementDialog=false"
		/>
	</div>
</template>

<style scoped>
button {
	position:         relative;
	background-color: transparent;

	font-size:        0.9rem;

	border-style:     solid;
	border-width:     thin;
	border-color:     var(--col-body-dark-200);
	border-radius:    4px;

	transition:       background-color 0.2s;

	outline:          none;

	cursor:           pointer;

	display:          flex;
	align-items:      center;

	overflow:         hidden;

	color:            var(--col-text-dark);
}

button:focus-visible,
button:hover {
	background-color: var(--col-main-purple);
}

.icon__bell {
	display:          block;
	background-color: var(--col-body-dark-100);

	padding:          0.65rem;
	border-radius:    2px;

	transition:       background-color 0.2s;
}

button:focus-visible .icon__bell,
button:hover .icon__bell {
	background-color: var(--col-main-purple);
}

.icon__bell--active {
	animation-name: anim-bell-shake;
	animation-duration: 3.5s;
	animation-iteration-count: infinite;
	animation-timing-function: linear;
	animation-direction: reverse;
}

@keyframes anim-bell-shake {
	0% {
		transform: rotate(0);
	}

	2% {
		transform: rotate(-10deg);
	}

	4% {
		transform: rotate(10deg);
	}

	6% {
		transform: rotate(-10deg);
	}

	8% {
		transform: rotate(10deg);
	}

	10% {
		transform: rotate(0);
	}
}
</style>