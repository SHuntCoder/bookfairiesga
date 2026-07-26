// ─────────────────────────────────────────────────────────────────────────────
// HOW TO ADD PHOTOS TO THE GALLERY
// ─────────────────────────────────────────────────────────────────────────────
// 1. Copy your image file into:  artifacts/book-fairies/public/gallery/
//    (any filename is fine, e.g. book-drive-2024.jpg)
//
// 2. Add an entry to the array below:
//    { src: "/gallery/your-filename.jpg", caption: "Your caption here" }
//
// 3. Save this file, then commit and push to GitHub.
//    The GitHub Actions workflow will automatically build and deploy the site.
//    Photos appear for everyone within ~2 minutes of pushing.
// ─────────────────────────────────────────────────────────────────────────────

export interface GalleryPhoto {
  src: string;
  caption: string;
}

const galleryPhotos: GalleryPhoto[] = [
  // Example (remove the "//" at the start of the line to enable):
  // { src: "/gallery/book-drive-2024.jpg", caption: "Book Drive 2024" },
];

export default galleryPhotos;
