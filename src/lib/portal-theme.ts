export type SurfaceVariant = 'surface-1' | 'surface-2' | 'surface-3';

export type PortalThemeTokens = {
  background: {
    base: string;
    layer1: string;
    layer2: string;
  };
  surfaces: Record<SurfaceVariant, string>;
  text: {
    strong: string;
    default: string;
    muted: string;
  };
  brand: {
    gold: string;
    goldHover: string;
    goldHighlight: string;
  };
  radius: {
    sm: number;
    md: number;
    lg: number;
  };
};

export type StatusColorMap = Record<'success' | 'warning' | 'danger' | 'info' | 'neutral', string>;

export const portalThemeTokens: PortalThemeTokens = {
  background: {
    base: '#060606',
    layer1: '#0D0D0F',
    layer2: '#141417',
  },
  surfaces: {
    'surface-1': '#121214',
    'surface-2': '#17171B',
    'surface-3': '#1F1F24',
  },
  text: {
    strong: '#F5F5F4',
    default: '#C9C9C4',
    muted: '#8B8B84',
  },
  brand: {
    gold: '#D4AF37',
    goldHover: '#B89025',
    goldHighlight: '#F4D77B',
  },
  radius: {
    sm: 10,
    md: 14,
    lg: 18,
  },
};

export const statusColorMap: StatusColorMap = {
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',
  neutral: '#8B8B84',
};
