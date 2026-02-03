import ContactForm from './ContactForm';
import Image from 'next/image';
import Link from 'next/link';

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

// Fallback: Parse text-based shortcodes
function renderWithTextShortcodes(content: string): JSX.Element[] {
  const parts: JSX.Element[] = [];
  
  // Regex to match all shortcodes
  const shortcodeRegex = /\[(\w+)(?:\s+([^\]]+))?\]/g;
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
  const data = shortcode.data || {};

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
            propertyId={data.property_id}
            propertyTitle={data.property_title}
          />
        </div>
      );

    case 'alert':
      return (
        <div key={`shortcode-${key}`} className={`my-6 p-6 rounded-xl ${
          data.type === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-200 border-l-4 border-yellow-500' :
          data.type === 'error' ? 'bg-red-100 dark:bg-red-900/30 text-red-900 dark:text-red-200 border-l-4 border-red-500' :
          data.type === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-200 border-l-4 border-green-500' :
          'bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-200 border-l-4 border-blue-500'
        }`}>
          {data.title && <h4 className="font-bold text-lg mb-2">{data.title}</h4>}
          <p>{data.message || data.text || 'Alert message'}</p>
        </div>
      );

    case 'button':
      return (
        <div key={`shortcode-${key}`} className="my-6">
          <Link
            href={data.url || '#'}
            className={`inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl ${
              data.style === 'outline' 
                ? 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
                : data.style === 'ghost'
                ? 'text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
            target={data.target === '_blank' ? '_blank' : undefined}
          >
            {data.text || 'Click Here'}
            {data.icon !== 'false' && (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </Link>
        </div>
      );

    case 'card':
      return (
        <div key={`shortcode-${key}`} className="my-8 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
          {data.title && <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{data.title}</h3>}
          {data.image && (
            <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
              <Image src={data.image} alt={data.title || ''} fill className="object-cover" />
            </div>
          )}
          {data.text && <p className="text-gray-700 dark:text-gray-300">{data.text}</p>}
          {data.url && (
            <Link href={data.url} className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold mt-4 hover:gap-3 transition-all">
              {data.link_text || 'Learn More'}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>
      );

    case 'grid':
      const columns = parseInt(data.columns) || 3;
      return (
        <div key={`shortcode-${key}`} className={`my-8 grid grid-cols-1 md:grid-cols-${columns} gap-6`}>
          {/* This is a placeholder - actual content would need to be nested */}
          <div className="text-gray-500 dark:text-gray-400 text-center p-8 border-2 border-dashed rounded-xl">
            Grid container ({columns} columns)
          </div>
        </div>
      );

    case 'columns':
      return (
        <div key={`shortcode-${key}`} className="my-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="prose dark:prose-invert" dangerouslySetInnerHTML={{ __html: data.left || '' }} />
          <div className="prose dark:prose-invert" dangerouslySetInnerHTML={{ __html: data.right || '' }} />
        </div>
      );

    case 'feature_box':
      return (
        <div key={`shortcode-${key}`} className="my-8 text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-2xl">
          {data.icon && (
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full mb-4 text-3xl">
              {data.icon}
            </div>
          )}
          {data.title && <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{data.title}</h3>}
          {data.text && <p className="text-gray-700 dark:text-gray-300">{data.text}</p>}
        </div>
      );

    case 'stats':
      return (
        <div key={`shortcode-${key}`} className="my-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
          <div className="text-5xl font-bold mb-2">{data.number || '0'}</div>
          <div className="text-xl opacity-90">{data.label || 'Stat'}</div>
          {data.description && <p className="text-sm opacity-75 mt-2">{data.description}</p>}
        </div>
      );

    case 'testimonial':
      return (
        <div key={`shortcode-${key}`} className="my-8 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            {data.avatar && (
              <Image src={data.avatar} alt={data.name || ''} width={64} height={64} className="rounded-full" />
            )}
            <div className={data.avatar ? 'ml-4' : ''}>
              <div className="font-bold text-gray-900 dark:text-white">{data.name || 'Anonymous'}</div>
              {data.title && <div className="text-sm text-gray-600 dark:text-gray-400">{data.title}</div>}
            </div>
          </div>
          <p className="text-gray-700 dark:text-gray-300 italic">&ldquo;{data.text || data.quote || 'Testimonial text'}&rdquo;</p>
        </div>
      );

    case 'cta':
      return (
        <div key={`shortcode-${key}`} className="my-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
          {data.title && <h2 className="text-4xl font-bold mb-4">{data.title}</h2>}
          {data.text && <p className="text-xl mb-8 opacity-90">{data.text}</p>}
          {data.button_text && (
            <Link
              href={data.button_url || '#'}
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:shadow-xl transition-all"
            >
              {data.button_text}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>
      );

    case 'spacer':
      const height = data.height || '40px';
      return <div key={`shortcode-${key}`} style={{ height }} />;

    case 'divider':
      return (
        <div key={`shortcode-${key}`} className="my-8">
          <hr className="border-gray-300 dark:border-gray-700" />
        </div>
      );

    case 'video':
      return (
        <div key={`shortcode-${key}`} className="my-8 aspect-video rounded-2xl overflow-hidden">
          <iframe
            src={data.url}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );

    default:
      console.warn(`Unknown shortcode type: ${shortcode.type}`);
      return <div key={`shortcode-${key}`} />;
  }
}
