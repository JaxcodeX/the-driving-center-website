import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/school-admin/', '/dashboard/', '/auth/'],
    },
    sitemap: 'https://thedrivingcentersaas.com/sitemap.xml',
  }
}
