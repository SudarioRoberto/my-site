// src/pages/api/datamatrix.js
import { createSVGWindow } from 'svgdom';
import { SVG, registerWindow } from '@svgjs/svg.js';
import { DataMatrix } from 'datamatrix-svg';

export const prerender = false;

export async function GET({ request }) {
  const url = new URL(request.url);
  const text = url.searchParams.get('text') || '';
  const size = parseInt(url.searchParams.get('size') || '100');
  
  if (!text) {
    return new Response('Texto para codificar é obrigatório', { status: 400 });
  }
  
  try {
    // Configurar ambiente para SVG
    const window = createSVGWindow();
    const document = window.document;
    registerWindow(window, document);
    
    // Criar o Data Matrix
    const datamatrix = new DataMatrix({
      msg: text,
      margin: 2,
      size: 'auto', // Tamanho automático baseado no conteúdo
      color: '#000000'
    });
    
    // Obter o SVG como string
    const svgString = datamatrix.toString();
    
    // Retornar o SVG
    return new Response(svgString, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'max-age=86400'
      }
    });
  } catch (error) {
    console.error('Erro ao gerar Data Matrix:', error);
    return new Response('Erro ao gerar código Data Matrix', { status: 500 });
  }
}

// src/pages/api/download-datamatrix.js
import { createSVGWindow } from 'svgdom';
import { SVG, registerWindow } from '@svgjs/svg.js';
import { DataMatrix } from 'datamatrix-svg';

export const prerender = false;

export async function GET({ request }) {
  const url = new URL(request.url);
  const text = url.searchParams.get('id') || '';
  
  if (!text) {
    return new Response('ID para codificar é obrigatório', { status: 400 });
  }
  
  try {
    // Configurar ambiente para SVG
    const window = createSVGWindow();
    const document = window.document;
    registerWindow(window, document);
    
    // Criar o Data Matrix
    const datamatrix = new DataMatrix({
      msg: text,
      margin: 2,
      size: 'auto', // Tamanho automático baseado no conteúdo
      color: '#000000'
    });
    
    // Obter o SVG como string
    const svgString = datamatrix.toString();
    
    // Adicionar alguns metadados para garantir que o SVG se comporte bem quando baixado
    const fileName = `datamatrix-${text.replace(/[^a-zA-Z0-9]/g, '-')}.svg`;
    
    // Retornar o SVG como um download
    return new Response(svgString, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      }
    });
  } catch (error) {
    console.error('Erro ao gerar Data Matrix:', error);
    return new Response('Erro ao gerar código Data Matrix', { status: 500 });
  }
}

// src/pages/api/delete-generic-sample.js
import { supabase } from '../../lib/supabase.js';

export const prerender = false;

export async function POST({ request }) {
  const formData = await request.formData();
  const id = formData.get('id');
  
  if (!id) {
    return new Response('ID é obrigatório', { status: 400 });
  }
  
  try {
    // Verificar se a amostra está associada a algum projeto
    const { data: sample } = await supabase
      .from('generic_samples')
      .select('project_id')
      .eq('id', id)
      .single();
      
    if (sample?.project_id) {
      return new Response('Não é possível excluir uma amostra associada a um projeto', { status: 403 });
    }
    
    // Excluir a amostra
    const { error } = await supabase
      .from('generic_samples')
      .delete()
      .eq('id', id);
      
    if (error) {
      throw error;
    }
    
    return new Response(null, {
      status: 303,
      headers: { Location: '/admin/generic-samples' }
    });
  } catch (error) {
    console.error('Erro ao excluir amostra:', error);
    return new Response('Erro ao excluir amostra', { status: 500 });
  }
}