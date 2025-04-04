import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const form = await request.formData();
  const id = form.get('id')?.toString();

  if (!id) return new Response('Sample ID ausente', { status: 400 });

  const { error } = await supabase.from('samples').delete().eq('id', id);
  if (error) return new Response('Erro ao excluir amostra', { status: 500 });

  return new Response(null, {
    status: 303,
    headers: { Location: '/admin' },
  });
};
