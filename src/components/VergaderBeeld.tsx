import { useState } from 'react';

const base = import.meta.env.BASE_URL;

type Props = {
  code: string;
  alt: string;
  caption: string;
  /** CSS `background` voor semi-transparante tintlaag (~max 25%) */
  tint: string;
};

/** Vergaderbeeld bovenaan de openingsscène (3:2, VK-codes). */
export function VergaderBeeld({ code, alt, caption, tint }: Props) {
  const [failed, setFailed] = useState(false);

  return (
    <figure className="vergader-beeld">
      <div className="vergader-beeld__frame">
        {failed ? (
          <div className="vergader-beeld__placeholder" role="img" aria-label={alt}>
            BEELD {code} VOLGT
          </div>
        ) : (
          <img
            src={`${base}beelden/${code}.jpg`}
            alt={alt}
            className="vergader-beeld__img"
            loading="eager"
            decoding="async"
            width={1800}
            height={1200}
            onError={() => setFailed(true)}
          />
        )}
        {tint !== 'transparent' ? (
          <div className="vergader-beeld__tint" style={{ background: tint }} aria-hidden="true" />
        ) : null}
        <div className="vergader-beeld__shade" aria-hidden="true" />
      </div>
      <figcaption className="vergader-beeld__cap">{caption}</figcaption>
    </figure>
  );
}