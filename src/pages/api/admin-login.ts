// src/pages/api/admin-login.ts
import type { APIRoute } from 'astro';

// ⚠️ Em produção, use um sistema de autenticação seguro e banco de dados
const ADMIN_EMAIL = 'sudario@alphabioma.com';
const ADMIN_PASSWORD = '3588Ufla+'; // Substitua por algo mais seguro

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const form = await request.formData();
  const email = form.get('email')?.toString();
  const password = form.get('password')?.toString();

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    cookies.set('admin_auth', 'true', {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 2, // 2 horas
    });
    return redirect('/admin/projects');
  }

  return new Response('Credenciais inválidas', {
    status: 401,
  });
};