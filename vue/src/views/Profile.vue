<script setup lang="ts">
import { ref } from 'vue';
import fetchData from '@/api/fetchData';
import FormInput from '@/components/form/FormInput.vue';
import AppButton from '@/components/buttons/AppButton.vue';

const newPassword = ref<{
	password: string,
	repeated: string,
}>({
	password: '',
	repeated: '',
});

const user = ref<any>(undefined);

async function fetchUserData()
{
	await fetchData('user', 'GET')
		.then(async (response) =>
		{
			let json = await response.json();
			user.value = json.data;
		});
}

async function updatePassword()
{
	await fetchData('user', 'PUT', { password: newPassword.value.password })
		.then((res) =>
		{
			if (res.status == 200)
			{
				newPassword.value.password = '';
				newPassword.value.repeated = '';
				alert('Successfully updated your password.');
			}
			else
			{
				alert('Could not update your password.');
			}
		})
}

fetchUserData();

// TODO: Profile page is not compiling when uncommenting the body.
</script>

<template>
	<h1>Profile page</h1>

	<span>Hi, {{ user['username'] }}!</span>

	<div>
		<FormInput
			v-model="user['email']"
			name="email"
			type="text"

			:disabled="true"
		/>

		<FormInput
			v-model="user['role']"
			name="role"
			type="text"

			:disabled="true"
		/>

		<FormInput
			v-model="user['teamName']"
			name="Team Name"
			type="text"

			:disabled="true"
		/>

		<FormInput
			v-model="user['inviteCode']"
			name="Team Invite Code"
			type="text"

			:disabled="true"
		/>

		<FormInput
			v-model="newPassword.password"
			name="New Password"
			type="password"
		/>
		<FormInput
			v-model="newPassword.repeated"
			name="Repeat Password"
			type="password"
		/>

		<AppButton
			:disabled="newPassword.password.length < 10 || newPassword.repeated !== newPassword.password"
			@click="updatePassword"
		>Update Password</AppButton>
	</div>
</template>

<style scoped>
	div {
		display: flex;
		flex-direction: column;
		row-gap: 1rem;
	}
</style>