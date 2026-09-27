import { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  items: { name: string; qty: number; price: number }[];
  totalPrice: number;
  paymentMethod: 'Wave' | 'Orange Money' | 'Espèces à la livraison';
  status: 'En attente' | 'Confirmée' | 'En livraison' | 'Livrée';
  date: string;
}

const INITIAL_ORDERS: Order[] = [
  {
    id: 'CMD-2026-089',
    customerName: 'Aïssatou Sow',
    phone: '+221778945612',
    address: 'Mermoz Pyrotechnie, Villa 42',
    city: 'Dakar',
    items: [
      { name: 'Gommage Corps Hydratant Karité', qty: 1, price: 12500 },
      { name: 'Sérum Éclat Visage Vitamine C', qty: 1, price: 15000 },
    ],
    totalPrice: 27500,
    paymentMethod: 'Wave',
    status: 'En livraison',
    date: '2026-09-26 18:45',
  },
  {
    id: 'CMD-2026-088',
    customerName: 'Fatou Diop',
    phone: '+221781234567',
    address: 'Sacré-Cœur 3, Immeuble B',
    city: 'Dakar',
    items: [
      { name: 'Huile Sèche Scintillante Rose Gold', qty: 2, price: 18000 },
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
      { name: 'Masque Argile & Rose Purifiant', qty: 1, price: 14000 },
      { name: 'Brume Hydratante Apaisante', qty: 1, price: 9500 },
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
      { name: 'Coffret Glow Intégra', qty: 1, price: 35000 },
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

  const filteredOrders = orders.filter(o => {
    const matchSearch = o.customerName.toLowerCase().includes(search.toLowerCase()) ||
                        o.id.toLowerCase().includes(search.toLowerCase()) ||
                        o.phone.includes(search);
    const matchStatus = !statusFilter || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const updateStatus = (id: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  const getStatusBadgeStyle = (status: Order['status']) => {
    switch (status) {
      case 'En attente': return { bg: '#FEF3C7', color: '#92400E' };
      case 'Confirmée': return { bg: '#E0F2FE', color: '#0369A1' };
      case 'En livraison': return { bg: '#EDE9FE', color: '#5B21B6' };
      case 'Livrée': return { bg: '#DCFCE7', color: '#166534' };
    }
  };

  const totalRevenue = orders.reduce((acc, curr) => acc + curr.totalPrice, 0);

  return (
    <AdminLayout title="Gestion des Commandes">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 border border-[#E5E3E8]">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-soft)] mb-1">
            Total Commandes
          </p>
          <p className="text-2xl font-bold text-[var(--text)]">{orders.length}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-[#E5E3E8]">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-soft)] mb-1">
            En Attente / Traitement
          </p>
          <p className="text-2xl font-bold text-amber-600">
            {orders.filter(o => o.status === 'En attente' || o.status === 'Confirmée').length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-[#E5E3E8]">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-soft)] mb-1">
            En Livraison
          </p>
          <p className="text-2xl font-bold text-purple-600">
            {orders.filter(o => o.status === 'En livraison').length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-[#E5E3E8]">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-soft)] mb-1">
            Chiffre d'Affaires
          </p>
          <p className="text-xl font-bold text-[var(--pink-deep)]">
            {totalRevenue.toLocaleString('fr-FR')} FCFA
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-[#E5E3E8] p-4 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-72">
          <input
            type="text"
            placeholder="Rechercher par nom, n° commande, téléphone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full px-4 py-2 text-sm rounded-lg border border-[#E5E3E8] outline-none focus:border-[var(--pink)]"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-medium text-[var(--text-soft)]">Statut:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border border-[#E5E3E8] outline-none focus:border-[var(--pink)] bg-white"
          >
            <option value="">Tous les statuts</option>
            <option value="En attente">En attente</option>
            <option value="Confirmée">Confirmée</option>
            <option value="En livraison">En livraison</option>
            <option value="Livrée">Livrée</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-[#E5E3E8] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-[#FAFAF9] border-b border-[#E5E3E8] text-xs font-semibold text-[var(--text-soft)] uppercase tracking-wider">
                <th className="px-6 py-3.5">Commande</th>
                <th className="px-6 py-3.5">Client & Contact</th>
                <th className="px-6 py-3.5">Produits</th>
                <th className="px-6 py-3.5">Paiement</th>
                <th className="px-6 py-3.5">Total</th>
                <th className="px-6 py-3.5">Statut</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EEF2]">
              {filteredOrders.map(o => {
                const badgeStyle = getStatusBadgeStyle(o.status);
                const waMessage = encodeURIComponent(
                  `Bonjour ${o.customerName}, nous vous contactons concernant votre commande Taneem'Store ${o.id} (${o.totalPrice.toLocaleString('fr-FR')} FCFA).`
                );

                return (
                  <tr key={o.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-[var(--text)] whitespace-nowrap">
                      <div>{o.id}</div>
                      <div className="text-xs font-normal text-[var(--text-soft)] mt-0.5">{o.date}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-[var(--text)]">{o.customerName}</div>
                      <div className="text-xs text-[var(--text-soft)]">{o.phone}</div>
                      <div className="text-xs text-[var(--text-soft)] mt-0.5">{o.address} ({o.city})</div>
                    </td>
                    <td className="px-6 py-4">
                      <ul className="text-xs space-y-1">
                        {o.items.map((item, idx) => (
                          <li key={idx} className="text-[var(--text)]">
                            <span className="font-medium">{item.qty}x</span> {item.name}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-[var(--text-soft)]">
                      {o.paymentMethod}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-[var(--pink-deep)]">
                      {o.totalPrice.toLocaleString('fr-FR')} FCFA
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={o.status}
                        onChange={e => updateStatus(o.id, e.target.value as Order['status'])}
                        className="px-2.5 py-1 rounded-full text-xs font-semibold outline-none cursor-pointer border-none"
                        style={{ background: badgeStyle.bg, color: badgeStyle.color }}
                      >
                        <option value="En attente">En attente</option>
                        <option value="Confirmée">Confirmée</option>
                        <option value="En livraison">En livraison</option>
                        <option value="Livrée">Livrée</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <a
                        href={`https://wa.me/${o.phone.replace(/[^0-9]/g, '')}?text=${waMessage}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#25D366] text-white hover:bg-[#1EBE5A] transition-colors"
                      >
                        <span>WhatsApp</span>
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
