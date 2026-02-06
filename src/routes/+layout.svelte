<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Enzo Campanholo</title>
	<meta name="description" content="Enzo Campanholo — personal site." />
</svelte:head>
{@render children()}
