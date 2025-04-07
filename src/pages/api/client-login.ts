// src/pages/api/client-login.ts
import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase.js';
import { verifyPassword } from '../../lib/auth.js';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const { projectId, password } = await request.json();

    if (!projectId || !password) {
      return new Response(
        JSON.stringify({ success: false, message: 'ID do projeto e senha são obrigatórios.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Buscar o projeto pelo ID
    const { data: project, error } = await supabase
      .from('projects')
      .select('id, password_hash, password_salt, email')
      .eq('project_id', projectId)
      .single();

    if (error || !project) {
      return new Response(
        JSON.stringify({ success: false, message: 'Projeto não encontrado.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verificar se a senha corresponde
    const passwordMatch = verifyPassword(
      password, 
      project.password_hash, 
      project.password_salt
    );

    if (!passwordMatch) {
      return new Response(
        JSON.stringify({ success: false, message: 'Senha incorreta.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Definir cookies para a sessão do cliente
    cookies.set('client_auth', 'true', {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 horas
    });

    cookies.set('client_project_id', project.id, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 horas
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Login realizado com sucesso.',
        projectId: project.id 
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Erro no login:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Erro interno do servidor.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};