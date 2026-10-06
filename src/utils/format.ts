export function formatPrice(price: number | undefined | null): string {
  const num = typeof price === 'number' && !isNaN(price) ? price : (Number(price) || 0);
  return num.toLocaleString('fr-FR').replace(/\s/g, '\u00A0') + '\u00A0FCFA';
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function normalizeCategorySlug(raw?: unknown): import('../data/types').CategorySlug {
  if (!raw || typeof raw !== 'string') return 'corps';
  const clean = raw.toLowerCase().trim();
  if (clean === 'corps' || clean === 'visage' || clean === 'maquillage' || clean === 'accessoires' || clean === 'bienetre') {
    return clean as import('../data/types').CategorySlug;
  }
  if (clean.includes('visage')) return 'visage';
  if (clean.includes('maquillage')) return 'maquillage';
  if (clean.includes('accessoire')) return 'accessoires';
  if (clean.includes('bien') || clean.includes('hygiene') || clean.includes('hygiéne')) return 'bienetre';
  if (clean.includes('corp')) return 'corps';
  return 'corps';
}


