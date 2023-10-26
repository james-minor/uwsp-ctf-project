<script setup lang="ts">
import { ref } from 'vue'
import router from '@/router/router';
import * as feather from 'feather-icons';
import FormInput from '@/components/FormInput.vue';
import { useSessionStore } from '@/stores/session';
import fetchData from '@/api/fetchData';
import AppButton from '@/components/buttons/AppButton.vue';

const formData = ref({
	email: '',
	username: '',
	password: '',
	teamName: '',
	inviteCode: '',
});

const formErrors = ref({
	email: '',
	username: '',
	password: '',
	teamName: '',
	inviteCode: '',
});

const teams = ref<[]>([]);

fetchData('teams', 'GET')
	.then(async (response) =>
	{
		let json = await response.json();
		teams.value = json.data['teams'];
	});

const newTeam = ref<boolean>(false);

const formValid = ref<boolean>(false);

const sessionStore = useSessionStore();

async function onFormSubmit()
{
	await fetchData(
		'user',
		'POST',
		{
			email: formData.value.email,
			username: formData.value.username,
			password: formData.value.password,
			teamName: formData.value.teamName,
			inviteCode: formData.value.inviteCode,
		})
		.then((res) =>
		{
			return res.json();
		})
		.then((res) =>
		{
			console.log(res);

			if (res.errors !== undefined)
			{
				// TODO: god this .concat business is hacky, maybe we should change the error schema?
				// TODO: trying to join an existing team appears to NOT work?
				// TODO: make sure that users REQUIRE a team (make teamId not nullable).

				formErrors.value.email = res.errors.filter((error: any) =>
				{
					return error.key === 'email';
				}).concat([{ message: '' }])[0].message;

				formErrors.value.username = res.errors.filter((error: any) =>
				{
					return error.key === 'username';
				}).concat([{ message: '' }])[0].message;

				formErrors.value.password = res.errors.filter((error: any) =>
				{
					return error.key === 'password';
				}).concat([{ message: '' }])[0].message;

				formErrors.value.teamName = res.errors.filter((error: any) =>
				{
					return error.key === 'teamName';
				}).concat([{ message: '' }])[0].message;

				formErrors.value.inviteCode = res.errors.filter((error: any) =>
				{
					return error.key === 'inviteCode';
				}).concat([{ message: '' }])[0].message;
			}

			/* Storing the session UUID.
			 */
			if (res.success === true)
			{
				if ('session' in res.data && 'admin' in res.data)
				{
					sessionStore.login(res.data.session, res.data.admin);
					router.push({ path: '/challenges' });
				}
			}
		});
}

function validateForm()
{
	formValid.value = true;

	/* Lazily validating email.
	 */
	if (formData.value.email.length < 5 || formData.value.email.length > 75)
	{
		formValid.value = false;
	}

	if (!(formData.value.email.includes('@') && formData.value.email.includes('.')))
	{
		formValid.value = false;
	}

	/* Validating username.
	 */
	if (formData.value.username.length < 3 || formData.value.username.length > 30)
	{
		formValid.value = false;
	}

	/* Validating password.
	 */
	if (formData.value.password.length < 10)
	{
		formValid.value = false;
	}
}

</script>

<template>
	<div class="view">
		<form method="post">
			<h1>Let's Get Started</h1>
			<p>Create your user account</p>

			<FormInput
				name="email"
				:icon="feather.icons.mail"
				type="email"
				:error="formErrors.email"
				:max-length="75"

				v-model="formData.email"
				@input="validateForm"
			/>
			<FormInput
				name="username"
				:icon="feather.icons.user"
				type="text"
				:error="formErrors.username"
				:max-length="30"

				v-model="formData.username"
				@input="validateForm"
			/>
			<FormInput
				name="password"
				:icon="feather.icons.lock"
				type="password"
				:error="formErrors.password"

				v-model="formData.password"
				@input="validateForm"
			/>

			<label for="team-type">
				Create a new team?
			</label>
			<input type="checkbox" name="team-type" id="team-type" v-model="newTeam">

			<FormInput
				v-if="newTeam"

				name="team-name"
				:icon="feather.icons.users"
				type="text"
				:error="formErrors.teamName"
				:max-length="40"

				v-model="formData.teamName"
				@input="validateForm"
			/>

			<div v-else>
				<select name="team-name" id="team-name" v-model="formData.teamName">
					<option v-for="team in teams" :value="team['name']">
						{{ team['name'] }}
					</option>
				</select>

				<FormInput
					name="invite-code"
					:icon="feather.icons.key"
					type="text"
					:error="formErrors.inviteCode"
					:max-length="8"

					v-model="formData.inviteCode"
					@input="validateForm"
				/>
			</div>

			<div class="button-container">
				<router-link class="btn" to="/login">Back</router-link>
				<AppButton @click.prevent="onFormSubmit" :disabled="!formValid">Register User</AppButton>
			</div>
		</form>
	</div>
</template>

<style scoped>
.view {
	min-height:       100svh;
	width:            100%;

	background-image: url("/full-screen-background.svg");

	display:          flex;
	align-items:      center;
	justify-content:  center;

	box-shadow:       inset 0 0 25vw 20px var(--col-main-purple);
}

form {
	display:            flex;
	flex-direction:     column;

	background-color:   var(--col-body-light-100);
	color:              var(--col-text-light);
	padding:            2.5rem;

	border-radius:      10px;
	min-width:          min(55ch, 95%);

	box-shadow:         0 0 10px 2px rgba(0, 0, 0, 0.5);
	-webkit-box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.5);
	-moz-box-shadow:    0 0 10px 2px rgba(0, 0, 0, 0.5);
}

h1,
p {
	text-align: center;
}

p {
	margin-bottom: 2rem;
}

.button-container {
	display:               grid;
	grid-template-columns: auto auto;
}

.btn {
	background-color: transparent;
	outline:          none;
	border:           currentColor thin solid;
	border-radius:    7px;

	padding:          0.75rem 1.75rem;

	display:          flex;
	align-items:      center;

	text-transform:   uppercase;
	text-decoration:  none;

	color:            black;
	cursor:           pointer;

	text-align:       center;

	transition:       opacity 0.3s;
}

.btn:nth-child(1) {
	justify-self: start;
}

.btn:nth-child(2) {
	justify-self: end;
}

.btn:disabled {
	cursor:  not-allowed;
	opacity: 0.65;
}

select {
	width: 100%;
}

</style>