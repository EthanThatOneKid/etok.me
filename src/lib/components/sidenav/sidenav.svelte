<script lang="ts">
	import type { SidenavData } from './sidenav';

	export let data: SidenavData;

	let closenavRef: HTMLElement;
	let opennavRef: HTMLElement;

	function handleSidenavKeyup(e: KeyboardEvent) {
		if (e.code === 'Escape') {
			document.location.hash = '';
		}
	}

	function handleSidenavTransitionend(e: TransitionEvent) {
		if (e.propertyName !== 'transform') {
			return;
		}

		const isOpen = document.location.hash === '#sidenav-open';

		isOpen ? closenavRef.focus() : opennavRef.focus();
	}
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<aside
	id="sidenav-open"
	on:keyup={handleSidenavKeyup}
	on:transitionend={handleSidenavTransitionend}
>
	<nav>
		{#each data.categories as category (category.title)}
			<h4>{category.title}</h4>
			{#each category.links as link (link.content)}
				<a href={link.href}>{link.content}</a>
			{/each}
		{/each}
	</nav>

	<a
		href="#"
		id="sidenav-close"
		title="Close Menu"
		aria-label="Close Menu"
		bind:this={closenavRef}
		on:change={() => history.go(-1)}
	></a>
</aside>

<main>
	<header>
		<a
			href="#sidenav-open"
			id="sidenav-button"
			class="hamburger"
			title="Open Menu"
			aria-label="Open Menu"
			bind:this={opennavRef}
		>
			<svg
				viewBox="0 0 50 40"
				role="presentation"
				focusable="false"
				aria-label="trigram for heaven symbol"
			>
				<line x1="0" x2="100%" y1="10%" y2="10%"></line>
				<line x1="0" x2="100%" y1="50%" y2="50%"></line>
				<line x1="0" x2="100%" y1="90%" y2="90%"></line>
			</svg>
		</a>
		<h1>{data.title}</h1>
	</header>

	<article>
		<slot />
	</article>
</main>

<style>
	:root {
		--surface: #1b1b1b;
		--surface2: #303030;
		--text: #e2e2e2;
		--text2: #ababab;
		--brandHSL: 328 100% 54%;
	}

	@media (prefers-color-scheme: light) {
		:root {
			--surface: #e2e2e2;
			--surface2: #fffffe;
			--text: #303030;
			--text2: #5e5e5e;
		}
	}

	:global(body) {
		min-block-size: 100vh;
		font-family:
			BLOKK,
			system-ui,
			-apple-system,
			Segoe UI,
			Roboto,
			Ubuntu,
			Cantarell,
			Noto Sans,
			sans-serif;
		padding: 0;
		background: #1b1b1b;
		background: var(--surface);
	}

	:global(body),
	h1,
	h4 {
		margin: 0;
		color: #e2e2e2;
		color: var(--text);
	}

	a {
		color: #ff7ac1;
		outline-color: #ff1492;
		outline-color: hsl(var(--brandHSL));
		outline-offset: 5px;
	}

	a:hover {
		color: #ff1492;
		color: hsl(var(--brandHSL));
	}

	:global(body) {
		display: grid;
		grid: [stack] 1fr / -webkit-min-content [stack] 1fr;
		grid: [stack] 1fr / min-content [stack] 1fr;
	}

	@media (max-width: 540px) {
		aside,
		main {
			grid-area: stack;
		}
	}

	#sidenav-open {
		--easeOutExpo: cubic-bezier(0.16, 1, 0.3, 1);
		--duration: 0.6s;
		display: grid;
		grid-template-columns: [nav] 2fr [escape] 1fr;
	}

	@media (max-width: 540px) {
		#sidenav-open {
			position: -webkit-sticky;
			position: sticky;
			top: 0;
			max-height: 100vh;
			overflow-x: hidden;
			overflow-y: auto;
			overflow: hidden auto;
			-ms-scroll-chaining: none;
			overscroll-behavior: contain;
			visibility: hidden;
			transform: translateX(-110vw);
			will-change: transform;
			transition:
				transform var(--duration) var(--easeOutExpo),
				visibility 0s linear var(--duration);
		}

		#sidenav-open:target {
			visibility: visible;
			transform: translateX(0);
			transition: transform var(--duration) var(--easeOutExpo);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		#sidenav-open {
			--duration: 1ms;
		}
	}

	#sidenav-button,
	#sidenav-close {
		-webkit-tap-highlight-color: transparent;
		-webkit-touch-callout: none;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
		touch-action: manipulation;
	}

	@media (min-width: 540px) {
		#sidenav-button,
		#sidenav-close {
			display: none;
		}
	}

	nav {
		display: inline-flex;
		flex-direction: column;
		padding: 2rem;
		font-size: 1.25rem;
		color: #e2e2e2;
		color: var(--text);
	}

	@media (min-width: 540px) {
		nav {
			-webkit-padding-before: 4.5rem;
			padding-block-start: 4.5rem;
		}
	}

	@media (max-width: 540px) {
		nav {
			background-color: #303030;
			background-color: var(--surface2);
			-webkit-border-end: 1px var(--surface1);
			border-inline-end: 1px var(--surface1);
			box-shadow: 5px 0 40px rgba(0, 0, 0, 0.45);
			font-size: 1.5rem;
		}
	}

	nav > h4 {
		text-transform: uppercase;
	}

	nav > h4:not(:first-child) {
		-webkit-margin-before: 2rem;
		margin-block-start: 2rem;
	}

	nav a {
		text-decoration: none;
		line-height: 1.25;
	}

	.hamburger {
		--size: 4rem;
		display: flex;
		align-content: center;
		justify-content: center;
		place-content: center;
		padding: 1rem;
		box-sizing: border-box;
		border-radius: 50%;
		border: 2px solid transparent;
		-webkit-margin-start: -1rem;
		margin-inline-start: -1rem;
		block-size: var(--size);
		inline-size: var(--size);
		outline: none;
		transition:
			border-color 0.25s ease,
			background-color 0.25s ease;
	}

	.hamburger:hover {
		border-color: rgba(255, 20, 146, 0.5);
		border-color: hsl(var(--brandHSL) / 50%);
	}

	.hamburger:focus {
		border-color: rgba(255, 20, 146, 0.12);
		border-color: hsl(var(--brandHSL) / 12%);
		background: rgba(255, 20, 146, 0.1);
		background: hsl(var(--brandHSL) / 10%);
	}

	.hamburger:hover svg > line {
		stroke: #ff1492;
		stroke: hsl(var(--brandHSL));
	}

	.hamburger:active {
		background: rgba(255, 20, 146, 0.2);
		background: hsl(var(--brandHSL) / 20%);
	}

	.hamburger > svg {
		width: 100%;
	}

	.hamburger > svg > line {
		stroke: #e2e2e2;
		stroke: var(--text);
		stroke-width: 7px;
		transition: stroke 0.25s ease;
	}

	aside > a {
		outline-offset: -1px;
		outline: 1px solid transparent;
	}

	aside > a:focus {
		outline-color: #ff1492;
		outline-color: hsl(var(--brandHSL));
		transition: outline-color 0.25s ease;
	}

	main {
		padding: 0.5rem 1.5rem;
	}

	main > header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		min-block-size: 3rem;
		-webkit-margin-after: 1rem;
		margin-block-end: 1rem;
	}

	article {
		display: inline-grid;
		gap: 2ch;
		background: #303030;
		background: var(--surface2);
		padding: 2ch;
		border-radius: 1ch;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
	}

	article > * {
		margin: 0;
	}
</style>
