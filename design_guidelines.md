# Design Guidelines: German Learning Platform

## Design Approach

**Selected Approach:** Design System (Material Design-inspired) with reading-focused adaptations

**Justification:** Language learning tools require clarity, focus, and consistent interaction patterns. The information-dense nature (articles + dictionary) demands a clean, systematic approach that prioritizes readability and distraction-free learning.

**Key Principles:**
- Reading-first: Optimized typography and spacing for extended reading sessions
- Contextual learning: Seamless integration between articles and dictionary
- Progressive disclosure: Keep interface minimal until user interaction reveals functionality

## Typography

**Font Family:** 
- Primary: 'Inter' or 'Source Sans Pro' for UI elements
- Reading: 'Merriweather' or 'Lora' for article content (serif for better readability)

**Type Scale:**
- Article titles: text-3xl to text-4xl, font-bold
- Article body: text-lg (18-20px for comfortable reading)
- Dictionary entries: text-base
- UI labels: text-sm
- Metadata: text-xs

**Line Height:** 
- Article content: leading-relaxed (1.75)
- UI elements: leading-normal

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, and 8 as primary spacing (p-2, p-4, p-6, p-8, gap-4, etc.)

**Container Strategy:**
- Article list: max-w-6xl centered
- Reading view: max-w-4xl for article content (optimal reading width)
- Dictionary sidebar: Fixed width of w-80 to w-96

**Grid Patterns:**
- Article cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Dictionary entries: Single column list with generous spacing (space-y-4)

## Component Library

### Navigation
- Fixed top navigation bar with logo, search, and user actions
- Breadcrumb navigation in reading view
- Floating action button for "Add New Article"

### Article Cards
- Card-based design with shadow-sm, rounded-lg
- Article title, preview text (first 2-3 lines), and metadata (word count, date added)
- Hover state with subtle elevation increase (shadow-md)
- Delete/edit actions revealed on hover

### Reading Interface
- Two-column layout on desktop: Article (2/3 width) + Dictionary sidebar (1/3 width)
- Single column on mobile with collapsible dictionary drawer
- Article content area with generous padding (px-8 md:px-12, py-8)
- Clean white/neutral background for article text

### Word Highlighting System
- Selected text shows subtle background highlight
- Click interaction reveals tooltip with "Add to Dictionary" button
- Visual feedback: highlighted words already in dictionary show distinct underline decoration
- Tooltip design: rounded-lg with shadow-lg, includes word translation input

### Dictionary Panel
- Sticky sidebar that scrolls independently
- Search bar at top with instant filtering
- Dictionary entries as cards with:
  - German word (font-semibold, text-lg)
  - Translation (text-base)
  - Context snippet from article (text-sm, italic, truncated)
  - Source article link
  - Delete icon
- Empty state illustration when no words saved

### Forms
- Article creation: Full-page modal or dedicated page
- Input fields: rounded-md borders, p-3 padding, focus:ring-2 states
- Large textarea for article content (min-h-96)
- Title input with text-2xl preview

### Buttons
- Primary: Solid fill, rounded-lg, px-6 py-3
- Secondary: Outline style with hover fill
- Icon buttons: Square with rounded-md, p-2
- Destructive actions: Red accent for delete

### Data Display
- Empty states: Centered illustrations with friendly messaging
- Loading states: Skeleton screens for article cards
- Word count badges: Rounded-full pills with subtle backgrounds

## Layout Specifications

### Article Library Page
- Hero section: No traditional hero - start immediately with search bar and filter options
- Article grid below with responsive columns
- Floating "+" button in bottom-right for quick article addition

### Reading View
- Full-width layout with contained article content
- Dictionary sidebar slides in from right on desktop
- Mobile: Bottom sheet dictionary drawer that user can expand
- Article metadata bar above content (author, date, estimated reading time)
- Progress indicator showing reading position

### Dictionary Page (Standalone)
- Searchable, filterable list view
- Group by article source option
- Alphabetical sorting
- Export functionality button in header

## Images

**No large hero image required** - This is a utility-focused application prioritizing immediate access to content

**Icon Usage:**
- Use Heroicons for all UI icons
- Dictionary icon, article icon, search icon, delete/edit icons
- Learning-related spot illustrations for empty states (books, lightbulb, etc.)

**Illustrations:**
- Empty state for no articles: Minimal line illustration of open book
- Empty dictionary: Minimal illustration of dictionary/translation concept
- 404/Error states: Friendly, minimal illustrations

## Interaction Patterns

**Text Selection:**
- Native browser selection styling initially
- On mouseup: Show floating tooltip above selection
- Tooltip contains input for translation + "Save" button
- Smooth fade-in animation for tooltip (duration-200)

**Dictionary Sidebar:**
- Slide-in transition when activated
- Click outside to dismiss on mobile
- Persistent on desktop when reading

**Minimal Animations:**
- Card hover elevations (transform scale-105, duration-200)
- Tooltip fade-ins
- Drawer/modal slide transitions
- No distracting scroll animations or parallax effects