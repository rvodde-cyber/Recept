import { useState } from 'react';
import type { HulpvraagBeeldCode } from '@content/hulpvraag.nl';
import { hulpvraagBeeldUrl } from '../game/hulpvraagBeeld';

type Props = {
  code: HulpvraagBeeldCode;
  alt: string;
  tint: string;
};

export function HulpvraagBeeld({ code, alt, tint }: Props) {
  const [failed, setFailed] = useState(false);
  const src = hulpvraagBeeldUrl(code);

  return (
    <figure className="hulpvraag-beeld">
      <div className="hulpvraag-beeld__frame">
        {!src || failed ? (
          <div
            className="hulpvraag-beeld__placeholder"
            role="img"
            aria-label={alt}
            style={{ background: tint }}
          />
        ) : (
          <img
            src={src}
            alt={alt}
            className="hulpvraag-beeld__img"
            loading="lazy"
            decoding="async"
            width={900}
            height={1200}
            onError={() => setFailed(true)}
          />
        )}
      </div>
    </figure>
  );
}