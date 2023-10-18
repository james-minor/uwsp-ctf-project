<script setup lang="ts">
import * as feather from 'feather-icons';
import { inject, ref } from 'vue';
import FormInput from '@/components/FormInput.vue';
import router from '@/router/router';
import { useSessionStore } from '@/stores/session';

const apiBaseUrl = inject('apiBaseURL');

const formData = ref({
	email: '',
	password: '',
});

const formErrors = ref({
	email: '',
	password: '',
});

const sessionStore = useSessionStore();

function onFormSubmit()
{
	fetch(`${apiBaseUrl}/v1/session`,
		{
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},

			body: JSON.stringify({
				email: formData.value.email,
				password: formData.value.password,
			}),
		})
		.then(function (res)
		{
			return res.json();
		})
		.then(function (res)
		{
			if (res.success)
			{
				if ('session' in res.data && 'admin' in res.data)
				{
					sessionStore.login(res.data.session, res.data.admin);
					router.push({ path: '/challenges' });
				}
			}
			else
			{
				formErrors.value.email = res.errors.filter((error: any) =>
				{
					return error.key === 'email';
				})[0].message;

				formErrors.value.password = res.errors.filter((error: any) =>
				{
					return error.key === 'password';
				})[0].message;
			}
		});
}

function onEmailInput(value: string)
{
	formData.value.email = value;

	// TODO: client side email validation
}

function onPasswordInput(value: string)
{
	formData.value.password = value;

	// TODO: client side password validation
}

</script>

<template>
	<div class="view">
		<form method="post" @submit.prevent="onFormSubmit">
			<h1>Welcome Back</h1>
			<p>Ready to start another challenge?</p>

			<FormInput
				name="email"
				:icon="feather.icons.mail"
				:on-value-changed="onEmailInput"
				type="email"
				:error="formErrors.email"
			/>
			<FormInput
				name="password"
				:icon="feather.icons.lock"
				:on-value-changed="onPasswordInput"
				type="password"
				:error="formErrors.password"
			/>

			<span>OR</span>

			<router-link to="/register">Create a new account</router-link>

			<input class="btn" type="submit" value="Login">
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
}

h1,
p {
	text-align: center;
}

p {
	margin-bottom: 2rem;
}


em {
	display:    block;
	height: 2rem;

	margin-top: 0.25rem;
	margin-bottom: 1rem;

	font-style: normal;
	font-size: 0.9rem;
	font-weight: bold;

	color: var(--col-accent-red)
}

input[type="email"],
input[type="text"],
input[type="password"] {
	padding: 0.5rem 0.75rem;
	border: none;
	outline: none;
}
</style>