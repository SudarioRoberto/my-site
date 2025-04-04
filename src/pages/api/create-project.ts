import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase.js';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const form = await request.formData();
  const name = form.get('projectName')?.toString().trim();
  const description = form.get('description')?.toString().trim();
  const sampleCount = parseInt(form.get('sampleCount')?.toString() || '0');

  if (!name || isNaN(sampleCount) || sampleCount <= 0) {
    return new Response('Dados inválidos', { status: 400 });
  }

  const { data: project, error: projectError } = await supabase
    .from('projects')
    .insert([{ name, description }])
    .select()
    .single();

  if (projectError) {
    console.error(projectError);
    return new Response('Erro ao criar projeto', { status: 500 });
  }

  const samples = Array.from({ length: sampleCount }, (_, i) => ({
    sample_id: `${name.toUpperCase().replace(/\s+/g, '-')}-${String(i + 1).padStart(3, '0')}`,
    project_id: project.id,
    status: 'Não coletado',
  }));

  const { error: sampleError } = await supabase.from('samples').insert(samples);
  if (sampleError) {
    console.error(sampleError);
    return new Response('Erro ao salvar amostras', { status: 500 });
  }

  return new Response(null, {
    status: 303,
    headers: { Location: '/admin' }
  });
};
