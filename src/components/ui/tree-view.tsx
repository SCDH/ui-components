import React from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { ChevronRight } from 'lucide-react'
// cva (Class Variance Authority) - A utility for creating type-safe CSS class variants
// It helps manage different visual states (like selected, hover, etc.) in a structured way
import { cva } from 'class-variance-authority'
// cn - A utility function that merges Tailwind CSS classes intelligently
// It handles conditional classes and prevents style conflicts
import { cn } from '@/lib/utils'

// Basic Tree Setup by MrLightful
// https://github.com/MrLightful/shadcn-tree-view

/**
 * Style variants for tree items
 * cva creates reusable style configurations that can be applied to elements
 * This variant creates a hover effect using pseudo-elements (before:)
 */
const treeVariants = cva(
    'group hover:before:opacity-100 before:absolute before:rounded-lg before:left-0 px-2 before:w-full before:opacity-0 before:bg-accent/70 before:h-[2rem] before:-z-10'
)

/**
 * Style variant for selected tree items
 * Makes the background visible and changes text color
 */
const selectedTreeVariants = cva(
    'before:opacity-100 before:bg-accent/70 text-accent-foreground'
)

/**
 * Style variant for when an item is being dragged over (drag & drop feedback)
 */
const dragOverVariants = cva(
    'before:opacity-100 before:bg-primary/20 text-primary-foreground'
)

/**
 * Interface defining the structure of a tree item
 * This is used for TypeScript type checking to ensure data consistency
 */
interface TreeDataItem {
    id: string // Unique identifier for the item
    name: string // Display text for the item
    icon?: any // Optional icon component to display (? means optional)
    selectedIcon?: any // Icon to show when item is selected
    openIcon?: any // Icon to show when node is expanded
    children?: TreeDataItem[] // Nested items (makes this a recursive structure)
    actions?: React.ReactNode // Optional action buttons/elements to show
    onClick?: () => void // Optional callback when item is clicked
    draggable?: boolean // Whether this item can be dragged
    droppable?: boolean // Whether items can be dropped onto this item
    disabled?: boolean // Whether the item is disabled (grayed out, not interactive)
}

/**
 * Props for the TreeView component
 * React.HTMLAttributes<HTMLDivElement> - This extends all standard HTML div attributes
 * (like className, style, onClick, etc.) so they can be passed to the component
 * The & combines this with our custom props below
 */
type TreeProps = React.HTMLAttributes<HTMLDivElement> & {
    data: TreeDataItem[] | TreeDataItem // The tree data (can be single item or array)
    initialSelectedItemId?: string // Which item should be selected on first render
    onSelectChange?: (item: TreeDataItem | undefined) => void // Callback when selection changes
    expandAll?: boolean // Whether to expand all nodes initially
    defaultNodeIcon?: any // Default icon for nodes (items with children)
    defaultLeafIcon?: any // Default icon for leaves (items without children)
    onDocumentDrag?: (sourceItem: TreeDataItem, targetItem: TreeDataItem) => void // Callback for drag & drop
}

