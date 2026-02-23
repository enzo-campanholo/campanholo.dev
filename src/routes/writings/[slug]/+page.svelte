<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const dateFormatter = new Intl.DateTimeFormat('en-US', {
		month: 'long',
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
	<title>{data.metadata.title} | Writings</title>
	<meta name="description" content={data.metadata.deck} />
</svelte:head>

<main class="writing-shell">
	<article class="writing-article">
		<header class="writing-header">
			<p class="writing-date">{formatDate(data.metadata.date)}</p>
			<h1 class="writing-title">{data.metadata.title}</h1>
			<p class="writing-deck">{data.metadata.deck}</p>
		</header>

		<div class="writing-body prose prose-neutral">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html data.bodyHtml}
		</div>
	</article>
</main>
