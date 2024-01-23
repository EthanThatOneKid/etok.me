<script lang="ts">
	import Sidenav from '$lib/components/sidenav/sidenav.svelte';
</script>

<Sidenav
	data={{
		title: 'Hello world!',
		categories: [
			{
				title: 'My',
				links: [
					{ content: 'Dashboard', href: '#' },
					{ content: 'Profile', href: '#' },
					{ content: 'Preferences', href: '#' },
					{ content: 'Archive', href: '#' }
				]
			},
			{
				title: 'Settings',
				links: [
					{ content: 'Accessibility', href: '#' },
					{ content: 'Theme', href: '#' },
					{ content: 'Admin', href: '#' }
				]
			}
		]
	}}
>
	<slot />
</Sidenav>