const TreeView = React.forwardRef<HTMLDivElement, TreeProps>(
    (
        {
            data,
            initialSelectedItemId,
            onSelectChange,
            expandAll,
            defaultLeafIcon,
            defaultNodeIcon,
            className,
            onDocumentDrag,
            ...props
        },
        ref
    ) => {
        const [selectedItemId, setSelectedItemId] = React.useState<
            string | undefined
        >(initialSelectedItemId)
        
        const [draggedItem, setDraggedItem] = React.useState<TreeDataItem | null>(null)

        const handleSelectChange = React.useCallback(
            (item: TreeDataItem | undefined) => {
                setSelectedItemId(item?.id)
                if (onSelectChange) {
                    onSelectChange(item)
                }
            },
            [onSelectChange]
        )

        // Handler for when drag operation starts
        const handleDragStart = React.useCallback((item: TreeDataItem) => {
            setDraggedItem(item)
        }, []) // Empty dependency array = function never changes

        // Handler for when item is dropped
        const handleDrop = React.useCallback((targetItem: TreeDataItem) => {
            // Only trigger callback if we have a valid drag operation
            if (draggedItem && onDocumentDrag && draggedItem.id !== targetItem.id) {
                onDocumentDrag(draggedItem, targetItem)
            }
            setDraggedItem(null) // Clear the dragged item
        }, [draggedItem, onDocumentDrag])

        /**
         * useMemo - Memoizes (caches) the result of expensive calculations
         * Only recalculates when dependencies change
         * Here we calculate which tree nodes should be expanded initially
         */
        const expandedItemIds = React.useMemo(() => {
            if (!initialSelectedItemId) {
                return [] as string[] // Type assertion: tell TypeScript this is a string array
            }

            const ids: string[] = []

            /**
             * Recursive function to walk through the tree structure
             * This builds the path from root to the initially selected item
             */
            function walkTreeItems(
                items: TreeDataItem[] | TreeDataItem,
                targetId: string
            ) {
                if (items instanceof Array) {
                    // If items is an array, iterate through each item
                    for (let i = 0; i < items.length; i++) {
                        ids.push(items[i]!.id) // ! is non-null assertion - we know this exists
                        if (walkTreeItems(items[i]!, targetId) && !expandAll) {
                            return true
                        }
                        if (!expandAll) ids.pop() // Remove if not on the path to target
                    }
                } else if (!expandAll && items.id === targetId) {
                    return true // Found the target item
                } else if (items.children) {
                    return walkTreeItems(items.children, targetId) // Recurse into children
                }
            }

            walkTreeItems(data, initialSelectedItemId)
            return ids
        }, [data, expandAll, initialSelectedItemId])

        return (
            <div className={cn('overflow-hidden relative p-2', className)}>
                {/* Main tree structure with all the items */}
                <TreeItem
                    data={data}
                    ref={ref} // Forward the ref to TreeItem
                    selectedItemId={selectedItemId}
                    handleSelectChange={handleSelectChange}
                    expandedItemIds={expandedItemIds}
                    defaultLeafIcon={defaultLeafIcon}
                    defaultNodeIcon={defaultNodeIcon}
                    handleDragStart={handleDragStart}
                    handleDrop={handleDrop}
                    draggedItem={draggedItem}
                    {...props} // Spread operator - passes all remaining props through
                />
                {/* Drop zone at the bottom for dropping items to move them to root level */}
                <div
                    className='w-full h-[48px]'
                    onDrop={() => { handleDrop({id: '', name: 'parent_div'})}}>

                </div>
            </div>
        )
    }
)
// displayName helps with debugging in React DevTools - shows the component name
TreeView.displayName = 'TreeView'

/**
 * Extended props for TreeItem (internal component)
 * Combines all TreeProps with additional internal state management props
 */
type TreeItemProps = TreeProps & {
    selectedItemId?: string
    handleSelectChange: (item: TreeDataItem | undefined) => void
    expandedItemIds: string[]
    defaultNodeIcon?: any
    defaultLeafIcon?: any
    handleDragStart?: (item: TreeDataItem) => void
    handleDrop?: (item: TreeDataItem) => void
    draggedItem: TreeDataItem | null
}

/**
 * TreeItem - Internal component that recursively renders tree structure
 * Handles the actual rendering of tree nodes and leaves
 */
