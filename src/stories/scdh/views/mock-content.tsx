// ---------------------------------------------------------------------------
// Placeholder content for the modes of a View.
// The real components (CodeView for TEI, an IIIF viewer for facsimiles) are separate tasks and
// replace these placeholders later.
// ---------------------------------------------------------------------------

const PARAGRAPHS = [
  'Sehr geehrter Herr Kollege!',
  '[Testtext] Für Ihren Brief und die beigelegte Arbeit danke ich Ihnen. Ich habe sie mit Interesse gelesen und werde Ihnen in den nächsten Wochen ausführlicher antworten. Herr Prof. PersonF lässt Sie herzlich grüßen.',
  '[Testtext] Eine Einladung nach StadtA lässt sich gewiss einrichten. Ich werde mit der UniStadtA sprechen und Ihnen die formale Einladung zusenden, sobald der Termin feststeht.',
  'Mit freundlichen Grüßen\nPersonB'
]

const FILLER =
  '[Testtext] Dabei hat es sich gezeigt, dass man auch die Axiomatisierungstheoreme sehr einfach auf die für den Kalkül ohne Funktionale zurückführen kann. Es würde mich sehr interessieren, wie Sie selbst zu meinen neuen Untersuchungen stehen.'

export function ReadingText({ long = false }: { long?: boolean }) {
  return (
    <div className="flex flex-col gap-4 text-base leading-relaxed">
      {PARAGRAPHS.map((p, i) => (
        <p key={i} className="whitespace-pre-line">
          {p}
        </p>
      ))}
      {long && Array.from({ length: 10 }, (_, i) => <p key={`f${i}`}>{FILLER}</p>)}
    </div>
  )
}

const TEI = `<?xml version="1.0" encoding="UTF-8"?>
<TEI xmlns="http://www.tei-c.org/ns/1.0" xml:id="Test_PersonB_PersonA_1956-10-02">
  <teiHeader>
    <fileDesc>
      <titleStmt>
        <title>PersonB an PersonA</title>
      </titleStmt>
    </fileDesc>
  </teiHeader>
  <text>
    <body>
      <p>Sehr geehrter Herr Kollege!</p>
      <p>[Testtext] Für Ihren Brief und die beigelegte Arbeit danke ich Ihnen.</p>
    </body>
  </text>
</TEI>`

export function TeiSource({ long = false }: { long?: boolean }) {
  return (
    <pre className="rounded-md bg-ulb-grey-050 p-4 font-mono text-sm whitespace-pre-wrap dark:bg-secondary">
      {long ? Array.from({ length: 6 }, () => TEI).join('\n') : TEI}
    </pre>
  )
}

export function FacsimilePlaceholder() {
  return (
    <div role="img" aria-label="Faksimile (Platzhalter)" className="aspect-[3/4] w-full bg-black" />
  )
}

const METADATA: [string, string[]][] = [
  ['Absender', ['Person A']],
  ['Absendeort', ['Ort A']],
  ['Empfänger', ['Person B']],
  ['Personen', ['Person C', 'Person D', 'Person E']],
  ['Orte', ['Ort A', 'Ort B', 'Ort C']],
  ['Organisationen', ['MathVereinigung', 'Universität Ort A']]
]

export function Metadata() {
  return (
    <dl className="flex flex-col gap-3 text-md">
      {METADATA.map(([term, values]) => (
        <div key={term}>
          <dt className="font-medium">{term}</dt>
          {values.map(v => (
            <dd key={v}>{v}</dd>
          ))}
        </div>
      ))}
    </dl>
  )
}
