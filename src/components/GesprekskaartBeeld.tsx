import { useState } from 'react';
import type { GesprekskaartBeeldCode } from '@data/schemas/gesprekskaart.schema';
import { gesprekskaartBeeldUrl } from '../game/gesprekskaartBeeld';

type Props = {
  code: GesprekskaartBeeldCode;
  alt: string;
  /** Periode-tint uit `introLook.tint` */
  tint: string;
};

/** Situatiebeeld onder de gesprekskaarttitel (16:9, register zonder 404). */
export function GesprekskaartBeeld({ code, alt, tint }: Props) {
  const [failed, setFailed] = useState(false);
  const src = gesprekskaartBeeldUrl(code);
  const showImg = Boolean(src) && !failed;

  return (
    <figure className="gesprekskaart-beeld">
      <div className="gesprekskaart-beeld__frame">
        {!showImg ? (
          <div
            className="gesprekskaart-beeld__placeholder"
            role="presentation"
            style={{ background: tint !== 'transparent' ? tint : 'var(--panel-2)' }}
          />
        ) : (
          <>
            <img
              src={src!}
              alt={alt}
              className="gesprekskaart-beeld__img"
              loading="lazy"
              decoding="async"
              width={1600}
              height={900}
              onError={() => setFailed(true)}
            />
            {tint !== 'transparent' ? (
              <div className="gesprekskaart-beeld__tint" style={{ background: tint }} aria-hidden="true" />
            ) : null}
          </>
        )}
      </div>
    </figure>
  );
}