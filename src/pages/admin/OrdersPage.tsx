import { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useToast } from '../../store/ToastContext';

interface OrderItem {
  name: string;
  qty: number;
  price: number;
  image?: string;
}

interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  items: OrderItem[];
  totalPrice: number;
  paymentMethod: 'Wave' | 'Orange Money' | 'Espèces à la livraison';
  status: 'En attente' | 'Confirmée' | 'En livraison' | 'Livrée';
  date: string;
  notes?: string;
}

const INITIAL_ORDERS: Order[] = [
  {
    id: 'CMD-2026-089',
    customerName: 'Aïssatou Sow',
    phone: '+221778945612',
    address: 'Mermoz Pyrotechnie, Villa 42',
    city: 'Dakar',
    items: [
      { name: 'Gommage Corps Hydratant Karité', qty: 1, price: 12500, image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=200' },
      { name: 'Sérum Éclat Visage Vitamine C', qty: 1, price: 15000, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=200' },
    ],
    totalPrice: 27500,
    paymentMethod: 'Wave',
    status: 'En livraison',
    date: '2026-09-26 18:45',
    notes: 'Livrer avant 19h si possible.',
  },
  {
    id: 'CMD-2026-088',
    customerName: 'Fatou Diop',
    phone: '+221781234567',
    address: 'Sacré-Cœur 3, Immeuble B',
    city: 'Dakar',
    items: [
      { name: 'Huile Sèche Scintillante Rose Gold', qty: 2, price: 18000, image: 'https://images.unsplash.com/photo-1608248597261-833244675b39?auto=format&fit=crop&q=80&w=200' },
    ],
    totalPrice: 36000,
    paymentMethod: 'Orange Money',
    status: 'Confirmée',
    date: '2026-09-26 16:20',
  },
  {
    id: 'CMD-2026-087',
    customerName: 'Mariama Ba',
    phone: '+221709876543',
    address: 'Point E, Rue 4 x Rue de Diourbel',
    city: 'Dakar',
    items: [
      { name: 'Masque Argile & Rose Purifiant', qty: 1, price: 14000, image: 'https://images.unsplash.com/photo-1567928254714-2a62886f6874?auto=format&fit=crop&q=80&w=200' },
      { name: 'Brume Hydratante Apaisante', qty: 1, price: 9500, image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=200' },
    ],
    totalPrice: 23500,
    paymentMethod: 'Espèces à la livraison',
    status: 'Livrée',
    date: '2026-09-25 14:10',
  },
  {
    id: 'CMD-2026-086',
    customerName: 'Aminata Ndiaye',
    phone: '+221765432109',
    address: 'Quartier Randoulène',
    city: 'Thiès',
    items: [
      { name: 'Coffret Glow Intégra', qty: 1, price: 35000, image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=200' },
    ],
    totalPrice: 35000,
    paymentMethod: 'Wave',
    status: 'En attente',
    date: '2026-09-25 11:05',
  },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { showToast } = useToast();

  const filteredOrders = orders.filter(o => {
    const matchSearch = o.customerName.toLowerCase().includes(search.toLowerCase()) ||
                        o.id.toLowerCase().includes(search.toLowerCase()) ||
                        o.phone.includes(search) ||
                        o.city.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || o.status === statusFilter;
    const matchPayment = !paymentFilter || o.paymentMethod === paymentFilter;
    return matchSearch && matchStatus && matchPayment;
  });

  const updateStatus = (id: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    if (selectedOrder && selectedOrder.id === id) {
      setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
    }
    showToast(`Statut de la commande ${id} changé en "${newStatus}".`);
  };

  const getStatusBadgeStyle = (status: Order['status']) => {
    switch (status) {
      case 'En attente': return { bg: '#FEF3C7', color: '#92400E', border: '#FDE68A' };
      case 'Confirmée': return { bg: '#E0F2FE', color: '#0369A1', border: '#BAE6FD' };
      case 'En livraison': return { bg: '#F5F3FF', color: '#5B21B6', border: '#DDD6FE' };
      case 'Livrée': return { bg: '#DCFCE7', color: '#166534', border: '#BBF7D0' };
    }
  };

  const getPaymentBadgeStyle = (method: Order['paymentMethod']) => {
    switch (method) {
      case 'Wave': return { bg: '#E0F2FE', color: '#0284C7' };
      case 'Orange Money': return { bg: '#FFEDD5', color: '#C2410C' };
      case 'Espèces à la livraison': return { bg: '#F3F4F6', color: '#374151' };
    }
  };

  const totalOrdersCount = orders.length;
  const pendingCount = orders.filter(o => o.status === 'En attente').length;
  const deliveryCount = orders.filter(o => o.status === 'En livraison').length;
  const completedCount = orders.filter(o => o.status === 'Livrée').length;
  const totalRevenue = orders.reduce((acc, curr) => acc + curr.totalPrice, 0);

  return (
    <AdminLayout title="Gestion des Commandes">
      {/* KPI Stats Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {/* Total Commandes */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '18px',
            padding: '20px 22px',
            border: '1px solid var(--line)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <p style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-soft)', marginBottom: '4px' }}>
              Commandes Total
            </p>
            <p style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', fontFamily: "'Cormorant Garamond', serif" }}>
              {totalOrdersCount}
            </p>
          </div>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#F5EFEA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
            🛍️
          </div>
        </div>

        {/* En Attente */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '18px',
            padding: '20px 22px',
            border: '1px solid var(--line)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <p style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-soft)', marginBottom: '4px' }}>
              En Attente
            </p>
            <p style={{ fontSize: '1.8rem', fontWeight: 800, color: '#92400E', fontFamily: "'Cormorant Garamond', serif" }}>
              {pendingCount}
            </p>
          </div>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
            ⏳
          </div>
        </div>

        {/* En Livraison */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '18px',
            padding: '20px 22px',
            border: '1px solid var(--line)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <p style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-soft)', marginBottom: '4px' }}>
              En Livraison
            </p>
            <p style={{ fontSize: '1.8rem', fontWeight: 800, color: '#5B21B6', fontFamily: "'Cormorant Garamond', serif" }}>
              {deliveryCount}
            </p>
          </div>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
            🚚
          </div>
        </div>

        {/* Livrées */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '18px',
            padding: '20px 22px',
            border: '1px solid var(--line)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <p style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-soft)', marginBottom: '4px' }}>
              Livrées
            </p>
            <p style={{ fontSize: '1.8rem', fontWeight: 800, color: '#166534', fontFamily: "'Cormorant Garamond', serif" }}>
              {completedCount}
            </p>
          </div>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
            ✅
          </div>
        </div>

        {/* Total Revenue */}
        <div
          style={{
            background: 'linear-gradient(135deg, #FAF7F5 0%, #F5EFEA 100%)',
            borderRadius: '18px',
            padding: '20px 22px',
            border: '1px solid var(--pink)',
            boxShadow: '0 4px 16px rgba(169, 144, 132, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <p style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--pink-deep)', marginBottom: '4px' }}>
              Chiffre d'Affaires
            </p>
            <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', fontFamily: "'Cormorant Garamond', serif" }}>
              {totalRevenue.toLocaleString('fr-FR')} FCFA
            </p>
          </div>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            💎
          </div>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '20px',
          padding: '20px 24px',
          border: '1px solid var(--line)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
          marginBottom: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
            <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.95rem', color: 'var(--text-soft)' }}>
              🔍
            </span>
            <input
              type="text"
              placeholder="Rechercher par client, n° commande, ville..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 40px 12px 44px',
                borderRadius: '12px',
                border: '1.5px solid var(--line)',
                fontSize: '0.88rem',
                outline: 'none',
                background: '#FAF8F4',
                color: 'var(--text)',
                boxSizing: 'border-box',
                transition: 'all 0.2s ease',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = 'var(--pink)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'var(--line)')}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-soft)',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Payment Method Filter */}
          <select
            value={paymentFilter}
            onChange={e => setPaymentFilter(e.target.value)}
            style={{
              padding: '12px 18px',
              borderRadius: '12px',
              border: '1.5px solid var(--line)',
              fontSize: '0.88rem',
              outline: 'none',
              background: '#FAF8F4',
              color: 'var(--text)',
              cursor: 'pointer',
              fontWeight: 600,
            }}
            onFocus={e => (e.currentTarget.style.borderColor = 'var(--pink)')}
            onBlur={e => (e.currentTarget.style.borderColor = 'var(--line)')}
          >
            <option value="">Tous modes de paiement</option>
            <option value="Wave">Wave</option>
            <option value="Orange Money">Orange Money</option>
            <option value="Espèces à la livraison">Espèces à la livraison</option>
          </select>
        </div>

        {/* Status Tabs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', borderTop: '1px solid var(--line)', paddingTop: '14px' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-soft)', uppercase: true, letterSpacing: '0.05em', marginRight: '8px' }}>
            Statut:
          </span>
          {[
            { key: '', label: 'Toutes', count: totalOrdersCount },
            { key: 'En attente', label: 'En attente', count: pendingCount, bg: '#FEF3C7', color: '#92400E' },
            { key: 'Confirmée', label: 'Confirmée', count: orders.filter(o => o.status === 'Confirmée').length, bg: '#E0F2FE', color: '#0369A1' },
            { key: 'En livraison', label: 'En livraison', count: deliveryCount, bg: '#F5F3FF', color: '#5B21B6' },
            { key: 'Livrée', label: 'Livrée', count: completedCount, bg: '#DCFCE7', color: '#166534' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              style={{
                padding: '6px 14px',
                borderRadius: '100px',
                fontSize: '0.8rem',
                fontWeight: 600,
                border: '1px solid',
                borderColor: statusFilter === tab.key ? (tab.color || 'var(--pink)') : 'var(--line)',
                background: statusFilter === tab.key ? (tab.bg || 'var(--pink)') : '#FFFFFF',
                color: statusFilter === tab.key ? (tab.color || '#FFFFFF') : 'var(--text)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table Card */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '20px',
          border: '1px solid var(--line)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          overflow: 'hidden',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: '#FAF7F5', borderBottom: '1px solid var(--line)' }}>
                <th style={{ padding: '16px 20px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-soft)' }}>
                  Commande
                </th>
                <th style={{ padding: '16px 20px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-soft)' }}>
                  Client & Livraison
                </th>
                <th style={{ padding: '16px 20px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-soft)' }}>
                  Articles
                </th>
                <th style={{ padding: '16px 20px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-soft)' }}>
                  Paiement
                </th>
                <th style={{ padding: '16px 20px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-soft)' }}>
                  Total
                </th>
                <th style={{ padding: '16px 20px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-soft)' }}>
                  Statut
                </th>
                <th style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-soft)', textAlign: 'right' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(o => {
                const badgeStyle = getStatusBadgeStyle(o.status);
                const payBadgeStyle = getPaymentBadgeStyle(o.paymentMethod);
                const waMessage = encodeURIComponent(
                  `Bonjour ${o.customerName}, nous vous contactons concernant votre commande Taneem'Store ${o.id} (${o.totalPrice.toLocaleString('fr-FR')} FCFA).`
                );

                return (
                  <tr
                    key={o.id}
                    style={{
                      borderBottom: '1px solid var(--line)',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#FAF8F4')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    {/* Commande ID & Date */}
                    <td style={{ padding: '16px 20px', verticalAlign: 'top' }}>
                      <div
                        onClick={() => setSelectedOrder(o)}
                        style={{ fontWeight: 700, color: 'var(--text)', cursor: 'pointer', fontFamily: 'monospace', fontSize: '0.9rem' }}
                      >
                        {o.id}
                      </div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-soft)', marginTop: '4px' }}>
                        📅 {o.date}
                      </div>
                    </td>

                    {/* Customer & Address */}
                    <td style={{ padding: '16px 20px', verticalAlign: 'top' }}>
                      <div style={{ fontWeight: 700, color: 'var(--text)' }}>
                        {o.customerName}
                      </div>
                      <a
                        href={`tel:${o.phone}`}
                        style={{ fontSize: '0.78rem', color: 'var(--pink-deep)', textDecoration: 'none', fontWeight: 600, display: 'inline-block', marginTop: '2px' }}
                      >
                        📞 {o.phone}
                      </a>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-soft)', marginTop: '3px' }}>
                        📍 {o.address} <span style={{ fontWeight: 600, color: 'var(--text)' }}>({o.city})</span>
                      </div>
                    </td>

                    {/* Items Preview */}
                    <td style={{ padding: '16px 20px', verticalAlign: 'top' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {o.items.map((item, idx) => (
                          <div key={idx} style={{ fontSize: '0.8rem', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontWeight: 700, color: 'var(--pink-deep)', background: '#FAF7F5', padding: '1px 6px', borderRadius: '4px' }}>
                              {item.qty}x
                            </span>
                            <span>{item.name}</span>
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Payment */}
                    <td style={{ padding: '16px 20px', verticalAlign: 'top' }}>
                      <span
                        style={{
                          padding: '4px 10px',
                          borderRadius: '100px',
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          background: payBadgeStyle.bg,
                          color: payBadgeStyle.color,
                          display: 'inline-block',
                        }}
                      >
                        {o.paymentMethod}
                      </span>
                    </td>

                    {/* Total Price */}
                    <td style={{ padding: '16px 20px', verticalAlign: 'top', fontWeight: 800, color: 'var(--pink-deep)', fontSize: '0.95rem' }}>
                      {o.totalPrice.toLocaleString('fr-FR')} FCFA
                    </td>

                    {/* Interactive Status Switcher */}
                    <td style={{ padding: '16px 20px', verticalAlign: 'top' }}>
                      <select
                        value={o.status}
                        onChange={e => updateStatus(o.id, e.target.value as Order['status'])}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '100px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          outline: 'none',
                          cursor: 'pointer',
                          background: badgeStyle.bg,
                          color: badgeStyle.color,
                          border: `1px solid ${badgeStyle.border}`,
                        }}
                      >
                        <option value="En attente">En attente</option>
                        <option value="Confirmée">Confirmée</option>
                        <option value="En livraison">En livraison</option>
                        <option value="Livrée">Livrée</option>
                      </select>
                    </td>

                    {/* Actions Column */}
                    <td style={{ padding: '16px 24px', textAlign: 'right', verticalAlign: 'top' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                        {/* WhatsApp CTA */}
                        <a
                          href={`https://wa.me/${o.phone.replace(/[^0-9]/g, '')}?text=${waMessage}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Discuter sur WhatsApp"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '7px 14px',
                            borderRadius: '100px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            background: '#25D366',
                            color: '#FFFFFF',
                            textDecoration: 'none',
                            boxShadow: '0 2px 8px rgba(37, 211, 102, 0.25)',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <span>💬</span> WhatsApp
                        </a>

                        {/* Order Invoice Details Drawer */}
                        <button
                          onClick={() => setSelectedOrder(o)}
                          title="Facture et détails"
                          style={{
                            padding: '7px 12px',
                            borderRadius: '8px',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            color: 'var(--text)',
                            background: '#FFFFFF',
                            border: '1px solid var(--line)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.borderColor = 'var(--pink)';
                            e.currentTarget.style.color = 'var(--pink-deep)';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.borderColor = 'var(--line)';
                            e.currentTarget.style.color = 'var(--text)';
                          }}
                        >
                          👁️ Reçu
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: '60px 24px', textAlign: 'center', background: '#FFFFFF' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🛍️</div>
                    <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>
                      Aucune commande trouvée
                    </p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-soft)' }}>
                      Essayez de modifier votre mot-clé de recherche ou de réinitialiser le filtre de statut.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice / Order Details Modal */}
      {selectedOrder && (
        <div
          onClick={() => setSelectedOrder(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 70,
            background: 'rgba(21, 15, 24, 0.65)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              maxWidth: '640px',
              width: '100%',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
              border: '1px solid var(--line)',
            }}
          >
            {/* Header */}
            <div
              style={{
                background: 'linear-gradient(135deg, #150F18 0%, #2A1F30 100%)',
                padding: '24px 32px',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#A99084' }}>
                  Fiche Commande & Facture
                </p>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', fontWeight: 700, color: '#FFFFFF', marginTop: '2px' }}>
                  {selectedOrder.id}
                </h2>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  border: 'none',
                  color: '#FFFFFF',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '28px 32px', maxHeight: '75vh', overflowY: 'auto' }}>
              {/* Customer Info Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px', background: '#FAF8F4', padding: '20px', borderRadius: '16px', border: '1px solid var(--line)' }}>
                <div>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-soft)', marginBottom: '4px' }}>
                    Informations Client
                  </p>
                  <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)' }}>
                    {selectedOrder.customerName}
                  </p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--pink-deep)', fontWeight: 600, marginTop: '2px' }}>
                    📞 {selectedOrder.phone}
                  </p>
                </div>

                <div>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-soft)', marginBottom: '4px' }}>
                    Adresse de Livraison
                  </p>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text)', lineHeight: 1.4 }}>
                    📍 {selectedOrder.address}, <strong>{selectedOrder.city}</strong>
                  </p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-soft)', marginTop: '4px' }}>
                    📅 Date: {selectedOrder.date}
                  </p>
                </div>
              </div>

              {/* Status & Payment Bar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--line)' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-soft)', marginRight: '8px' }}>Mode de Paiement:</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)' }}>{selectedOrder.paymentMethod}</span>
                </div>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-soft)', marginRight: '8px' }}>Statut:</span>
                  <select
                    value={selectedOrder.status}
                    onChange={e => updateStatus(selectedOrder.id, e.target.value as Order['status'])}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '100px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: '1px solid var(--pink)',
                      background: '#FAF7F5',
                    }}
                  >
                    <option value="En attente">En attente</option>
                    <option value="Confirmée">Confirmée</option>
                    <option value="En livraison">En livraison</option>
                    <option value="Livrée">Livrée</option>
                  </select>
                </div>
              </div>

              {/* Items List */}
              <p style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-soft)', marginBottom: '12px' }}>
                Détail des Articles Commandés
              </p>
              <div style={{ border: '1px solid var(--line)', borderRadius: '14px', overflow: 'hidden', marginBottom: '24px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ background: '#FAF7F5', borderBottom: '1px solid var(--line)' }}>
                      <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-soft)' }}>Article</th>
                      <th style={{ padding: '10px 16px', textAlign: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-soft)' }}>Qté</th>
                      <th style={{ padding: '10px 16px', textAlign: 'right', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-soft)' }}>Prix Unitaire</th>
                      <th style={{ padding: '10px 16px', textAlign: 'right', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-soft)' }}>Sous-total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--line)' }}>
                        <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text)' }}>
                          {item.name}
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 700 }}>
                          {item.qty}
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--text-soft)' }}>
                          {item.price.toLocaleString('fr-FR')} FCFA
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: 'var(--pink-deep)' }}>
                          {(item.qty * item.price).toLocaleString('fr-FR')} FCFA
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total Summary */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
                <div style={{ width: '260px', background: '#FAF8F4', padding: '16px 20px', borderRadius: '14px', border: '1px solid var(--line)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-soft)', marginBottom: '8px' }}>
                    <span>Frais de livraison:</span>
                    <span style={{ fontWeight: 600, color: '#166534' }}>Inclus / Offert</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)', borderTop: '1px solid var(--line)', paddingTop: '8px' }}>
                    <span>Total Général:</span>
                    <span style={{ color: 'var(--pink-deep)' }}>{selectedOrder.totalPrice.toLocaleString('fr-FR')} FCFA</span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', borderTop: '1px solid var(--line)', paddingTop: '20px' }}>
                <button
                  onClick={() => window.print()}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '100px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    border: '1.5px solid var(--line)',
                    background: '#FFFFFF',
                    color: 'var(--text)',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  🖨️ Imprimer la Facture
                </button>
                <a
                  href={`https://wa.me/${selectedOrder.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Bonjour ${selectedOrder.customerName}, nous vous confirmons la bonne réception de votre commande ${selectedOrder.id}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '10px 22px',
                    borderRadius: '100px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    background: '#25D366',
                    color: '#FFFFFF',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  💬 WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
