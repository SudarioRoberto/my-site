import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ cookies, request }) => {
  cookies.delete('admin_auth', {
    path: '/',
    httpOnly: true,
    sameSite: 'strict',
    secure: true,
  });

  return Response.redirect(new URL('/', request.url), 303);
};