const PHONE = '221781734994';

export interface ProductInfo {
  id?: string;
  name: string;
  description?: string;
  priceFormatted?: string;
  image?: string;
  categorySlug?: string;
}

export function getPublicBaseUrl(): string {
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'https://tanneemstore.com';
    }
    return window.location.origin;
  }
  return 'https://tanneemstore.com';
}

export function getProductImageUrl(productId?: string, imageStr?: string): string {
  if (imageStr && (imageStr.startsWith('http://') || imageStr.startsWith('https://'))) {
    return imageStr;
  }
  if (productId) {
    const base = getPublicBaseUrl();
    return `${base}/api/product-image?id=${encodeURIComponent(productId)}`;
  }
  return '';
}

export function getProductPageUrl(productId?: string): string {
  if (!productId) return '';
  const base = getPublicBaseUrl();
  return `${base}/product/${encodeURIComponent(productId)}`;
}

export function buildWhatsAppLink(productOrMessage?: string | ProductInfo): string {
  if (!productOrMessage) {
    const text = `Bonjour Taneem'Store ✨,\n\nJe souhaite avoir des informations sur vos produits et passer commande.`;
    return `https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`;
  }

  if (typeof productOrMessage === 'string') {
    const text = `Bonjour Taneem'Store ✨,\n\n${productOrMessage}`;
    return `https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`;
  }

  let text = `Bonjour Taneem'Store ✨,\n\n`;
  text += `Je souhaite commander ce produit :\n\n`;
  text += `🛍️ *PRODUIT :* ${productOrMessage.name}\n`;
  if (productOrMessage.priceFormatted) {
    text += `💰 *PRIX :* ${productOrMessage.priceFormatted}\n`;
  }
  if (productOrMessage.description) {
    text += `📝 *INFO :* ${productOrMessage.description}\n`;
  }

  const photoUrl = getProductImageUrl(productOrMessage.id, productOrMessage.image);
  if (photoUrl) {
    text += `📸 *PHOTO :* ${photoUrl}\n`;
  }
  if (productOrMessage.id) {
    text += `🔗 *FICHE PRODUIT :* ${getProductPageUrl(productOrMessage.id)}\n`;
  }
  text += `\nMerci de me recontacter pour confirmer la disponibilité et la livraison !`;

  return `https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`;
}
