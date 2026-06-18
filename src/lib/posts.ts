const files = import.meta.glob('../posts/*.txt', {
	eager: true,
	query: '?raw',
	import: 'default',
}) as Record<string, string>;

export type Post = {
	slug: string;
	title: string;
	body: string;
};

function parsePost(slug: string, raw: string): Post {
	const trimmed = raw.trim();
	const newline = trimmed.indexOf('\n');
	if (newline === -1) {
		return { slug, title: trimmed, body: '' };
	}
	return {
		slug,
		title: trimmed.slice(0, newline).trim(),
		body: trimmed.slice(newline + 1).trim(),
	};
}

export function getPosts(): Post[] {
	return Object.entries(files)
		.map(([path, raw]) => {
			const slug = path.match(/\/([^/]+)\.txt$/)?.[1] ?? '';
			return parsePost(slug, raw);
		})
		.sort((a, b) => b.slug.localeCompare(a.slug));
}

export function getPost(slug: string): Post | undefined {
	return getPosts().find((post) => post.slug === slug);
}
