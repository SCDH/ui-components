import type { FacetItem } from '@/components/ui/scdh/facet'
import type { ListItemProps } from '@/components/ui/scdh/list-item'

// ---------------------------------------------------------------------------
// Facet data — static items for visual demonstration
// ---------------------------------------------------------------------------

export interface FacetGroup {
  /** Unique identifier */
  value: string
  /** Display title (passed to Facet as `title` prop) */
  title: string
  /** Facet items */
  items: FacetItem[]
  /** Whether expanded by default (passed to Facet as `defaultExpanded`) */
  defaultExpanded?: boolean
}

export const FACET_GROUPS: FacetGroup[] = [
  {
    value: 'facet-epoche',
    title: 'Epoche',
    defaultExpanded: true,
    items: [
      { value: 'antike', label: 'Antike', count: 42 },
      { value: 'mittelalter', label: 'Mittelalter', count: 128 },
      { value: 'neuzeit', label: 'Neuzeit', count: 67 },
      { value: 'moderne', label: 'Moderne', count: 34 },
      { value: 'gegenwart', label: 'Gegenwart', count: 19 }
    ]
  },
  {
    value: 'facet-autor',
    title: 'Autor:in',
    items: [
      { value: 'goethe', label: 'Goethe, J.W.', count: 15 },
      { value: 'schiller', label: 'Schiller, F.', count: 9 },
      { value: 'kant', label: 'Kant, I.', count: 12 },
      { value: 'hegel', label: 'Hegel, G.W.F.', count: 7 },
      { value: 'nietzsche', label: 'Nietzsche, F.', count: 11 }
    ]
  },
  {
    value: 'facet-sammlung',
    title: 'Sammlung',
    items: [
      { value: 'handschriften', label: 'Handschriften', count: 34 },
      { value: 'inkunabeln', label: 'Inkunabeln', count: 21 },
      { value: 'urkunden', label: 'Urkunden', count: 53 },
      { value: 'karten', label: 'Karten & Pläne', count: 16 }
    ]
  }
]

// ---------------------------------------------------------------------------
// Search results — static ListItem data for visual demonstration
// ---------------------------------------------------------------------------

export const SEARCH_RESULTS: ListItemProps[] = [
  {
    title: 'Codex Monacensis — Evangelienhandschrift',
    subtitle: 'Unbekannter Schreiber, Kloster Tegernsee',
    meta: 'Handschrift · 11. Jahrhundert',
    description:
      'Vollständig erhaltene Evangelienhandschrift mit zwölf ganzseitigen Miniaturen ' +
      'und reichem Initialschmuck. Pergament, 245 Blatt.',
    tags: [{ label: 'Handschriften' }, { label: 'Mittelalter' }, { label: 'Tegernsee' }]
  },
  {
    title: 'Faust: Eine Tragödie — Erster Theil',
    subtitle: 'Johann Wolfgang von Goethe',
    meta: "Druck · 1808 · Cotta'sche Verlagsbuchhandlung",
    description:
      'Erstausgabe des ersten Teils der Faust-Tragödie. Exemplar mit handschriftlicher ' +
      'Widmung des Verfassers an Charlotte von Stein.',
    tags: [{ label: 'Neuzeit' }, { label: 'Druck' }]
  },
  {
    title: 'Sachsenspiegel — Heidelberger Bilderhandschrift',
    subtitle: 'Eike von Repgow',
    meta: 'Handschrift · um 1300 · Pergament',
    description:
      'Eine der vier erhaltenen Bilderhandschriften des Sachsenspiegels. ' +
      'Reich illuminierte Rechtssammlung des Mittelalters.',
    tags: [{ label: 'Handschriften' }, { label: 'Mittelalter' }, { label: 'Recht' }]
  },
  {
    title: 'Gutenberg-Bibel — Fragment einer Pergamentausgabe',
    subtitle: 'Johannes Gutenberg, Mainz',
    meta: 'Inkunabel · um 1454',
    description:
      'Zwei Doppelblätter aus der 42-zeiligen Bibel. Mit handgemalten Initialen ' +
      'und Rubrizierungen. Provenienz: Benediktinerabtei St. Gallen.',
    tags: [{ label: 'Inkunabeln' }, { label: 'Mittelalter' }, { label: 'Mainz' }]
  },
  {
    title: 'Kritik der reinen Vernunft — Zweyte hin und wieder verbesserte Auflage',
    subtitle: 'Immanuel Kant',
    meta: 'Druck · 1787 · Johann Friedrich Hartknoch, Riga',
    description:
      'Die maßgebliche zweite Auflage (sog. „B-Auflage“) mit der Widerlegung ' +
      'des Idealismus und der umgearbeiteten transzendentalen Deduktion.',
    tags: [{ label: 'Neuzeit' }, { label: 'Philosophie' }]
  },
  {
    title: 'Nibelungenlied — Handschrift C (Donaueschingen)',
    subtitle: 'Anonym',
    meta: 'Handschrift · um 1220–1230 · Pergament',
    description:
      'Die jüngste der drei Haupthandschriften des Nibelungenliedes. ' +
      'Mit 39 kolorierten Federzeichnungen. Provenienz: Fürstlich Fürstenbergische Hofbibliothek.',
    tags: [{ label: 'Handschriften' }, { label: 'Mittelalter' }, { label: 'Donaueschingen' }]
  },
  {
    title: 'Also sprach Zarathustra — Ein Buch für Alle und Keinen',
    subtitle: 'Friedrich Nietzsche',
    meta: 'Druck · 1883–1885 · E. Schmeitzner, Chemnitz',
    description:
      'Erstausgabe aller vier Teile in den originalen Verlageseinbänden. ' +
      'Teil I mit eigenhändiger Widmung an Franz Overbeck.',
    tags: [{ label: 'Moderne' }, { label: 'Philosophie' }]
  },
  {
    title: 'Tabula Peutingeriana — Faksimile des XII. Jahrhunderts',
    subtitle: 'Nach einer Vorlage des 4. Jahrhunderts',
    meta: 'Pergamentrolle · 12. Jahrhundert',
    description:
      'Mittelalterliche Abschrift der spätantiken Straßenkarte des Römischen Reiches. ' +
      'Elf Pergamentblätter, zusammengesetzt auf 6,82 m Länge.',
    tags: [{ label: 'Handschriften' }, { label: 'Mittelalter' }, { label: 'Karten' }]
  }
]
