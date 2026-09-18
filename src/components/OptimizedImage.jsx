import React from "react";

/**
 * Optimized image helper: lazy by default, async decode.
 * Assets in /public/images are WebP-only after optimize:images.
 */
export default function OptimizedImage({
  src,
  alt = "",
  className = "",
  width,
  height,
  loading = "lazy",
  fetchPriority,
  decoding = "async",
  sizes,
  ...rest
}) {
  if (!src) return null;

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading={loading}
      decoding={decoding}
      fetchPriority={fetchPriority}
      sizes={sizes}
      {...rest}
    />
  );
}
