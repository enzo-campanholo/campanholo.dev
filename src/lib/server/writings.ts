import { error } from '@sveltejs/kit';
import type { Component } from 'svelte';
import { render } from 'svelte/server';

export type WritingsIndexItem = {
	slug: string;
	title: string;
	date: string;
	deck: string;
};

type WritingsMetadata = {
	title: string;
	date: string;
	deck: string;
};

type WritingsModule = {
	default?: unknown;
	metadata: unknown;
};

type WritingsPostModule = {
	default: Component;
	metadata: unknown;
};

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function isStrictIsoDate(value: string): boolean {
	if (!ISO_DATE_RE.test(value)) {
		return false;
	}

	const parsed = new Date(`${value}T00:00:00Z`);
	if (Number.isNaN(parsed.valueOf())) {
		return false;
	}

	return parsed.toISOString().slice(0, 10) === value;
}

function assertMetadata(metadata: unknown, source: string): WritingsMetadata {
	if (!metadata || typeof metadata !== 'object') {
		throw new Error(`Invalid frontmatter in ${source}: metadata must be an object.`);
	}

	const { title, date, deck } = metadata as Record<string, unknown>;

	if (typeof title !== 'string' || title.trim() === '') {
		throw new Error(`Invalid frontmatter in ${source}: "title" is required and must be a string.`);
	}

	if (typeof deck !== 'string' || deck.trim() === '') {
		throw new Error(`Invalid frontmatter in ${source}: "deck" is required and must be a string.`);
	}

	if (typeof date !== 'string' || !isStrictIsoDate(date)) {
		throw new Error(`Invalid frontmatter in ${source}: "date" must be strict ISO YYYY-MM-DD.`);
	}

	return { title, date, deck };
}

function slugFromPath(path: string): string {
	const fileName = path.split('/').pop();
	if (!fileName || !fileName.endsWith('.svx')) {
		throw new Error(`Unexpected writing file path: ${path}`);
	}

	return fileName.slice(0, -4);
}

export async function listWritings(): Promise<WritingsIndexItem[]> {
	const modules = import.meta.glob('/content/writings/*.svx') as Record<
		string,
		() => Promise<WritingsModule>
	>;

	const items = await Promise.all(
		Object.entries(modules).map(async ([path, loadModule]) => {
			const mod = await loadModule();
			const metadata = assertMetadata(mod.metadata, path);

			return {
				slug: slugFromPath(path),
				title: metadata.title,
				date: metadata.date,
				deck: metadata.deck
			};
		})
	);

	return items.sort((a, b) => b.date.localeCompare(a.date));
}

export async function loadWritingBySlug(slug: string): Promise<{
	metadata: WritingsMetadata;
	bodyHtml: string;
}> {
	const modules = import.meta.glob('/content/writings/*.svx') as Record<
		string,
		() => Promise<WritingsPostModule>
	>;
	const key = `/content/writings/${slug}.svx`;
	const loadModule = modules[key];
	if (!loadModule) {
		throw error(404, 'Writing not found');
	}

	const mod = await loadModule();
	const metadata = assertMetadata(mod.metadata, key);
	const { body } = await render(mod.default);

	return { metadata, bodyHtml: body };
}
