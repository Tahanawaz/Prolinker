/**
 * Business details shown across the site.
 * TODO(before launch): replace the placeholder contact details and social links
 * with ProLinker's real ones.
 */
export const siteConfig = {
  name: 'ProLinker',
  url: 'https://prolinker.pk',
  contact: {
    email: 'support@prolinker.pk',
    phone: '+92 300 0000000',
    phoneHref: 'tel:+923000000000',
    whatsappHref: 'https://wa.me/923000000000',
    hours: 'Mon–Sat, 9:00 AM – 8:00 PM',
    address: 'Lahore, Punjab, Pakistan',
  },
  social: {
    facebook: 'https://facebook.com/',
    instagram: 'https://instagram.com/',
    linkedin: 'https://linkedin.com/',
    youtube: 'https://youtube.com/',
  },
  /**
   * Display-only. The live rate is read from platform settings on the server
   * once the backend is connected; never compute real charges from this.
   */
  commissionRate: 0.1,
  cities: [
    'Lahore',
    'Karachi',
    'Islamabad',
    'Rawalpindi',
    'Faisalabad',
    'Multan',
    'Peshawar',
    'Quetta',
    'Sialkot',
    'Gujranwala',
    'Hyderabad',
  ],
} as const;

export type City = (typeof siteConfig.cities)[number];
