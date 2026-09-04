import React from 'react';

interface WpJsonLdProps {
  schema?: Record<string, any> | Array<Record<string, any>> | null;
}

/**
 * ⚡ Component chèn Schema Structured Data (JSON-LD) chuẩn Google cho SEO
 */
export default function WpJsonLd({ schema }: WpJsonLdProps) {
  if (!schema) return null;
  if (Array.isArray(schema) && schema.length === 0) return null;
  if (typeof schema === 'object' && Object.keys(schema).length === 0) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  );
}
