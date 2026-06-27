import React from 'react';

/**
 * FestivalGallery
 * Componente React listo para integrar en el home de abolaconecta.com.br
 *
 * Props:
 *  - variant: 'strip' (banda fina) | 'grid' (sección dedicada)
 *  - title: string opcional para variante 'grid'
 *  - subtitle: string opcional
 *  - imagesBase: string base donde están los logos (default: '/assets/festivais/web')
 *  - showPremio: boolean (default true) - destaca o card do Curta-se
 *
 * Dados mantidos em festivais.json. Para mantener sincronizado,
 * regenerar este array desde el JSON con un script build-time.
 */

export interface Festival {
  id: string;
  nome: string;
  edicao: string | null;
  ano: number | null;
  cidade: string | null;
  pais: string;
  categoria: string;
  isPremio: boolean;
  logo: string;
}

export const FESTIVAIS: Festival[] = [
  {
    id: 'curta-se',
    nome: 'Curta-se',
    edicao: '23ª',
    ano: null,
    cidade: 'Aracaju',
    pais: 'Sergipe, Brasil',
    categoria: 'Prêmio · Melhor Trailer',
    isPremio: true,
    logo: '23-curta-se-festival-sergipe-premio-melhor-trailer.jpg',
  },
  {
    id: 'cinefoot',
    nome: 'CINEFOOT',
    edicao: null,
    ano: 2021,
    cidade: 'Rio de Janeiro',
    pais: 'Brasil',
    categoria: 'Seleção Oficial',
    isPremio: false,
    logo: 'cinefoot-2021.jpg',
  },
  {
    id: 'fiacine',
    nome: 'FIA CINE',
    edicao: '9ª',
    ano: null,
    cidade: null,
    pais: 'Brasil',
    categoria: 'Seleção Oficial',
    isPremio: false,
    logo: '9-fiacine-festival-ibero-americano.jpg',
  },
  {
    id: 'lisbon-sport',
    nome: 'Lisbon Sport Film Festival',
    edicao: '4ª',
    ano: 2022,
    cidade: 'Lisboa',
    pais: 'Portugal',
    categoria: 'Seleção Oficial',
    isPremio: false,
    logo: '4-lisbon-sport-film-festival-2022.jpg',
  },
  {
    id: 'ubuntu',
    nome: 'Festival Ubuntu',
    edicao: '3ª',
    ano: 2022,
    cidade: null,
    pais: 'Brasil',
    categoria: 'Seleção Oficial',
    isPremio: false,
    logo: '3-festival-ubuntu-2022.jpg',
  },
  {
    id: 'cinema-negro-em-acao',
    nome: 'Cinema Negro em Ação',
    edicao: '3ª',
    ano: 2022,
    cidade: 'Rio de Janeiro',
    pais: 'Brasil',
    categoria: 'Seleção Oficial',
    isPremio: false,
    logo: '3-cinema-negro-em-acao-2022.jpg',
  },
  {
    id: 'elas-nas-telas',
    nome: 'Elas nas Telas',
    edicao: null,
    ano: 2025,
    cidade: 'Belém, Pará',
    pais: 'Brasil',
    categoria: 'Seleção Oficial',
    isPremio: false,
    logo: 'festival-elas-nas-telas-belem-2025.jpg',
  },
];

interface Props {
  variant?: 'strip' | 'grid';
  title?: string;
  subtitle?: string;
  imagesBase?: string;
  showPremio?: boolean;
}

function FestivalCard({ festival, imagesBase, variant }: { festival: Festival; imagesBase: string; variant: 'strip' | 'grid' }) {
  const isPremio = festival.isPremio;
  return (
    <div
      className={`festival-card ${isPremio ? 'premio' : ''} variant-${variant}`}
      title={`${festival.nome}${festival.edicao ? ' · ' + festival.edicao + ' edição' : ''}${festival.ano ? ' · ' + festival.ano : ''} · ${festival.categoria}`}
    >
      <img
        src={`${imagesBase}/${festival.logo}`}
        alt={`${festival.nome} - ${festival.categoria}`}
        loading="lazy"
      />
      {variant === 'grid' && (
        <>
          <div className="festival-nome">{festival.nome}</div>
          <div className="festival-meta">
            {festival.edicao ? `${festival.edicao} edição · ` : ''}
            {festival.ano ? `${festival.ano} · ` : ''}
            {festival.cidade || festival.pais}
          </div>
          <div className="festival-categoria">{festival.categoria}</div>
        </>
      )}
    </div>
  );
}

export function FestivalGallery({
  variant = 'strip',
  title = 'Premiações e exibições',
  subtitle = 'O documentário circulou em mostras, festivais e espaços acadêmicos no Brasil e fora do país.',
  imagesBase = '/assets/festivais/web',
  showPremio = true,
}: Props) {
  const visible = showPremio ? FESTIVAIS : FESTIVAIS.filter((f) => !f.isPremio);

  if (variant === 'strip') {
    return (
      <section className="festival-strip" aria-label="Premiações e exibições">
        <div className="festival-strip-label">
          Exibido e premiado em festivais no Brasil e no exterior
        </div>
        <div className="festival-strip-track">
          {/* Duplicar para loop infinito do marquee */}
          {[...visible, ...visible].map((f, i) => (
            <FestivalCard key={`${f.id}-${i}`} festival={f} imagesBase={imagesBase} variant="strip" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="festival-grid-section" aria-label="Premiações e exibições">
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
      <div className="festival-grid">
        {visible.map((f) => (
          <FestivalCard key={f.id} festival={f} imagesBase={imagesBase} variant="grid" />
        ))}
      </div>
    </section>
  );
}

export default FestivalGallery;
