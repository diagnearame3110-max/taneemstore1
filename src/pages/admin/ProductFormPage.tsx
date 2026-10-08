import { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { useProducts } from '../../store/ProductsContext';
import { useToast } from '../../store/ToastContext';
import ProductCard from '../../components/store/ProductCard';
import type { CategorySlug, Product } from '../../data/types';

const CATEGORIES: { slug: CategorySlug; label: string }[] = [
  { slug: 'corps', label: 'Soins du Corps' },
  { slug: 'visage', label: 'Soins du Visage' },
  { slug: 'accessoires', label: 'Accessoires Beauté' },
  { slug: 'bienetre', label: 'Bien-être & Hygiène' },
];

const PLACEHOLDER = 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop&auto=format';

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
    description: description || 'Description courte du produit.',
    price: priceNum,
    priceFormatted: priceNum.toLocaleString('fr-FR') + ' FCFA',
    image: image || PLACEHOLDER,
    categorySlug,
    inStock,
    updatedAt: new Date().toISOString(),
  };

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Le nom du produit est requis.';
    if (!description.trim()) e.description = 'La description est requise.';
    if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) e.price = 'Entrez un prix valide supérieur à 0.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleImageFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const src = ev.target?.result as string;
      if (!src) return;
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 600;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > MAX_DIM) {
            height *= MAX_DIM / width;
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width *= MAX_DIM / height;
            height = MAX_DIM;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          setImage(canvas.toDataURL('image/jpeg', 0.82));
        } else {
          setImage(src);
        }
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    const data = { name, description, price: parseFloat(price), image: image || PLACEHOLDER, categorySlug, inStock };
    if (existing) {
      await updateProduct(existing.id, data);
      showToast('Produit mis à jour avec succès.');
    } else {
      await addProduct(data);
      showToast('Nouveau produit ajouté.');
    }
    navigate('/admin/products');
  }

  return (
    <AdminLayout title={existing ? 'Modifier le Produit' : 'Ajouter un Nouveau Produit'}>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px', alignItems: 'start' }}>
        {/* Form Container */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid var(--line)',
            padding: '36px 40px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
        >
          {/* Nom du produit */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text)' }}>
              Nom du Produit *
            </label>
            <input
              type="text"
              placeholder="ex: Lotion Hydratante Eclat Rose"
              value={name}
              onChange={e => { setName(e.target.value); if (errors.name) setErrors(prev => ({ ...prev, name: '' })); }}
              style={{
                width: '100%',
                padding: '14px 18px',
                borderRadius: '10px',
                border: `1.5px solid ${errors.name ? '#DC2626' : 'var(--line)'}`,
                fontSize: '0.92rem',
                outline: 'none',
                transition: 'all 0.2s ease',
                background: '#FAF8F4',
                boxSizing: 'border-box',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = 'var(--pink)')}
              onBlur={e => (e.currentTarget.style.borderColor = errors.name ? '#DC2626' : 'var(--line)')}
            />
            {errors.name && <span style={{ fontSize: '0.8rem', color: '#DC2626', fontWeight: 600 }}>{errors.name}</span>}
          </div>

          {/* Catégorie */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text)' }}>
              Catégorie du Produit
            </label>
            <select
              value={categorySlug}
              onChange={e => setCategorySlug(e.target.value as CategorySlug)}
              style={{
                width: '100%',
                padding: '14px 18px',
                borderRadius: '10px',
                border: '1.5px solid var(--line)',
                fontSize: '0.92rem',
                outline: 'none',
                background: '#FAF8F4',
                cursor: 'pointer',
                boxSizing: 'border-box',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = 'var(--pink)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'var(--line)')}
            >
              {CATEGORIES.map(c => (
                <option key={c.slug} value={c.slug}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text)' }}>
                Description Courte *
              </label>
              <span style={{ fontSize: '0.76rem', color: description.length > 60 ? '#E65100' : 'var(--text-soft)', fontWeight: 600 }}>
                {description.length}/60 caractères
              </span>
            </div>
            <textarea
              value={description}
              onChange={e => { setDescription(e.target.value); if (errors.description) setErrors(prev => ({ ...prev, description: '' })); }}
              rows={3}
              placeholder="Courte description vendeuse (ex: Lotion nourrissante au beurre de karité...)"
              style={{
                width: '100%',
                padding: '14px 18px',
                borderRadius: '10px',
                border: `1.5px solid ${errors.description ? '#DC2626' : 'var(--line)'}`,
                fontSize: '0.92rem',
                outline: 'none',
                transition: 'all 0.2s ease',
                background: '#FAF8F4',
                resize: 'vertical',
                boxSizing: 'border-box',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = 'var(--pink)')}
              onBlur={e => (e.currentTarget.style.borderColor = errors.description ? '#DC2626' : 'var(--line)')}
            />
            {errors.description && <span style={{ fontSize: '0.8rem', color: '#DC2626', fontWeight: 600 }}>{errors.description}</span>}
          </div>

          {/* Prix */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text)' }}>
              Prix de Vente (FCFA) *
            </label>
            <input
              type="number"
              min="0"
              placeholder="ex: 12500"
              value={price}
              onChange={e => { setPrice(e.target.value); if (errors.price) setErrors(prev => ({ ...prev, price: '' })); }}
              style={{
                width: '100%',
                padding: '14px 18px',
                borderRadius: '10px',
                border: `1.5px solid ${errors.price ? '#DC2626' : 'var(--line)'}`,
                fontSize: '0.92rem',
                outline: 'none',
                transition: 'all 0.2s ease',
                background: '#FAF8F4',
                boxSizing: 'border-box',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = 'var(--pink)')}
              onBlur={e => (e.currentTarget.style.borderColor = errors.price ? '#DC2626' : 'var(--line)')}
            />
            {errors.price && <span style={{ fontSize: '0.8rem', color: '#DC2626', fontWeight: 600 }}>{errors.price}</span>}
          </div>

          {/* Upload Image Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text)' }}>
              Image du Produit
            </label>
            <div
              onClick={() => fileRef.current?.click()}
              style={{
                border: '2px dashed var(--line)',
                borderRadius: '16px',
                padding: '24px',
                textAlign: 'center',
                cursor: 'pointer',
                background: '#FAF8F4',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--pink)';
                e.currentTarget.style.background = 'var(--blush-soft)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--line)';
                e.currentTarget.style.background = '#FAF8F4';
              }}
            >
              {image ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <img src={image} alt="Aperçu" style={{ maxHeight: '120px', borderRadius: '10px', objectFit: 'cover', border: '1px solid var(--line)' }} />
                  <span style={{ fontSize: '0.78rem', color: 'var(--pink-deep)', fontWeight: 600 }}>Cliquez pour changer d'image</span>
                </div>
              ) : (
                <div style={{ padding: '12px 0' }}>
                  <span style={{ fontSize: '2rem', display: 'block', marginBottom: '8px' }}>📷</span>
                  <p style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text)' }}>
                    Cliquez ici pour uploader une photo
                  </p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-soft)', marginTop: '4px' }}>
                    Formats acceptés : PNG, JPG, WEBP
                  </p>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageFile} />
            <input
              type="url"
              placeholder="…ou collez une URL d'image directe (Unsplash, etc.)"
              value={image.startsWith('data:') ? '' : image}
              onChange={e => setImage(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '10px',
                border: '1.5px solid var(--line)',
                fontSize: '0.85rem',
                outline: 'none',
                background: '#FAF8F4',
                boxSizing: 'border-box',
                marginTop: '4px',
              }}
            />
          </div>

          {/* Toggle Stock Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 0' }}>
            <button
              type="button"
              onClick={() => setInStock(s => !s)}
              style={{
                position: 'relative',
                width: '52px',
                height: '28px',
                borderRadius: '100px',
                background: inStock ? 'var(--pink)' : '#D1D5DB',
                border: 'none',
                cursor: 'pointer',
                transition: 'background 0.2s ease',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: '3px',
                  left: '3px',
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  background: '#FFFFFF',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                  transition: 'transform 0.2s ease',
                  transform: inStock ? 'translateX(24px)' : 'translateX(0)',
                }}
              />
            </button>
            <div>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)' }}>
                {inStock ? '● Produit En Stock' : '○ En Rupture de Stock'}
              </span>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-soft)' }}>
                {inStock ? 'Visible et disponible à la commande' : 'Masquera le bouton d\'achat direct'}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '14px', paddingTop: '12px', borderTop: '1px solid var(--line)' }}>
            <button
              type="submit"
              style={{
                background: 'var(--pink)',
                color: '#FFFFFF',
                padding: '14px 32px',
                borderRadius: '100px',
                fontSize: '0.9rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(169, 144, 132, 0.35)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--pink-deep)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--pink)')}
            >
              {existing ? 'Enregistrer les Modifications' : 'Créer le Produit'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              style={{
                background: 'transparent',
                color: 'var(--text)',
                padding: '14px 28px',
                borderRadius: '100px',
                fontSize: '0.9rem',
                fontWeight: 600,
                border: '1.5px solid var(--line)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--blush-soft)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              Annuler
            </button>
          </div>
        </div>

        {/* Live Preview Sidebar */}
        <div style={{ position: 'sticky', top: '96px' }}>
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid var(--line)',
              padding: '24px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            }}
          >
            <div
              style={{
                fontSize: '0.76rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--text-soft)',
                marginBottom: '16px',
              }}
            >
              Aperçu en Direct sur la Boutique
            </div>
            <div style={{ maxWidth: '280px', margin: '0 auto' }}>
              <ProductCard product={preview} preview />
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
