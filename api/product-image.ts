import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://bxuouzgqgzvygqwypsvr.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_7tPa4PHngIR4mF_-A95fDg_c33x872e';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop&auto=format';

export default async function handler(req: any, res: any) {
  // Extract id from query params or url
  let id = req.query?.id;
  if (!id && req.url) {
    try {
      const parsedUrl = new URL(req.url, 'http://localhost');
      id = parsedUrl.searchParams.get('id');
    } catch {}
  }

  if (!id || typeof id !== 'string') {
    res.writeHead(302, { Location: FALLBACK_IMAGE });
    return res.end();
  }

  try {
    const { data: product, error } = await supabase
      .from('products')
      .select('image')
      .eq('id', id)
      .single();

    if (error || !product || !product.image) {
      res.writeHead(302, { Location: FALLBACK_IMAGE });
      return res.end();
    }

    const imageStr = String(product.image);

    // If already an external HTTP URL, redirect
    if (imageStr.startsWith('http://') || imageStr.startsWith('https://')) {
      res.writeHead(302, { Location: imageStr });
      return res.end();
    }

    // If data:image/...;base64,...
    const match = imageStr.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/);
    if (match) {
      const mimeType = match[1];
      const base64Data = match[2];
      const buffer = Buffer.from(base64Data, 'base64');

      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Length', buffer.length);
      res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400');
      return res.status ? res.status(200).send(buffer) : res.end(buffer);
    }

    res.writeHead(302, { Location: FALLBACK_IMAGE });
    return res.end();
  } catch (err) {
    console.error('Error serving product image:', err);
    res.writeHead(302, { Location: FALLBACK_IMAGE });
    return res.end();
  }
}
