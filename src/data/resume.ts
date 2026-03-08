export interface Job {
  company: string;
  logo: string;
  dates: string;
  roles: string[];
}

export const jobs: Job[] = [
  {
    company: 'Puzzmo',
    logo: '/images/companies/puzzmo_logo.jpg',
    dates: 'January 2024 - Present',
    roles: ['Senior Software Architect'],
  },
  {
    company: 'Discord',
    logo: '/images/companies/discord_logo.jpg',
    dates: 'June 2018 - August 2022',
    roles: ['Staff Software Engineer'],
  },
  {
    company: 'Dropbox',
    logo: '/images/companies/dropbox_logo.jpg',
    dates: 'October 2012 - June 2018',
    roles: ['Staff Site Reliability Engineer', 'Site Reliability Engineer'],
  },
  {
    company: 'Google (YouTube)',
    logo: '/images/companies/google_logo.jpg',
    dates: 'November 2010 - October 2012',
    roles: ['Site Reliability Engineer'],
  },
  {
    company: 'CBS Interactive',
    logo: '/images/companies/cbs_interactive_logo.jpg',
    dates: 'August 2006 - August 2010',
    roles: [
      'Senior Systems Administrator',
      'Systems Administrator',
      'Junior Systems Administrator',
      'Operations Specialist',
    ],
  },
  {
    company: 'Affinity Internet',
    logo: '/images/companies/affinity_com_logo.jpg',
    dates: 'August 2003 - August 2006',
    roles: [
      'NOC Engineer',
      'Sales Consultant / Web Agent',
      'Technical Support Specialist',
    ],
  },
];
