import React from 'react';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  onClick?: () => void;
}

/**
 * A responsive image component with lazy loading that optimizes for different screen sizes
 */
const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  className = '',
  sizes = '100vw',
  objectFit = 'cover',
  priority = false,
  loading = 'lazy',
  onClick,
}) => {
  // For native optimization in modern browsers
  return (
    <img
      src={src}
      alt={alt}
      className={`${className}`}
      style={{ objectFit }}
      loading={priority ? 'eager' : loading}
      sizes={sizes}
      onClick={onClick}
      // Additional attributes for better SEO and accessibility
      decoding="async"
    />
  );
};

export default ResponsiveImage;