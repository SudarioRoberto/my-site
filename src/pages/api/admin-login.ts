// src/pages/api/admin-login.ts
import type { APIRoute } from 'astro';
import crypto from 'crypto';

export const prerender = false;

// Credenciais do admin específicas solicitadas
const ADMIN_EMAIL = 'sudario@alphabioma.com';
const ADMIN_PASSWORD = '3588Ufla+';

// Função simples para verificar a senha do admin
function verifyAdminPassword(password) {
  // Comparação direta para fins de desenvolvimento
  return password === ADMIN_PASSWORD;
}

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  try {
    const { email, password } = await request.json();

    // Verificar credenciais de admin
    if (email === ADMIN_EMAIL && verifyAdminPassword(password)) {
      cookies.set('admin_auth', 'true', {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 2, // 2 horas
      });
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Login de administrador bem-sucedido.'
      }), { status: 200 });
    }

    return new Response(JSON.stringify({
      success: false,
      message: 'Credenciais de administrador inválidas.'
    }), { status: 401 });
  } catch (error) {
    console.error('Erro no login admin:', error);
    return new Response(JSON.stringify({
      success: false, 
      message: 'Erro ao processar o login.'
    }), { status: 500 });
  }
};