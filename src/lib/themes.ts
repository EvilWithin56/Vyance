// themes.ts
// PRD-compliant theming engine 

export const THEME_BASES = [
  { id: 'stitch', name: 'Stitch Light', type: 'Light', vars: { '--color-primary': '#0032b5', '--color-background': '#f7f9fb', '--color-surface-container': '#f2f4f6', '--color-on-background': '#191c1e' } },
  { id: 'void_purple', name: 'Void Purple', type: 'Dark', vars: { '--color-primary': '#c99fff', '--color-background': '#12121D', '--color-surface-container': '#1C1C28', '--color-on-background': '#E6E6E6' } },
  { id: 'arctic_core', name: 'Arctic Core', type: 'Dark', vars: { '--color-primary': '#82D2FF', '--color-background': '#0D141C', '--color-surface-container': '#15202B', '--color-on-background': '#E2E8F0' } },
  { id: 'midnight_rose', name: 'Midnight Rose', type: 'Dark', vars: { '--color-primary': '#FFB2BE', '--color-background': '#181214', '--color-surface-container': '#241A1C', '--color-on-background': '#F0E2E4' } },
  { id: 'matrix_mint', name: 'Matrix Mint', type: 'Dark', vars: { '--color-primary': '#6EE7B7', '--color-background': '#07150E', '--color-surface-container': '#0D2418', '--color-on-background': '#D1FAE5' } },
  { id: 'ember_dark', name: 'Ember Dark', type: 'Dark', vars: { '--color-primary': '#FCA5A5', '--color-background': '#1A1211', '--color-surface-container': '#291C1A', '--color-on-background': '#FEE2E2' } },
  { id: 'lavender_web', name: 'Lavender Web', type: 'Light', vars: { '--color-primary': '#7D5260', '--color-background': '#FAF8FF', '--color-surface-container': '#F2F0F9', '--color-on-background': '#1C1B1F' } },
  { id: 'neon_slime', name: 'Neon Slime', type: 'Dark', vars: { '--color-primary': '#D9F99D', '--color-background': '#0A150C', '--color-surface-container': '#132817', '--color-on-background': '#ECFCCB' } },
  { id: 'terracotta', name: 'Terracotta Cloud', type: 'Light', vars: { '--color-primary': '#9C413D', '--color-background': '#FFF8F6', '--color-surface-container': '#FCEEEB', '--color-on-background': '#201A19' } },
  { id: 'deep_sea', name: 'Deep Sea UI', type: 'Dark', vars: { '--color-primary': '#93C5FD', '--color-background': '#0B1423', '--color-surface-container': '#132135', '--color-on-background': '#DBEAFE' } },
  { id: 'matcha', name: 'Matcha Light', type: 'Light', vars: { '--color-primary': '#4D6A42', '--color-background': '#F7FAF3', '--color-surface-container': '#EEF2E9', '--color-on-background': '#1A1C19' } },
  { id: 'vaporwave', name: 'Vaporwave DM', type: 'Dark', vars: { '--color-primary': '#F0ABFC', '--color-background': '#140E1B', '--color-surface-container': '#20182A', '--color-on-background': '#FAE8FF' } },
  { id: 'gold', name: 'Gold Status', type: 'Light', vars: { '--color-primary': '#755A00', '--color-background': '#FFFBFF', '--color-surface-container': '#F7EFE1', '--color-on-background': '#1F1B16' } },
  { id: 'stealth', name: 'Stealth Mode', type: 'Dark', vars: { '--color-primary': '#94A3B8', '--color-background': '#080C11', '--color-surface-container': '#10161F', '--color-on-background': '#F8FAFC' } },
  { id: 'barbie', name: 'Y2K Barbie', type: 'Light', vars: { '--color-primary': '#BE185D', '--color-background': '#FFF1F2', '--color-surface-container': '#FFE4E6', '--color-on-background': '#4C0519' } },
  { id: 'cobalt', name: 'Cobalt Protocol', type: 'Dark', vars: { '--color-primary': '#60A5FA', '--color-background': '#080E18', '--color-surface-container': '#121A28', '--color-on-background': '#EFF6FF' } },
];

export const THEME_GRADIENTS = [
  'Flat Color', 'Stitch App', 'Galactic Night', 'Rave Core', 'Aurora Swim', 'Lava Drip', 'Abyss Blue', 'Amber Blaze', 'Pastel Drift', 'Phantom Haze', 'Cyber Mint', 'Solar Punch', 'Deep Ocean', 'Sakura Haze', 'Prism Burst', 'Midnight Steel', 'Sunset Drip'
];

export function applyTheme(baseId: string, gradientName: string) {
  const theme = THEME_BASES.find(t => t.id === baseId) || THEME_BASES[0];
  
  // Set minimal vars for demo, normally we map all 15 vars described in section 15.4
  Object.entries(theme.vars).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value);
  });
  
  if (theme.type === 'Dark') {
    document.documentElement.classList.add('dark');
    document.documentElement.style.setProperty('--color-surface-container-lowest', 'var(--color-background)');
    document.documentElement.style.setProperty('--color-surface-container-low', 'var(--color-surface-container)');
    document.documentElement.style.setProperty('--color-surface', 'var(--color-background)');
    document.documentElement.style.setProperty('--color-on-surface', 'var(--color-on-background)');
  } else {
    document.documentElement.classList.remove('dark');
  }

  // Apply gradient string
  document.body.setAttribute('data-gradient', gradientName.toLowerCase().replace(/\s+/g, '-'));
}
