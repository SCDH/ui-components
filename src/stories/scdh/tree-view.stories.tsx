import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { 
  FolderIcon, 
  FileIcon, 
  FolderOpenIcon, 
  MoreHorizontalIcon,
  EditIcon,
  TrashIcon,
  PlusIcon,
  BookOpenIcon,
  ScrollTextIcon
} from 'lucide-react';
import { TreeView, createTreeData, type TreeDataItem } from '@/components/ui/scdh/tree-view';

const meta = {
  title: 'SCDH-UI/TreeView',
  component: TreeView,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'SCDH Tree View component for displaying hierarchical data structures like file systems, navigation menus, or organizational charts.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    compact: {
      control: 'boolean',
      description: 'Compact mode with tighter spacing'
    },
    expandAll: {
      control: 'boolean', 
      description: 'Expand all nodes initially'
    },
    initialSelectedItemId: {
      control: 'text',
      description: 'ID of initially selected item'
    }
  },
  args: { 
    onSelectChange: fn(),
    onDocumentDrag: fn()
  },
} satisfies Meta<typeof TreeView>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample tree data for documents
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
 * Helper function to transform DTS JSON to TreeView structure
 * Converts hierarchical DTS data (collections, resources, scenes) into tree items
 */
function transformDTStoTree(dtsData: typeof sampleData): TreeDataItem[] {
  const data = dtsData[0]
  
  // Create root collection node
  const rootCollection: TreeDataItem = {
    id: data.collection.id,
    name: data.collection.title,
    icon: FolderIcon,
    openIcon: FolderOpenIcon,
    children: []
  }
  
  // Transform each member (resource) in the collection
  data.collection.members.forEach(member => {
    const resourceNode: TreeDataItem = {
      id: member.id,
      name: member.title,
      icon: BookOpenIcon,
      openIcon: BookOpenIcon,
      children: []
    }
    
    // Transform scenes as child items of the resource
    if (member.scenes) {
      member.scenes.forEach(scene => {
        const sceneNode: TreeDataItem = {
          id: scene.identifier,
          name: scene.title,
          icon: ScrollTextIcon,
          // Store the content for potential use in click handlers
          onClick: () => {
            console.log(`Selected scene: ${scene.title}`, scene.content)
          }
        }
        resourceNode.children?.push(sceneNode)
      })
    }
    
    rootCollection.children?.push(resourceNode)
  })
  
  return [rootCollection]
}

// Sample tree data for file systems
const sampleFileSystem: TreeDataItem[] = [
  {
    id: 'src',
    name: 'src',
    children: [
      {
        id: 'components',
        name: 'components',
        children: [
          {
            id: 'ui',
            name: 'ui',
            children: [
              { id: 'button.tsx', name: 'button.tsx' },
              { id: 'tree-view.tsx', name: 'tree-view.tsx' },
              { id: 'input.tsx', name: 'input.tsx' },
            ]
          },
          {
            id: 'forms',
            name: 'forms',
            children: [
              { id: 'login-form.tsx', name: 'login-form.tsx' },
              { id: 'contact-form.tsx', name: 'contact-form.tsx' },
            ]
          }
        ]
      },
      {
        id: 'pages',
        name: 'pages',
        children: [
          { id: 'home.tsx', name: 'home.tsx' },
          { id: 'about.tsx', name: 'about.tsx' },
          { id: 'contact.tsx', name: 'contact.tsx' },
        ]
      },
      { id: 'app.tsx', name: 'App.tsx' },
      { id: 'main.tsx', name: 'main.tsx' },
    ]
  },
  {
    id: 'public',
    name: 'public',
    children: [
      { id: 'index.html', name: 'index.html' },
      { id: 'favicon.ico', name: 'favicon.ico' },
    ]
  },
  { id: 'package.json', name: 'package.json' },
  { id: 'vite.config.ts', name: 'vite.config.ts' },
  { id: 'README.md', name: 'README.md' },
];

// Basic Examples
export const Default: Story = {
  args: {
    data: sampleFileSystem,
  },
  parameters: {
    layout: 'padded'
  }
};

export const Compact: Story = {
  args: {
    data: sampleFileSystem,
    compact: true,
  },
  parameters: {
    layout: 'padded'
  }
};

export const ExpandedAll: Story = {
  args: {
    data: sampleFileSystem,
    expandAll: true,
  },
  parameters: {
    layout: 'padded'
  }
};

