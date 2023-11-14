<script setup lang="ts">

import * as feather from 'feather-icons';
import { onMounted, ref } from 'vue';

const props = defineProps<{
	categoryTitle: string,
	challenges: any[],
}>();

const open = ref<boolean>(false);

</script>

<template>
	<div v-if="props.challenges.length > 0" :class="{'dropdown': true}">
		<div class="dropdown__header" @click="open = !open">
			<h2>{{ props.categoryTitle }}</h2>
		</div>
		<div v-if="open" class="dropdown__content">
			<div
				v-for="challenge in challenges"

				:key="challenge['id']"

				class="challenge-button"

				@click="$emit('select', challenge['id'])"
			>
				<span>{{ challenge['title'] }}</span>
				<span>{{ challenge['value'] }}</span>
			</div>
		</div>
	</div>
</template>

<style scoped>
.dropdown {
	width: 100%;
}

.dropdown__header {
	cursor:           pointer;

	padding:          1rem 0.75rem;

	color:            var(--col-text-dark);
	background-color: var(--col-main-purple);

	border-right:     solid 0 var(--col-accent-violet-nt);

	transition:       border-right-width 0.2s;
}

.dropdown__content {
	overflow: hidden;
}

.dropdown__header:focus-within,
.dropdown__header:hover {
	border-right-width: 1ch;
}

.challenge-button {
	padding:       1rem;

	border-bottom: dashed thin var(--col-body-dark-200);

	display: grid;
	grid-template-columns: repeat(2, 1fr);

	cursor: pointer;
}

.challenge-button span:nth-child(2) {
	text-align: right;
}

.challenge-button:last-child {
	border-bottom: none;
}

.challenge-button:hover {
	background-color: var(--col-body-dark-300);
}
</style>