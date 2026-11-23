import type { HulpvraagItem } from '@content/hulpvraag.nl';
import { zusNaamVoorCopy } from '@content/hulpvraag.nl';

type Props = {
  item: HulpvraagItem;
  playerName: string;
};

export function HulpvraagOpdrachtbalk({ item, playerName }: Props) {
  const naam = zusNaamVoorCopy(playerName);
  const vrager = item.vrager;

  return (
    <section className="hulpvraag-opdracht" aria-labelledby="hulpvraag-opdracht-kop">
      <h2 id="hulpvraag-opdracht-kop" className="hulpvraag-opdracht__kop" tabIndex={-1}>
        Jullie opdracht
      </h2>
      <p className="body">
        Jullie zijn nog steeds {naam}. {vrager} vraagt jullie dit uit te zoeken. Jullie hebben een uur.
      </p>
      <p className="body">
        Het product vraagt drie dingen: kennis, vakmanschap en een morele afweging.
      </p>
      <div className="hulpvraag-opdracht__blokken">
        <Blok kop="Opdracht" tekst={item.opdracht} />
        <Blok kop="Kennis" tekst={item.kennis} />
        <Blok kop="Vakmanschap" tekst={item.vakmanschap} />
        <Blok kop={`Morele afweging (stap ${item.afwegingStap})`} tekst={item.afweging} />
      </div>
      <p className="note">
        Verdeel het uur zo: ongeveer 15 minuten kennis, 30 minuten maken en 15 minuten afwegen.
      </p>
      <p className="note">De uitleg en de vragen staan in jullie werkboek.</p>
    </section>
  );
}

function Blok({ kop, tekst }: { kop: string; tekst: string }) {
  return (
    <div className="hulpvraag-opdracht__blok">
      <h3 className="hulpvraag-opdracht__blok-kop">{kop}</h3>
      <p className="body">{tekst}</p>
    </div>
  );
}