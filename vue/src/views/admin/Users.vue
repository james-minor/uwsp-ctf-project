<script setup lang="ts">
import fetchData from '@/api/fetchData';
import { ref } from 'vue';
import ModelEditor from '@/components/admin/ModelEditor.vue';
import ViewHeader from '@/components/admin/ViewHeader.vue';
import EmptyListFooter from '@/components/admin/EmptyListFooter.vue';
import { FieldType } from '@/enum/FieldType';
import type { SelectOption } from '@/types/SelectOption';

const roles = ref<SelectOption[]>([
	{
		value: 'ADMIN',
		text: 'ADMIN',
	},
	{
		value: 'USER',
		text: 'USER',
	},
]);

const users = ref<[]>([]);

async function fetchUsers()
{
	await fetchData('users', 'GET')
		.then(async (response) =>
		{
			let json = await response.json();
			users.value = json.data['users'];
		});
}
fetchUsers();

</script>

<template>
	<ViewHeader>Manage Users</ViewHeader>

	<ModelEditor
		v-if="users.length > 0"
		v-for="user in users"
		model="user"

		:id="user['id']"
		:fields="[
			{
				name: 'username',
				type: FieldType.TEXT,
				editable: false,
				initialValue: user['username'],
				modelValue: user['username'],
			},
			{
				name: 'role',
				type: FieldType.SELECT,
				editable: true,
				initialValue: user['role'],
				modelValue: user['role'],
				options: roles,
			},
		]"

		@refresh="fetchUsers"
	/>

	<EmptyListFooter v-else>No Posted Users</EmptyListFooter>
</template>

<style scoped>

</style>