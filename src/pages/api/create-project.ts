// src/pages/api/create-project.ts
import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase.js';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const contentType = request.headers.get('content-type') || '';

  if (!contentType.includes('application/x-www-form-urlencoded') && !contentType.includes('multipart/form-data')) {
    return new Response('Unsupported Content-Type', { status: 415 });
  }

  const form = await request.formData();
  const projectName = form.get('projectName')?.toString().trim();
  const sampleCount = parseInt(form.get('sampleCount')?.toString() || '0');

  if (!projectName || isNaN(sampleCount) || sampleCount <= 0) {
    return new Response('Dados inválidos', { status: 400 });
  }

  const { data: project, error: projectError } = await supabase
    .from('projects')
    .insert([{ name: projectName }])
    .select()
    .single();

  if (projectError) {
    console.error(projectError);
    return new Response('Erro ao criar projeto', { status: 500 });
  }

  const samples = Array.from({ length: sampleCount }, (_, i) => {
    const index = String(i + 1).padStart(3, '0');
    return {
      sample_id: `${projectName.toUpperCase().replace(/\s+/g, '-')}-${index}`,
      project_id: project.id,
      status: 'Não coletado',
    };
  });

  const { error: sampleError } = await supabase.from('samples').insert(samples);

  if (sampleError) {
    console.error(sampleError);
    return new Response('Erro ao salvar amostras', { status: 500 });
  }

  return new Response(null, {
    status: 303,
    headers: {
      Location: '/admin/projects',
    },
  });
};
