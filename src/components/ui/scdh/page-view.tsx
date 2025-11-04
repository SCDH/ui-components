import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * PageView Section Item
 * 
 * Represents a single content section with a title and content.
 * Content can be either a single string or an array of paragraphs.
 */
export interface PageViewSection {
  /** Unique identifier for the section */
  id?: string
  
  /** Section title/headline */
  title: string
  
  /** Section content - can be a single string or multiple paragraphs */
  content: string | string[]
}

/**
 * PageView Component Props
 * 
 * This component provides a flexible way to render structured text content
 * with headlines and paragraphs. It's designed to be data-agnostic - you can
 * feed it data from any source (JSON, API, static content, etc.).
 */
export interface PageViewProps {
  /** Main page title (optional) */
  title?: string
  
  /** Page description/subtitle (optional) */
  description?: string
  
  /** Array of sections to render */
  sections: PageViewSection[]
  
  /** Custom className for the container */
  className?: string
  
  /** Custom className for section titles */
  sectionTitleClassName?: string
  
  /** Custom className for paragraphs */
  paragraphClassName?: string
  
  /** Optional callback when a section is clicked */
  onSectionClick?: (section: PageViewSection) => void
}

/**
 * PageView Component
 * 
 * A flexible component for rendering structured text content with beautiful
 * typography. Uses Tailwind CSS for styling and can be customized via props.
 * 
 * Features:
 * - Renders headlines and paragraphs with proper hierarchy
 * - Responsive typography that scales well
 * - Clean spacing and readability-focused design
 * - Fully customizable via className props
 * - Optional click handlers for interactive use cases
 * 
 * Example usage:
 * ```tsx
 * <PageView
 *   title="My Document"
 *   description="A collection of thoughts"
 *   sections={[
 *     { title: "Introduction", content: "This is the intro..." },
 *     { title: "Chapter 1", content: ["Paragraph 1", "Paragraph 2"] }
 *   ]}
 * />
 * ```
 */
const PageView = React.forwardRef<HTMLDivElement, PageViewProps>(
  ({
    title,
    description,
    sections,
    className,
    sectionTitleClassName,
    paragraphClassName,
    onSectionClick,
    ...props
  }, ref) => {
    /**
     * Helper function to render content
     * Handles both string and string array content
     */
    const renderContent = (content: string | string[]) => {
      // If content is a single string, wrap it in an array for consistent handling
      const paragraphs = Array.isArray(content) ? content : [content]
      
      return paragraphs.map((paragraph, index) => (
        <p
          key={index}
          className={cn(
            // Base paragraph styles with good readability
            "text-base leading-relaxed text-gray-700 dark:text-gray-300",
            // Spacing between paragraphs (except the last one)
            index < paragraphs.length - 1 && "mb-4",
            // Allow custom paragraph styling
            paragraphClassName
          )}
        >
          {paragraph}
        </p>
      ))
    }

    return (
      <div
        ref={ref}
        className={cn(
          // Container with max width for optimal reading
          "max-w-4xl mx-auto px-6 py-8",
          // Custom class overrides
          className
        )}
        {...props}
      >
        {/* Page Header (optional) */}
        {(title || description) && (
          <header className="mb-12">
            {title && (
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                {title}
              </h1>
            )}
            {description && (
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                {description}
              </p>
            )}
          </header>
        )}

        {/* Sections */}
        <div className="space-y-10">
          {sections.map((section, index) => (
            <section
              key={section.id || index}
              className={cn(
                // Section spacing and transitions
                "transition-all duration-200",
                // Add hover effect if clickable
                onSectionClick && "cursor-pointer hover:translate-x-1"
              )}
              onClick={() => onSectionClick?.(section)}
            >
              {/* Section Title */}
              <h2
                className={cn(
                  // Section heading styles
                  "text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4",
                  // Border accent for visual separation
                  "border-l-4 border-scdh-blue pl-4",
                  // Custom section title styling
                  sectionTitleClassName
                )}
              >
                {section.title}
              </h2>

              {/* Section Content */}
              <div className="pl-6">
                {renderContent(section.content)}
              </div>
            </section>
          ))}
        </div>
      </div>
    )
  }
)

PageView.displayName = "PageView"

export { PageView }
