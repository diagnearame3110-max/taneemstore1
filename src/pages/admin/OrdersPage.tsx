import { useState } from 'react';
import { Icon } from '@iconify/react';
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
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { showToast } = useToast();

  const filteredOrders = orders.filter(o => {
    const matchSearch = o.customerName.toLowerCase().includes(search.toLowerCase()) ||
                        o.id.toLowerCase().includes(search.toLowerCase()) ||
                        o.phone.includes(search) ||
                        o.city.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const updateStatus = (id: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    if (selectedOrder && selectedOrder.id === id) {
      setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
    }
    showToast(`Statut de la commande ${id} mis à jour : "${newStatus}".`);
  };

  const getStatusBadgeStyle = (status: Order['status']) => {
    switch (status) {
      case 'En attente': return { bg: '#FEF3C7', color: '#92400E', border: '#FDE68A' };
      case 'Confirmée': return { bg: '#E0F2FE', color: '#0369A1', border: '#BAE6FD' };
      case 'En livraison': return { bg: '#F5F3FF', color: '#5B21B6', border: '#DDD6FE' };
      case 'Livrée': return { bg: '#DCFCE7', color: '#166534', border: '#BBF7D0' };
    }
  };

  const totalOrdersCount = orders.length;
  const pendingCount = orders.filter(o => o.status === 'En attente').length;
  const deliveryCount = orders.filter(o => o.status === 'En livraison').length;
  const completedCount = orders.filter(o => o.status === 'Livrée').length;
  const totalRevenue = orders.reduce((acc, curr) => acc + curr.totalPrice, 0);

  return (
    <AdminLayout title="Gestion des Commandes">
      {/* Top KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {/* Card 1: Total */}
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
              Total Commandes
            </p>
            <p style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', fontFamily: "'Cormorant Garamond', serif" }}>
              {totalOrdersCount}
            </p>
          </div>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#F5EFEA', color: 'var(--pink-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon icon="lucide:shopping-bag" style={{ fontSize: '1.4rem' }} />
          </div>
        </div>

        {/* Card 2: En Attente */}
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
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon icon="lucide:clock" style={{ fontSize: '1.4rem' }} />
          </div>
        </div>

        {/* Card 3: En Livraison */}
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
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#F5F3FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon icon="lucide:truck" style={{ fontSize: '1.4rem' }} />
          </div>
        </div>

        {/* Card 4: Livrées */}
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
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#DCFCE7', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon icon="lucide:check-circle-2" style={{ fontSize: '1.4rem' }} />
          </div>
        </div>

        {/* Card 5: Chiffre d'Affaires */}
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
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#FFFFFF', color: 'var(--pink-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <Icon icon="lucide:gem" style={{ fontSize: '1.4rem' }} />
          </div>
        </div>
      </div>

      {/* Toolbar Search & Status Filter Tabs */}
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
            <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-soft)', display: 'flex', alignItems: 'center' }}>
              <Icon icon="lucide:search" style={{ fontSize: '1.1rem' }} />
            </span>
            <input
              type="text"
              placeholder="Rechercher par client, N° commande, ville..."
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
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Icon icon="lucide:x" style={{ fontSize: '1rem' }} />
              </button>
            )}
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', borderTop: '1px solid var(--line)', paddingTop: '14px' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-soft)', textTransform: 'uppercase', letterSpacing: '0.05em', marginRight: '8px' }}>
            Filtrer par statut:
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

      {/* Orders Table - Completely Static Layout, No Horizontal Scrollbar */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '20px',
          border: '1px solid var(--line)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem', tableLayout: 'fixed' }}>
          <thead>
            <tr style={{ background: '#FAF7F5', borderBottom: '1px solid var(--line)' }}>
              <th style={{ width: '25%', padding: '16px 18px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-soft)' }}>
                N° Commande & Date
              </th>
              <th style={{ width: '31%', padding: '16px 18px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-soft)' }}>
                Client & Destination
              </th>
              <th style={{ width: '20%', padding: '16px 18px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-soft)' }}>
                Statut
              </th>
              <th style={{ width: '16%', padding: '16px 18px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-soft)' }}>
                Total
              </th>
              <th style={{ width: '8%', padding: '16px 18px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-soft)', textAlign: 'center' }}>
                Détails
              </th>
            </tr>
          </thead>
            <tbody>
              {filteredOrders.map(o => {
                const badgeStyle = getStatusBadgeStyle(o.status);

                return (
                  <tr
                    key={o.id}
                    style={{
                      borderBottom: '1px solid var(--line)',
                      transition: 'background 0.15s ease',
                      cursor: 'pointer',
                    }}
                    onClick={() => setSelectedOrder(o)}
                    onMouseEnter={e => (e.currentTarget.style.background = '#FAF8F4')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    {/* Commande ID & Date */}
                    <td style={{ padding: '14px 20px', verticalAlign: 'middle' }}>
                      <div style={{ fontWeight: 700, color: 'var(--text)', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                        {o.id}
                      </div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-soft)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Icon icon="lucide:calendar" style={{ fontSize: '0.8rem' }} />
                        <span>{o.date}</span>
                      </div>
                    </td>

                    {/* Client & City */}
                    <td style={{ padding: '14px 20px', verticalAlign: 'middle' }}>
                      <div style={{ fontWeight: 700, color: 'var(--text)' }}>
                        {o.customerName}
                      </div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-soft)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ background: '#FAF7F5', padding: '2px 8px', borderRadius: '100px', border: '1px solid var(--line)', fontWeight: 600, color: 'var(--pink-deep)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                          <Icon icon="lucide:map-pin" style={{ fontSize: '0.75rem' }} /> {o.city}
                        </span>
                      </div>
                    </td>

                    {/* Statut Badge */}
                    <td style={{ padding: '14px 20px', verticalAlign: 'middle' }}>
                      <span
                        style={{
                          padding: '5px 12px',
                          borderRadius: '100px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          background: badgeStyle.bg,
                          color: badgeStyle.color,
                          border: `1px solid ${badgeStyle.border}`,
                          display: 'inline-block',
                        }}
                      >
                        {o.status}
                      </span>
                    </td>

                    {/* Montant Total */}
                    <td style={{ padding: '14px 20px', verticalAlign: 'middle', fontWeight: 800, color: 'var(--pink-deep)', fontSize: '0.95rem' }}>
                      {o.totalPrice.toLocaleString('fr-FR')} FCFA
                    </td>

                    {/* Eye Icon Only Compact Button */}
                    <td style={{ padding: '14px 20px', textAlign: 'center', verticalAlign: 'middle' }}>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedOrder(o);
                        }}
                        title="Voir les détails de la commande"
                        style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '50%',
                          fontSize: '0.9rem',
                          color: '#FFFFFF',
                          background: 'linear-gradient(90deg, #A99084 0%, #8F776C 100%)',
                          border: 'none',
                          cursor: 'pointer',
                          boxShadow: '0 2px 8px rgba(169, 144, 132, 0.3)',
                          transition: 'all 0.2s ease',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
                        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                      >
                        <Icon icon="lucide:eye" style={{ fontSize: '1.1rem' }} />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '60px 24px', textAlign: 'center', background: '#FFFFFF' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>
                      <Icon icon="lucide:shopping-bag" style={{ color: 'var(--text-soft)' }} />
                    </div>
                    <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>
                      Aucune commande trouvée
                    </p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-soft)' }}>
                      Essayez de modifier votre mot-clé de recherche ou de réinitialiser le filtre.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
      </div>

      {/* Comprehensive Order Details Modal */}
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
            {/* Modal Header */}
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
                  Fiche Commande & Facture Client
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
                <Icon icon="lucide:x" style={{ fontSize: '1.2rem' }} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '28px 32px', maxHeight: '75vh', overflowY: 'auto' }}>
              {/* Customer & Address Card */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px', background: '#FAF8F4', padding: '20px', borderRadius: '16px', border: '1px solid var(--line)' }}>
                <div>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-soft)', marginBottom: '4px' }}>
                    Informations Client
                  </p>
                  <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)' }}>
                    {selectedOrder.customerName}
                  </p>
                  <a
                    href={`tel:${selectedOrder.phone}`}
                    style={{ fontSize: '0.85rem', color: 'var(--pink-deep)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '4px', textDecoration: 'none' }}
                  >
                    <Icon icon="lucide:phone" /> {selectedOrder.phone}
                  </a>
                </div>

                <div>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-soft)', marginBottom: '4px' }}>
                    Livraison & Date
                  </p>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text)', lineHeight: 1.4 }}>
                    📍 {selectedOrder.address}, <strong>{selectedOrder.city}</strong>
                  </p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-soft)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Icon icon="lucide:calendar" /> Date: {selectedOrder.date}
                  </p>
                </div>
              </div>

              {/* Status & Payment Controls Bar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--line)' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-soft)', marginRight: '8px' }}>Paiement:</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)', background: '#FAF7F5', padding: '4px 10px', borderRadius: '100px', border: '1px solid var(--line)' }}>
                    {selectedOrder.paymentMethod}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-soft)', marginRight: '8px' }}>Changer le statut:</span>
                  <select
                    value={selectedOrder.status}
                    onChange={e => updateStatus(selectedOrder.id, e.target.value as Order['status'])}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '100px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: '1.5px solid var(--pink)',
                      background: '#FAF7F5',
                      color: 'var(--text)',
                      outline: 'none',
                    }}
                  >
                    <option value="En attente">En attente</option>
                    <option value="Confirmée">Confirmée</option>
                    <option value="En livraison">En livraison</option>
                    <option value="Livrée">Livrée</option>
                  </select>
                </div>
              </div>

              {/* Items List Table */}
              <p style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-soft)', marginBottom: '12px' }}>
                Articles Commandés
              </p>
              <div style={{ border: '1px solid var(--line)', borderRadius: '14px', overflow: 'hidden', marginBottom: '24px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ background: '#FAF7F5', borderBottom: '1px solid var(--line)' }}>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-soft)' }}>Produit</th>
                      <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-soft)' }}>Qté</th>
                      <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-soft)' }}>Prix Unitaire</th>
                      <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-soft)' }}>Sous-total</th>
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

              {/* Total Calculation Card */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
                <div style={{ width: '260px', background: '#FAF8F4', padding: '16px 20px', borderRadius: '14px', border: '1px solid var(--line)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-soft)', marginBottom: '8px' }}>
                    <span>Livraison:</span>
                    <span style={{ fontWeight: 600, color: '#166534' }}>Inclus / Offert</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)', borderTop: '1px solid var(--line)', paddingTop: '8px' }}>
                    <span>Total Général:</span>
                    <span style={{ color: 'var(--pink-deep)' }}>{selectedOrder.totalPrice.toLocaleString('fr-FR')} FCFA</span>
                  </div>
                </div>
              </div>

              {/* Modal Bottom Actions */}
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
                  <Icon icon="lucide:printer" style={{ fontSize: '1rem' }} /> Imprimer
                </button>
                <a
                  href={`https://wa.me/${selectedOrder.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Bonjour ${selectedOrder.customerName}, nous vous contactons concernant votre commande Taneem'Store ${selectedOrder.id} (${selectedOrder.totalPrice.toLocaleString('fr-FR')} FCFA).`)}`}
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
                    boxShadow: '0 3px 10px rgba(37, 211, 102, 0.3)',
                  }}
                >
                  <Icon icon="logos:whatsapp-icon" style={{ fontSize: '1.1rem' }} /> WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
