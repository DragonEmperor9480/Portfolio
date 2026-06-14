/**
 * Next.js Metadata API — auto-generates /robots.txt at build time.
 * https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */
export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: 'https://amrut.amrutlabs.in/sitemap.xml',
    host: 'https://amrut.amrutlabs.in',
  };
}
