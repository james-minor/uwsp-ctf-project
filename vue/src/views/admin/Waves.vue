<script setup lang="ts">
import { ref } from 'vue';
import fetchData from '@/api/fetchData';
import ViewHeader from '@/components/admin/ViewHeader.vue';
import EmptyListFooter from '@/components/admin/EmptyListFooter.vue';
import ModelEditor from '@/components/admin/ModelEditor.vue';

const waves = ref<[]>([]);

async function fetchWaves()
{
	await fetchData('waves', 'GET')
		.then(async (response) =>
		{
			let json = await response.json();
			waves.value = json.data['waves'];
		});
}

fetchWaves();
</script>

<template>
	<ViewHeader>Manage Release Waves</ViewHeader>

	<ModelEditor
		v-if="waves.length > 0"
		v-for="wave in waves"
		model="wave"

		:id="wave['id']"
		:fields="[
			{
				name: 'releaseDate',
				type: 'text',
				editable: true,
				initialValue: wave['releaseDate'],
				modelValue: wave['releaseDate'],
			},
		]"
	/>

	<EmptyListFooter v-else>No Posted Waves</EmptyListFooter>
</template>

<style scoped>

</style>