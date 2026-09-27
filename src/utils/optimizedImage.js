// Project screenshots in /public/projects have a smaller .webp copy next to each .png/.jpg.
// The data files keep the original paths (used for SEO and social previews); the UI shows the WebP.
const LOCAL_RASTER = /^\/projects\/.+\.(png|jpe?g)$/i;

export default function optimizedImage(src) {
  return src && LOCAL_RASTER.test(src) ? src.replace(/\.(png|jpe?g)$/i, ".webp") : src;
}
