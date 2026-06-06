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
  return url.replace(
    "/upload/",
    `/upload/w_${width},h_${height},c_fill,q_${quality},f_auto/`
  );
}

/**
 * Korner Club watermark overlay — applied to all public-facing photos.
 * Uses Cloudinary's layer construction syntax (3 chained segments):
 *   1. l_  → open the overlay layer with the logo asset
 *   2. e_make_transparent:40 → remove the white background (tolerance 40)
 *   3. fl_layer_apply → close/place the layer with size, opacity & position
 */
// x_0.05,fl_relative shifts the watermark 5% of image width to the right
// to compensate for asymmetric transparent margins in the logo asset canvas.
const WM = "l_wordmark-1linea-claro-1880_voqbek/e_make_transparent:40,w_0.9,fl_relative/fl_layer_apply,g_center,o_18,x_0.05,fl_relative";

/** Small grid thumbnail — admin photo picker (NO watermark) */
export const thumbAdmin = (url: string) => cloudinaryThumb(url, 240, 180);

/** Card thumbnail — public listing pages (with watermark) */
export const thumbCard = (url: string): string => {
  if (!url || !url.includes("res.cloudinary.com")) return url;
  return url.replace("/upload/", `/upload/w_600,h_450,c_fill,q_auto,f_auto/${WM}/`);
};

/** Gallery main photo — detail page hero (high quality, no crop, with watermark) */
export const thumbGallery = (url: string): string => {
  if (!url || !url.includes("res.cloudinary.com")) return url;
  return url.replace("/upload/", `/upload/w_1600,c_limit,q_90,f_auto/${WM}/`);
};

/** Small strip thumbnail — detail page bottom strip (NO watermark, too small) */
export const thumbStrip = (url: string) => cloudinaryThumb(url, 160, 112);
