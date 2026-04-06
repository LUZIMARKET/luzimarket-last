import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // Supported locales
  locales: ['es', 'en'],

  // Default locale (Spanish for northern Mexico focus)
  defaultLocale: 'es',

  // Locale prefix configuration
  localePrefix: 'always', // Always show locale in URL

  // Define localized pathnames
  pathnames: {
    '/': '/',
    '/products': '/products',
    '/products/[slug]': '/products/[slug]',
    '/category/[slug]': '/category/[slug]',
    '/category/[slug]/[vendor]': '/category/[slug]/[vendor]',
    '/cart': '/cart',
    '/checkout': '/checkout',
    '/vendor-register': {
      es: '/vendedor/registro',
      en: '/vendor/register'
    },
    '/vendor-register/success': {
      es: '/vendedor/registro/exito',
      en: '/vendor/register/success'
    },
    '/vendor/dashboard': {
      es: '/vendedor/panel',
      en: '/vendor/dashboard'
    },
    '/vendor/products': {
      es: '/vendedor/productos',
      en: '/vendor/products'
    },
    '/vendor/products/[id]': {
      es: '/vendedor/productos/[id]',
      en: '/vendor/products/[id]'
    },
    '/vendor/products/new': {
      es: '/vendedor/productos/nuevo',
      en: '/vendor/products/new'
    },
    '/vendor/orders': {
      es: '/vendedor/ordenes',
      en: '/vendor/orders'
    },
    '/vendor/orders/[id]': {
      es: '/vendedor/ordenes/[id]',
      en: '/vendor/orders/[id]'
    },
    '/vendor/analytics': {
      es: '/vendedor/analiticas',
      en: '/vendor/analytics'
    },
    '/vendor/financials': {
      es: '/vendedor/finanzas',
      en: '/vendor/financials'
    },
    '/vendor/settings': {
      es: '/vendedor/configuracion',
      en: '/vendor/settings'
    },
    '/vendor/settings/shipping': {
      es: '/vendedor/configuracion/envio',
      en: '/vendor/settings/shipping'
    },
    '/vendor/settings/store': {
      es: '/vendedor/configuracion/tienda',
      en: '/vendor/settings/store'
    },
    '/vendor/settings/notifications': {
      es: '/vendedor/configuracion/notificaciones',
      en: '/vendor/settings/notifications'
    },
    '/vendor/settings/security': {
      es: '/vendedor/configuracion/seguridad',
      en: '/vendor/settings/security'
    },
    '/vendor/settings/payments': {
      es: '/vendedor/configuracion/pagos',
      en: '/vendor/settings/payments'
    },
    '/vendor/stripe-onboarding': {
      es: '/vendedor/pagos',
      en: '/vendor/stripe-onboarding'
    },
    '/admin': '/admin', // Keep admin routes in English
    '/admin/orders': '/admin/orders',
    '/admin/orders/[id]': '/admin/orders/[id]',
    '/admin/vendors': '/admin/vendors',
    '/admin/vendors/[id]': '/admin/vendors/[id]',
    '/admin/vendors/[id]/transactions': '/admin/vendors/[id]/transactions',
    '/admin/products': '/admin/products',
    '/admin/moderation/images': '/admin/moderation/images',
    '/admin/users': '/admin/users',
    '/admin/financials': '/admin/financials',
    '/admin/categories': '/admin/categories',
    '/admin/locked-accounts': '/admin/locked-accounts',
    '/admin/email-templates': '/admin/email-templates',
    '/admin/settings': '/admin/settings',
    '/coming-soon': {
      es: '/proximamente',
      en: '/coming-soon'
    },
    '/brands': '/brands',
    '/brands/[slug]': '/brands/[slug]',
    '/best-sellers': '/best-sellers',
    '/handpicked': '/handpicked',
    '/search': '/search',
    '/categories': '/categories',
    '/occasions': '/occasions',
    '/occasions/[id]': '/occasions/[id]',
    '/editorial': '/editorial',
    '/editorial/[id]': '/editorial/[id]',
    '/wishlist': '/wishlist',
    '/login': '/login',
    '/register': '/register',
    '/register/success': '/register/success',
    '/register/customer': '/register/customer',
    '/forgot-password': '/forgot-password',
    '/reset-password': '/reset-password',
    '/resend-verification': '/resend-verification',
    '/orders/lookup': '/orders/lookup',
    '/orders': '/orders',
    '/orders/[id]': '/orders/[id]',
    '/orders/[orderNumber]': '/orders/[orderNumber]',
    '/account': {
      es: '/account',
      en: '/account'
    },
    '/account/security': {
      es: '/account/security',
      en: '/account/security'
    },
    '/about': '/about',
    '/contact': '/contact',
    '/terms': '/terms',
    '/privacy': '/privacy',
    '/newsletter': '/newsletter',
    '/careers': '/careers',
    '/sitemap': '/sitemap',
    '/cookies': '/cookies',
    '/accessibility': '/accessibility'
  }
});