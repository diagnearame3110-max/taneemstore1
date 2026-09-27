import { buildWhatsAppLink } from '../../utils/whatsapp';

export default function CTABand() {
  return (
    <div className="band">
      <div className="wrap">
        <h2>Un coup de cœur sur nos stories ?</h2>
        <p>Écrivez-nous directement sur WhatsApp avec une capture du produit — on vous répond en quelques minutes.</p>
        <a
          className="btn-primary"
          href={buildWhatsAppLink("Bonjour Taneem'Store, je voudrais passer commande.")}
          target="_blank"
          rel="noopener noreferrer"
        >
          Écrire sur WhatsApp
        </a>
      </div>
    </div>
  );
}
