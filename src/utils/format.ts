export function formatPrice(price: number | undefined | null): string {
  const num = typeof price === 'number' && !isNaN(price) ? price : (Number(price) || 0);
  return num.toLocaleString('fr-FR').replace(/\s/g, '\u00A0') + '\u00A0FCFA';
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function normalizeCategorySlug(raw?: unknown): import('../data/types').CategorySlug {
  if (!raw || typeof raw !== 'string') return 'skincare';
  const clean = raw.toLowerCase().trim();
  if (clean === 'skincare' || clean === 'corps' || clean === 'dentaire' || clean === 'levres' || clean === 'bienetre') {
    return clean as import('../data/types').CategorySlug;
  }
  if (clean.includes('skin') || clean.includes('visage')) return 'skincare';
  if (clean.includes('corp')) return 'corps';
  if (clean.includes('dent')) return 'dentaire';
  if (clean.includes('levr') || clean.includes('lèvre')) return 'levres';
  if (clean.includes('bien') || clean.includes('hygiene') || clean.includes('hygiéne')) return 'bienetre';
  if (clean.includes('accessoire')) return 'dentaire';
  return 'skincare';
}

export function formatCategoryTitle(title?: unknown, slug?: string): string {
  const clean = typeof title === 'string' ? title.replace(/&amp;/g, '&').trim() : '';
  const normSlug = slug ? normalizeCategorySlug(slug) : (clean ? normalizeCategorySlug(clean) : 'skincare');
  
  if (normSlug === 'skincare') return 'SKINCARE';
  if (normSlug === 'corps') return 'SOIN CORPS';
  if (normSlug === 'dentaire') return 'SOIN DENTAIRE';
  if (normSlug === 'levres') return 'SOIN DES LEVRES';
  if (normSlug === 'bienetre') return 'SOIN ET BIEN ETRE';
  
  return clean ? clean.toUpperCase() : 'SKINCARE';
}
