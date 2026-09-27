const PHONE = '221781734994';

export interface ProductInfo {
  name: string;
  description?: string;
  priceFormatted?: string;
  image?: string;
  categorySlug?: string;
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
  if (productOrMessage.image && productOrMessage.image.startsWith('http')) {
    text += `🖼️ *PHOTO :* ${productOrMessage.image}\n`;
  }
  text += `\nMerci de me recontacter pour confirmer la disponibilité et la livraison !`;

  return `https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`;
}
