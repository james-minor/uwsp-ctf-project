<script setup lang="ts">
import { inject, ref } from 'vue'
import router from '@/router/router';
import Cookies from 'js-cookie';
import * as feather from 'feather-icons';

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

function onFormSubmit()
{
	fetch(`${apiBaseUrl}/v1/user/create`,
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
				if ('message' in res.data)
				{
					Cookies.set('session', res.data['message']);
					router.push({ path: '/challenges' });
				}
			}
		});
}
</script>

<template>
	<div class="view">
		<form method="post" @submit.prevent="onFormSubmit">
			<h1>Let's Get Started</h1>
			<p>Create your user account</p>

			<div class="input-container">
				<div class="icon" v-html="feather.icons.mail.toSvg({ stroke: 'white' })" />
				<input
					name="email"
					type="email"
					v-model="formData.email"
					placeholder="Email"
					maxlength="75"
				>
			</div>
			<em>{{ formErrors.email }}</em>

			<div class="input-container">
				<div class="icon" v-html="feather.icons.user.toSvg({ stroke: 'white' })" />
				<input
					name="username"
					type="text"
					v-model="formData.username"
					placeholder="Username"
					minlength="3"
					maxlength="30"
				>
			</div>
			<em>{{ formErrors.username }}</em>

			<div class="input-container">
				<div class="icon" v-html="feather.icons.lock.toSvg({ stroke: 'white' })" />
				<input
					name="password"
					type="password"
					v-model="formData.password"
					placeholder="Password"
					minlength="10"
				>
			</div>
			<em>{{ formErrors.password }}</em>

			<div class="button-container">
				<router-link class="btn" to="/login">Back</router-link>
				<input class="btn" type="submit" value="Register User">
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

.input-container {
	display: grid;
	grid-template-columns: auto 1fr;
	grid-template-rows: 1fr;

	border: black thin solid;
}

.input-container:focus-within {
	outline: var(--col-accent-violet-nt) solid 2px;
}

.icon {
	aspect-ratio: 1;
	background-color: var(--col-main-purple);

	padding: 0.65rem;

	display: flex;
	align-items: center;
	justify-content: center;
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
}

.btn:nth-child(1) {
	justify-self: start;
}

.btn:nth-child(2) {
	justify-self: end;
	background-color: var(--col-main-purple);
	color: white;
}

</style>