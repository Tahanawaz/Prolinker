import type { SiteContent } from './types';

export const en: SiteContent = {
  common: {
    skipToContent: 'Skip to content',
    learnMore: 'Learn more',
    viewAll: 'View all services',
    getStarted: 'Get started',
    bookService: 'Book a service',
    joinAsWorker: 'Join as a worker',
    perVisit: 'per visit',
    sampleNotice:
      'Sample stories for preview. Real customer reviews will appear here after launch.',
  },

  nav: {
    services: 'Services',
    servicesMenuTitle: 'Every home job, one trusted platform',
    servicesMenuDescription: 'Verified professionals across 8 trades',
    servicesMenuCta: 'Explore all services',
    servicesMenuPromoTitle: 'TEVTA-certified pros',
    servicesMenuPromoBody:
      'Look for the badge: government-recognised skills, verified by ProLinker.',
    links: [
      { label: 'For Workers', to: '/for-workers' },
      { label: 'TEVTA Partnership', to: '/tevta' },
      { label: 'About', to: '/about' },
      { label: 'FAQ', to: '/faq' },
      { label: 'Contact', to: '/contact' },
    ],
    login: 'Log in',
    signup: 'Get started',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    switchLanguage: 'اردو میں دیکھیں',
  },

  footer: {
    ctaEyebrow: 'Ready when you are',
    ctaTitle: 'Get your home job done by someone you can trust.',
    ctaBody:
      'Book a verified professional in minutes, or join ProLinker and grow your income with fair, transparent pay.',
    blurb:
      'ProLinker connects households and businesses across Pakistan with verified, skilled workers, with fair pay for every job.',
    columns: [
      {
        title: 'Services',
        links: [
          { label: 'Plumbing', to: '/services#plumber' },
          { label: 'Electrical', to: '/services#electrician' },
          { label: 'Carpentry', to: '/services#carpenter' },
          { label: 'Painting', to: '/services#painter' },
          { label: 'AC Repair & Service', to: '/services#ac-technician' },
          { label: 'Cleaning', to: '/services#cleaner' },
        ],
      },
      {
        title: 'For Workers',
        links: [
          { label: 'Join ProLinker', to: '/for-workers' },
          { label: 'Earnings & fees', to: '/for-workers#earnings' },
          { label: 'Bonus program', to: '/for-workers#bonus' },
          { label: 'Emergency Fund', to: '/for-workers#emergency-fund' },
          { label: 'TEVTA certification', to: '/tevta' },
        ],
      },
      {
        title: 'Company',
        links: [
          { label: 'About us', to: '/about' },
          { label: 'TEVTA Partnership', to: '/tevta' },
          { label: 'FAQ', to: '/faq' },
          { label: 'Contact', to: '/contact' },
        ],
      },
    ],
    contactTitle: 'Get in touch',
    hoursLabel: 'Support hours',
    followUs: 'Follow ProLinker',
    rights: 'All rights reserved.',
    madeIn: 'Built in Pakistan, for Pakistan.',
    legal: [
      { label: 'Privacy Policy', to: '/privacy' },
      { label: 'Terms of Service', to: '/terms' },
    ],
  },

  categories: {
    plumber: {
      name: 'Plumber',
      short: 'Leaks, fittings, geysers, tanks',
      description:
        'From a dripping tap to a full bathroom fitting, get a skilled plumber who arrives with the right tools.',
      includes: [
        'Leak detection & repair',
        'Tap, mixer & sanitary fitting',
        'Geyser installation & repair',
        'Water tank & motor work',
        'Drain & sewerage unblocking',
      ],
    },
    electrician: {
      name: 'Electrician',
      short: 'Wiring, DBs, fans, UPS',
      description:
        'Safe, code-conscious electrical work for homes and shops: faults found fast and fixed properly.',
      includes: [
        'Fault finding & rewiring',
        'Distribution board & breakers',
        'Fan, light & fixture installation',
        'UPS & inverter setup',
        'Socket & switch replacement',
      ],
    },
    carpenter: {
      name: 'Carpenter',
      short: 'Doors, furniture, cabinets',
      description: 'Repairs, fittings and custom woodwork, finished neatly and built to last.',
      includes: [
        'Door & lock repair',
        'Furniture assembly & repair',
        'Kitchen cabinets & wardrobes',
        'Shelving & wall fittings',
        'Polish & finishing',
      ],
    },
    painter: {
      name: 'Painter',
      short: 'Interior, exterior, touch-ups',
      description:
        'Clean, even finishes with proper surface prep: single rooms, full homes or commercial spaces.',
      includes: [
        'Interior & exterior painting',
        'Wall putty & surface prep',
        'Weather-shield coating',
        'Wood & metal enamel',
        'Touch-ups & repainting',
      ],
    },
    'ac-technician': {
      name: 'AC Technician',
      short: 'Service, gas, installation',
      description:
        'Beat the heat with reliable AC servicing, gas refills, repairs and installations for all major brands.',
      includes: [
        'General & deep servicing',
        'Gas charging & leak repair',
        'Installation & shifting',
        'Inverter AC diagnostics',
        'PCB & compressor repair',
      ],
    },
    cleaner: {
      name: 'Cleaner',
      short: 'Homes, offices, deep cleans',
      description:
        'Thorough, trustworthy cleaning for homes and workplaces: regular visits or one-off deep cleans.',
      includes: [
        'Full home deep cleaning',
        'Kitchen & bathroom cleaning',
        'Sofa & carpet cleaning',
        'Water tank cleaning',
        'Post-construction cleaning',
      ],
    },
    mason: {
      name: 'Mason',
      short: 'Brickwork, tiles, plaster',
      description:
        'Experienced masons for construction, renovation and repair: solid work, clean finish.',
      includes: [
        'Brick & block work',
        'Plaster & repair',
        'Floor & wall tiling',
        'Boundary walls',
        'Renovation & extensions',
      ],
    },
    labourer: {
      name: 'Labourer',
      short: 'Shifting, loading, site help',
      description:
        'Dependable helping hands for shifting, loading, site support and any job that needs extra muscle.',
      includes: [
        'House & office shifting',
        'Loading & unloading',
        'Construction site help',
        'Debris removal',
        'Event setup support',
      ],
    },
  },

  home: {
    hero: {
      badge: 'CNIC-verified · TEVTA-certified professionals',
      titleStart: 'Skilled hands for',
      titleHighlight: 'every home job,',
      titleEnd: 'one tap away.',
      subtitle:
        'Book trusted plumbers, electricians, carpenters, painters, AC technicians and more: verified, rated, and paid fairly.',
      serviceLabel: 'Service',
      servicePlaceholder: 'What do you need?',
      cityLabel: 'City',
      cityPlaceholder: 'Select your city',
      searchCta: 'Find workers',
      popular: 'Popular:',
      citiesLabel: 'Launching across Pakistan',
    },
    mockup: {
      workerName: 'Muhammad Bilal',
      workerRole: 'Plumber · 7 yrs experience',
      jobs: '120+ jobs',
      verified: 'CNIC verified',
      tevta: 'TEVTA certified',
      hire: 'Book now',
      bookingTitle: 'Booking confirmed',
      bookingBody: 'Today, 4:30 PM · Gulberg',
      earningsTitle: 'Worker keeps 90%',
      earningsBody: 'Flat 10% platform fee',
    },
    stats: [
      { value: '8', label: 'Trades covered' },
      { value: '100%', label: 'CNIC-verified workers' },
      { value: '10%', label: 'Flat platform fee' },
      { value: '2', label: 'Languages: English & اردو' },
    ],
    categories: {
      eyebrow: 'Services',
      title: 'Whatever needs fixing, we have a pro for it',
      description:
        'Eight core trades, each delivered by professionals we have personally verified.',
    },
    howItWorks: {
      eyebrow: 'How it works',
      title: 'Simple for customers. Fair for workers.',
      description: 'A clear, guided journey from request to payment, on both sides.',
      tabs: {
        customers: {
          label: 'For customers',
          steps: [
            {
              title: 'Tell us the job',
              body: 'Pick a service, describe the problem and choose a time that suits you.',
            },
            {
              title: 'Choose your pro',
              body: 'Compare verified workers by rating, experience, price and TEVTA badge.',
            },
            {
              title: 'Track & chat',
              body: 'Follow every status update and chat with your worker in the app.',
            },
            {
              title: 'Pay & review',
              body: 'Pay by cash, JazzCash, Easypaisa or card, then rate the job.',
            },
          ],
        },
        workers: {
          label: 'For workers',
          steps: [
            {
              title: 'Create your profile',
              body: 'Add your skills, service area, rates and CNIC in a few minutes.',
            },
            {
              title: 'Get verified',
              body: 'Our team reviews your documents. Upload a TEVTA certificate for the badge.',
            },
            {
              title: 'Accept jobs',
              body: 'Receive nearby requests, accept the ones you want and manage your schedule.',
            },
            {
              title: 'Earn & grow',
              body: 'Keep 90% of every job, unlock bonuses and build your rating.',
            },
          ],
        },
      },
    },
    features: {
      eyebrow: 'Why ProLinker',
      title: 'Built on trust, from the first tap to the final payment',
      description:
        'Every part of ProLinker is designed to make hiring safer for customers and work fairer for workers.',
      items: [
        {
          title: 'Verified identities',
          body: 'Every worker is CNIC-checked and manually approved by our team before taking a job.',
        },
        {
          title: 'TEVTA-certified skills',
          body: 'Workers with government-recognised training carry a TEVTA badge and rank higher in search.',
        },
        {
          title: 'Transparent pricing',
          body: 'One flat 10% platform fee. No hidden charges for customers, no surprises for workers.',
        },
        {
          title: 'Flexible payments',
          body: 'Pay the way you prefer: cash, JazzCash, Easypaisa or card.',
        },
        {
          title: 'Real reviews',
          body: 'Only customers with a completed booking can leave a review, so every rating counts.',
        },
        {
          title: 'Support that listens',
          body: 'Raise a complaint on any booking and our team will step in to resolve it.',
        },
      ],
    },
    workers: {
      eyebrow: 'For workers',
      title: 'Your skill deserves fair pay and real security',
      description:
        'ProLinker is built for the people doing the work. Keep the majority of what you earn, and get support when life gets hard.',
      bullets: [
        {
          title: 'Keep 90% of every job',
          body: 'A flat 10% platform fee, shown clearly before you accept.',
        },
        {
          title: 'Monthly & yearly bonuses',
          body: 'Hit job and rating targets to unlock cash rewards.',
        },
        {
          title: 'Worker Emergency Fund',
          body: 'Part of every commission builds a fund that supports workers in emergencies.',
        },
      ],
    },
    tevta: {
      eyebrow: 'TEVTA Partnership',
      title: 'Certified skills, recognised and rewarded',
      description:
        'In partnership with TEVTA, we highlight workers whose training is government-recognised, and give them the visibility they have earned.',
      points: [
        'Verified TEVTA badge on worker profiles',
        'Priority placement in customer search',
        'Greater trust, more bookings, better rates',
      ],
      badgeTitle: 'TEVTA Verified',
      badgeBody: 'Certificate checked by ProLinker',
    },
    testimonials: {
      eyebrow: 'Stories',
      title: 'Loved by households, valued by workers',
      description: 'A platform that works for both sides of the job.',
      items: [
        {
          quote:
            'Our geyser stopped working on a winter night. I booked a TEVTA-certified plumber and he was here within the hour. Honest price, neat work.',
          name: 'Ayesha K.',
          role: 'Customer',
          city: 'Lahore',
        },
        {
          quote:
            'Before, I waited at the chowk for work. Now jobs come to my phone, I keep 90% and I know exactly what I earn every month.',
          name: 'Muhammad Bilal',
          role: 'Electrician',
          city: 'Rawalpindi',
        },
        {
          quote:
            'We manage three offices. ProLinker gives us verified people, clear invoices and one place to track every job.',
          name: 'Hamza R.',
          role: 'Facility manager',
          city: 'Karachi',
        },
      ],
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Questions, answered',
      description: 'Everything you need to know before your first booking.',
      items: [
        {
          q: 'How do you verify workers?',
          a: 'Every worker submits their CNIC, skills and service area. Our team reviews each profile manually before approval. Workers with TEVTA certificates get an extra verified badge.',
        },
        {
          q: 'How much does ProLinker charge?',
          a: 'ProLinker charges a flat 10% platform fee on completed jobs. The worker keeps 90%. The fee is calculated automatically, so there are no hidden extras.',
        },
        {
          q: 'Which payment methods can I use?',
          a: 'You can pay by cash, JazzCash, Easypaisa or card, whichever is most convenient for you.',
        },
        {
          q: 'What if I am not happy with the work?',
          a: 'You can raise a complaint on the booking and our support team will review it and work with you and the worker to resolve it.',
        },
        {
          q: 'Is ProLinker available in Urdu?',
          a: 'Yes. The whole platform works in both English and Urdu. Switch anytime from the top menu.',
        },
      ],
    },
  },

  calculator: {
    title: 'Earnings calculator',
    description: 'See exactly what you take home from a job.',
    amountLabel: 'Job amount',
    jobAmount: 'Customer pays',
    platformFee: 'ProLinker fee (10%)',
    youEarn: 'You earn',
    note: 'Illustrative. The platform fee is set by ProLinker and always shown before you accept a job.',
  },

  services: {
    hero: {
      eyebrow: 'Our services',
      title: 'Professional help for every corner of your home',
      description:
        'Eight trades, one standard: verified professionals, upfront pricing and support if anything goes wrong.',
    },
    includesTitle: 'Popular jobs',
    bookCta: 'Book',
    guarantee: {
      eyebrow: 'The ProLinker standard',
      title: 'What you can expect on every booking',
      description: 'No matter the job, these promises stay the same.',
      items: [
        { title: 'Verified professional', body: 'CNIC-checked and approved by our team.' },
        { title: 'Price agreed upfront', body: 'Know the quote before work begins.' },
        { title: 'Live status updates', body: 'From accepted to completed, always in the loop.' },
        { title: 'Support on your side', body: 'Raise a complaint and we step in.' },
      ],
    },
  },

  workers: {
    hero: {
      eyebrow: 'For workers',
      title: 'More jobs. Fair pay. Real support.',
      description:
        'Join ProLinker to get steady work near you, keep 90% of every job, and build a reputation that grows your income.',
    },
    benefits: {
      eyebrow: 'Why join',
      title: 'Built for the people who do the work',
      description:
        'We only succeed when you do. That is why the platform is designed around fair earnings.',
      items: [
        {
          title: 'Steady work nearby',
          body: 'Get job requests in your own service area. No more waiting at the chowk.',
        },
        {
          title: 'Transparent earnings',
          body: 'A flat 10% fee. See your gross, fee and net for every job in your dashboard.',
        },
        {
          title: 'You are in control',
          body: 'Accept the jobs you want, set your availability and choose your rates.',
        },
        {
          title: 'Reputation that pays',
          body: 'Great ratings and a TEVTA badge move you up in search results.',
        },
        {
          title: 'Bonuses that reward effort',
          body: 'Hit monthly and yearly targets to earn cash bonuses.',
        },
        {
          title: 'A safety net',
          body: 'The Worker Emergency Fund supports you when life gets hard.',
        },
      ],
    },
    bonus: {
      eyebrow: 'Bonus program',
      title: 'Do great work, earn extra',
      description:
        'Bonus rules are set by ProLinker and reviewed regularly. Current example tiers:',
      tiers: [
        { name: 'Monthly Performer', requirement: '10+ jobs · 4.0★ average', reward: 'PKR 1,500' },
        { name: 'Monthly Star', requirement: '20+ jobs · 4.5★ average', reward: 'PKR 3,000' },
        { name: 'Yearly Champion', requirement: '200+ jobs · 4.5★ average', reward: 'PKR 25,000' },
      ],
      note: 'Tiers and amounts may change. Your live progress is always visible in your worker dashboard.',
    },
    fund: {
      eyebrow: 'Worker Emergency Fund',
      title: 'Support when you need it most',
      description:
        'A share of every platform fee goes into a dedicated fund for ProLinker workers facing medical, family or other emergencies.',
      points: [
        'Funded automatically from platform commission',
        'Request support directly from your dashboard',
        'Every request reviewed fairly by our team',
        'Track the status of your request at any time',
      ],
    },
    requirements: {
      eyebrow: 'What you need',
      title: 'Requirements to join',
      description: 'Getting started is simple.',
      items: [
        'A valid Pakistani CNIC',
        'A smartphone with an active number',
        'Proven skill in at least one trade',
        'TEVTA certificate (optional, earns a badge)',
      ],
    },
    steps: {
      eyebrow: 'Get started',
      title: 'From sign-up to first job',
      description: 'Most workers finish their profile in under 10 minutes.',
      items: [
        { title: 'Sign up', body: 'Create your account and choose “Worker”.' },
        {
          title: 'Complete your profile',
          body: 'Add skills, categories, area, rates and your CNIC.',
        },
        { title: 'Get approved', body: 'Our team verifies your details, usually within 48 hours.' },
        { title: 'Start earning', body: 'Go available and start accepting jobs near you.' },
      ],
    },
  },

  tevta: {
    hero: {
      eyebrow: 'TEVTA Partnership',
      title: 'Where certified skill meets real opportunity',
      description:
        'ProLinker works with TEVTA to recognise trained, certified workers and connect them with customers who value quality.',
    },
    about: {
      eyebrow: 'The partnership',
      title: 'Recognising training that matters',
      description: '',
      paragraphs: [
        'TEVTA (Technical Education & Vocational Training Authority) trains thousands of skilled tradespeople across Punjab every year. Their certification represents real, practical training.',
        'Through our partnership, workers can upload their TEVTA certificate to ProLinker. Once our team verifies it, the worker’s profile displays a TEVTA Verified badge and receives priority placement in search.',
      ],
    },
    forWorkers: {
      title: 'For certified workers',
      items: [
        'Stand out with a verified TEVTA badge',
        'Appear higher in customer search results',
        'Win more bookings and command better rates',
        'Turn your training into steady income',
      ],
    },
    forCustomers: {
      title: 'For customers',
      items: [
        'Hire professionals with recognised training',
        'Filter search results by TEVTA-certified workers',
        'More confidence for complex or technical jobs',
        'The same verified, reviewed ProLinker experience',
      ],
    },
    steps: {
      eyebrow: 'Get the badge',
      title: 'How to become TEVTA Verified',
      description: 'Already certified? It takes just a few minutes.',
      items: [
        { title: 'Join as a worker', body: 'Create your ProLinker worker profile.' },
        {
          title: 'Upload your certificate',
          body: 'Add a clear photo or PDF of your TEVTA certificate.',
        },
        { title: 'We verify it', body: 'Our team checks your certificate details.' },
        {
          title: 'Badge goes live',
          body: 'Your profile shows TEVTA Verified with priority ranking.',
        },
      ],
    },
  },

  about: {
    hero: {
      eyebrow: 'About ProLinker',
      title: 'Making skilled work trusted, visible and fairly paid',
      description:
        'We are building the platform Pakistan’s households and skilled workers deserve: safe, simple and fair for everyone.',
    },
    story: {
      eyebrow: 'Our story',
      title: 'It started with a simple problem',
      description: '',
      paragraphs: [
        'Finding a reliable plumber or electrician in Pakistan usually means asking around, hoping for the best and negotiating without any idea of a fair price. For skilled workers, it means waiting at the chowk with no guarantee of work and no safety net.',
        'ProLinker was created to fix both sides at once. Customers get verified, reviewed professionals and transparent pricing. Workers get steady jobs, keep 90% of what they earn, and gain access to bonuses and an emergency fund built from the platform itself.',
      ],
    },
    mission: {
      title: 'Our mission',
      body: 'To connect every household in Pakistan with trusted skilled workers, while giving those workers fair pay, dignity and security.',
    },
    vision: {
      title: 'Our vision',
      body: 'A Pakistan where skilled work is recognised, every worker has a reliable income, and every home job is done right the first time.',
    },
    values: {
      eyebrow: 'Our values',
      title: 'What we stand for',
      description: 'The principles behind every decision we make.',
      items: [
        {
          title: 'Trust first',
          body: 'Verification, reviews and support make every interaction safer.',
        },
        {
          title: 'Fairness',
          body: 'Transparent fees and fair earnings for the people doing the work.',
        },
        {
          title: 'Dignity of labour',
          body: 'Every skill deserves respect, recognition and opportunity.',
        },
        {
          title: 'Built for Pakistan',
          body: 'Urdu and English, local payments, and a design for real local needs.',
        },
      ],
    },
    commitments: {
      eyebrow: 'Our commitments',
      title: 'Promises we build into the platform',
      description: '',
      items: [
        { value: '90%', label: 'of every job goes to the worker' },
        { value: '100%', label: 'of workers identity-verified' },
        { value: '1', label: 'flat, transparent platform fee' },
        { value: '24h', label: 'target response time for complaints' },
      ],
    },
  },

  faq: {
    hero: {
      eyebrow: 'Help centre',
      title: 'Frequently asked questions',
      description: 'Quick answers about booking, payments, safety and working with ProLinker.',
    },
    groups: [
      {
        title: 'For customers',
        items: [
          {
            q: 'How do I book a worker?',
            a: 'Choose a service, describe the job, pick a time and select a verified worker. You will get updates at every step, from acceptance to completion.',
          },
          {
            q: 'Can I choose a specific worker?',
            a: 'Yes. Browse profiles by rating, experience, price, city and TEVTA certification, then book the one you prefer.',
          },
          {
            q: 'Can I cancel a booking?',
            a: 'You can cancel a booking before the worker starts the job. Cancellation details are shown on the booking page.',
          },
          {
            q: 'Can I chat with the worker?',
            a: 'Yes. Once a booking is created, you can message the worker directly inside ProLinker.',
          },
        ],
      },
      {
        title: 'Payments & pricing',
        items: [
          {
            q: 'What does ProLinker charge?',
            a: 'A flat 10% platform fee on completed jobs, deducted from the job amount. The worker receives 90%.',
          },
          { q: 'Which payment methods are accepted?', a: 'Cash, JazzCash, Easypaisa and card.' },
          {
            q: 'When do I pay?',
            a: 'You pay after the job is completed and the final amount is confirmed.',
          },
        ],
      },
      {
        title: 'For workers',
        items: [
          {
            q: 'How do I join as a worker?',
            a: 'Sign up as a worker, complete your profile with your CNIC, skills and service area, and wait for approval from our team.',
          },
          {
            q: 'How long does verification take?',
            a: 'Most profiles are reviewed within 48 hours.',
          },
          {
            q: 'How do bonuses work?',
            a: 'ProLinker sets monthly and yearly bonus rules based on completed jobs and average rating. Your progress is shown in your dashboard.',
          },
          {
            q: 'What is the Worker Emergency Fund?',
            a: 'A share of platform fees goes into a fund that approved workers can request support from during genuine emergencies. Each request is reviewed by our team.',
          },
        ],
      },
      {
        title: 'Safety & trust',
        items: [
          {
            q: 'How are workers verified?',
            a: 'Every worker submits their CNIC and is manually approved. TEVTA-certified workers have their certificate checked too.',
          },
          {
            q: 'What if something goes wrong?',
            a: 'Raise a complaint on the booking. Our team will review it and work with both sides to resolve it.',
          },
          {
            q: 'Is my personal data safe?',
            a: 'Yes. Sensitive documents like CNIC images are stored privately and are only visible to our verification team.',
          },
        ],
      },
    ],
    stillQuestions: {
      title: 'Still have a question?',
      body: 'Our support team is happy to help in English or Urdu.',
      cta: 'Contact support',
    },
  },

  contact: {
    hero: {
      eyebrow: 'Contact',
      title: 'We’re here to help',
      description:
        'Questions, partnerships or feedback: reach out and our team will get back to you.',
    },
    form: {
      title: 'Send us a message',
      description: 'Fill in the form and it will open in your email app, ready to send.',
      name: 'Full name',
      email: 'Email',
      phone: 'Phone (optional)',
      phoneHint: 'e.g. 0300 1234567',
      topic: 'Topic',
      topics: [
        'General question',
        'Booking support',
        'Joining as a worker',
        'TEVTA partnership',
        'Business enquiry',
      ],
      message: 'Message',
      submit: 'Send message',
      submitHint: 'Opens your email app with your message ready to send.',
      success: 'Your email app should now be open. Just press send!',
      errors: {
        name: 'Please enter your name',
        email: 'Please enter a valid email address',
        phone: 'Please enter a valid Pakistani mobile number',
        message: 'Please write a message (at least 10 characters)',
      },
    },
    channels: {
      title: 'Other ways to reach us',
      email: 'Email',
      phone: 'Phone',
      whatsapp: 'WhatsApp',
      hours: 'Support hours',
      office: 'Office',
    },
  },

  privacy: {
    hero: {
      eyebrow: 'Legal',
      title: 'Privacy Policy',
      description: 'How ProLinker collects, uses and protects your information.',
    },
    updated: 'Last updated: November 2026',
    draftNotice:
      'This policy is a working draft and will be finalised after legal review before launch.',
    sections: [
      {
        title: 'Information we collect',
        body: [
          'Account details such as your name, email, phone number and city.',
          'For workers: CNIC number and documents, skills, service area and optional TEVTA certificate.',
          'Booking details, messages, reviews and payment records needed to provide the service.',
        ],
      },
      {
        title: 'How we use it',
        body: [
          'To create and manage your account, match customers with workers and process bookings.',
          'To verify worker identities and certificates.',
          'To provide support, resolve complaints and keep the platform safe.',
        ],
      },
      {
        title: 'How we protect it',
        body: [
          'Sensitive documents are stored in private, access-controlled storage.',
          'Access to personal data is limited to what each role needs.',
          'We never sell your personal information.',
        ],
      },
      {
        title: 'Your choices',
        body: [
          'You can view and update your profile at any time.',
          'You can request deletion of your account by contacting support.',
        ],
      },
      {
        title: 'Contact',
        body: ['For any privacy questions, contact us through the Contact page.'],
      },
    ],
  },

  terms: {
    hero: {
      eyebrow: 'Legal',
      title: 'Terms of Service',
      description: 'The rules for using ProLinker as a customer or a worker.',
    },
    updated: 'Last updated: November 2026',
    draftNotice:
      'These terms are a working draft and will be finalised after legal review before launch.',
    sections: [
      {
        title: 'Using ProLinker',
        body: [
          'ProLinker is a platform that connects customers with independent skilled workers.',
          'You must provide accurate information and keep your account secure.',
        ],
      },
      {
        title: 'Bookings',
        body: [
          'Customers request jobs; workers may accept or decline them.',
          'Booking status, quotes and final amounts are recorded on the platform.',
        ],
      },
      {
        title: 'Fees & payments',
        body: [
          'ProLinker charges a platform fee on completed jobs, currently 10% of the job amount.',
          'Fees are calculated by ProLinker and shown transparently to both parties.',
        ],
      },
      {
        title: 'Workers',
        body: [
          'Workers must pass identity verification before accepting jobs.',
          'Bonus programs and the Worker Emergency Fund are governed by rules published by ProLinker and may change.',
        ],
      },
      {
        title: 'Reviews & conduct',
        body: [
          'Reviews must be honest and relate to a completed booking.',
          'Abusive, fraudulent or unsafe behaviour may lead to account suspension.',
        ],
      },
      {
        title: 'Complaints',
        body: ['Either party can raise a complaint about a booking, which ProLinker will review.'],
      },
    ],
  },

  auth: {
    loginTitle: 'Log in to ProLinker',
    signupTitle: 'Join ProLinker',
    body: 'Accounts are launching soon. Choose how you’d like to use ProLinker:',
    customer: {
      title: 'I need a service',
      body: 'Book verified workers for jobs at home or work.',
    },
    worker: {
      title: 'I offer a service',
      body: 'Get jobs near you and keep 90% of what you earn.',
    },
    back: 'Back to home',
  },
};
