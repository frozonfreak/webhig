/** Shared documentation site URLs and sitemap entries (no side effects). */
export const SITE = {
  origin: 'https://frozonfreak.github.io/webhig',
  github: 'https://github.com/frozonfreak/webhig',
  title: 'The Web HIG — Pin how the web behaves',
};

/** HTML pages linked from docs/index.html (excluding index and generated 404). */
export const PUBLIC_DOC_PAGES = ['understand.html', 'adopt.html', 'ai.html', 'reference.html'];

/** Sitemap entries: path is relative to site root (`/` = home). */
export const SITEMAP_PATHS = [
  { path: '/', priority: '1.0' },
  { path: '/understand.html', priority: '0.9' },
  { path: '/adopt.html', priority: '0.9' },
  { path: '/ai.html', priority: '0.8' },
  { path: '/reference.html', priority: '0.8' },
];

export function renderSitemapXml(origin = SITE.origin) {
  const urls = SITEMAP_PATHS.map(({ path, priority }) => {
    const loc = path === '/' ? `${origin}/` : `${origin}${path}`;
    return [
      '  <url>',
      `    <loc>${loc}</loc>`,
      '    <changefreq>weekly</changefreq>',
      `    <priority>${priority}</priority>`,
      '  </url>',
    ].join('\n');
  });
  return ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">', ...urls, '</urlset>', ''].join('\n');
}
