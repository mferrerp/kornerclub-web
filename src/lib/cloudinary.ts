/**
 * Transforms a Cloudinary URL to request a resized/compressed version.
 * Works by inserting transformation parameters after "/upload/".
 * Falls back to the original URL if it's not a Cloudinary URL (e.g. blob: previews).
 */
export function cloudinaryThumb(
  url: string,
  width = 400,
  height = 300,
  quality = "auto"
): string {
  if (!url || !url.includes("res.cloudinary.com")) return url;
  // Insert transformations after /upload/
  return url.replace(
    "/upload/",
    `/upload/w_${width},h_${height},c_fill,q_${quality},f_auto/`
  );
}

/** Small grid thumbnail — admin photo picker */
export const thumbAdmin = (url: string) => cloudinaryThumb(url, 240, 180);

/** Card thumbnail — public listing pages */
export const thumbCard = (url: string) => cloudinaryThumb(url, 600, 450);

/** Gallery main photo — detail page hero (high quality, no crop, width-capped) */
export const thumbGallery = (url: string) => {
  if (!url || !url.includes("res.cloudinary.com")) return url;
  // c_limit: never upscale, never crop — just cap width; q_90 for crisp detail
  return url.replace("/upload/", "/upload/w_1600,c_limit,q_90,f_auto/");
};

/** Small strip thumbnail — detail page bottom strip */
export const thumbStrip = (url: string) => cloudinaryThumb(url, 160, 112);