export const WithSelection: Story = {
  args: {
    data: sampleFileSystem,
    initialSelectedItemId: 'button.tsx',
    expandAll: true,
  },
  parameters: {
    layout: 'padded'
  }
};

// Tree with actions
const treeWithActions: TreeDataItem[] = [
  {
    id: 'documents',
    name: 'Documents',
    actions: (
      <div className="flex gap-1">
        <div className="h-6 w-6 flex items-center justify-center rounded hover:bg-gray-100 transition-colors">
          <PlusIcon className="h-3 w-3" />
        </div>
        <div className="h-6 w-6 flex items-center justify-center rounded hover:bg-gray-100 transition-colors">
          <MoreHorizontalIcon className="h-3 w-3" />
        </div>
      </div>
    ),
    children: [
      {
        id: 'report.pdf',
        name: 'Annual Report.pdf',
        actions: (
          <div className="flex gap-1">
            <div className="h-6 w-6 flex items-center justify-center rounded hover:bg-gray-100 transition-colors">
              <EditIcon className="h-3 w-3" />
            </div>
            <div className="h-6 w-6 flex items-center justify-center rounded hover:bg-gray-100 transition-colors">
              <TrashIcon className="h-3 w-3" />
            </div>
          </div>
        ),
      },
      {
        id: 'presentation.pptx',
        name: 'Project Presentation.pptx',
        actions: (
          <div className="flex gap-1">
            <div className="h-6 w-6 flex items-center justify-center rounded hover:bg-gray-100 transition-colors">
              <EditIcon className="h-3 w-3" />
            </div>
            <div className="h-6 w-6 flex items-center justify-center rounded hover:bg-gray-100 transition-colors">
              <TrashIcon className="h-3 w-3" />
            </div>
          </div>
        ),
      }
    ]
  },
  {
    id: 'projects',
    name: 'Projects',
    actions: (
      <div className="flex gap-1">
        <div className="h-6 w-6 flex items-center justify-center rounded hover:bg-gray-100 transition-colors">
          <PlusIcon className="h-3 w-3" />
        </div>
      </div>
    ),
    children: [
      { id: 'website', name: 'Company Website' },
      { id: 'mobile-app', name: 'Mobile App' },
    ]
  }
];

export const WithActions: Story = {
  args: {
    data: treeWithActions,
    expandAll: true,
  },
  parameters: {
    layout: 'padded'
  }
};

// Drag and Drop Example
const draggableTree: TreeDataItem[] = [
  {
    id: 'todo',
    name: 'To Do',
    draggable: true,
    droppable: true,
    children: [
      { id: 'task1', name: 'Design new layout', draggable: true },
      { id: 'task2', name: 'Write documentation', draggable: true },
    ]
  },
  {
    id: 'in-progress',
    name: 'In Progress',
    draggable: true,
    droppable: true,
    children: [
      { id: 'task3', name: 'Implement API', draggable: true },
    ]
  },
  {
    id: 'done',
    name: 'Done',
    draggable: true,
    droppable: true,
    children: [
      { id: 'task4', name: 'Setup project', draggable: true },
      { id: 'task5', name: 'Initial design', draggable: true },
    ]
  }
];

export const DragAndDrop: Story = {
  args: {
    data: draggableTree,
    expandAll: true,
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Tree items can be dragged and dropped between different containers. Try dragging tasks between the different status columns.'
      }
    }
  }
};

// Custom Icons Example
const customIconTree: TreeDataItem[] = [
  {
    id: 'images',
    name: 'Images',
    icon: FolderIcon,
    openIcon: FolderOpenIcon,
    children: [
      { id: 'photo1.jpg', name: 'vacation.jpg', icon: FileIcon },
      { id: 'photo2.png', name: 'screenshot.png', icon: FileIcon },
    ]
  },
  {
    id: 'videos',
    name: 'Videos', 
    icon: FolderIcon,
    openIcon: FolderOpenIcon,
    children: [
      { id: 'video1.mp4', name: 'presentation.mp4', icon: FileIcon },
    ]
  }
];

export const CustomIcons: Story = {
  args: {
    data: customIconTree,
    expandAll: true,
  },
  parameters: {
    layout: 'padded'
  }
};

