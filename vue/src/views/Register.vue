<script setup lang="ts">
import { inject, ref } from 'vue'
import router from '@/router/router';
import * as feather from 'feather-icons';
import FormInput from '@/components/FormInput.vue';
import { useSessionStore } from '@/stores/session';

const apiBaseUrl = inject('apiBaseURL');

const formData = ref({
	email: '',
	username: '',
	password: '',
});

const formErrors = ref({
	email: '',
	username: '',
	password: '',
});

const formValid = ref<boolean>(false);

const sessionStore = useSessionStore();

function onFormSubmit()
{
	fetch(`${apiBaseUrl}/v1/user`,
		{
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},

			body: JSON.stringify({
				email: formData.value.email,
				username: formData.value.username,
				password: formData.value.password,
			}),
		})
		.then(function (res)
		{
			return res.json();
		})
		.then(function (res)
		{
			if (res.errors !== undefined)
			{
				formErrors.value.email = res.errors.filter((error: any) =>
				{
					return error.key === 'email';
				})[0].message;

				formErrors.value.username = res.errors.filter((error: any) =>
				{
					return error.key === 'username';
				})[0].message;

				formErrors.value.password = res.errors.filter((error: any) =>
				{
					return error.key === 'password';
				})[0].message;
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

function onEmailInput(value: string)
{
	formData.value.email = value;
	validateForm();
}

function onUsernameInput(value: string)
{
	formData.value.username = value;
	validateForm();
}

function onPasswordInput(value: string)
{
	formData.value.password = value;
	validateForm();
}

function validateForm()
{
	formValid.value = true;

	if (formData.value.email.length === 0 || formData.value.email.length > 75)
	{
		formValid.value = false;
	}

	if (!(formData.value.email.includes('@') && formData.value.email.includes('.')))
	{
		formValid.value = false;
	}

	if (formData.value.username.length < 3 || formData.value.username.length > 30)
	{
		formValid.value = false;
	}

	if (formData.value.password.length < 10)
	{
		formValid.value = false;
	}
}

</script>

<template>
	<div class="view">
		<form method="post" @submit.prevent="onFormSubmit">
			<h1>Let's Get Started</h1>
			<p>Create your user account</p>

			<FormInput
				name="email"
				:icon="feather.icons.mail"
				:on-value-changed="onEmailInput"
				type="email"
				:error="formErrors.email"
				:max-length="75"
			/>
			<FormInput
				name="username"
				:icon="feather.icons.user"
				:on-value-changed="onUsernameInput"
				type="text"
				:error="formErrors.username"
				:max-length="30"
			/>
			<FormInput
				name="password"
				:icon="feather.icons.lock"
				:on-value-changed="onPasswordInput"
				type="password"
				:error="formErrors.password"
			/>

			<div class="button-container">
				<router-link class="btn" to="/login">Back</router-link>
				<input class="btn" type="submit" value="Register User" :disabled="!formValid">
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
}

form {
	display:            flex;
	flex-direction:     column;

	background-color:   white;
	padding:            2.5rem;

	color:              black;

	border-radius:      10px;

	box-shadow:         0 0 10px 2px rgba(0, 0, 0, 0.75);
	-webkit-box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.75);
	-moz-box-shadow:    0 0 10px 2px rgba(0, 0, 0, 0.75);

	min-width: min(55ch, 95%);
}

h1,
p {
	text-align: center;
}

p {
	margin-bottom: 2rem;
}

.button-container {
	display: grid;
	grid-template-columns: auto auto;
}

.btn {
	background-color: transparent;
	outline: none;
	border: currentColor thin solid;
	border-radius: 7px;

	padding: 0.75rem 1.75rem;

	display: flex;
	align-items: center;

	text-transform: uppercase;
	text-decoration: none;

	color: black;
	cursor: pointer;

	text-align: center;

	transition: opacity 0.3s;
}

.btn:nth-child(1) {
	justify-self: start;
}

.btn:nth-child(2) {
	justify-self: end;
	background-color: var(--col-main-purple);
	color: white;
}

.btn:disabled {
	cursor: not-allowed;
	opacity: 0.65;
}

</style>