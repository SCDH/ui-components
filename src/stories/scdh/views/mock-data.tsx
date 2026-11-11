import type { ViewMode, ViewState } from '@/components/ui/scdh/views'
import { FacsimilePlaceholder, Metadata, ReadingText, TeiSource } from './mock-content'

// ---------------------------------------------------------------------------
// Modes and initial views
// ---------------------------------------------------------------------------

export const MODES: ViewMode[] = [
  { id: 'reading', label: 'Lesetext', content: <ReadingText /> },
  { id: 'tei', label: 'TEI-Quelltext', content: <TeiSource /> },
  { id: 'facsimile', label: 'Faksimile', content: <FacsimilePlaceholder /> }
]

export const LONG_MODES: ViewMode[] = [
  { id: 'reading', label: 'Lesetext', content: <ReadingText long /> },
  { id: 'tei', label: 'TEI-Quelltext', content: <TeiSource long /> },
  { id: 'facsimile', label: 'Faksimile', content: <FacsimilePlaceholder /> }
]

/** The pinned "Metadaten" view: a single mode, no selection, can not be closed, always in place. */
export const METADATA_VIEW: ViewState = {
  id: 'metadata',
  mode: 'metadata',
  modes: [{ id: 'metadata', label: 'Metadaten', content: <Metadata /> }],
  pinned: true
}

/** Metadata next to the reading text and the TEI source. */
export const THREE_VIEWS: ViewState[] = [
  METADATA_VIEW,
  { id: 'reading', mode: 'reading' },
  { id: 'tei', mode: 'tei' }
]

/** Metadata and the most views that can be open next to it (3). */
export const MANY_VIEWS: ViewState[] = [
  METADATA_VIEW,
  { id: 'v1', mode: 'reading' },
  { id: 'v2', mode: 'tei' },
  { id: 'v3', mode: 'facsimile' }
]
