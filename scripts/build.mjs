import { cp, mkdir, readdir, rm, readFile, writeFile } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const projectRoot = process.cwd();
const sourceDir = path.join(projectRoot, 'source');
const distDir = path.join(projectRoot, 'dist');
const siteDomain = process.env.ABOLA_SITE_DOMAIN || 'https://www.abolaconecta.com.br';
const allowIndex = process.env.ABOLA_ALLOW_INDEX !== '0';
const cacheVersion = process.env.ABOLA_CACHE_VERSION || '20260623-social-previews';

if (!existsSync(sourceDir)) {
  throw new Error(`Fonte nao encontrada: ${sourceDir}`);
}

await rm(distDir, { recursive: true, force: true });
await mkdir(distDir, { recursive: true });
await cp(sourceDir, distDir, { recursive: true });

const routeCanonicals = new Map([
  ['index.html', `${siteDomain}/`],
  ['documentário/index.html', `${siteDomain}/documentário/`],
  ['sobre/index.html', `${siteDomain}/sobre/`],
  ['serviços/index.html', `${siteDomain}/serviços/`],
  ['comunidade/index.html', `${siteDomain}/comunidade/`],
  ['loja/index.html', `${siteDomain}/loja/`],
  ['blog/index.html', `${siteDomain}/blog/`],
  ['contato/index.html', `${siteDomain}/contato/`],
  ['apoie/index.html', `${siteDomain}/apoie/`],
  ['la-pelota-conecta/index.html', `${siteDomain}/la-pelota-conecta/`],
  ['faq/index.html', `${siteDomain}/faq/`],
  ['mapa-do-site/index.html', `${siteDomain}/mapa-do-site/`],
  ['privacidade/index.html', `${siteDomain}/privacidade/`],
  ['copa-2026/index.html', `${siteDomain}/copa-2026/`],
  ['copa-2026/fichas/index.html', `${siteDomain}/copa-2026/fichas/`],
  ['copa-2026/baixar/index.html', `${siteDomain}/copa-2026/baixar/`],
  ['copa-2026/camisa-abya-yala/index.html', `${siteDomain}/copa-2026/camisa-abya-yala/`],
  ['camisa-abya-yala/index.html', `${siteDomain}/camisa-abya-yala/`],
  ['loja/index.html', `${siteDomain}/loja/`],
  ['copa-2026/ebook-consolidado/index.html', `${siteDomain}/copa-2026/ebook-consolidado/`],
  ['copa-2026/ebook-educadores-v1/index.html', `${siteDomain}/copa-2026/ebook-educadores-v1/`],
]);

const socialDefaults = {
  siteName: 'A Bola Conecta',
  locale: 'pt_BR',
  type: 'website',
  title: 'A Bola Conecta | Documentário, futebol e educação',
  description: 'Documentário + Metodologia ABC para implementar a Lei 10.639 em escolas. Educação antirracista com futebol, ancestralidade africana e capacitação docente.',
  image: '/assets/social-preview/og-a-bola-conecta.jpg',
  imageAlt: 'A Bola Conecta - documentário, futebol e educação',
};

