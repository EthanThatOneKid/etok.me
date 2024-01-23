<script lang="ts">
	import { onMount } from 'svelte';

	let sidenavRef: HTMLElement;
	let closenavRef: HTMLElement;
	let opennavRef: HTMLElement;

	onMount(() => {
		function handleSidenavClose(e: KeyboardEvent) {
			if (e.target instanceof HTMLElement && e.target.closest('#sidenav-close')) {
				document.location.hash = '';
			}
		}

		sidenavRef.addEventListener('keyup', handleSidenavClose);

		return () => {
			sidenavRef.removeEventListener('keyup', handleSidenavClose);
		};
	});

	// https://youtu.be/uiZqDLqjGRY?t=187
	// https://youtu.be/oHcTn83M1ls
</script>

<aside id="sidenav-open">
	<nav>
		<h4>My</h4>
		<a href="#">Dashboard</a>
		<a href="#">Profile</a>
		<a href="#">Preferences</a>
		<a href="#">Archive</a>

		<h4>Settings</h4>
		<a href="#">Accessibility</a>
		<a href="#">Theme</a>
		<a href="#">Admin</a>
	</nav>

	<a href="#" id="sidenav-close" title="Close Menu" aria-label="Close Menu"></a>
</aside>

<main>
	<header>
		<a
			href="#sidenav-open"
			id="sidenav-button"
			class="hamburger"
			title="Open Menu"
			aria-label="Open Menu"
			bind:this={sidenavRef}
		>
			<svg
				viewBox="0 0 50 40"
				role="presentation"
				focusable="false"
				aria-label="trigram for heaven symbol"
			>
				<line x1="0" x2="100%" y1="10%" y2="10%" />
				<line x1="0" x2="100%" y1="50%" y2="50%" />
				<line x1="0" x2="100%" y1="90%" y2="90%" />
			</svg>
		</a>
		<h1>Site Title</h1>
	</header>

	<article>
		<h2>Totam Header</h2>
		<p>
			Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cum consectetur, necessitatibus
			velit officia ut impedit veritatis temporibus soluta? Totam odit cupiditate facilis nisi sunt
			hic necessitatibus voluptatem nihil doloribus! Enim.
		</p>
		<p>
			Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fugit rerum, amet odio explicabo
			voluptas eos cum libero, ex esse quasi optio incidunt soluta eligendi labore error corrupti!
			Dolore, cupiditate porro.
		</p>

		<h3>Subhead Totam Odit</h3>
		<p>
			Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fugit rerum, amet odio explicabo
			voluptas eos cum libero, ex esse quasi optio incidunt soluta eligendi labore error corrupti!
			Dolore, cupiditate porro.
		</p>
		<p>
			Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fugit rerum, amet odio explicabo
			voluptas eos cum libero, ex esse quasi optio incidunt soluta eligendi labore error corrupti!
			Dolore, cupiditate porro.
		</p>

		<h3>Subhead</h3>
		<p>
			Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fugit rerum, amet odio explicabo
			voluptas eos cum libero, ex esse quasi optio incidunt soluta eligendi labore error corrupti!
			Dolore, cupiditate porro.
		</p>
		<p>
			Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fugit rerum, amet odio explicabo
			voluptas eos cum libero, ex esse quasi optio incidunt soluta eligendi labore error corrupti!
			Dolore, cupiditate porro.
		</p>
	</article>
</main>

<style>
	:global(body) {
		display: grid;
		grid: [stack] 1fr / min-content [stack] 1fr;

		@media (max-width: 540px) {
			& > :matches(aside, main) {
				grid-area: stack;
			}
		}
	}

	#sidenav-open {
		display: grid;
		grid-template-columns: [nav] 2fr [escape] 1fr;
	}

	#sidenav-open {
		--easeOutExpo: cubic-bezier(0.16, 1, 0.3, 1);
		--duration: 0.6s;

		display: grid;
		grid-template-columns: [nav] 2fr [escape] 1fr;

		@media (max-width: 540px) {
			position: sticky;
			top: 0;
			max-height: 100vh;
			overflow: hidden auto;
			overscroll-behavior: contain;
			visibility: hidden; /* not keyboard accessible when closed */
			transform: translateX(-110vw);
			will-change: transform;
			transition:
				transform var(--duration) var(--easeOutExpo),
				visibility 0s linear var(--duration);

			@media (prefers-reduced-motion: reduce) {
				--duration: 1ms;
			}

			&:target {
				visibility: visible;
				transform: translateX(0);
				transition: transform var(--duration) var(--easeOutExpo);
			}

			&:target {
				visibility: visible;
			}
		}
	}

	/* https://youtu.be/uiZqDLqjGRY?t=187 */
	/* https://youtu.be/oHcTn83M1ls */
</style>