// Utility function demonstration
const flatData = [
  { id: 'root', name: 'Root', type: 'folder' as const },
  { id: 'child1', name: 'Child 1', parentId: 'root', type: 'folder' as const },
  { id: 'child2', name: 'Child 2', parentId: 'root', type: 'file' as const },
  { id: 'grandchild1', name: 'Grandchild 1', parentId: 'child1', type: 'file' as const },
  { id: 'grandchild2', name: 'Grandchild 2', parentId: 'child1', type: 'file' as const },
];

export const FromFlatData: Story = {
  args: {
    data: createTreeData(flatData),
    expandAll: true,
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'This example shows how to use the `createTreeData` utility function to convert flat data structures into hierarchical tree data.'
      }
    }
  }
};

// Disabled items example
const disabledTree: TreeDataItem[] = [
  {
    id: 'active-folder',
    name: 'Active Folder',
    children: [
      { id: 'active-file', name: 'active-file.txt' },
      { id: 'disabled-file', name: 'readonly-file.txt', disabled: true },
    ]
  },
  {
    id: 'disabled-folder',
    name: 'Disabled Folder',
    disabled: true,
    children: [
      { id: 'nested-file', name: 'nested-file.txt' },
    ]
  }
];

export const DisabledItems: Story = {
  args: {
    data: disabledTree,
    expandAll: true,
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Items can be disabled to prevent interaction while still showing them in the tree structure.'
      }
    }
  }
};

// ==========================================
// DTS Data Examples
// ==========================================

/**
 * Basic DTS tree showing collection, resource, and scenes
 * This demonstrates how to use TreeView with DTS data structures
 */
export const DTSBasic: Story = {
  args: {
    data: transformDTStoTree(sampleData),
    expandAll: true,
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'TreeView displaying DTS (Distributed Text Services) data with collections, resources, and scenes. Click on scenes to see their content in the console.'
      }
    }
  }
};

/**
 * DTS tree with compact mode
 * Better for displaying large text collections
 */
export const DTSCompact: Story = {
  args: {
    data: transformDTStoTree(sampleData),
    compact: true,
    expandAll: true,
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Compact view of DTS data - useful when displaying large text collections with many scenes.'
      }
    }
  }
};

/**
 * DTS tree with initial selection
 * Shows how to pre-select a specific scene
 */
export const DTSWithSelection: Story = {
  args: {
    data: transformDTStoTree(sampleData),
    initialSelectedItemId: 'scene2', // Pre-select "Vor dem Tor"
    expandAll: true,
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'DTS tree with a pre-selected scene. The "Vor dem Tor" scene is initially highlighted.'
      }
    }
  }
};

/**
 * DTS tree collapsed by default
 * Users can explore the hierarchy step by step
 */
export const DTSCollapsed: Story = {
  args: {
    data: transformDTStoTree(sampleData),
    expandAll: false,
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'DTS tree starts collapsed, allowing users to explore the collection hierarchy at their own pace.'
      }
    }
  }
};

/**
 * DTS tree with action buttons
 * Shows how to add interactive elements to DTS items
 */
export const DTSWithActions: Story = {
  args: {
    data: (() => {
      const treeData = transformDTStoTree(sampleData)
      
      // Add actions to the root collection
      if (treeData[0]) {
        treeData[0].actions = (
          <div className="flex gap-1">
            <div className="h-6 w-6 flex items-center justify-center rounded hover:bg-gray-100 transition-colors">
              <PlusIcon className="h-3 w-3" />
            </div>
          </div>
        )
        
        // Add actions to each resource
        treeData[0].children?.forEach(resource => {
          resource.actions = (
            <div className="flex gap-1">
              <div className="h-6 w-6 flex items-center justify-center rounded hover:bg-gray-100 transition-colors">
                <EditIcon className="h-3 w-3" />
              </div>
              <div className="h-6 w-6 flex items-center justify-center rounded hover:bg-gray-100 transition-colors">
                <MoreHorizontalIcon className="h-3 w-3" />
              </div>
            </div>
          )
          
          // Add actions to each scene
          resource.children?.forEach(scene => {
            scene.actions = (
              <div className="flex gap-1">
                <div className="h-6 w-6 flex items-center justify-center rounded hover:bg-gray-100 transition-colors">
                  <EditIcon className="h-3 w-3" />
                </div>
              </div>
            )
          })
        })
      }
      
      return treeData
    })(),
    expandAll: true,
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'DTS tree with action buttons for each item type. Collections can add new items, resources can be edited or have additional options, and scenes can be edited.'
      }
    }
  }
};
