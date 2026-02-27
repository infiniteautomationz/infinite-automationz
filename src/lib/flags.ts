function envEnabled(value: string | undefined, defaultValue: boolean) {
  if (value == null || value.trim() === '') return defaultValue;
  return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
}

export function isAdminRedesignEnabled() {
  return envEnabled(process.env.NEXT_PUBLIC_FLAG_ADMIN_REDESIGN, true);
}

export function isClientRedesignEnabled() {
  return envEnabled(process.env.NEXT_PUBLIC_FLAG_CLIENT_REDESIGN, true);
}

export function isPortalUiV2Enabled() {
  return envEnabled(process.env.NEXT_PUBLIC_FLAG_PORTAL_UI_V2, true);
}

export function isAuthUiV2Enabled() {
  return envEnabled(process.env.NEXT_PUBLIC_FLAG_AUTH_UI_V2, true);
}

export function isCommandBarV1Enabled() {
  return envEnabled(process.env.NEXT_PUBLIC_FLAG_COMMAND_BAR_V1, true);
}
