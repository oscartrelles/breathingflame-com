"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sitemap = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
// Ensure Admin is initialized once
if (!admin.apps.length) {
    admin.initializeApp();
}
function xmlEscape(s) {
    return s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}
exports.sitemap = functions.https.onRequest(async (_req, res) => {
    var _a, _b;
    try {
        const db = admin.firestore();
        const configuredBase = (_b = (_a = functions.config()) === null || _a === void 0 ? void 0 : _a.app) === null || _b === void 0 ? void 0 : _b.sitemap_base_url;
        const BASE = configuredBase || process.env.SITEMAP_BASE_URL || 'https://breathingflame.com';
        // Static routes
        const staticRoutes = [
            '/',
            '/individuals',
            '/organizations',
            '/programs',
            '/events',
            '/testimonials',
            '/about',
            '/contact'
        ].map((p) => ({ loc: `${BASE}${p}`, changefreq: 'monthly', priority: 0.8 }));
        // Programs
        const proSnap = await db.collection('programs').get();
        const programs = proSnap.docs.map((d) => {
            const slug = d.get('slug');
            return {
                loc: `${BASE}/programs/${encodeURIComponent(slug)}`,
                changefreq: 'weekly',
                priority: 0.7
            };
        });
        // Experiences
        const expSnap = await db.collection('experiences').get();
        const experiences = expSnap.docs.map((d) => {
            const slug = d.get('slug');
            return {
                loc: `${BASE}/experiences/${encodeURIComponent(slug)}`,
                changefreq: 'weekly',
                priority: 0.7
            };
        });
        // Posts
        const postSnap = await db
            .collection('posts')
            .orderBy('publishedAt', 'desc')
            .limit(5000)
            .get();
        const posts = postSnap.docs.map((d) => {
            const slug = d.get('slug');
            const publishedAt = d.get('publishedAt');
            const lastmod = (publishedAt === null || publishedAt === void 0 ? void 0 : publishedAt.toDate)
                ? publishedAt.toDate().toISOString()
                : new Date().toISOString();
            return {
                loc: `${BASE}/resources/${encodeURIComponent(slug)}`,
                changefreq: 'weekly',
                priority: 0.6,
                lastmod
            };
        });
        // Home at higher priority
        const home = [
            { loc: `${BASE}/`, changefreq: 'weekly', priority: 0.9 }
        ];
        const urls = [
            ...home,
            ...staticRoutes.filter((r) => r.loc !== `${BASE}/`),
            ...programs,
            ...experiences,
            ...posts
        ];
        const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
            .map((u) => `  <url>
    <loc>${xmlEscape(u.loc)}</loc>
    ${'lastmod' in u && u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : `<lastmod>${new Date().toISOString()}</lastmod>`}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority.toFixed(1)}</priority>
  </url>`)
            .join('\n')}
</urlset>`;
        res.set('Content-Type', 'application/xml; charset=utf-8');
        res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
        res.status(200).send(body);
    }
    catch (e) {
        console.error(e);
        res.status(500).send('<!-- sitemap error -->');
    }
});
//# sourceMappingURL=sitemap.js.map