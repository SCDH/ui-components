import * as React from "react"
import { TreeView as BaseTreeView, type TreeDataItem as BaseTreeDataItem } from "@/components/ui/imports/tree-view"
import { cn } from "@/lib/utils"
import { ChevronRight, Folder, FolderOpen, File } from "lucide-react"

/**
 * SCDH Tree View Component Props
 * 
 * This interface extends the base TreeView but provides SCDH-specific defaults
 * and simplified API for common use cases.
 */
export interface TreeViewProps extends Omit<React.ComponentProps<typeof BaseTreeView>, 'defaultNodeIcon' | 'defaultLeafIcon'> {
  /** 
   * Tree data structure - can be a single item or array of items
   */
  data: TreeDataItem[] | TreeDataItem
  
  /** 
   * Initially selected item ID
   */
  initialSelectedItemId?: string
  
  /** 
   * Callback when selection changes
   */
  onSelectChange?: (item: TreeDataItem | undefined) => void
  
  /** 
   * Whether to expand all nodes initially
   */
  expandAll?: boolean
  
  /** 
   * Custom icon for folder nodes (defaults to SCDH folder icon)
   */
  nodeIcon?: React.ComponentType<{ className?: string }>
  
  /** 
   * Custom icon for leaf items (defaults to SCDH file icon)
   */
  leafIcon?: React.ComponentType<{ className?: string }>
  
  /** 
   * Drag and drop handler
   */
  onDocumentDrag?: (sourceItem: TreeDataItem, targetItem: TreeDataItem) => void
  
  /** 
   * Compact mode for tighter spacing
   */
  compact?: boolean
}

/**
 * SCDH Tree Data Item
 * Re-export with SCDH-specific documentation
 */
export interface TreeDataItem extends BaseTreeDataItem {
  /** Unique identifier for the tree item */
  id: string
  
  /** Display name for the tree item */
  name: string
  
  /** Optional icon (overrides default icons) */
  icon?: React.ComponentType<{ className?: string }>
  
  /** Icon when item is selected */
  selectedIcon?: React.ComponentType<{ className?: string }>
  
  /** Icon when folder is open */
  openIcon?: React.ComponentType<{ className?: string }>
  
  /** Child items (makes this a folder/node) */
  children?: TreeDataItem[]
  
  /** Action buttons/elements shown on hover/selection */
  actions?: React.ReactNode
  
  /** Click handler for the item */
  onClick?: () => void
  
  /** Whether item can be dragged */
  draggable?: boolean
  
  /** Whether items can be dropped on this item */
  droppable?: boolean
  
  /** Whether item is disabled */
  disabled?: boolean
}

/**
 * SCDH Tree View Component
 * 
 * This component wraps the base TreeView to provide SCDH-specific styling
 * and sensible defaults while maintaining all functionality.
 * 
 * Key features:
 * - SCDH brand colors and styling
 * - Default folder/file icons
 * - Compact mode option
 * - Simplified API
 * - Full accessibility support from base component
 */
const TreeView = React.forwardRef<HTMLDivElement, TreeViewProps>(
  ({ 
    nodeIcon = Folder,
    leafIcon = File,
    compact = false,
    className,
    ...props 
  }, ref) => {
    return (
      <BaseTreeView
        ref={ref}
        defaultNodeIcon={nodeIcon}
        defaultLeafIcon={leafIcon}
        className={cn(
          // Base SCDH tree styling
          "scdh-tree-view",
          
          // SCDH color scheme overrides
          "[&_.group]:hover:before:bg-scdh-blue/20",
          "[&[data-state=selected]]:before:bg-scdh-blue/30",
          "[&[data-state=selected]]:text-scdh-text",
          
          // Focus styling with SCDH colors
          "[&:focus-visible]:outline-scdh-blue",
          "[&:focus-visible]:outline-2",
          "[&:focus-visible]:outline-offset-2",
          
          // Compact mode adjustments
          compact && [
            "[&_.ml-4]:ml-2",           // Reduce indentation
            "[&_.py-2]:py-1",           // Reduce vertical padding
            "[&_.text-sm]:text-xs",     // Smaller text
          ],
          
          // Custom scrollbar styling
          "scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300",
          
          className
        )}
        {...props}
      />
    )
  }
)

TreeView.displayName = "SCDHTreeView"

/**
 * Utility function to create tree data from flat structure
 * Useful for converting file system data or hierarchical data
 */
export function createTreeData(
  items: Array<{
    id: string
    name: string
    parentId?: string
    type?: 'folder' | 'file'
    [key: string]: any
  }>
): TreeDataItem[] {
  const itemMap = new Map<string, TreeDataItem>()
  const rootItems: TreeDataItem[] = []

  // First pass: create all items
  items.forEach(item => {
    const { parentId, type, ...itemProps } = item
    itemMap.set(item.id, {
      ...itemProps,
      children: type === 'folder' ? [] : undefined,
    })
  })

  // Second pass: build hierarchy
  items.forEach(item => {
    const treeItem = itemMap.get(item.id)!
    
    if (item.parentId) {
      const parent = itemMap.get(item.parentId)
      if (parent?.children) {
        parent.children.push(treeItem)
      }
    } else {
      rootItems.push(treeItem)
    }
  })

  return rootItems
}

/**
 * Default icons for SCDH Tree View
 * These can be customized by passing different icons to the component
 */
export const TreeIcons = {
  Folder,
  FolderOpen,
  File,
  ChevronRight
} as const

export { TreeView, type TreeDataItem as SCDHTreeDataItem }
