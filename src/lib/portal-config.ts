export type PortalNavKey =
  | 'inbox'
  | 'services'
  | 'messages'
  | 'files'
  | 'calendar'
  | 'deliverables'
  | 'billing'
  | 'support';

export type BrandConfig = {
  name: string;
  portalTitle: string;
  logoPath: string;
  primaryNav: Array<{
    key: PortalNavKey;
    name: string;
    href: string;
    glyph: string;
    badgeCount?: number;
    accent?: 'gold' | 'danger' | 'info';
  }>;
};

export const INFINITE_BRAND_CONFIG: BrandConfig = {
  name: 'Infinite Automationz',
  portalTitle: 'Customer Portal',
  logoPath: '/assets/images/ia-logo-symbol.png',
  primaryNav: [
    { key: 'inbox', name: 'Inbox', href: '/app', glyph: 'I', accent: 'gold' },
    { key: 'services', name: 'Services', href: '/app/services', glyph: 'S' },
    { key: 'messages', name: 'Messages', href: '/app/messages', glyph: 'M' },
    { key: 'files', name: 'Files', href: '/app/files', glyph: 'F' },
    { key: 'calendar', name: 'Calendar', href: '/app/calendar', glyph: 'C' },
    { key: 'deliverables', name: 'Deliverables', href: '/app/deliverables', glyph: 'D', accent: 'info' },
    { key: 'billing', name: 'Billing', href: '/app/billing', glyph: 'B', accent: 'danger' },
    { key: 'support', name: 'Support', href: '/app/support', glyph: 'H' },
  ],
};
