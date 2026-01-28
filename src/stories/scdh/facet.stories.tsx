// Sample library data - Book categories
const bookCategories: FacetItem[] = [
  { id: 'fiction', value: 'fiction', label: 'Fiction', count: 1243 },
  { id: 'non-fiction', value: 'non-fiction', label: 'Non-Fiction', count: 892 },
  { id: 'science', value: 'science', label: 'Science', count: 567 },
  { id: 'history', value: 'history', label: 'History', count: 432 },
  { id: 'biography', value: 'biography', label: 'Biography', count: 234 },
  { id: 'poetry', value: 'poetry', label: 'Poetry', count: 156 }
]

// Book languages
const bookLanguages: FacetItem[] = [
  { id: 'de', value: 'de', label: 'German', count: 3421 },
  { id: 'en', value: 'en', label: 'English', count: 2876 },
  { id: 'fr', value: 'fr', label: 'French', count: 543 },
  { id: 'it', value: 'it', label: 'Italian', count: 234 },
  { id: 'es', value: 'es', label: 'Spanish', count: 187 },
  { id: 'la', value: 'la', label: 'Latin', count: 98 }
]

// Publication years
const publicationYears: FacetItem[] = [
  { id: '2020s', value: '2020-2029', label: '2020-2029', count: 234 },
  { id: '2010s', value: '2010-2019', label: '2010-2019', count: 567 },
  { id: '2000s', value: '2000-2009', label: '2000-2009', count: 432 },
  { id: '1990s', value: '1990-1999', label: '1990-1999', count: 321 },
  { id: '1980s', value: '1980-1989', label: '1980-1989', count: 198 },
  { id: 'older', value: 'before-1980', label: 'Before 1980', count: 876 }
]

// Authors (with some selected)
const authors: FacetItem[] = [
  { id: 'goethe', value: 'goethe', label: 'Johann Wolfgang von Goethe', count: 45, isRefined: true },
  { id: 'schiller', value: 'schiller', label: 'Friedrich Schiller', count: 32 },
  { id: 'kafka', value: 'kafka', label: 'Franz Kafka', count: 28, isRefined: true },
  { id: 'mann', value: 'mann', label: 'Thomas Mann', count: 23 },
  { id: 'hesse', value: 'hesse', label: 'Hermann Hesse', count: 19 }
]
