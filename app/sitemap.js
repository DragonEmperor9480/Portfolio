/**
 * Next.js Metadata API — auto-generates /sitemap.xml at build time.
 * https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 *
 * When you add blog posts later, add each post URL to the `routes` array
 * or fetch them dynamically from your CMS/MDX files.
 */
export default function sitemap() {
  const baseUrl = 'https://amrut.amrutlabs.in';

  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/amrutlab`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    // When you add blog posts, add them here like:
    // {
    //   url: `${baseUrl}/blog/my-first-post`,
    //   lastModified: new Date('2024-01-01'),
    //   changeFrequency: 'weekly',
    //   priority: 0.8,
    // },
  ];

  return routes;
}
