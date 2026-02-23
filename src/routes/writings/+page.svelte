<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const dateFormatter = new Intl.DateTimeFormat('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
		timeZone: 'UTC'
	});

	function formatDate(date: string): string {
		const [year, month, day] = date.split('-').map(Number);
		return dateFormatter.format(new Date(Date.UTC(year, month - 1, day)));
	}
</script>

<svelte:head>
	<title>Writings | Enzo Campanholo</title>
	<meta name="description" content="Short writings by Enzo Campanholo." />
</svelte:head>

<main class="writings-shell">
	<header class="writings-header">
		<h1 class="writings-title">{data.heading}</h1>
	</header>

	{#if data.items.length === 0}
		<p class="writings-empty">No writings published yet.</p>
	{:else}
		<ul class="writings-list" aria-label="Writings list">
			{#each data.items as item (item.slug)}
				<li class="writings-item">
					<a href={resolve(`/writings/${item.slug}`)} class="writings-link">
						<h2 class="writings-item-title">{item.title}</h2>
						<p class="writings-item-meta">{formatDate(item.date)}</p>
						<p class="writings-item-deck">{item.deck}</p>
					</a>
				</li>
			{/each}
		</ul>
	{/if}
</main>
