/** Vervang recht apostrof in weergave (z'n, zo'n, 's); brontekst blijft ASCII. */
export function normalizeSpokenApostrophe(text: string): string {
  return text.replace(/'/g, '\u2019');
}

type Props = { text: string; quoted: boolean };

export function SpokenLineText({ text, quoted }: Props) {
  if (!quoted) return <>{text}</>;
  const body = normalizeSpokenApostrophe(text);
  return (
    <>
      <span className="spoken-q" aria-hidden="true">
        {"\u201C"}
      </span>
      {body}
      <span className="spoken-q" aria-hidden="true">
        {"\u201D"}
      </span>
    </>
  );
}