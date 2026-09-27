import { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { useProducts } from '../../store/ProductsContext';
import { useToast } from '../../store/ToastContext';
import ProductCard from '../../components/store/ProductCard';
import type { CategorySlug, Product } from '../../data/types';

const CATEGORIES: { slug: CategorySlug; label: string }[] = [
  { slug: 'corps', label: 'Corps' },
  { slug: 'visage', label: 'Visage' },
  { slug: 'maquillage', label: 'Maquillage' },
  { slug: 'accessoires', label: 'Accessoires' },
  { slug: 'bienetre', label: 'Bien-être & hygiène' },
];

const PLACEHOLDER = 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop&auto=format';

export default function ProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const { products, addProduct, updateProduct } = useProducts();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const existing = id ? products.find(p => p.id === id) : null;

  const [name, setName] = useState(existing?.name ?? '');
  const [categorySlug, setCategorySlug] = useState<CategorySlug>(existing?.categorySlug ?? 'corps');
  const [description, setDescription] = useState(existing?.description ?? '');
  const [price, setPrice] = useState(existing?.price.toString() ?? '');
  const [image, setImage] = useState(existing?.image ?? '');
  const [inStock, setInStock] = useState(existing?.inStock ?? true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileRef = useRef<HTMLInputElement>(null);

  const priceNum = parseFloat(price) || 0;
  const preview: Product = {
    id: existing?.id ?? '__preview__',
    name: name || 'Nom du produit',
    description: description || 'Description courte.',
    price: priceNum,
    priceFormatted: priceNum.toLocaleString('fr-FR') + ' FCFA',
    image: image || PLACEHOLDER,
    categorySlug,
    inStock,
    updatedAt: new Date().toISOString(),
  };

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Le nom est requis.';
    if (!description.trim()) e.description = 'La description est requise.';
    if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) e.price = 'Entrez un prix valide.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleImageFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    const data = { name, description, price: parseFloat(price), image: image || PLACEHOLDER, categorySlug, inStock };
    if (existing) {
      updateProduct(existing.id, data);
      showToast('Produit modifié.');
    } else {
      addProduct(data);
      showToast('Produit ajouté.');
    }
    navigate('/admin/products');
  }

  const inputClass = "w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-colors bg-white";
  const inputStyle = { borderColor: '#E5E3E8', color: 'var(--ink)' };

  return (
    <AdminLayout title={existing ? 'Modifier le produit' : 'Nouveau produit'}>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form fields */}
        <div className="lg:col-span-2 bg-white rounded-xl border p-6 flex flex-col gap-5" style={{ borderColor: '#E5E3E8' }}>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--ink)' }}>
              Nom du produit *
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className={inputClass}
              style={inputStyle}
              onFocus={e => (e.currentTarget.style.borderColor = 'var(--pink)')}
              onBlur={e => (e.currentTarget.style.borderColor = errors.name ? '#dc2626' : '#E5E3E8')}
            />
            {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--ink)' }}>
              Catégorie
            </label>
            <select
              value={categorySlug}
              onChange={e => setCategorySlug(e.target.value as CategorySlug)}
              className={inputClass}
              style={inputStyle}
            >
              {CATEGORIES.map(c => (
                <option key={c.slug} value={c.slug}>{c.label}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide flex justify-between" style={{ color: 'var(--ink)' }}>
              <span>Description courte *</span>
              <span className={description.length > 60 ? 'text-orange-500' : ''} style={{ color: 'var(--ink-soft)' }}>
                {description.length}/60
              </span>
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              className={inputClass}
              style={inputStyle}
              onFocus={e => (e.currentTarget.style.borderColor = 'var(--pink)')}
              onBlur={e => (e.currentTarget.style.borderColor = '#E5E3E8')}
            />
            {errors.description && <p className="text-xs text-red-600">{errors.description}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--ink)' }}>
              Prix (FCFA) *
            </label>
            <input
              type="number"
              min="0"
              value={price}
              onChange={e => setPrice(e.target.value)}
              className={inputClass}
              style={inputStyle}
              onFocus={e => (e.currentTarget.style.borderColor = 'var(--pink)')}
              onBlur={e => (e.currentTarget.style.borderColor = '#E5E3E8')}
            />
            {errors.price && <p className="text-xs text-red-600">{errors.price}</p>}
            {priceNum > 0 && (
              <p className="text-xs" style={{ color: 'var(--ink-soft)' }}>
                Aperçu : {priceNum.toLocaleString('fr-FR')} FCFA
              </p>
            )}
          </div>

          {/* Image */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--ink)' }}>
              Image du produit
            </label>
            <div
              className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors"
              style={{ borderColor: '#E5E3E8' }}
              onClick={() => fileRef.current?.click()}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--pink)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#E5E3E8')}
            >
              {image ? (
                <img src={image} alt="Aperçu" className="mx-auto max-h-32 rounded-lg object-cover" />
              ) : (
                <p className="text-sm" style={{ color: 'var(--ink-soft)' }}>
                  Cliquez pour uploader une image ou collez une URL ci-dessous
                </p>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageFile} />
            <input
              type="url"
              placeholder="…ou collez une URL d'image"
              value={image.startsWith('data:') ? '' : image}
              onChange={e => setImage(e.target.value)}
              className={inputClass}
              style={inputStyle}
            />
          </div>

          {/* Stock toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setInStock(s => !s)}
              className="relative w-12 h-6 rounded-full transition-colors"
              style={{ background: inStock ? 'var(--pink)' : '#D1D5DB' }}
            >
              <span
                className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform"
                style={{ transform: inStock ? 'translateX(24px)' : 'translateX(0)' }}
              />
            </button>
            <span className="text-sm font-medium" style={{ color: 'var(--ink)' }}>
              {inStock ? 'En stock' : 'Rupture de stock'}
            </span>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg font-semibold text-sm text-white transition-colors"
              style={{ background: 'var(--pink)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--pink-deep)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--pink)')}
            >
              Enregistrer
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="px-6 py-2.5 rounded-lg font-semibold text-sm border transition-colors"
              style={{ borderColor: '#E5E3E8', color: 'var(--ink)' }}
            >
              Annuler
            </button>
          </div>
        </div>

        {/* Live preview */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--ink-soft)' }}>
            Aperçu de la carte
          </p>
          <div style={{ maxWidth: 260 }}>
            <ProductCard product={preview} preview />
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
