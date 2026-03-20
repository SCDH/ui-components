import type { FacetDefinition } from '@/components/ui/scdh/facet-search/types'
import type { ListItemProps } from '@/components/ui/scdh/list-item'

// ---------------------------------------------------------------------------
// Mock data: Scholarly catalogue items
// ---------------------------------------------------------------------------

/**
 * Mock result items simulating a scholarly digital humanities catalogue.
 * Each item has metadata, tags, and an optional thumbnail.
 */
export const mockResultItems: ListItemProps[] = [
  {
    meta: 'added on 2025-03-15',
    title: 'Faust: Eine Tragödie',
    subtitle: 'Goethe, Johann Wolfgang von',
    description:
      'Das gesamte Drama in kritischer Edition mit Kommentar und Variantenapparat. Basierend auf der Weimarer Ausgabe.',
    tags: [
      { label: 'Literature', className: 'bg-green-100 text-green-800 border-green-300' },
      { label: 'Drama', className: 'bg-violet-100 text-violet-800 border-violet-300' },
    ],
  },
  {
    meta: 'added on 2025-01-22',
    title: 'Die Leiden des jungen Werthers',
    subtitle: 'Goethe, Johann Wolfgang von',
    description:
      'Briefroman in digitaler Edition. Enthält beide Fassungen (1774 und 1787) mit synoptischer Darstellung.',
    tags: [
      { label: 'Literature', className: 'bg-green-100 text-green-800 border-green-300' },
      { label: 'Novel', className: 'bg-blue-100 text-blue-800 border-blue-300' },
    ],
  },
  {
    meta: 'added on 2024-11-08',
    title: 'Kritik der reinen Vernunft',
    subtitle: 'Kant, Immanuel',
    description:
      'Vollständige digitale Edition der ersten (A) und zweiten (B) Auflage mit Seitenkonkordanz und Sachregister.',
    tags: [
      { label: 'Philosophy', className: 'bg-amber-100 text-amber-800 border-amber-300' },
    ],
  },
  {
    meta: 'added on 2024-09-30',
    title: 'Also sprach Zarathustra',
    subtitle: 'Nietzsche, Friedrich',
    description:
      'Ein Buch für Alle und Keinen. Kritische Studienausgabe mit Entstehungsgeschichte und Nachlass-Fragmenten.',
    tags: [
      { label: 'Philosophy', className: 'bg-amber-100 text-amber-800 border-amber-300' },
    ],
  },
  {
    meta: 'added on 2024-08-14',
    title: 'Der Prozess',
    subtitle: 'Kafka, Franz',
    description:
      'Kritische Ausgabe des unvollendeten Romans mit Faksimile der Handschrift und textkritischem Apparat.',
    tags: [
      { label: 'Literature', className: 'bg-green-100 text-green-800 border-green-300' },
      { label: 'Novel', className: 'bg-blue-100 text-blue-800 border-blue-300' },
    ],
  },
  {
    meta: 'added on 2024-07-03',
    title: 'Die Verwandlung',
    subtitle: 'Kafka, Franz',
    description:
      'Erzählung in digitaler kritischer Edition. Vergleich der Erstausgabe mit dem Manuskript.',
    tags: [
      { label: 'Literature', className: 'bg-green-100 text-green-800 border-green-300' },
      { label: 'Short Story', className: 'bg-rose-100 text-rose-800 border-rose-300' },
    ],
  },
  {
    meta: 'added on 2024-06-18',
    title: 'Buddenbrooks',
    subtitle: 'Mann, Thomas',
    description:
      'Verfall einer Familie. Digitale Edition mit Entstehungskontext und Rezeptionsgeschichte.',
    tags: [
      { label: 'Literature', className: 'bg-green-100 text-green-800 border-green-300' },
      { label: 'Novel', className: 'bg-blue-100 text-blue-800 border-blue-300' },
    ],
  },
  {
    meta: 'added on 2024-05-02',
    title: 'Phänomenologie des Geistes',
    subtitle: 'Hegel, Georg Wilhelm Friedrich',
    description:
      'Digitale Edition des Hauptwerks mit historisch-kritischem Kommentar und Begriffsregister.',
    tags: [
      { label: 'Philosophy', className: 'bg-amber-100 text-amber-800 border-amber-300' },
    ],
  },
  {
    meta: 'added on 2024-04-12',
    title: 'Nathan der Weise',
    subtitle: 'Lessing, Gotthold Ephraim',
    description:
      'Dramatisches Gedicht in fünf Aufzügen. Kritische Ausgabe mit Quellen und Wirkungsgeschichte.',
    tags: [
      { label: 'Literature', className: 'bg-green-100 text-green-800 border-green-300' },
      { label: 'Drama', className: 'bg-violet-100 text-violet-800 border-violet-300' },
    ],
  },
  {
    meta: 'added on 2024-03-01',
    title: 'Die Welt als Wille und Vorstellung',
    subtitle: 'Schopenhauer, Arthur',
    description:
      'Hauptwerk in zwei Bänden. Digitale Edition mit Verzeichnis der Randbemerkungen und Querverweisen.',
    tags: [
      { label: 'Philosophy', className: 'bg-amber-100 text-amber-800 border-amber-300' },
    ],
  },
]

