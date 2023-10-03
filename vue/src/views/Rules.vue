<script setup lang="ts">

import NavigationBar from '@/components/NavigationBar.vue';
</script>

<template>
	<navigation-bar/>
	<div>
		<section>
			<h1>Contest Rules</h1>

			<p>
				The Pointer Overflow CTF is hereafter referred to as the "CTF" or simply the "contest." The term "admin" refers
				to anyone officially working within the contest to ensure the challenges remain available and viable, and that
				teams and scoring are remain working. The term "organizer" applies to anyone officially working within the
				contest to communicate changes, administer the contest, arbitrate disputes, and manually review any scoring
				discrepancies. Those participating in the CTF are referred to as "participants" or "contestants" collectively,
				or as "teams" when referring to groups of participants officially working together.
			</p>

			<p>
				Participants may contact admins or organizers using the methods indicated in the contact page of the contest
				website.
			</p>
		</section>

		<section>
			<h1>General Rules</h1>

			<ol>
				<li>All flags must be submitted as strings. Flags can be identified by their format: poctf{UWSP_msg} (regex ^poctf{.*}$) Ex.
					<code>poctf{UWSP_7h15_15_4_54mpl3_fl46}</code>
				</li>
				<li>Flags must be submitted prior to the challenge closure for any points to be awarded.</li>
				<li>Flags must be submitted through the content website in the appropriate field marked for that challenge for any points to be awarded.</li>
				<li>Participants must follow the content rules at all times. Violating any CTF rules will be grounds for exclusions from this and future CTF challenges. Attempts to violate the rules that also constitute a violation of the law will be pursued by the appropriate authorities.</li>
				<li>Decisions made by admins or organizers regarding all disputes is final.</li>
				<li>Flag hoarding, interference, or tamping with challenges outside of your team's instance is not allowed.</li>
				<li>DDoS/DoS attacks are strictly prohibited.</li>
				<li>These rules are subject to change at any point without prior notice at any point up to 48 hours before the contest begins. All participants should review these rules in the 48 hours prior to the start of the contest to ensure they are familiar with the accepted version of these rules.</li>
			</ol>
		</section>

		<section>
			<h1>Team Composition</h1>

			<ol>
				<li>No limit on team size. All participants on the team must be officially registered on the CTF site to be considered valid participants.</li>
				<li>Teams will be identified by a unique ID that will be used to track flag submissions.</li>
				<li>Collaboration between competing teams is not allowed.</li>
			</ol>
		</section>

		<section>
			<h1>Participant Conduct</h1>

			<ol>
				<li>Treat everyone with respect. Harassment of any kind will not be tolerated.</li>

				<li>Grievances, concerns, or complaints should be issued to content organizers or an admin.</li>

				<li>Posting flags or solutions to the challenges prior to the challenges being closed for submissions is strictly
					prohibited.</li>

				<li>Do not post write-ups until the CTF is over.</li>

				<li>Please do not use or share pirated software, books, or tools in this CTF.</li>

				<li>Keep content SFW on all communication platforms associated with the contest.</li>

				<li>Do not hack the CTF infrastructure.</li>

				<li>Violation of any of the rules may lead to deletion of messages, being banned from communication channels, being
					expelled from the CTF or in extreme cases referral to authorities.</li>

				<li>All contestants participate at their own risk. The CTF, organizers, and admins are not responsible for any real or
					imagined loss or damage that arises from participation in the contest. Contestants must act responsibly and ethically in
					their participation at all times.</li>
			</ol>
		</section>

		<section>
			<h1>Awarding of Prizes</h1>

			<ol>
				<li>The CTF is a contest of skill. No purchase is necessary to enter. No sponsorship is offered or implied. By
					entering the CTF participants agree to abide by the Official Rules and decisions of the contest organizers. The
					CTF organizers reserve the right to refuse, withdraw, or disqualify participants at their sole discretion.
					Contest prizes are awarded to participants at their sole discretion.</li>

				<li>Contest winners are eligible only with valid registration and participation in the CTF. A valid e-mail address must
					be provided at sign-up. Delivery of contest prizes will be done digitally using this address.</li>
			</ol>
		</section>
	</div>
</template>

<style scoped>
	div {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	section {
		max-width: 75ch;
		margin:    1.5rem 2ch;
	}

	h1 {
		margin-bottom: 0.5rem;
		font-size: 2rem;

		color: transparent;
		background: linear-gradient(65deg, var(--col-main-purple) 0, var(--col-accent-violet-nt) 100%);
		background-clip: text;
	}

	p {
		margin-top: 0.75rem;
		margin-bottom: 0.75rem;
	}

	ol {
		padding-left: 3ch;
	}

	li {
		line-height: 1.6;
		margin-top: 0.5rem;
		margin-bottom: 0.5rem;
	}

	p,
	li {
		font-size: 1.125rem;
	}

	code {
		background-color: var(--col-body-dark-200);
		display: inline-block;
		margin-top: 0.25rem;
		margin-bottom: 0.25rem;
		padding: 0.5rem 1rem;

		border-radius: 5px;

		color: var(--col-main-gold);
		font-family: monospace;
	}

	@media (prefers-color-scheme: light)
	{
		code {
			background-color: var(--col-body-light-200);
			color: var(--col-main-purple);
		}
	}
</style>