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
