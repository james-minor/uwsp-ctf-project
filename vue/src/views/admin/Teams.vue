<script setup lang="ts">
import fetchData from '@/api/fetchData';
import { ref } from 'vue';
import ModelEditor from '@/components/admin/ModelEditor.vue';
import ViewHeader from '@/components/admin/ViewHeader.vue';

const teams = ref<[]>([]);

async function fetchTeams()
{
	await fetchData('teams', 'GET')
		.then(async (response) =>
		{
			let json = await response.json();
			teams.value = json.data['teams'];
		});
}

fetchTeams();
</script>

<template>
	<ViewHeader>Manage Teams</ViewHeader>

	<ModelEditor
		v-for="team in teams"
		model="team"

		:id="team['id']"
		:fields="[
			{
				name: 'name',
				type: 'text',
				editable: false,
				initialValue: team['name'],
				modelValue: team['name'],
			},
		]"
	/>
</template>

<style scoped>

</style>