// ---------------------------------------------------------------------------
// Mock data: Facet definitions
// ---------------------------------------------------------------------------

/** Three facets: Category, Language, Century */
export const mockFacetDefinitions: FacetDefinition[] = [
  {
    key: 'category',
    title: 'Category',
    selectionMode: 'checkbox',
    searchable: true,
    items: [
      { id: 'literature', value: 'literature', label: 'Literature', count: 6 },
      { id: 'philosophy', value: 'philosophy', label: 'Philosophy', count: 4 },
      { id: 'drama', value: 'drama', label: 'Drama', count: 2 },
      { id: 'novel', value: 'novel', label: 'Novel', count: 3 },
      { id: 'short-story', value: 'short-story', label: 'Short Story', count: 1 },
    ],
  },
  {
    key: 'language',
    title: 'Language',
    selectionMode: 'checkbox',
    items: [
      { id: 'de', value: 'de', label: 'German', count: 10 },
      { id: 'en', value: 'en', label: 'English', count: 0 },
      { id: 'fr', value: 'fr', label: 'French', count: 0 },
      { id: 'la', value: 'la', label: 'Latin', count: 0 },
    ],
  },
  {
    key: 'century',
    title: 'Century',
    selectionMode: 'checkbox',
    items: [
      { id: '18th', value: '18th', label: '18th century', count: 3 },
      { id: '19th', value: '19th', label: '19th century', count: 5 },
      { id: '20th', value: '20th', label: '20th century', count: 2 },
    ],
  },
]

// ---------------------------------------------------------------------------
// Tag-to-category mapping (for filtering logic)
// ---------------------------------------------------------------------------

/** Maps item tags to facet category values */
const tagToCategoryMap: Record<string, string> = {
  Literature: 'literature',
  Philosophy: 'philosophy',
  Drama: 'drama',
  Novel: 'novel',
  'Short Story': 'short-story',
}

/** Maps authors to their century */
const authorToCentury: Record<string, string> = {
  'Lessing, Gotthold Ephraim': '18th',
  'Kant, Immanuel': '18th',
  'Goethe, Johann Wolfgang von': '18th',
  'Schopenhauer, Arthur': '19th',
  'Hegel, Georg Wilhelm Friedrich': '19th',
  'Nietzsche, Friedrich': '19th',
  'Mann, Thomas': '19th',
  'Kafka, Franz': '20th',
}

// ---------------------------------------------------------------------------
// Mock service: server-side filtering simulation
// ---------------------------------------------------------------------------

/**
 * Simulates a server-side search with filtering.
 * Used as the MSW handler logic and also as a standalone mock service.
 *
 * @param query - Full-text search query
 * @param filters - Active facet filters
 * @returns Filtered results and updated facet counts
 */
export function performMockSearch(
  query: string,
  filters: Record<string, readonly string[]>
): { items: ListItemProps[]; facets: FacetDefinition[]; totalCount: number } {
  let filtered = [...mockResultItems]

  // Apply full-text query filter
  if (query.trim()) {
    const normalizedQuery = query.toLowerCase().trim()
    filtered = filtered.filter(
      item =>
        item.title.toLowerCase().includes(normalizedQuery) ||
        item.subtitle?.toLowerCase().includes(normalizedQuery) ||
        item.description?.toLowerCase().includes(normalizedQuery)
    )
  }

  // Apply category filter
  const categoryFilter = filters['category'] ?? []
  if (categoryFilter.length > 0) {
    filtered = filtered.filter(item =>
      item.tags?.some(tag => {
        const mapped = tagToCategoryMap[tag.label]
        return mapped && categoryFilter.includes(mapped)
      })
    )
  }

  // Apply century filter
  const centuryFilter = filters['century'] ?? []
  if (centuryFilter.length > 0) {
    filtered = filtered.filter(item => {
      const century = item.subtitle ? authorToCentury[item.subtitle] : undefined
      return century && centuryFilter.includes(century)
    })
  }

  // Recompute facet counts based on filtered results
  const updatedFacets = mockFacetDefinitions.map(facet => {
    if (facet.key === 'category') {
      return {
        ...facet,
        items: facet.items.map(fi => ({
          ...fi,
          count: filtered.filter(item =>
            item.tags?.some(tag => tagToCategoryMap[tag.label] === fi.value)
          ).length,
        })),
      }
    }

    if (facet.key === 'century') {
      return {
        ...facet,
        items: facet.items.map(fi => ({
          ...fi,
          count: filtered.filter(item => {
            const century = item.subtitle ? authorToCentury[item.subtitle] : undefined
            return century === fi.value
          }).length,
        })),
      }
    }

    // Language facet: all items are German in our mock data
    return {
      ...facet,
      items: facet.items.map(fi => ({
        ...fi,
        count: fi.value === 'de' ? filtered.length : 0,
      })),
    }
  })

  return {
    items: filtered,
    facets: updatedFacets,
    totalCount: filtered.length,
  }
}
