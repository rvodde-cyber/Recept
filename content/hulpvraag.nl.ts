import type { EpisodeId } from '@data/episodes/meta';

export type HulpvraagBeeldCode = 'h1' | 'h2' | 'h3' | 'h4' | 'h5';

export type HulpvraagItem = {
  id: string;
  aflevering: EpisodeId;
  vrager: string;
  titel: string;
  verhaal: readonly [string, string, string];
  slotvraag: string;
  waarden: string;
  niveau: 'meso';
  opdracht: string;
  kennis: string;
  vakmanschap: string;
  afwegingStap: string;
  afweging: string;
  beeld: HulpvraagBeeldCode;
  alt: string;
};

/** Beschikbare extensie per code; .webp wint bij beide (handmatig/registry). Geen netwerk-probe. */
export const HULPVRAAG_BEELD_EXT: Record<HulpvraagBeeldCode, 'webp' | 'jpg' | null> = {
  h1: 'jpg',
  h2: 'jpg',
  h3: 'jpg',
  h4: 'jpg',
  h5: 'jpg',
};

export const HULPVRAAG_REFLECTIE =
  'Wat zou jij doen en waarom? Welke waarden zijn hier in het spel?';

const ITEMS: Record<EpisodeId, HulpvraagItem> = {
  1: {
    id: 'hulpvraag-a1-harrie',
    aflevering: 1,
    vrager: 'Harrie',
    titel: 'Wie vragen we?',
    verhaal: [
      'De bestelling is tien keer zo groot als vorige maand. In de schuur in Berkel-Enschot staan de kratten tot aan het dak, en Harrie, Lies en Gerrit redden het niet meer. Vanochtend belden er nog twee klanten.',
      '"Mijn neef kan morgen beginnen," zegt Harrie tegen {naam}. "En de jongens van de overkant ook. Gaat snel, kost niks, toch?" Hij krabt in zijn nek. "Maar de vrouwen uit het dorp vragen al weken of er werk is. Daar heb ik nog niks mee gedaan."',
      '"Jij bent de slimste van ons. Kun jij uitzoeken hoe we de eerste vaste mensen vinden? Ik heb er zelf geen verstand van, en ik wil het goed doen, hè."',
    ],
    slotvraag: 'Hoe werf je snel, zonder dat alleen de bekenden een kans krijgen?',
    waarden: 'eerlijkheid, rechtvaardigheid, loyaliteit',
    niveau: 'meso',
    opdracht: 'Ontwerp een wervingscampagne voor de eerste vaste medewerkers.',
    kennis:
      'Wat zegt onderzoek over realistische voorbeelden van het werk (job previews) en over de voorspellende waarde van selectiemethoden?',
    vakmanschap:
      "Wervingsplan van 2 à 3 pagina's met doelgroep, kanalen, selectiecriteria en procedure, plus een vacaturetekst, plus een korte reactie aan Harrie op zijn plan om eerst de neef en de jongens van de overkant te nemen, met argumenten.",
    afwegingStap: 'Zien',
    afweging: 'Wie zie je niet als je werft via bekenden? Welke uitsluiting zit in jullie criteria?',
    beeld: 'h1',
    alt: 'Harrie spreekt in de schuur tegen de zus, die we op de rug zien.',
  },
  2: {
    id: 'hulpvraag-a2-gerrit',
    aflevering: 2,
    vrager: 'Gerrit',
    titel: 'Meepraten',
    verhaal: [
      'De band loopt nu de hele dag. In de werkplaats in Loven werken tachtig mensen in ploegen. Gerrit, ploegbaas bij de nachtploeg, wacht {naam} op bij de koffieautomaat, vlak voordat de ochtendploeg binnenkomt.',
      '"De nachtploeg vraagt of er een ondernemingsraad komt," zegt hij. "Harrie vindt het veel gedoe, en het kost geld. Hij zegt dat ze gewoon bij hem kunnen komen. Maar wie durft dat nou, om drie uur \'s nachts? En de flexkrachten vragen het al helemaal niet." Hij draait zijn kopje rond. "Ik heb ze beloofd dat jij ernaar kijkt. Harrie moet wel overtuigd worden."',
      '"Kun jij uitzoeken hoe we dat goed opzetten, en wat we tegen Harrie zeggen?"',
    ],
    slotvraag: 'Hoe geef je ook de mensen een stem die nooit bij Harrie aan tafel komen, als dat tijd en geld kost?',
    waarden: 'zeggenschap (stem), rechtvaardigheid, vertrouwen',
    niveau: 'meso',
    opdracht: 'Stel een plan op om een ondernemingsraad in te stellen.',
    kennis:
      'Medezeggenschap en voice (waarom zwijgen mensen?) en wat onderzoek zegt over de opbrengsten ervan. Zoek de actuele eisen in de Wet op de ondernemingsraden zelf op.',
    vakmanschap:
      'Oprichtingsplan met tijdpad, informatie aan het personeel, faciliteiten en een eerste overlegagenda, plus een korte reactie aan Harrie op zijn bezwaren (moeite en geld), met argumenten.',
    afwegingStap: 'Voelen',
    afweging: 'Wiens stem wordt het zwakst gehoord, zoals de nachtploeg of de flexkracht, en wat doen jullie daarmee?',
    beeld: 'h2',
    alt: 'Gerrit bij de koffieautomaat in de productiehal, tegenover de zus op de rug gezien.',
  },
  3: {
    id: 'hulpvraag-a3-sanne',
    aflevering: 3,
    vrager: 'Sanne',
    titel: 'Het gesprek na de ziekmelding',
    verhaal: [
      'Het verzuim is in Waalwijk dit jaar verdubbeld. Marco heeft de cijfers van de drie vestigingen naast elkaar gelegd en wil dat leidinggevenden na elke ziekmelding een gesprek voeren en alles vastleggen. Hij wil het voor de zomer geregeld hebben.',
      'Sanne, die op de vloer werkt, schuift na het overleg naast {naam}. "Het is niet alleen griep. Joke is dit jaar vier keer ziek geweest en niemand heeft gevraagd waarom. Ze is niet de enige. Zo\'n gesprek met een formulier voelt als controle, en dat merken mensen. Dan zeggen ze niks meer."',
      '"Marco heeft ook een punt, hoor. Kun jij een aanpak bedenken die klopt?"',
    ],
    slotvraag: 'Waar houdt zorg op en begint controle?',
    waarden: 'zorg, vertrouwen, transparantie',
    niveau: 'meso',
    opdracht: 'Ontwerp een verzuimaanpak.',
    kennis: 'Het JD-R-model: wat verklaart verzuim naast ziekte (werkdruk, hulpbronnen, betrokkenheid)?',
    vakmanschap:
      "Verzuimprotocol van 2 pagina's met rol van leidinggevende en bedrijfsarts, plus een gespreksleidraad, plus een korte reactie aan Marco op zijn wens om elk gesprek vast te leggen, met argumenten.",
    afwegingStap: 'Wegen',
    afweging: 'Waar loopt de grens tussen zorg en controle? Wat mag een leidinggevende vragen en wat niet?',
    beeld: 'h3',
    alt: 'Sanne gaat bij de zus zitten in de vergaderkamer.',
  },
  4: {
    id: 'hulpvraag-a4-harrie',
    aflevering: 4,
    vrager: 'Harrie',
    titel: 'Ruben wil niet meer',
    verhaal: [
      'In de dronefabriek bij Vossenberg bouwt Ruben al drie jaar aan de besturing. Sinds kort gaan er drones naar Defensie. Ruben heeft gewetensbezwaren: hij wil niet werken aan oorlogswapens en vraagt of hij aan iets anders kan werken.',
      'Harrie, inmiddels eenenzeventig, legt het voor aan {naam}. "Op het dashboard staat hij op oranje, onder de norm. Erik zegt: dat is gewoon een cijfer. Mogen wij hem niet ontslaan wegens werkweigering? Maar de jongen levert goed werk, alleen niet hieraan. Ik weet het echt niet. Ik wil hem niet kwijt, en ik wil ook niemand dwingen."',
      '"Kun jij dit uitzoeken? Mogen we hem ontslaan als hij weigert, en wat mogen we van hem vragen?"',
    ],
    slotvraag: 'Wat mag een bedrijf van Ruben vragen, en wat mag een cijfer over hem zeggen?',
    waarden: 'geweten, privacy, eerlijkheid',
    niveau: 'meso',
    opdracht:
      'Kies één: (a) schrijf een juridisch-ethische notitie over meten en AI in HR, of (b) over een medewerker met gewetensbezwaren tegen werken aan oorlogswapens: wat zijn de rechten en plichten van beide kanten?',
    kennis:
      'De AVG, de AI-verordening en ethical fading, plus de regels voor ontslag en werkweigering (goed werkgeverschap, gronden, procedure). De docent controleert vooraf de actuele stand van de wetgeving.',
    vakmanschap:
      "Notitie van 2 pagina's met conclusie en aanbeveling, die Harries vraag of ontslag mag expliciet beantwoordt, plus een korte reactie aan Erik op zijn standpunt dat het \"gewoon een cijfer\" is, met argumenten.",
    afwegingStap: 'Handelen',
    afweging: 'Wanneer verdwijnt de ethische kant van een besluit achter een dashboard?',
    beeld: 'h4',
    alt: 'Harrie in de dronefabriek, tegenover de zus op de rug gezien.',
  },
  5: {
    id: 'hulpvraag-a5-anne-fleur',
    aflevering: 5,
    vrager: 'Anne-Fleur',
    titel: 'De lijst van de investeerder',
    verhaal: [
      'De investeerder wil volgend kwartaal vijftien procent minder fte in de Groep. Dat betekent reorganiseren: er staan dertig functies op de lijst om te schrappen. Anne-Fleur, van de nieuwe generatie, legt de lijst voor aan {naam}.',
      '"De cijfers kloppen," zegt ze. "Maar ik ken die mensen. Yusuf werkt al zesentwintig jaar bij ons. Het bericht aan het personeel is nog niet geschreven, en ik wil niet dat ze het via via horen. Vrijdag wil de investeerder antwoord. Voor sommigen is dit hun enige werkgever geweest."',
      '"Kun jij een plan maken? Wie, wanneer, en hoe vertellen we het? Ik wil dit zorgvuldig doen, ook voor degenen die blijven."',
    ],
    slotvraag: 'Wie draagt de lasten, en wie hoort het als eerste?',
    waarden: 'rechtvaardigheid, transparantie, zorg',
    niveau: 'meso',
    opdracht: 'Stel een reorganisatieplan op.',
    kennis: 'Verandermanagement, procedurele rechtvaardigheid en wat onderzoek zegt over de mensen die blijven.',
    vakmanschap:
      "Plan van 3 à 4 pagina's met aanleiding en alternatieven, betrokken groepen, overleg, ontslagroute, sociaal plan in hoofdlijnen en communicatie, plus een bericht aan het personeel, plus een korte reactie aan de investeerder op zijn eis van vijftien procent, met argumenten.",
    afwegingStap: 'Volhouden',
    afweging: 'Wie draagt de lasten, wie hoort het als eerste en hoe houd je vol als het besluit pijn doet?',
    beeld: 'h5',
    alt: 'Anne-Fleur toont de zus een lijst in een glazen vergaderkamer.',
  },
};

export function hulpvraagVoor(episode: EpisodeId): HulpvraagItem {
  return ITEMS[episode];
}

/** Naam van de zus in copy; zonder gekozen naam: «de zus». */
export function zusNaamVoorCopy(playerName: string | undefined): string {
  const t = (playerName ?? '').trim();
  return t.length > 0 ? t : 'de zus';
}

export function vervangHulpvraagNaam(tekst: string, playerName: string | undefined): string {
  return tekst.replace(/\{naam\}/g, zusNaamVoorCopy(playerName));
}