const TreeItem = React.forwardRef<HTMLDivElement, TreeItemProps>(
    (
        {
            className,
            data,
            selectedItemId,
            handleSelectChange,
            expandedItemIds,
            defaultNodeIcon,
            defaultLeafIcon,
            handleDragStart,
            handleDrop,
            draggedItem,
            ...props
        },
        ref
    ) => {
        // Normalize data to always be an array for consistent handling
        if (!(data instanceof Array)) {
            data = [data]
        }
        return (
            // role="tree" is for accessibility (screen readers)
            <div ref={ref} role="tree" className={className} {...props}>
                <ul>
                    {/* Map over data array to render each item */}
                    {data.map((item) => (
                        <li key={item.id}> {/* key is required by React for list items */}
                            {/* Conditional rendering: TreeNode if has children, TreeLeaf otherwise */}
                            {item.children ? (
                                <TreeNode
                                    item={item}
                                    selectedItemId={selectedItemId}
                                    expandedItemIds={expandedItemIds}
                                    handleSelectChange={handleSelectChange}
                                    defaultNodeIcon={defaultNodeIcon}
                                    defaultLeafIcon={defaultLeafIcon}
                                    handleDragStart={handleDragStart}
                                    handleDrop={handleDrop}
                                    draggedItem={draggedItem}
                                />
                            ) : (
                                <TreeLeaf
                                    item={item}
                                    selectedItemId={selectedItemId}
                                    handleSelectChange={handleSelectChange}
                                    defaultLeafIcon={defaultLeafIcon}
                                    handleDragStart={handleDragStart}
                                    handleDrop={handleDrop}
                                    draggedItem={draggedItem}
                                />
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        )
    }
)
TreeItem.displayName = 'TreeItem'

/**
 * TreeNode - Component for items that have children (expandable/collapsible)
 * Uses Accordion for expand/collapse functionality
 * Note: This is a regular component (not forwardRef) as it doesn't need ref forwarding
 */
const TreeNode = ({
    item,
    handleSelectChange,
    expandedItemIds,
    selectedItemId,
    defaultNodeIcon,
    defaultLeafIcon,
    handleDragStart,
    handleDrop,
    draggedItem,
}: {
    // Inline type definition using object destructuring
    // This is TypeScript's way of defining parameter types directly
    item: TreeDataItem
    handleSelectChange: (item: TreeDataItem | undefined) => void
    expandedItemIds: string[]
    selectedItemId?: string
    defaultNodeIcon?: any
    defaultLeafIcon?: any
    handleDragStart?: (item: TreeDataItem) => void
    handleDrop?: (item: TreeDataItem) => void
    draggedItem: TreeDataItem | null
}) => {
    // Track whether this node is expanded (Accordion requires array format)
    const [value, setValue] = React.useState(
        expandedItemIds.includes(item.id) ? [item.id] : []
    )
    // Track visual feedback during drag operations
    const [isDragOver, setIsDragOver] = React.useState(false)

    // HTML5 Drag & Drop API event handlers
    const onDragStart = (e: React.DragEvent) => {
        if (!item.draggable) {
            e.preventDefault()
            return
        }
        // Store the item ID in the drag data
        e.dataTransfer.setData('text/plain', item.id)
        handleDragStart?.(item) // ?. is optional chaining - only calls if function exists
    }

    const onDragOver = (e: React.DragEvent) => {
        // Allow drop if item is droppable and not dragging onto itself
        if (item.droppable !== false && draggedItem && draggedItem.id !== item.id) {
            e.preventDefault() // Necessary to allow drop
            setIsDragOver(true) // Visual feedback
        }
    }

    const onDragLeave = () => {
        setIsDragOver(false)
    }

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
        handleDrop?.(item)
    }

    return (
        // Radix UI Accordion for expand/collapse behavior
        // "multiple" allows multiple nodes to be open at once
        <AccordionPrimitive.Root
            type="multiple"
            value={value}
            onValueChange={(s) => setValue(s)}
        >
            <AccordionPrimitive.Item value={item.id}>
                <AccordionTrigger
                    className={cn(
                        // cn merges multiple class strings intelligently
                        treeVariants(), // Base styles
                        selectedItemId === item.id && selectedTreeVariants(), // Conditional: selected styles
                        isDragOver && dragOverVariants() // Conditional: drag over styles
                    )}
                    onClick={() => {
                        handleSelectChange(item)
                        item.onClick?.() // Call custom onClick if provided
                    }}
                    draggable={!!item.draggable} // !! converts to boolean (double negation)
                    onDragStart={onDragStart}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                >
                    <TreeIcon
                        item={item}
                        isSelected={selectedItemId === item.id}
                        isOpen={value.includes(item.id)}
                        default={defaultNodeIcon}
                    />
                    <span className="text-sm truncate">{item.name}</span>
                    {/* Actions (like delete, edit buttons) shown on hover/select */}
                    <TreeActions isSelected={selectedItemId === item.id}>
                        {item.actions}
                    </TreeActions>
                </AccordionTrigger>
                {/* Content shown when expanded - recursively renders children */}
                <AccordionContent className="ml-4 pl-1 border-l">
                    <TreeItem
                        data={item.children ? item.children : item}
                        selectedItemId={selectedItemId}
                        handleSelectChange={handleSelectChange}
                        expandedItemIds={expandedItemIds}
                        defaultLeafIcon={defaultLeafIcon}
                        defaultNodeIcon={defaultNodeIcon}
                        handleDragStart={handleDragStart}
                        handleDrop={handleDrop}
                        draggedItem={draggedItem}
                    />
                </AccordionContent>
            </AccordionPrimitive.Item>
        </AccordionPrimitive.Root>
    )
}

/**
 * TreeLeaf - Component for items without children (end nodes)
 * Uses forwardRef to allow parent components to access the DOM element
 * 
 * The type definition combines:
 * - React.HTMLAttributes<HTMLDivElement>: Standard div props (className, onClick, etc.)
 * - Custom props specific to TreeLeaf (item, selectedItemId, etc.)
 */
const TreeLeaf = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
        item: TreeDataItem
        selectedItemId?: string
        handleSelectChange: (item: TreeDataItem | undefined) => void
        defaultLeafIcon?: any
        handleDragStart?: (item: TreeDataItem) => void
        handleDrop?: (item: TreeDataItem) => void
        draggedItem: TreeDataItem | null
    }
>(
    (
        {
            className,
            item,
            selectedItemId,
            handleSelectChange,
            defaultLeafIcon,
            handleDragStart,
            handleDrop,
            draggedItem,
            ...props
        },
        ref // The forwarded ref that will be attached to the div
    ) => {
        // Track drag over state for visual feedback
        const [isDragOver, setIsDragOver] = React.useState(false)

        // Drag & Drop handlers - similar to TreeNode but checks disabled state
        const onDragStart = (e: React.DragEvent) => {
            if (!item.draggable || item.disabled) {
                e.preventDefault()
                return
            }
            e.dataTransfer.setData('text/plain', item.id)
            handleDragStart?.(item)
        }

        const onDragOver = (e: React.DragEvent) => {
            if (item.droppable !== false && !item.disabled && draggedItem && draggedItem.id !== item.id) {
                e.preventDefault()
                setIsDragOver(true)
            }
        }

        const onDragLeave = () => {
            setIsDragOver(false)
        }

        const onDrop = (e: React.DragEvent) => {
            if (item.disabled) return
            e.preventDefault()
            setIsDragOver(false)
            handleDrop?.(item)
        }

        return (
            <div
                ref={ref} // Attach the forwarded ref to this div
                className={cn(
                    // Base styles for leaf items
                    'ml-5 flex text-left items-center py-2 cursor-pointer before:right-1',
                    treeVariants(),
                    className, // Allow custom className to override
                    selectedItemId === item.id && selectedTreeVariants(),
                    isDragOver && dragOverVariants(),
                    // Disabled state styling
                    item.disabled && 'opacity-50 cursor-not-allowed pointer-events-none'
                )}
                onClick={() => {
                    if (item.disabled) return // Prevent interaction if disabled
                    handleSelectChange(item)
                    item.onClick?.()
                }}
                draggable={!!item.draggable && !item.disabled}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                {...props} // Spread remaining props (like data attributes, aria labels, etc.)
            >
                <TreeIcon
                    item={item}
                    isSelected={selectedItemId === item.id}
                    default={defaultLeafIcon}
                />
                <span className="flex-grow text-sm truncate">{item.name}</span>
                {/* Only show actions if selected AND not disabled */}
                <TreeActions isSelected={selectedItemId === item.id && !item.disabled}>
                    {item.actions}
                </TreeActions>
            </div>
        )
    }
)
TreeLeaf.displayName = 'TreeLeaf'

/**
 * AccordionTrigger - Type-safe Wrapper around Radix UI's Accordion.Trigger
 *
 * Basically this is now a pre-styled version of Accordion.Trigger with simplified props
 *
 * Advanced TypeScript concepts here:
 * - React.ElementRef<typeof Component>: Gets the ref type from a component
 * - React.ComponentPropsWithoutRef<typeof Component>: Gets all props except ref
 * This ensures type safety when wrapping third-party components
 */
const AccordionTrigger = React.forwardRef<
    React.ElementRef<typeof AccordionPrimitive.Trigger>, // this is currently HTMLButtonElement, but it can be inferred
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
    <AccordionPrimitive.Header>
        <AccordionPrimitive.Trigger
            ref={ref}
            className={cn(
                // Complex selector: rotates chevron when accordion is open
                'flex flex-1 w-full items-center py-2 transition-all first:[&[data-state=open]>svg]:first-of-type:rotate-90',
                className
            )}
            {...props}
        >
            {/* Chevron icon that rotates when expanded */}
            <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200 text-accent-foreground/50 mr-1" />
            {children}
        </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
))
// Use the original component's displayName for debugging
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

/**
 * AccordionContent - Wrapper for the collapsible content area
 * Uses Radix UI's data attributes (data-state) for animation states
 */
const AccordionContent = React.forwardRef<
    React.ElementRef<typeof AccordionPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
    <AccordionPrimitive.Content
        ref={ref}
        className={cn(
            // data-[state=...] are attribute selectors that respond to Radix UI's state
            'overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
            className
        )}
        {...props}
    >
        {/* Inner wrapper for padding control */}
        <div className="pb-1 pt-0">{children}</div>
    </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

/**
 * TreeIcon - Displays the appropriate icon based on item state
 * Handles icon priority: selected > open > default
 * Note: "default" is a reserved keyword, so we rename it in destructuring
 */
const TreeIcon = ({
    item,
    isOpen,
    isSelected,
    default: defaultIcon // Rename "default" to "defaultIcon" to avoid keyword conflict
}: {
    item: TreeDataItem
    isOpen?: boolean
    isSelected?: boolean
    default?: any
}) => {
    // Determine which icon to show based on priority
    let Icon = defaultIcon
    if (isSelected && item.selectedIcon) {
        Icon = item.selectedIcon
    } else if (isOpen && item.openIcon) {
        Icon = item.openIcon
    } else if (item.icon) {
        Icon = item.icon
    }
    // Render icon if it exists, otherwise render empty fragment
    return Icon ? (
        <Icon className="h-4 w-4 shrink-0 mr-2" />
    ) : (
        <></> // Empty fragment - renders nothing
    )
}

/**
 * TreeActions - Container for action buttons (edit, delete, etc.)
 * Shows on hover or when item is selected
 * Uses Tailwind's "group-hover" to show when parent is hovered
 */
const TreeActions = ({
    children,
    isSelected
}: {
    children: React.ReactNode // React.ReactNode accepts any valid React child
    isSelected: boolean
}) => {
    return (
        <div
            className={cn(
                isSelected ? 'block' : 'hidden', // Show if selected
                'absolute right-3 group-hover:block' // Also show on hover (parent has "group" class)
            )}
        >
            {children}
        </div>
    )
}

// Export the main component and the type for external use
export { TreeView, type TreeDataItem }
