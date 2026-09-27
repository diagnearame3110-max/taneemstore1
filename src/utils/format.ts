export function formatPrice(price: number): string {
  return price.toLocaleString('fr-FR').replace(/\s/g, '\u00A0') + '\u00A0FCFA';
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

