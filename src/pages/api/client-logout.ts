import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ cookies, redirect }) => {
  cookies.delete('client_auth', {
    path: '/',
  });
  
  cookies.delete('client_project_id', {
    path: '/',
  });

  return redirect('/login');
};