const routeSocial = new Map([
  ['index.html', {
    title: 'A Bola Conecta | Documentário, futebol e educação',
    description: 'Documentário + Metodologia ABC para implementar a Lei 10.639 em escolas. Educação antirracista com futebol, ancestralidade africana e capacitação docente.',
    image: '/assets/og-card-metodologia.png',
    imageAlt: 'A Bola Conecta - documentário, futebol e educação',
    imageType: 'image/png',
  }],
  ['metodologia/index.html', {
    title: 'Metodologia ABC | Audiovisual, Bola e Câmera - A Bola Conecta',
    description: 'Ferramentas alfabetizadoras em habilidades sociais para educação, esporte, cultura, ambientes corporativos e projetos sociais. Por Mônica Saraiva da Silva e Sebastián Acevedo Vásquez.',
    image: '/assets/og-card-metodologia.png',
    imageAlt: 'Metodologia ABC - Audiovisual, Bola e Câmera',
    imageType: 'image/png',
  }],
  ['documentario/index.html', {
    title: 'Documentário A Bola Conecta | Futebol, África e Brasil',
    description: 'Conheca o documentário A Bola Conecta e sua proposta educativa entre futebol, ancestralidade africana, cultura afro-brasileira e Lei 10.639.',
    image: '/assets/og-card-documentario.png',
    imageAlt: 'Preview do documentário A Bola Conecta',
    imageType: 'image/png',
  }],
  ['sobre/index.html', {
    title: 'Sobre A Bola Conecta | Metodologia ABC',
    description: 'Conheca a proposta que une áudiovisual, bola e camera para transformar futebol em línguagem educativa, cultural e territorial.',
    image: '/assets/og-card-metodologia.png',
    imageAlt: 'Sobre A Bola Conecta e a Metodologia ABC',
    imageType: 'image/png',
  }],
  ['servicos/index.html', {
    title: 'Serviços educativos | A Bola Conecta',
    description: 'Oficinas, formações, mediação cultural e experiências educativas com futebol, áudiovisual, território e cultura popular.',
    image: '/assets/og-card-servicos.png',
    imageAlt: 'Serviços educativos A Bola Conecta',
    imageType: 'image/png',
  }],
  ['comunidade/index.html', {
    title: 'Comunidade | A Bola Conecta',
    description: 'Entre no Time da Educação e acompanhe a circulação de materiais, encontros e experiências com futebol, cultura e território.',
    image: '/assets/og-card-metodologia.png',
    imageAlt: 'Comunidade A Bola Conecta',
    imageType: 'image/png',
  }],
  ['blog/index.html', {
    title: 'Blog | A Bola Conecta',
    description: 'Textos, campanhas e materiais sobre futebol, educação, cultura, território e metodologia ABC.',
    image: '/assets/og-card-metodologia.png',
    imageAlt: 'Blog A Bola Conecta',
    imageType: 'image/png',
  }],
  ['apoie/index.html', {
    title: 'Contribuir para a circulação | A Bola Conecta',
    description: 'Contribua com valor livre para sustentar pesquisa, produção, tecnologia e circulação educativa, com registro pela agência.',
    image: '/assets/og-card-metodologia.png',
    imageAlt: 'Contribuir para a circulação educativa A Bola Conecta',
    imageType: 'image/png',
  }],
  ['la-pelota-conecta/index.html', {
    title: 'La Pelota Conecta | Documental, fútbol y educación latinoamericana',
    description: 'Versión en español latinoamericano para ver el documental, explorar fichas de la Copa 2026 y usar el fútbol como lectura de território, memória y cultura.',
    image: '/assets/social-preview/og-a-bola-conecta.jpg',
    imageAlt: 'La Pelota Conecta - documental, fútbol y educación latinoamericana',
    locale: 'es_419',
  }],
  ['copa-2026/index.html', {
    title: 'Gondwana na Copa 2026 | A Bola Conecta',
    description: 'Fichas, guia e perguntas para ler a Copa pela Terra, pelos povos, pela memória e pela bola.',
    image: '/assets/og-card-copa-2026.png',
    imageAlt: 'Gondwana na Copa 2026 - campanha educativa',
    imageType: 'image/png',
  }],
  ['copa-2026/fichas/index.html', {
    title: 'Fichas Gondwana na Copa 2026 - 48 seleções | A Bola Conecta',
    description: '48 seleções como portas de entrada para território, memória, cultura popular, migrações, povos e futebol.',
    image: '/assets/social-preview/og-fichas-copa.jpg',
    imageAlt: 'Fichas educativas Gondwana na Copa 2026 - 48 seleções',
    imageType: 'image/jpeg',
  }],
  ['copa-2026/baixar/index.html', {
    title: 'Baixar Guia Gondwana na Copa | A Bola Conecta',
    description: 'Baixe o guia educativo de acesso aberto para usar em aula, oficina, projeto social, clube ou roda de conversa.',
    image: '/assets/social-preview/og-baixar-guia.jpg',
    imageAlt: 'Baixar guia educativo Gondwana na Copa',
  }],
  ['copa-2026/camisa-abya-yala/index.html', {
    title: 'Camisa Abya Yala | Gondwana na Copa',
    description: 'Vista a campanha Gondwana na Copa e ajude a circular uma leitura educativa da Copa 2026.',
    image: '/assets/social-preview/og-camisa-abya-yala.jpg',
    imageAlt: 'Camisa Abya Yala da campanha Gondwana na Copa',
  }],
  ['camisa-abya-yala/index.html', {
    title: 'Viste o Manto Gondwana FC · Camisa Abya Yala | A Bola Conecta',
    description: 'Camiseta pedagógica Gondwana FC + LWGA. Manual pedagógico, carta de compromisso simbólica e contraparte visível para abrir la cancha del conocimiento en los territórios.',
    image: '/assets/social-preview/og-camisa-abya-yala.jpg',
    imageAlt: 'Camisa Abya Yala - camiseta pedagógica do Time da Educação',
  }],
  ['loja/index.html', {
    title: 'Loja | A Bola Conecta',
    description: 'Peças pedagógicas e culturais do Time da Educação: camiseta Abya Yala, guias, materiais e livros.',
    image: '/assets/og-card-metodologia.png',
    imageAlt: 'Loja A Bola Conecta',
    imageType: 'image/png',
  }],
  ['imprensa/index.html', {
    title: 'Imprensa | A Bola Conecta',
    description: 'Sala de imprensa do A Bola Conecta: releases, fotos oficiais, kit de midia, logomarcas e contatos para jornalistas, marcas e produtores.',
    image: '/assets/og-card-metodologia.png',
    imageAlt: 'Imprensa A Bola Conecta',
    imageType: 'image/png',
  }],
  ['festivais/index.html', {
    title: 'Trajetoria em festivais | A Bola Conecta',
    description: 'Premiacoes e exibicoes do doc A Bola Conecta em festivais, mostras e espacos academicos no Brasil e no exterior.',
    image: '/assets/og-card-documentario.png',
    imageAlt: 'Trajetoria do documentario A Bola Conecta em festivais',
    imageType: 'image/png',
  }],
  ['time-da-educacao/index.html', {
    title: 'Time da Educacao | Gondwana FC',
    description: 'O Time da Educacao do Gondwana FC: futebol, ancestralidade africana, cultura afro-brasileira e Lei 10.639 em sala de aula.',
    image: '/assets/og-card-metodologia.png',
    imageAlt: 'Time da Educacao Gondwana FC',
    imageType: 'image/png',
  }],
  ['faq/index.html', {
    title: 'FAQ | A Bola Conecta',
    description: 'Perguntas frequentes sobre o projeto A Bola Conecta, a Metodologia ABC, o doc e como participar.',
    image: '/assets/og-card-metodologia.png',
    imageAlt: 'FAQ A Bola Conecta',
    imageType: 'image/png',
  }],
  ['la-pelota-conecta/index.html', {
    title: 'La Pelota Conecta | Documental, futbol y educacion',
    description: 'Version en espanol latinoamericano para ver el documental, explorar fichas de la Copa 2026 y usar el futbol como lectura de territorio, memoria y cultura.',
    image: '/assets/og-card-metodologia.png',
    imageAlt: 'La Pelota Conecta - documental, futbol y educacion',
    imageType: 'image/png',
    locale: 'es_419',
  }],
  ['mapa-do-site/index.html', {
    title: 'Mapa do site | A Bola Conecta',
    description: 'Indice completo de paginas do site A Bola Conecta.',
    image: '/assets/og-card-metodologia.png',
    imageAlt: 'Mapa do site A Bola Conecta',
    imageType: 'image/png',
  }],
  ['privacidade/index.html', {
    title: 'Privacidade | A Bola Conecta',
    description: 'Politica de privacidade e tratamento de dados do site A Bola Conecta.',
    image: '/assets/og-card-metodologia.png',
    imageAlt: 'Privacidade A Bola Conecta',
    imageType: 'image/png',
  }],
  ['contato/index.html', {
    title: 'Contato | A Bola Conecta',
    description: 'Fale com a equipe do A Bola Conecta e do Gondwana FC - Time da Educacao. Imprensa, parcerias, escolas, federacoes e projetos sociais.',
    image: '/assets/og-card-metodologia.png',
    imageAlt: 'Contato A Bola Conecta',
    imageType: 'image/png',
  }],
  ['copa-2026/sobre-para-ia/index.html', {
    title: 'Resumo para imprensa e IA | Gondwana na Copa',
    description: 'Resumo estruturado da campanha Gondwana na Copa para jornalistas, buscadores, IA e parceiros institucionais.',
    image: '/assets/social-preview/og-gondwana-na-copa.jpg',
    imageAlt: 'Resumo Gondwana na Copa para imprensa e IA',
  }],
  ['blog/gondwana-na-copa-guia-educativo-copa-2026/index.html', {
    type: 'article',
    title: 'Gondwana na Copa: guia educativo para a Copa 2026',
    description: 'Uma campanha educativa para transformar a Copa 2026 em leitura de mundo, com fichas online e guia em PDF.',
    image: '/assets/social-preview/og-blog-copa.jpg',
    imageAlt: 'Artigo Gondwana na Copa - guia educativo para a Copa 2026',
  }],
  ['blog/faq-gondwana-na-copa-copa-2026/index.html', {
    type: 'article',
    title: 'FAQ Gondwana na Copa | A Bola Conecta',
    description: 'Perguntas e respostas sobre a campanha Gondwana na Copa, fichas educativas, guia e usos pedagógicos.',
    image: '/assets/social-preview/og-gondwana-na-copa.jpg',
    imageAlt: 'FAQ Gondwana na Copa',
  }],

  ['copa-2026/fichas/08-brasil/index.html', {
    title: 'Brasil na Copa 2026 | Ficha educativa Gondwana FC',
    description: 'Ficha educativa de Brasil: território, povos, memória, cultura popular e futebol para ler a Copa 2026 em sala de aula e mediação cultural.',
    image: '/assets/social-preview/og-copa-2026-fichas.jpg',
    imageAlt: 'Ficha educativa Brasil - A Bola Conecta',
  }],
  ['copa-2026/fichas/09-argentina/index.html', {
    title: 'Argentina na Copa 2026 | Ficha educativa Gondwana FC',
    description: 'Ficha educativa de Argentina: território, povos, memória, cultura popular e futebol para ler a Copa 2026 em sala de aula e mediação cultural.',
    image: '/assets/social-preview/og-copa-2026-fichas.jpg',
    imageAlt: 'Ficha educativa Argentina - A Bola Conecta',
  }],
  ['copa-2026/fichas/10-uruguai/index.html', {
    title: 'Uruguai na Copa 2026 | Ficha educativa Gondwana FC',
    description: 'Ficha educativa de Uruguai: território, povos, memória, cultura popular e futebol para ler a Copa 2026 em sala de aula e mediação cultural.',
    image: '/assets/social-preview/og-copa-2026-fichas.jpg',
    imageAlt: 'Ficha educativa Uruguai - A Bola Conecta',
  }],
  ['copa-2026/fichas/11-colombia/index.html', {
    title: 'Colômbia na Copa 2026 | Ficha educativa Gondwana FC',
    description: 'Ficha educativa de Colômbia: território, povos, memória, cultura popular e futebol para ler a Copa 2026 em sala de aula e mediação cultural.',
    image: '/assets/social-preview/og-copa-2026-fichas.jpg',
    imageAlt: 'Ficha educativa Colombia - A Bola Conecta',
  }],
  ['copa-2026/fichas/12-equador/index.html', {
    title: 'Equador na Copa 2026 | Ficha educativa Gondwana FC',
    description: 'Ficha educativa de Equador: território, povos, memória, cultura popular e futebol para ler a Copa 2026 em sala de aula e mediação cultural.',
    image: '/assets/social-preview/og-copa-2026-fichas.jpg',
    imageAlt: 'Ficha educativa Equador - A Bola Conecta',
  }],
  ['copa-2026/fichas/13-paraguai/index.html', {
    title: 'Paraguai na Copa 2026 | Ficha educativa Gondwana FC',
    description: 'Ficha educativa de Paraguai: território, povos, memória, cultura popular e futebol para ler a Copa 2026 em sala de aula e mediação cultural.',
    image: '/assets/social-preview/og-copa-2026-fichas.jpg',
    imageAlt: 'Ficha educativa Paraguai - A Bola Conecta',
  }],
  ['copa-2026/fichas/14-africa-do-sul/index.html', {
    title: 'África do Sul na Copa 2026 | Ficha educativa Gondwana FC',
    description: 'Ficha educativa de África do Sul: território, povos, memória, cultura popular e futebol para ler a Copa 2026 em sala de aula e mediação cultural.',
    image: '/assets/social-preview/og-copa-2026-fichas.jpg',
    imageAlt: 'Ficha educativa África do sul - A Bola Conecta',
  }],
  ['copa-2026/fichas/15-gana/index.html', {
    title: 'Gana na Copa 2026 | Ficha educativa Gondwana FC',
    description: 'Ficha educativa de Gana: território, povos, memória, cultura popular e futebol para ler a Copa 2026 em sala de aula e mediação cultural.',
    image: '/assets/social-preview/og-copa-2026-fichas.jpg',
    imageAlt: 'Ficha educativa Gana - A Bola Conecta',
  }],
  ['copa-2026/fichas/16-senegal/index.html', {
    title: 'Senegal na Copa 2026 | Ficha educativa Gondwana FC',
    description: 'Ficha educativa de Senegal: território, povos, memória, cultura popular e futebol para ler a Copa 2026 em sala de aula e mediação cultural.',
    image: '/assets/social-preview/og-copa-2026-fichas.jpg',
    imageAlt: 'Ficha educativa Senegal - A Bola Conecta',
  }],
  ['copa-2026/fichas/17-egito/index.html', {
    title: 'Egito na Copa 2026 | Ficha educativa Gondwana FC',
    description: 'Ficha educativa de Egito: território, povos, memória, cultura popular e futebol para ler a Copa 2026 em sala de aula e mediação cultural.',
    image: '/assets/social-preview/og-copa-2026-fichas.jpg',
    imageAlt: 'Ficha educativa Egito - A Bola Conecta',
  }],
  ['copa-2026/fichas/18-marrocos/index.html', {
    title: 'Marrocos na Copa 2026 | Ficha educativa Gondwana FC',
    description: 'Ficha educativa de Marrocos: território, povos, memória, cultura popular e futebol para ler a Copa 2026 em sala de aula e mediação cultural.',
    image: '/assets/social-preview/og-copa-2026-fichas.jpg',
    imageAlt: 'Ficha educativa Marrocos - A Bola Conecta',
  }],
  ['copa-2026/fichas/19-argelia/index.html', {
    title: 'Argélia na Copa 2026 | Ficha educativa Gondwana FC',
    description: 'Ficha educativa de Argélia: território, povos, memória, cultura popular e futebol para ler a Copa 2026 em sala de aula e mediação cultural.',
    image: '/assets/social-preview/og-copa-2026-fichas.jpg',
    imageAlt: 'Ficha educativa Argelia - A Bola Conecta',
  }],
  ['copa-2026/fichas/20-tunisia/index.html', {
    title: 'Tunísia na Copa 2026 | Ficha educativa Gondwana FC',
    description: 'Ficha educativa de Tunísia: território, povos, memória, cultura popular e futebol para ler a Copa 2026 em sala de aula e mediação cultural.',
    image: '/assets/social-preview/og-copa-2026-fichas.jpg',
    imageAlt: 'Ficha educativa Tunisia - A Bola Conecta',
  }],
  ['copa-2026/fichas/21-costa-do-marfim/index.html', {
    title: 'Costa do Marfim na Copa 2026 | Ficha educativa Gondwana FC',
    description: 'Ficha educativa de Costa do Marfim: território, povos, memória, cultura popular e futebol para ler a Copa 2026 em sala de aula e mediação cultural.',
    image: '/assets/social-preview/og-copa-2026-fichas.jpg',
    imageAlt: 'Ficha educativa Costa do marfim - A Bola Conecta',
  }],
  ['copa-2026/fichas/22-república-democratica-do-congo/index.html', {
    title: 'República Democrática do Congo na Copa 2026 | Ficha educativa Gondwana FC',
    description: 'Ficha educativa de República Democrática do Congo: território, povos, memória, cultura popular e futebol para ler a Copa 2026 em sala de aula e mediação cultural.',
    image: '/assets/social-preview/og-copa-2026-fichas.jpg',
    imageAlt: 'Ficha educativa República democratica do congo - A Bola Conecta',
  }],
  ['copa-2026/fichas/23-australia/index.html', {
    title: 'Austrália na Copa 2026 | Ficha educativa Gondwana FC',
    description: 'Ficha educativa de Austrália: território, povos, memória, cultura popular e futebol para ler a Copa 2026 em sala de aula e mediação cultural.',
    image: '/assets/social-preview/og-copa-2026-fichas.jpg',
    imageAlt: 'Ficha educativa Australia - A Bola Conecta',
  }],
  ['copa-2026/fichas/24-nova-zelandia/index.html', {
    title: 'Nova Zelândia na Copa 2026 | Ficha educativa Gondwana FC',
    description: 'Ficha educativa de Nova Zelândia: território, povos, memória, cultura popular e futebol para ler a Copa 2026 em sala de aula e mediação cultural.',
    image: '/assets/social-preview/og-copa-2026-fichas.jpg',
    imageAlt: 'Ficha educativa Nova zelandia - A Bola Conecta',
  }],
  ['copa-2026/fichas/25-arabia-saudita/index.html', {
    title: 'Arábia Saudita na Copa 2026 | Ficha educativa Gondwana FC',
    description: 'Ficha educativa de Arábia Saudita: território, povos, memória, cultura popular e futebol para ler a Copa 2026 em sala de aula e mediação cultural.',
    image: '/assets/social-preview/og-copa-2026-fichas.jpg',
    imageAlt: 'Ficha educativa Arabia saudita - A Bola Conecta',
  }],
  ['copa-2026/fichas/26-catar/index.html', {
    title: 'Catar na Copa 2026 | Ficha educativa Gondwana FC',
    description: 'Ficha educativa de Catar: território, povos, memória, cultura popular e futebol para ler a Copa 2026 em sala de aula e mediação cultural.',
    image: '/assets/social-preview/og-copa-2026-fichas.jpg',
    imageAlt: 'Ficha educativa Catar - A Bola Conecta',
  }],
  ['copa-2026/fichas/27-jordania/index.html', {
    title: 'Jordânia na Copa 2026 | Ficha educativa Gondwana FC',
    description: 'Ficha educativa de Jordânia: território, povos, memória, cultura popular e futebol para ler a Copa 2026 em sala de aula e mediação cultural.',
    image: '/assets/social-preview/og-copa-2026-fichas.jpg',
    imageAlt: 'Ficha educativa Jordania - A Bola Conecta',
  }],
  ['copa-2026/fichas/28-iraque/index.html', {
    title: 'Iraque na Copa 2026 | Ficha educativa Gondwana FC',
    description: 'Ficha educativa de Iraque: território, povos, memória, cultura popular e futebol para ler a Copa 2026 em sala de aula e mediação cultural.',
    image: '/assets/social-preview/og-copa-2026-fichas.jpg',
    imageAlt: 'Ficha educativa Iraque - A Bola Conecta',
  }],
  ['copa-2026/fichas/29-estados-unidos/index.html', {
    title: 'Estados Unidos na Copa 2026 | Ficha educativa Gondwana FC',
    description: 'Ficha educativa de Estados Unidos: território, povos, memória, cultura popular e futebol para ler a Copa 2026 em sala de aula e mediação cultural.',
    image: '/assets/social-preview/og-copa-2026-fichas.jpg',
    imageAlt: 'Ficha educativa Estados unidos - A Bola Conecta',
  }],
  ['copa-2026/fichas/30-mexico/index.html', {
    title: 'México na Copa 2026 | Ficha educativa Gondwana FC',
    description: 'Ficha educativa de México: território, povos, memória, cultura popular e futebol para ler a Copa 2026 em sala de aula e mediação cultural.',
    image: '/assets/social-preview/og-copa-2026-fichas.jpg',
    imageAlt: 'Ficha educativa Mexico - A Bola Conecta',
  }],
  ['copa-2026/fichas/31-canada/index.html', {
    title: 'Canadá na Copa 2026 | Ficha educativa Gondwana FC',
    description: 'Ficha educativa de Canadá: território, povos, memória, cultura popular e futebol para ler a Copa 2026 em sala de aula e mediação cultural.',
    image: '/assets/social-preview/og-copa-2026-fichas.jpg',
    imageAlt: 'Ficha educativa Canada - A Bola Conecta',
  }],
  ['copa-2026/fichas/32-japao/index.html', {
    title: 'Japão na Copa 2026 | Ficha educativa Gondwana FC',
    description: 'Ficha educativa de Japão: território, povos, memória, cultura popular e futebol para ler a Copa 2026 em sala de aula e mediação cultural.',
    image: '/assets/social-preview/og-copa-2026-fichas.jpg',
    imageAlt: 'Ficha educativa Japao - A Bola Conecta',
  }],
  ['copa-2026/fichas/33-ira/index.html', {
    title: 'Irã na Copa 2026 | Ficha educativa Gondwana FC',
    description: 'Ficha educativa de Irã: território, povos, memória, cultura popular e futebol para ler a Copa 2026 em sala de aula e mediação cultural.',
    image: '/assets/social-preview/og-copa-2026-fichas.jpg',
    imageAlt: 'Ficha educativa Ira - A Bola Conecta',
  }],
  ['copa-2026/fichas/34-coreia-do-sul/index.html', {
    title: 'Coreia do Sul na Copa 2026 | Ficha educativa Gondwana FC',
    description: 'Ficha educativa de Coreia do Sul: território, povos, memória, cultura popular e futebol para ler a Copa 2026 em sala de aula e mediação cultural.',
    image: '/assets/social-preview/og-copa-2026-fichas.jpg',
    imageAlt: 'Ficha educativa Coreia do sul - A Bola Conecta',
  }],
  ['copa-2026/fichas/35-uzbequistao/index.html', {
    title: 'Uzbequistão na Copa 2026 | Ficha educativa Gondwana FC',
    description: 'Ficha educativa de Uzbequistão: território, povos, memória, cultura popular e futebol para ler a Copa 2026 em sala de aula e mediação cultural.',
    image: '/assets/social-preview/og-copa-2026-fichas.jpg',
    imageAlt: 'Ficha educativa Uzbequistao - A Bola Conecta',
  }],
  ['copa-2026/fichas/36-cabo-verde/index.html', {
    title: 'Cabo Verde na Copa 2026 | Ficha educativa Gondwana FC',
    description: 'Ficha educativa de Cabo Verde: território, povos, memória, cultura popular e futebol para ler a Copa 2026 em sala de aula e mediação cultural.',
    image: '/assets/social-preview/og-copa-2026-fichas.jpg',
    imageAlt: 'Ficha educativa Cabo verde - A Bola Conecta',
  }],
  ['copa-2026/fichas/37-inglaterra/index.html', {
    title: 'Inglaterra na Copa 2026 | Ficha educativa Gondwana FC',
    description: 'Ficha educativa de Inglaterra: território, povos, memória, cultura popular e futebol para ler a Copa 2026 em sala de aula e mediação cultural.',
    image: '/assets/social-preview/og-copa-2026-fichas.jpg',
    imageAlt: 'Ficha educativa Inglaterra - A Bola Conecta',
  }],
  ['copa-2026/fichas/38-franca/index.html', {
    title: 'França na Copa 2026 | Ficha educativa Gondwana FC',
    description: 'Ficha educativa de França: território, povos, memória, cultura popular e futebol para ler a Copa 2026 em sala de aula e mediação cultural.',
    image: '/assets/social-preview/og-copa-2026-fichas.jpg',
    imageAlt: 'Ficha educativa Franca - A Bola Conecta',
  }],
  ['copa-2026/fichas/39-espanha/index.html', {
    title: 'Espanha na Copa 2026 | Ficha educativa Gondwana FC',
    description: 'Ficha educativa de Espanha: território, povos, memória, cultura popular e futebol para ler a Copa 2026 em sala de aula e mediação cultural.',
    image: '/assets/social-preview/og-copa-2026-fichas.jpg',
    imageAlt: 'Ficha educativa Espanha - A Bola Conecta',
  }],
  ['copa-2026/fichas/40-alemanha/index.html', {
    title: 'Alemanha na Copa 2026 | Ficha educativa Gondwana FC',
    description: 'Ficha educativa de Alemanha: território, povos, memória, cultura popular e futebol para ler a Copa 2026 em sala de aula e mediação cultural.',
    image: '/assets/social-preview/og-copa-2026-fichas.jpg',
    imageAlt: 'Ficha educativa Alemanha - A Bola Conecta',
  }],
  ['copa-2026/fichas/41-portugal/index.html', {
    title: 'Portugal na Copa 2026 | Ficha educativa Gondwana FC',
    description: 'Ficha educativa de Portugal: território, povos, memória, cultura popular e futebol para ler a Copa 2026 em sala de aula e mediação cultural.',
    image: '/assets/social-preview/og-copa-2026-fichas.jpg',
    imageAlt: 'Ficha educativa Portugal - A Bola Conecta',
  }],
  ['copa-2026/fichas/42-países-baixos/index.html', {
    title: 'Países Baixos na Copa 2026 | Ficha educativa Gondwana FC',
    description: 'Ficha educativa de Países Baixos: território, povos, memória, cultura popular e futebol para ler a Copa 2026 em sala de aula e mediação cultural.',
    image: '/assets/social-preview/og-copa-2026-fichas.jpg',
    imageAlt: 'Ficha educativa Países baixos - A Bola Conecta',
  }],
  ['copa-2026/fichas/43-belgica/index.html', {
    title: 'Bélgica na Copa 2026 | Ficha educativa Gondwana FC',
    description: 'Ficha educativa de Bélgica: território, povos, memória, cultura popular e futebol para ler a Copa 2026 em sala de aula e mediação cultural.',
    image: '/assets/social-preview/og-copa-2026-fichas.jpg',
    imageAlt: 'Ficha educativa Belgica - A Bola Conecta',
  }],
  ['copa-2026/fichas/44-croacia/index.html', {
    title: 'Croácia na Copa 2026 | Ficha educativa Gondwana FC',
    description: 'Ficha educativa de Croácia: território, povos, memória, cultura popular e futebol para ler a Copa 2026 em sala de aula e mediação cultural.',
    image: '/assets/social-preview/og-copa-2026-fichas.jpg',
    imageAlt: 'Ficha educativa Croacia - A Bola Conecta',
  }],
  ['copa-2026/fichas/45-suica/index.html', {
    title: 'Suíça na Copa 2026 | Ficha educativa Gondwana FC',
    description: 'Ficha educativa de Suíça: território, povos, memória, cultura popular e futebol para ler a Copa 2026 em sala de aula e mediação cultural.',
    image: '/assets/social-preview/og-copa-2026-fichas.jpg',
    imageAlt: 'Ficha educativa Suica - A Bola Conecta',
  }],
  ['copa-2026/fichas/46-austria/index.html', {
    title: 'Áustria na Copa 2026 | Ficha educativa Gondwana FC',
    description: 'Ficha educativa de Áustria: território, povos, memória, cultura popular e futebol para ler a Copa 2026 em sala de aula e mediação cultural.',
    image: '/assets/social-preview/og-copa-2026-fichas.jpg',
    imageAlt: 'Ficha educativa Austria - A Bola Conecta',
  }],
  ['copa-2026/fichas/47-escocia/index.html', {
    title: 'Escócia na Copa 2026 | Ficha educativa Gondwana FC',
    description: 'Ficha educativa de Escócia: território, povos, memória, cultura popular e futebol para ler a Copa 2026 em sala de aula e mediação cultural.',
    image: '/assets/social-preview/og-copa-2026-fichas.jpg',
    imageAlt: 'Ficha educativa Escocia - A Bola Conecta',
  }],
  ['copa-2026/fichas/48-noruega/index.html', {
    title: 'Noruega na Copa 2026 | Ficha educativa Gondwana FC',
    description: 'Ficha educativa de Noruega: território, povos, memória, cultura popular e futebol para ler a Copa 2026 em sala de aula e mediação cultural.',
    image: '/assets/social-preview/og-copa-2026-fichas.jpg',
    imageAlt: 'Ficha educativa Noruega - A Bola Conecta',
  }],
  ['copa-2026/fichas/49-bosnia-e-herzegovina/index.html', {
    title: 'Bósnia e Herzegovina na Copa 2026 | Ficha educativa Gondwana FC',
    description: 'Ficha educativa de Bósnia e Herzegovina: território, povos, memória, cultura popular e futebol para ler a Copa 2026 em sala de aula e mediação cultural.',
    image: '/assets/social-preview/og-copa-2026-fichas.jpg',
    imageAlt: 'Ficha educativa Bosnia e herzegovina - A Bola Conecta',
  }],
  ['copa-2026/fichas/50-suecia/index.html', {
    title: 'Suécia na Copa 2026 | Ficha educativa Gondwana FC',
    description: 'Ficha educativa de Suécia: território, povos, memória, cultura popular e futebol para ler a Copa 2026 em sala de aula e mediação cultural.',
    image: '/assets/social-preview/og-copa-2026-fichas.jpg',
    imageAlt: 'Ficha educativa Suecia - A Bola Conecta',
  }],
  ['copa-2026/fichas/51-turquia/index.html', {
    title: 'Turquia na Copa 2026 | Ficha educativa Gondwana FC',
    description: 'Ficha educativa de Turquia: território, povos, memória, cultura popular e futebol para ler a Copa 2026 em sala de aula e mediação cultural.',
    image: '/assets/social-preview/og-copa-2026-fichas.jpg',
    imageAlt: 'Ficha educativa Turquia - A Bola Conecta',
  }],
  ['copa-2026/fichas/52-tchequia/index.html', {
    title: 'Tchéquia na Copa 2026 | Ficha educativa Gondwana FC',
    description: 'Ficha educativa de Tchéquia: território, povos, memória, cultura popular e futebol para ler a Copa 2026 em sala de aula e mediação cultural.',
    image: '/assets/social-preview/og-copa-2026-fichas.jpg',
    imageAlt: 'Ficha educativa Tchequia - A Bola Conecta',
  }],
  ['copa-2026/fichas/53-panama/index.html', {
    title: 'Panamá na Copa 2026 | Ficha educativa Gondwana FC',
    description: 'Ficha educativa de Panamá: território, povos, memória, cultura popular e futebol para ler a Copa 2026 em sala de aula e mediação cultural.',
    image: '/assets/social-preview/og-copa-2026-fichas.jpg',
    imageAlt: 'Ficha educativa Panama - A Bola Conecta',
  }],
  ['copa-2026/fichas/54-curação/index.html', {
    title: 'Curaçao na Copa 2026 | Ficha educativa Gondwana FC',
    description: 'Ficha educativa de Curaçao: território, povos, memória, cultura popular e futebol para ler a Copa 2026 em sala de aula e mediação cultural.',
    image: '/assets/social-preview/og-copa-2026-fichas.jpg',
    imageAlt: 'Ficha educativa Curação - A Bola Conecta',
  }],
  ['copa-2026/fichas/55-haiti/index.html', {
    title: 'Haiti na Copa 2026 | Ficha educativa Gondwana FC',
    description: 'Ficha educativa de Haiti: território, povos, memória, cultura popular e futebol para ler a Copa 2026 em sala de aula e mediação cultural.',
    image: '/assets/social-preview/og-copa-2026-fichas.jpg',
    imageAlt: 'Ficha educativa Haiti - A Bola Conecta',
  }],
]);

