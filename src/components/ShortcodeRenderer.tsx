import ContactForm from './ContactForm';

interface ShortcodeRendererProps {
  content: string;
  shortcodes?: Array<{
    type: string;
    position: number;
    data?: {
      property_id?: number;
      property_title?: string;
      [key: string]: any;
    };
  }>;
}

export default function ShortcodeRenderer({ content, shortcodes = [] }: ShortcodeRendererProps) {
  // If backend provides structured shortcodes, use them
  if (shortcodes && shortcodes.length > 0) {
    return <>{renderWithStructuredShortcodes(content, shortcodes)}</>;
  }
  
  // Otherwise, fallback to parsing text shortcodes
  return <>{renderWithTextShortcodes(content)}</>;
}

// Render with structured shortcodes from backend
function renderWithStructuredShortcodes(
  content: string, 
  shortcodes: Array<{ type: string; position: number; data?: any }>
): JSX.Element[] {
  const parts: JSX.Element[] = [];
  const sortedShortcodes = [...shortcodes].sort((a, b) => a.position - b.position);
  
  let lastPosition = 0;

  sortedShortcodes.forEach((shortcode, index) => {
    // Add content before shortcode
    if (shortcode.position > lastPosition) {
      const textBefore = content.substring(lastPosition, shortcode.position);
      if (textBefore.trim()) {
        parts.push(
          <div 
            key={`content-${index}`}
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: textBefore }}
          />
        );
      }
    }

    // Add shortcode component
    parts.push(renderShortcode(shortcode, index));
    lastPosition = shortcode.position;
  });

  // Add remaining content
  if (lastPosition < content.length) {
    const remainingText = content.substring(lastPosition);
    if (remainingText.trim()) {
      parts.push(
        <div 
          key="content-end"
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: remainingText }}
        />
      );
    }
  }

  return parts;
}

// Fallback: Parse text-based shortcodes [contact_form], [property_inquiry_form]
function renderWithTextShortcodes(content: string): JSX.Element[] {
  const parts: JSX.Element[] = [];
  
  // Regex to match shortcodes like [contact_form title="Contact Us"]
  const shortcodeRegex = /\[(contact_form|property_inquiry_form)(?:\s+([^\]]+))?\]/g;
  let lastIndex = 0;
  let match;
  let matchIndex = 0;

  while ((match = shortcodeRegex.exec(content)) !== null) {
    // Add HTML content before shortcode
    if (match.index > lastIndex) {
      const htmlBefore = content.substring(lastIndex, match.index);
      if (htmlBefore.trim()) {
        parts.push(
          <div 
            key={`content-${matchIndex}`}
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: htmlBefore }}
          />
        );
      }
    }

    // Parse shortcode attributes
    const type = match[1];
    const attributesString = match[2] || '';
    const attributes = parseShortcodeAttributes(attributesString);

    // Render the shortcode component
    parts.push(renderShortcode({ type, data: attributes }, `shortcode-${matchIndex}`));
    
    lastIndex = match.index + match[0].length;
    matchIndex++;
  }

  // Add remaining HTML content
  if (lastIndex < content.length) {
    const remainingHtml = content.substring(lastIndex);
    if (remainingHtml.trim()) {
      parts.push(
        <div 
          key="content-end"
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: remainingHtml }}
        />
      );
    }
  }

  // If no shortcodes found, just render the content
  if (parts.length === 0) {
    return [
      <div 
        key="content-only" 
        className="prose dark:prose-invert max-w-none" 
        dangerouslySetInnerHTML={{ __html: content }} 
      />
    ];
  }

  return parts;
}

// Parse attributes from shortcode string: title="Contact Us" id="123"
function parseShortcodeAttributes(attrString: string): Record<string, any> {
  const attributes: Record<string, any> = {};
  const attrRegex = /(\w+)="([^"]*)"/g;
  let match;

  while ((match = attrRegex.exec(attrString)) !== null) {
    const key = match[1];
    const value = match[2];
    
    // Try to parse as number if it looks like one
    if (/^\d+$/.test(value)) {
      attributes[key] = parseInt(value, 10);
    } else {
      attributes[key] = value;
    }
  }

  return attributes;
}

function renderShortcode(
  shortcode: { type: string; data?: any },
  key: number | string
): JSX.Element {
  switch (shortcode.type) {
    case 'contact_form':
      return (
        <div key={`shortcode-${key}`} className="my-8">
          <ContactForm />
        </div>
      );

    case 'property_inquiry_form':
      return (
        <div key={`shortcode-${key}`} className="my-8">
          <ContactForm
            propertyId={shortcode.data?.property_id}
            propertyTitle={shortcode.data?.property_title}
          />
        </div>
      );

    default:
      console.warn(`Unknown shortcode type: ${shortcode.type}`);
      return <div key={`shortcode-${key}`} />;
  }
}
