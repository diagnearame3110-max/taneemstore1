import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../store/CartContext';
import { formatPrice } from '../utils/format';
import { buildWhatsAppLink } from '../utils/whatsapp';
import type { Product } from '../data/types';

const WHATSAPP_PHONE = '221781734994';

interface ConfirmedOrder {
  id: string;
  firstName: string;
  lastName: string;
  emailOrPhone: string;
  address: string;
  apartment: string;
  city: string;
  postalCode: string;
  country: string;
  deliveryMethod: 'dakar' | 'hors_region';
  deliveryFee: number;
  paymentMethod: 'orange_money' | 'wave';
  cartItems: { product: Product; quantity: number }[];
  totalPrice: number;
  discountAmount: number;
  finalTotal: number;
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, totalPrice, clearCart } = useCart();

  // State for order confirmation screen
  const [confirmedOrder, setConfirmedOrder] = useState<ConfirmedOrder | null>(null);

  // Form State
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState(true);
  const [country, setCountry] = useState('Sénégal');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('Dakar');
  const [saveInfo, setSaveInfo] = useState(true);
  const [newsletterSms, setNewsletterSms] = useState(false);

  // Delivery method: 'dakar' (2000 FCFA) or 'hors_region' (3000 FCFA)
  const [deliveryMethod, setDeliveryMethod] = useState<'dakar' | 'hors_region'>('dakar');

  // Payment method: 'orange_money' or 'wave'
  const [paymentMethod, setPaymentMethod] = useState<'orange_money' | 'wave'>('orange_money');

  // Billing address
  const [billingSame, setBillingSame] = useState(true);

  // Promo code
  const [promoInput, setPromoInput] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  // Email update button state
  const [emailUpdatesSubscribed, setEmailUpdatesSubscribed] = useState(false);

  // Calculations
  const deliveryFee = deliveryMethod === 'dakar' ? 2000 : 3000;
  const discountAmount = useMemo(() => Math.round((totalPrice * discountPercent) / 100), [totalPrice, discountPercent]);
  const finalTotal = useMemo(() => Math.max(0, totalPrice + deliveryFee - discountAmount), [totalPrice, deliveryFee, discountAmount]);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');
    const code = promoInput.trim().toUpperCase();
    if (!code) return;

    if (code === 'TANEEM10' || code === 'WELCOME10') {
      setDiscountPercent(10);
      setPromoSuccess('Code promo de 10% appliqué avec succès !');
    } else if (code === 'VIP15') {
      setDiscountPercent(15);
      setPromoSuccess('Code promo VIP de 15% appliqué !');
    } else {
      setPromoError('Code de réduction invalide');
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!emailOrPhone.trim()) {
      alert('Veuillez entrer votre email ou numéro de téléphone.');
      return;
    }
    if (!firstName.trim() || !lastName.trim()) {
      alert('Veuillez entrer votre prénom et votre nom.');
      return;
    }
    if (!address.trim()) {
      alert('Veuillez préciser votre adresse de livraison.');
      return;
    }

    const orderId = '0' + Math.random().toString(36).substring(2, 10).toUpperCase();

    // Create confirmed order record
    const orderData: ConfirmedOrder = {
      id: orderId,
      firstName,
      lastName,
      emailOrPhone,
      address,
      apartment,
      city,
      postalCode,
      country,
      deliveryMethod,
      deliveryFee,
      paymentMethod,
      cartItems: [...cart],
      totalPrice,
      discountAmount,
      finalTotal,
    };

    // Build rich WhatsApp order message matching exact screenshot structure
    let text = `Bonjour Taneem'Store,\n\n`;
    text += `Je souhaite valider ma commande (N° ${orderId}) :\n\n`;
    text += `👤 *INFORMATIONS CLIENT :*\n`;
    text += `• Nom : ${firstName} ${lastName}\n`;
    text += `• Contact : ${emailOrPhone}\n`;
    text += `• Adresse : ${address}${apartment ? ', ' + apartment : ''}, ${city} (${country})\n\n`;

    text += `🚚 *MODE D'EXPÉDITION :*\n`;
    text += `• Expédition : ${deliveryMethod === 'dakar' ? 'Dakar (2 000 FCFA)' : 'Hors région (3 000 FCFA)'}\n\n`;

    text += `💳 *MODE DE PAIEMENT :*\n`;
    text += `• Moyen de paiement : ${paymentMethod === 'orange_money' ? 'Orange Money (78 173 49 94)' : 'Wave (78 173 49 94)'}\n\n`;

    text += `🛒 *DÉTAILS DES ARTICLES :*\n`;
    cart.forEach(item => {
      const linePrice = formatPrice(item.product.price * item.quantity);
      text += `• Produit : ${item.quantity > 1 ? item.quantity + 'x ' : ''}${item.product.name}\n`;
      text += `• Prix : ${linePrice}\n`;
      if (item.product.image && item.product.image.startsWith('http')) {
        text += `• Image : ${item.product.image}\n`;
      }
      text += `\n`;
    });

    text += `📊 *RÉCAPITULATIF :*\n`;
    text += `• Sous-total : ${formatPrice(totalPrice)}\n`;
    text += `• Expédition : ${formatPrice(deliveryFee)}\n`;
    if (discountAmount > 0) {
      text += `• Réduction : -${formatPrice(discountAmount)}\n`;
    }
    text += `• Total : ${formatPrice(finalTotal)}\n`;
    text += `• Lien : ${window.location.origin}\n\n`;
    text += `Je viens d'effectuer le paiement via ${paymentMethod === 'orange_money' ? 'Orange Money' : 'Wave'}. Merci de me recontacter pour la livraison !`;

    const waUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
    
    // Open WhatsApp link in background tab
    window.open(waUrl, '_blank');

    // Display thank-you / confirmation screen and clear cart
    setConfirmedOrder(orderData);
    clearCart();
  };

  // ----------------------------------------------------
  // RENDER: ORDER CONFIRMATION / THANK YOU SCREEN
  // ----------------------------------------------------
  if (confirmedOrder) {
    return (
      <div style={{ minHeight: '100vh', background: '#FFFFFF', color: '#1B1420', fontFamily: "'Inter', sans-serif" }}>
        {/* Header */}
        <header style={{ borderBottom: '1px solid #EEEEEE', padding: '18px 24px', background: '#FFFFFF' }}>
          <div style={{ maxWidth: '1180px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link to="/" style={{ textDecoration: 'none', fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 700, fontSize: '1.4rem', color: 'var(--pink-deep)' }}>
              Taneem'Store
            </Link>
          </div>
        </header>

        {/* 2-Column Confirmation Body */}
        <div className="checkout-grid" style={{ maxWidth: '1180px', margin: '0 auto' }}>
          
          {/* LEFT COLUMN: Confirmation Info & Details */}
          <div className="checkout-left" style={{ padding: '40px 48px 48px 24px', borderRight: '1px solid #EEEEEE' }}>
            
            {/* Header with Checkmark */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '28px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  border: '2px solid #2563EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#2563EB',
                  flexShrink: 0,
                  marginTop: '2px',
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>

              <div>
                <div style={{ fontSize: '0.85rem', color: '#6B7280', fontWeight: 500 }}>
                  Confirmation n° {confirmedOrder.id}
                </div>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#111827', margin: '4px 0 0 0', fontFamily: "'Inter', sans-serif" }}>
                  Merci, {confirmedOrder.firstName.toUpperCase()} !
                </h1>
              </div>
            </div>

            {/* Box 1: Confirmation Message */}
            <div
              style={{
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                padding: '18px 20px',
                marginBottom: '20px',
                background: '#FFFFFF',
              }}
            >
              <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#111827', margin: '0 0 6px 0' }}>
                Votre commande est maintenant confirmée
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#4B5563', margin: 0 }}>
                Vous recevrez prochainement un SMS de confirmation
              </p>
            </div>

            {/* Box 2: Order Updates */}
            <div
              style={{
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                padding: '18px 20px',
                marginBottom: '20px',
                background: '#FFFFFF',
              }}
            >
              <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#111827', margin: '0 0 6px 0' }}>
                Mises à jour de commande
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#4B5563', margin: '0 0 16px 0' }}>
                Vous recevrez les mises à jour sur l'expédition et la livraison par e-mail.
              </p>

              <button
                onClick={() => setEmailUpdatesSubscribed(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  border: '1px solid #2563EB',
                  borderRadius: '6px',
                  background: emailUpdatesSubscribed ? '#EFF6FF' : '#FFFFFF',
                  color: '#2563EB',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <span>
                  {emailUpdatesSubscribed
                    ? '✓ Inscription aux mises à jour activée'
                    : 'Recevoir des mises à jour sur le statut de l\'expédition par e-mail'}
                </span>
              </button>
            </div>

            {/* Box 3: Order Details */}
            <div
              style={{
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                padding: '22px',
                marginBottom: '36px',
                background: '#FFFFFF',
              }}
            >
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#111827', margin: '0 0 20px 0' }}>
                Détails de la commande
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px 20px', fontSize: '0.88rem' }}>
                
                {/* Coordonnées */}
                <div>
                  <div style={{ fontWeight: 700, color: '#111827', marginBottom: '6px' }}>Coordonnées</div>
                  <div style={{ color: '#4B5563' }}>{confirmedOrder.emailOrPhone}</div>
                </div>

                {/* Moyen de paiement */}
                <div>
                  <div style={{ fontWeight: 700, color: '#111827', marginBottom: '6px' }}>Moyen de paiement</div>
                  <div style={{ color: '#4B5563', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>• 💵</span>
                    <span>{confirmedOrder.paymentMethod === 'orange_money' ? 'Orange Money' : 'Wave'}</span>
                  </div>
                </div>

                {/* Adresse de livraison */}
                <div>
                  <div style={{ fontWeight: 700, color: '#111827', marginBottom: '6px' }}>Adresse de livraison</div>
                  <div style={{ color: '#4B5563', lineHeight: 1.45 }}>
                    <div>{confirmedOrder.firstName} {confirmedOrder.lastName}</div>
                    <div>{confirmedOrder.address}{confirmedOrder.apartment ? ', ' + confirmedOrder.apartment : ''}</div>
                    <div>{confirmedOrder.postalCode ? confirmedOrder.postalCode + ' ' : ''}{confirmedOrder.city}</div>
                    <div>{confirmedOrder.country}</div>
                  </div>
                </div>

                {/* Adresse de facturation */}
                <div>
                  <div style={{ fontWeight: 700, color: '#111827', marginBottom: '6px' }}>Adresse de facturation</div>
                  <div style={{ color: '#4B5563', lineHeight: 1.45 }}>
                    <div>{confirmedOrder.firstName} {confirmedOrder.lastName}</div>
                    <div>{confirmedOrder.address}{confirmedOrder.apartment ? ', ' + confirmedOrder.apartment : ''}</div>
                    <div>{confirmedOrder.postalCode ? confirmedOrder.postalCode + ' ' : ''}{confirmedOrder.city}</div>
                    <div>{confirmedOrder.country}</div>
                  </div>
                </div>

                {/* Mode d'expédition */}
                <div>
                  <div style={{ fontWeight: 700, color: '#111827', marginBottom: '6px' }}>Mode d'expédition</div>
                  <div style={{ color: '#4B5563' }}>
                    {confirmedOrder.deliveryMethod === 'dakar' ? 'Dakar' : 'Hors région'}
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom Actions */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ fontSize: '0.88rem', color: '#4B5563' }}>
                Besoin d'aide ?{' '}
                <a
                  href={buildWhatsAppLink(`Bonjour Taneem'Store, j'ai une question concernant ma commande N° ${confirmedOrder.id}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#2563EB', textDecoration: 'underline', fontWeight: 600 }}
                >
                  Nous contacter
                </a>
              </div>

              <button
                onClick={() => navigate('/')}
                style={{
                  padding: '13px 28px',
                  background: '#2563EB',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#1D4ED8')}
                onMouseLeave={e => (e.currentTarget.style.background = '#2563EB')}
              >
                Retour à la boutique
              </button>
            </div>

          </div>

          {/* RIGHT COLUMN: Order Items & Pricing Breakdown */}
          <div style={{ padding: '40px 32px 48px 48px', background: '#F9FAFB' }}>
            
            {/* Ordered Items List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '28px' }}>
              {confirmedOrder.cartItems.map(({ product, quantity }) => (
                <div key={product.id} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ position: 'relative', width: '64px', height: '64px', flexShrink: 0 }}>
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', border: '1px solid #E5E7EB', background: '#FFFFFF' }}
                    />
                    <span
                      style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        background: '#000000',
                        color: '#FFFFFF',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {quantity}
                    </span>
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {product.name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#6B7280' }}>
                      {product.description.slice(0, 30)}...
                    </div>
                  </div>

                  <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#111827', whiteSpace: 'nowrap' }}>
                    {formatPrice(product.price * quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* Totals Breakdown */}
            <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', color: '#4B5563' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Sous-total</span>
                <span style={{ fontWeight: 600, color: '#111827' }}>{formatPrice(confirmedOrder.totalPrice)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Expédition</span>
                <span style={{ fontWeight: 600, color: '#111827' }}>{formatPrice(confirmedOrder.deliveryFee)}</span>
              </div>

              {confirmedOrder.discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669' }}>
                  <span>Réduction</span>
                  <span style={{ fontWeight: 600 }}>-{formatPrice(confirmedOrder.discountAmount)}</span>
                </div>
              )}

              <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '18px', marginTop: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: '1.15rem', fontWeight: 700, color: '#111827' }}>Total</span>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', color: '#6B7280', marginRight: '6px' }}>XOF</span>
                  <span style={{ fontSize: '1.45rem', fontWeight: 800, color: '#111827' }}>{formatPrice(confirmedOrder.finalTotal)}</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // EMPTY CART SCREEN
  // ----------------------------------------------------
  if (cart.length === 0) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.8rem', marginBottom: '12px' }}>Votre panier est vide</h2>
        <p style={{ color: 'var(--text-soft)', marginBottom: '24px' }}>Ajoutez des produits à votre panier avant d'accéder au paiement.</p>
        <Link to="/" className="btn-primary" style={{ textDecoration: 'none' }}>
          Retourner à la boutique
        </Link>
      </div>
    );
  }

  // ----------------------------------------------------
  // REGULAR CHECKOUT FORM SCREEN
  // ----------------------------------------------------
  return (
    <div style={{ minHeight: '100vh', background: '#FFFFFF', color: '#1B1420', fontFamily: "'Inter', sans-serif" }}>
      {/* Top Header */}
      <header style={{ borderBottom: '1px solid #EEEEEE', padding: '16px 24px', background: '#FFFFFF' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none', fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 700, fontSize: '1.4rem', color: 'var(--pink-deep)' }}>
            Taneem'Store
          </Link>
          <Link to="/" style={{ fontSize: '0.88rem', color: 'var(--pink)', textDecoration: 'none', fontWeight: 600 }}>
            ← Retour aux achats
          </Link>
        </div>
      </header>

      {/* Main Checkout Container */}
      <div className="checkout-grid" style={{ maxWidth: '1180px', margin: '0 auto' }}>
        
        {/* LEFT COLUMN - FORM */}
        <div className="checkout-left" style={{ padding: '36px 48px 48px 24px', borderRight: '1px solid #EEEEEE' }}>
          <form onSubmit={handleSubmitOrder}>
            
            {/* 1. CONTACT */}
            <section style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#111827' }}>Contact</h3>
                <span style={{ fontSize: '0.82rem', color: '#6B7280' }}>Déjà un compte ? <Link to="/admin/login" style={{ color: '#2563EB', textDecoration: 'none' }}>Se connecter</Link></span>
              </div>
              <input
                type="text"
                placeholder="Email ou numéro de portable"
                value={emailOrPhone}
                onChange={e => setEmailOrPhone(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '6px',
                  fontSize: '0.92rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px', fontSize: '0.84rem', color: '#4B5563', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={newsletterEmail}
                  onChange={e => setNewsletterEmail(e.target.checked)}
                />
                M'envoyer des nouvelles et des offres par e-mail
              </label>
            </section>

            {/* 2. LIVRAISON */}
            <section style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '14px', color: '#111827' }}>Livraison</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Pays */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#6B7280', marginBottom: '4px' }}>Pays/Région</label>
                  <select
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '6px',
                      fontSize: '0.92rem',
                      background: '#F9FAFB',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="Sénégal">Sénégal</option>
                    <option value="Côte d'Ivoire">Côte d'Ivoire</option>
                    <option value="Mali">Mali</option>
                    <option value="France">France</option>
                  </select>
                </div>

                {/* Prénom & Nom */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <input
                    type="text"
                    placeholder="Prénom"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    required
                    style={{ padding: '12px 14px', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '0.92rem' }}
                  />
                  <input
                    type="text"
                    placeholder="Nom"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    required
                    style={{ padding: '12px 14px', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '0.92rem' }}
                  />
                </div>

                {/* Adresse */}
                <input
                  type="text"
                  placeholder="Adresse"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  required
                  style={{ padding: '12px 14px', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '0.92rem' }}
                />

                {/* Appartement */}
                <input
                  type="text"
                  placeholder="Appartement, suite, etc. (optionnel)"
                  value={apartment}
                  onChange={e => setApartment(e.target.value)}
                  style={{ padding: '12px 14px', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '0.92rem' }}
                />

                {/* Code postal & Ville */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <input
                    type="text"
                    placeholder="Code postal (optionnel)"
                    value={postalCode}
                    onChange={e => setPostalCode(e.target.value)}
                    style={{ padding: '12px 14px', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '0.92rem' }}
                  />
                  <input
                    type="text"
                    placeholder="Ville"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    required
                    style={{ padding: '12px 14px', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '0.92rem' }}
                  />
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', fontSize: '0.84rem', color: '#4B5563', cursor: 'pointer' }}>
                  <input type="checkbox" checked={saveInfo} onChange={e => setSaveInfo(e.target.checked)} />
                  Sauvegarder mes informations pour la prochaine fois
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: '#4B5563', cursor: 'pointer' }}>
                  <input type="checkbox" checked={newsletterSms} onChange={e => setNewsletterSms(e.target.checked)} />
                  M'envoyer des nouvelles et des offres par SMS
                </label>
              </div>
            </section>

            {/* 3. MODE D'EXPÉDITION */}
            <section style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '14px', color: '#111827' }}>Mode d'expédition</h3>
              <div style={{ border: '1px solid #D1D5DB', borderRadius: '8px', overflow: 'hidden' }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 16px',
                    borderBottom: '1px solid #E5E7EB',
                    background: deliveryMethod === 'dakar' ? '#EFF6FF' : '#FFFFFF',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                      type="radio"
                      name="delivery"
                      checked={deliveryMethod === 'dakar'}
                      onChange={() => setDeliveryMethod('dakar')}
                    />
                    <span style={{ fontSize: '0.92rem', fontWeight: 600 }}>Dakar</span>
                  </div>
                  <span style={{ fontSize: '0.92rem', fontWeight: 700 }}>2 000 FCFA</span>
                </label>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 16px',
                    background: deliveryMethod === 'hors_region' ? '#EFF6FF' : '#FFFFFF',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                      type="radio"
                      name="delivery"
                      checked={deliveryMethod === 'hors_region'}
                      onChange={() => setDeliveryMethod('hors_region')}
                    />
                    <span style={{ fontSize: '0.92rem', fontWeight: 600 }}>Hors région</span>
                  </div>
                  <span style={{ fontSize: '0.92rem', fontWeight: 700 }}>3 000 FCFA</span>
                </label>
              </div>
            </section>

            {/* 4. PAIEMENT */}
            <section style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px', color: '#111827' }}>Paiement</h3>
              <p style={{ fontSize: '0.82rem', color: '#6B7280', marginTop: 0, marginBottom: '14px' }}>Toutes les transactions sont sécurisées et chiffrées.</p>

              <div style={{ border: '1px solid #D1D5DB', borderRadius: '8px', overflow: 'hidden' }}>
                {/* Orange Money */}
                <div style={{ borderBottom: '1px solid #E5E7EB' }}>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '14px 16px',
                      background: paymentMethod === 'orange_money' ? '#EFF6FF' : '#FFFFFF',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: '0.92rem',
                    }}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'orange_money'}
                      onChange={() => setPaymentMethod('orange_money')}
                    />
                    <span>Orange Money</span>
                  </label>

                  {paymentMethod === 'orange_money' && (
                    <div style={{ padding: '14px 16px', background: '#F9FAFB', fontSize: '0.85rem', color: '#374151', borderTop: '1px solid #E5E7EB' }}>
                      💡 Valider sur ce numéro <strong>78 173 49 94</strong> et envoyer une capture d'écran du paiement sur WhatsApp.
                    </div>
                  )}
                </div>

                {/* WAVE */}
                <div>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '14px 16px',
                      background: paymentMethod === 'wave' ? '#EFF6FF' : '#FFFFFF',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: '0.92rem',
                    }}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'wave'}
                      onChange={() => setPaymentMethod('wave')}
                    />
                    <span>WAVE</span>
                  </label>

                  {paymentMethod === 'wave' && (
                    <div style={{ padding: '14px 16px', background: '#F9FAFB', fontSize: '0.85rem', color: '#374151', borderTop: '1px solid #E5E7EB' }}>
                      🌊 Payer via l'application Wave sur le numéro <strong>78 173 49 94</strong> et envoyer le reçu sur WhatsApp.
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* 5. ADRESSE DE FACTURATION */}
            <section style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '14px', color: '#111827' }}>Adresse de facturation</h3>
              <div style={{ border: '1px solid #D1D5DB', borderRadius: '8px', overflow: 'hidden' }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '14px 16px',
                    borderBottom: '1px solid #E5E7EB',
                    background: billingSame ? '#EFF6FF' : '#FFFFFF',
                    cursor: 'pointer',
                    fontSize: '0.92rem',
                  }}
                >
                  <input type="radio" name="billing" checked={billingSame} onChange={() => setBillingSame(true)} />
                  Identique à l'adresse de livraison
                </label>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '14px 16px',
                    background: !billingSame ? '#EFF6FF' : '#FFFFFF',
                    cursor: 'pointer',
                    fontSize: '0.92rem',
                  }}
                >
                  <input type="radio" name="billing" checked={!billingSame} onChange={() => setBillingSame(false)} />
                  Utiliser une adresse de facturation différente
                </label>
              </div>
            </section>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '16px',
                background: 'var(--rose-vieilli)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '100px',
                fontSize: '0.95rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(169, 99, 119, 0.3)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#945265')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--rose-vieilli)')}
            >
              Valider le paiement
            </button>

            {/* FOOTER LINKS */}
            <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid #EEEEEE', display: 'flex', gap: '20px', fontSize: '0.78rem', color: '#2563EB' }}>
              <a href="#" onClick={e => e.preventDefault()} style={{ color: '#2563EB', textDecoration: 'underline' }}>Politique de remboursement</a>
              <a href="#" onClick={e => e.preventDefault()} style={{ color: '#2563EB', textDecoration: 'underline' }}>Politique de confidentialité</a>
            </div>

          </form>
        </div>

        {/* RIGHT COLUMN - ORDER SUMMARY */}
        <div style={{ padding: '36px 24px 48px 48px', background: '#F9FAFB' }}>
          
          {/* Cart Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
            {cart.map(({ product, quantity }) => (
              <div key={product.id} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ position: 'relative', width: '64px', height: '64px', flexShrink: 0 }}>
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', border: '1px solid #E5E7EB', background: '#FFFFFF' }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      background: '#6B7280',
                      color: '#FFFFFF',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {quantity}
                  </span>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {product.name}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#6B7280' }}>
                    {product.description.slice(0, 30)}...
                  </div>
                </div>

                <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#111827', whiteSpace: 'nowrap' }}>
                  {formatPrice(product.price * quantity)}
                </div>
              </div>
            ))}
          </div>

          {/* PROMO CODE INPUT */}
          <form onSubmit={handleApplyPromo} style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
            <input
              type="text"
              placeholder="Code de réduction ou carte-cadeau"
              value={promoInput}
              onChange={e => setPromoInput(e.target.value)}
              style={{
                flex: 1,
                padding: '11px 14px',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                fontSize: '0.88rem',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              style={{
                padding: '11px 18px',
                background: '#E5E7EB',
                color: '#374151',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
              }}
            >
              Valider
            </button>
          </form>
          {promoError && <p style={{ color: '#DC2626', fontSize: '0.8rem', marginTop: '-16px', marginBottom: '16px' }}>{promoError}</p>}
          {promoSuccess && <p style={{ color: '#059669', fontSize: '0.8rem', marginTop: '-16px', marginBottom: '16px' }}>{promoSuccess}</p>}

          {/* TOTALS BREAKDOWN */}
          <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: '#4B5563' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Sous-total</span>
              <span style={{ fontWeight: 600, color: '#111827' }}>{formatPrice(totalPrice)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Expédition</span>
              <span style={{ fontWeight: 600, color: '#111827' }}>{formatPrice(deliveryFee)}</span>
            </div>

            {discountAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669' }}>
                <span>Réduction ({discountPercent}%)</span>
                <span style={{ fontWeight: 600 }}>-{formatPrice(discountAmount)}</span>
              </div>
            )}

            <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '16px', marginTop: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827' }}>Total</span>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: '#6B7280', marginRight: '6px' }}>XOF</span>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#111827' }}>{formatPrice(finalTotal)}</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

