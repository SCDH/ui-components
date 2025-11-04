import type { Meta, StoryObj } from '@storybook/react-vite'
import { PageView, type PageViewSection } from '@/components/ui/scdh/page-view'

/**
 * Sample DTS JSON data
 * This demonstrates how PageView can consume JSON data from external sources
 */
const sampleData = [
    {
        context: "https://distributed-text-services.github.io/specifications/context/1.0rc1.json",
        dtsVersion: "1.0rc1",
        collection: {
            id: "root",
            type: "Collection",
            title: "Klassische Texte",
            description: "Eine kleine Sammlung klassischer Werke.",
            members: [
                {
                    id: "faust",
                    type: "Resource",
                    title: "Goethe: Faust I",
                    description: "Drei Szenen aus Faust I.",
                    scenes: [
                        {
                            identifier: "scene1",
                            title: "Nacht",
                            content: [
                                "Habe nun, ach! Philosophie, Juristerei und Medizin und leider auch Theologie studiert, mit heißem Bemühn.",
                                "Da steh ich nun, ich armer Tor, und bin so klug als wie zuvor.",
                                "Heiße Magister, heiße Doktor gar und ziehe schon an die zehen Jahr herauf, herab und quer und krumm meine Schüler an der Nase herum."
                            ]
                        },
                        {
                            identifier: "scene2",
                            title: "Vor dem Tor",
                            content: [
                                "Vom Eise befreit sind Strom und Bäche durch des Frühlings holden, belebenden Blick.",
                                "Im Tale grünet Hoffnungsglück; der alte Winter, in seiner Schwäche, zog sich in rauhe Berge zurück.",
                                "Von dorther sendet er, fliehend, nur ohnmächtige Schauer körnigen Eises in Streifen über die grünende Flur."
                            ]
                        },
                        {
                            identifier: "scene3",
                            title: "Studierzimmer",
                            content: [
                                "Mein schöner Abendstern, wohl grüß ich dich! Du Freundlicher, wie gerne sah ich dich!",
                                "O bleib, mein Licht, mein Hoffnungsschein, o bleib, und führe mich heim!",
                                "Wie schwinden mir der Erde Schranken, wie drängt sich alles in Gefühl!"
                            ]
                        }
                    ]
                }
            ]
        }
    }
]

/**
 * Helper function to transform DTS JSON to PageView sections
 * This demonstrates one way to consume external data
 */
function transformDTStoSections(dtsData: typeof sampleData): {
  title: string
  description: string
  sections: PageViewSection[]
} {
  const resource = dtsData[0].collection.members[0]
  
  return {
    title: resource.title,
    description: resource.description,
    sections: resource.scenes.map(scene => ({
      id: scene.identifier,
      title: scene.title,
      content: scene.content
    }))
  }
}

// Transform sample data for stories
const { title, description, sections } = transformDTStoSections(sampleData)

const meta = {
  title: 'SCDH-UI/PageView',
  component: PageView,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Main page title'
    },
    description: {
      control: 'text',
      description: 'Page description/subtitle'
    },
    sections: {
      control: 'object',
      description: 'Array of sections to display'
    },
    onSectionClick: {
      action: 'section-clicked',
      description: 'Callback when a section is clicked'
    }
  },
} satisfies Meta<typeof PageView>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default story showing the PageView with Faust I content
 */
export const Default: Story = {
  args: {
    title,
    description,
    sections,
  },
}

/**
 * Story without page title and description
 * Just shows the sections
 */
export const SectionsOnly: Story = {
  args: {
    sections,
  },
}

/**
 * Story with custom styling
 * Demonstrates how to customize the appearance
 */
export const CustomStyling: Story = {
  args: {
    title,
    description,
    sections,
    className: 'bg-gray-50 dark:bg-gray-900',
    sectionTitleClassName: 'text-scdh-blue font-bold',
    paragraphClassName: 'text-justify',
  },
}

/**
 * Story with interactive sections
 * Click on sections to trigger an action
 */
export const Interactive: Story = {
  args: {
    title,
    description,
    sections,
    onSectionClick: (section: PageViewSection) => {
      alert(`You clicked on section: ${section.title}`)
    },
  },
}

/**
 * Simple example with minimal data
 * Shows how easy it is to use PageView with simple content
 */
export const SimpleExample: Story = {
  args: {
    title: 'Ein einfaches Beispiel',
    description: 'Dieses Beispiel zeigt, wie einfach die PageView-Komponente zu nutzen ist.',
    sections: [
      {
        title: 'Einführung',
        content: 'Dies ist ein einfacher Text, der in einem Absatz dargestellt wird.'
      },
      {
        title: 'Mehrzeilige Inhalte',
        content: [
          'Dies ist der erste Absatz eines mehrzeiligen Inhalts.',
          'Und dies ist der zweite Absatz, der automatisch mit dem richtigen Abstand dargestellt wird.',
          'Ein dritter Absatz zeigt, wie gut das Spacing funktioniert.'
        ]
      },
      {
        title: 'Fazit',
        content: 'Die Komponente ist flexibel und einfach zu verwenden!'
      }
    ],
  },
}

/**
 * Example with only one section
 * Useful for simple use cases
 */
export const SingleSection: Story = {
  args: {
    title: 'Ein einzelner Abschnitt',
    sections: [
      {
        title: 'Der einzige Abschnitt',
        content: [
          'Manchmal braucht man nur einen einzigen Abschnitt.',
          'Die Komponente funktioniert auch in diesem Fall perfekt.',
        ]
      }
    ],
  },
}
