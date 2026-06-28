// Middleware edge que normaliza paths com caracteres acentuados antes
// do routing estatico do Vercel.
//
// Por que isto existe: o React Router do bundle SPA do home faz pushState
// para '/documentario' (sem acento), mas se o usuario ja navegou antes
// por uma URL com acento (do SW cacheado ou do historico do navegador),
// o navegador URL-encodeia o path antes de mandar o GET. Resultado: o
// Vercel recebe '/document%C3%A1rio' e o rewrite catch-all serve o
// index.html (404 client-side).
//
// Este middleware intercepta o request, decodifica o pathname, mapeia
// variates acentuados para a versao canonica sem acento, e redireciona
// 308. Roda em todas as regioes edge antes dos rewrites estaticos.
//
// Adicionar variates aqui quando descobrir novas inconsistencias.
//
// IMPORTANT: matcher deve ser restrito a paths que NAO sao assets para
// nao interferir com o cache de arquivos estaticos. Os rewrites estaticos
// ja redirecionam /documental, /documentario, /copa-2026/* corretamente.

export const config = {
  matcher: [
    // Aplica em qualquer path que nao seja asset, favicon, sw.js,
    // sitemap ou robots
    '/((?!assets/|__l5e/|robots\\.txt|sitemap\\.xml|sw\\.js|favicon\\.ico).*)'
  ]
};

// Mapa de pathname normalizado: chave = variante acentuada,
// valor = canonica sem acento (sempre comeca com /)
const ACCENT_NORMALIZATIONS = {
  '/documentário': '/documentario',
  '/documentário/': '/documentario',
};

export default function middleware(request) {
  const url = new URL(request.url);

  // Primeiro: tentar match exato com variates acentuadas conhecidas
  if (ACCENT_NORMALIZATIONS[url.pathname]) {
    const canonical = ACCENT_NORMALIZATIONS[url.pathname];
    const target = new URL(canonical + url.search + url.hash, url.origin);
    return Response.redirect(target, 308);
  }

  // Segundo: tentar match com pathname decodificado (caso o navegador
  // tenha enviado URL-encoded como /document%C3%A1rio)
  let decoded;
  try {
    decoded = decodeURIComponent(url.pathname);
  } catch (e) {
    // pathname malformado - deixa passar para o routing normal
    return;
  }

  if (decoded !== url.pathname && ACCENT_NORMALIZATIONS[decoded]) {
    const canonical = ACCENT_NORMALIZATIONS[decoded];
    const target = new URL(canonical + url.search + url.hash, url.origin);
    return Response.redirect(target, 308);
  }

  // Nenhuma normalizacao aplicavel - continua o routing normal
}