const referencedAssets = new Set();
const htmlFiles = [];
const textFiles = [];
const textExtensions = new Set(['.html', '.js', '.css', '.xml', '.txt', '.json', '.webmanifest']);

async function collectTextFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const absolutePath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await collectTextFiles(absolutePath);
    } else if (entry.isFile() && textExtensions.has(path.extname(entry.name))) {
      const relativePath = path.relative(distDir, absolutePath);
      textFiles.push(relativePath);
      if (entry.name.endsWith('.html')) htmlFiles.push(relativePath);
    }
  }
}

function canonicalFor(relativePath) {
  if (routeCanonicals.has(relativePath)) return routeCanonicals.get(relativePath);
  if (relativePath === 'index.html') return `${siteDomain}/`;
  if (!relativePath.endsWith('/index.html')) return null;
  return `${siteDomain}/${relativePath.replace(/\/index\.html$/, '/')}`;
}

function trackReferencedAssets(html) {
  for (const match of html.matchAll(/(?:src|href)="\/?(assets\/[^"?#]+)(?:[?#][^"]*)?"/g)) {
    referencedAssets.add(match[1]);
  }
}

function versionLocalAssets(html) {
  return html.replace(/\/(assets\/(?:index-Bc6DgKrQ-crm-api-leads1\.js|abc-analytics\.js|nav-guard\.js|copa-nav-inject\.js))(?:\?v=[^"']*)?/g, `/$1?v=${cacheVersion}`);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function absoluteUrl(value) {
  if (!value) return value;
  if (/^https?:\/\//.test(value)) return value;
  return `${siteDomain}${value.startsWith('/') ? '' : '/'}${value}`;
}

function upsertTag(html, matcher, tag) {
  if (matcher.test(html)) return html.replace(matcher, tag);
  return html.replace('</head>', `  ${tag}\n</head>`);
}

// Mapa slug -> codigo ISO do pais para fichas individuais
// Lido de source/copa-2026/fichas/story-data.js para garantir consistencia
let fichaCountryMapCache = null;
function getFichaCountryMap() {
  if (fichaCountryMapCache) return fichaCountryMapCache;
  const storyDataPath = path.join(sourceDir, 'copa-2026', 'fichas', 'story-data.js');
  if (!existsSync(storyDataPath)) return new Map();
  const source = readFileSync(storyDataPath, 'utf8');
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(`${source}\n;globalThis.__countries = countries;`, sandbox);
  const countries = sandbox.__countries || [];
  const map = new Map();
  countries.forEach((country, index) => {
    const num = String(index + 8).padStart(2, '0');
    const slug = `${num}-${country.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
    map.set(slug, { code: country.code, name: country.name });
  });
  fichaCountryMapCache = map;
  return map;
}

function fichaImageFor(relativePath) {
  const match = relativePath.match(/^copa-2026\/fichas\/([^/]+)\/index\.html$/);
  if (!match) return null;
  const slug = match[1];
  const countryInfo = getFichaCountryMap().get(slug);
  if (!countryInfo) return null;
  return {
    image: `/api/og-ficha/?pais=${countryInfo.code}&style=c`,
    imageType: 'image/png',
    imageAlt: `Ficha educativa ${countryInfo.name} - Copa 2026 - Gondwana FC`,
  };
}

// Converte código ISO-3166 alpha-2 (ex: 'br', 'co') em emoji de bandeira.
// 'br' -> '🇧🇷', 'co' -> '🇨🇴', etc.
// Funciona no og:title (texto Unicode), renderizado nativamente por WhatsApp/Telegram/iOS/Android.
function countryCodeToEmoji(code) {
  if (!code || code.length !== 2) return '';
  const codePoints = [...code.toUpperCase()].map(c => 0x1F1E6 + (c.charCodeAt(0) - 65));
  return String.fromCodePoint(...codePoints);
}

// Retorna og:title com emoji de bandeira para fichas individuais.
// O title original é mantido como fallback se o scraper não suportar emoji.
function fichaTitleFor(relativePath, baseTitle) {
  const match = relativePath.match(/^copa-2026\/fichas\/([^/]+)\/index\.html$/);
  if (!match) return baseTitle;
  const countryInfo = getFichaCountryMap().get(match[1]);
  if (!countryInfo) return baseTitle;
  const emoji = countryCodeToEmoji(countryInfo.code);
  if (!emoji) return baseTitle;
  // Insere emoji depois do primeiro " | " ou no início se não houver
  const sep = ' | ';
  if (baseTitle.includes(sep)) {
    const [first, ...rest] = baseTitle.split(sep);
    return `${first} ${emoji}${sep}${rest.join(sep)}`;
  }
  return `${emoji} ${baseTitle}`;
}

function syncSocialMeta(html, relativePath, canonical) {
  const fichaMeta = fichaImageFor(relativePath);
  const meta = { ...socialDefaults, ...(routeSocial.get(relativePath) || {}) };
  // Para fichas individuais, sempre sobrescreve image e imageAlt com o endpoint dinamico
  if (fichaMeta) {
    meta.image = fichaMeta.image;
    meta.imageAlt = fichaMeta.imageAlt;
    if (fichaMeta.imageType) meta.imageType = fichaMeta.imageType;
  }
  const url = canonical || canonicalFor(relativePath) || `${siteDomain}/`;
  const image = absoluteUrl(meta.image);
  const titleRaw = fichaMeta ? fichaTitleFor(relativePath, meta.title) : meta.title;
  const title = escapeHtml(titleRaw);
  const description = escapeHtml(meta.description);
  const imageAlt = escapeHtml(meta.imageAlt || meta.title);
  const siteName = escapeHtml(meta.siteName || socialDefaults.siteName);
  const locale = escapeHtml(meta.locale || socialDefaults.locale);
  const type = escapeHtml(meta.type || socialDefaults.type);

  html = upsertTag(html, /<title>[^<]*<\/title>/, `<title>${title}</title>`);
  html = upsertTag(html, /<meta name="description" content="[^"]*" ?\/?>/, `<meta name="description" content="${description}" />`);

  const tags = [
    ['property', 'og:type', type],
    ['property', 'og:site_name', siteName],
    ['property', 'og:locale', locale],
    ['property', 'og:title', title],
    ['property', 'og:description', description],
    ['property', 'og:url', url],
    ['property', 'og:image', image],
    ['property', 'og:image:secure_url', image],
    ['property', 'og:image:type', escapeHtml(meta.imageType || 'image/jpeg')],
    ['property', 'og:image:width', '1200'],
    ['property', 'og:image:height', '630'],
    ['property', 'og:image:alt', imageAlt],
    ['name', 'twitter:card', 'summary_large_image'],
    ['name', 'twitter:title', title],
    ['name', 'twitter:description', description],
    ['name', 'twitter:image', image],
    ['name', 'twitter:image:alt', imageAlt],
  ];

  for (const [attr, key, value] of tags) {
    const escapedValue = escapeHtml(value);
    const re = new RegExp(`<meta ${attr}="${key}" content="[^"]*" ?\\/?>`);
    html = upsertTag(html, re, `<meta ${attr}="${key}" content="${escapedValue}" />`);
  }

  return html;
}

function injectNavGuard(html) {
  if (html.includes('window.__navGuardInstalled')) return html;
  const guardPath = path.join(sourceDir, 'assets', 'nav-guard.js');
  if (!existsSync(guardPath)) return html;
  const guardSource = readFileSync(guardPath, 'utf8');
  const buildStamp = `<!-- build:${cacheVersion}-${Date.now()} -->`;
  return html.replace('</head>', `    ${buildStamp}\n    <script>window.__navGuardInstalled=true;${guardSource}</script>\n  </head>`);
}

await collectTextFiles(distDir);

function rewriteForRoot(content) {
  return content
    .replaceAll('https://sebas-ai.infraqualia.com/a-bola-conecta', siteDomain)
    .replaceAll('/a-bola-conecta/', '/')
    .replaceAll('/a-bola-conecta?', '/?')
    .replaceAll('/a-bola-conecta#', '/#')
    .replace(/\/a-bola-conecta(?=["'`<\s])/g, '/');
}

for (const relativePath of textFiles) {
  const file = path.join(distDir, relativePath);
  let content = await readFile(file, 'utf8');
  content = rewriteForRoot(content);
  await writeFile(file, content);
}

for (const relativePath of htmlFiles) {
  const canonical = canonicalFor(relativePath);
  const file = path.join(distDir, relativePath);
  let html = await readFile(file, 'utf8');
  if (canonical) {
    if (html.includes('rel="canonical"')) {
      html = html.replace(/<link rel="canonical" href="[^"]*" ?\/?>/, `<link rel="canonical" href="${canonical}" />`);
    } else {
      html = html.replace('</head>', `    <link rel="canonical" href="${canonical}" />
  </head>`);
    }
  }

  html = syncSocialMeta(html, relativePath, canonical);
  html = injectNavGuard(html);
  html = versionLocalAssets(html);
  trackReferencedAssets(html);

  if (allowIndex) {
    html = html.replace(/\n\s*<meta name="robots" content="noindex,nofollow" ?\/?>/, '');
  } else if (!html.includes('name="robots"')) {
    html = html.replace('</head>', '    <meta name="robots" content="noindex,nofollow" />\n  </head>');
  }

  await writeFile(file, html);
}

const assetsDir = path.join(distDir, 'assets');
if (existsSync(assetsDir)) {
  for (const asset of await readdir(assetsDir)) {
    const relativeAsset = `assets/${asset}`;
    const isGeneratedJs = asset.endsWith('.js') && asset.startsWith('index-');
    if (isGeneratedJs && !referencedAssets.has(relativeAsset)) {
      await rm(path.join(assetsDir, asset), { force: true });
    }
  }
}

const robotsPath = path.join(distDir, 'robots.txt');
const robots = allowIndex
  ? `User-agent: *\nAllow: /\n\nSitemap: ${siteDomain}/sitemap.xml\n`
  : `User-agent: *\nDisallow: /\n\nSitemap: ${siteDomain}/sitemap.xml\n`;
await writeFile(robotsPath, robots);

const sitemapPath = path.join(distDir, 'sitemap.xml');
if (existsSync(sitemapPath)) {
  let sitemap = await readFile(sitemapPath, 'utf8');
  sitemap = sitemap.replaceAll('https://abolaconecta.com.br', siteDomain);
  await writeFile(sitemapPath, sitemap);
}

console.log(`Build pronto em ${distDir}`);
console.log(`Indexação: ${allowIndex ? 'permitida' : 'bloqueada por seguranca'}`);
