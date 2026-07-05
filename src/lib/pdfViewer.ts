import * as pdfjsLib from 'pdfjs-dist';
import type { PDFDocumentProxy } from 'pdfjs-dist';

// pdfjs-dist v3 utilise un worker classique (.js, pas .mjs).
// Le suffixe ?url dit à Vite d'émettre le fichier comme asset statique et de retourner son URL.
// Cette approche est universellement compatible (Samsung Internet, vieux Android, Firefox, Safari).
// v6 utilisait { type:'module' } qui nécessite le support des module-workers — absent sur de
// nombreux navigateurs mobiles.
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.js?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

let _pdf: PDFDocumentProxy | null = null;
let _container: HTMLElement | null = null;

async function renderPage(
  pdf: PDFDocumentProxy,
  pageNum: number,
  container: HTMLElement,
): Promise<void> {
  const page = await pdf.getPage(pageNum);
  const baseViewport = page.getViewport({ scale: 1 });

  // Largeur réelle du conteneur ; fallback sur 90 % de la fenêtre si pas encore rendu
  const containerWidth = container.clientWidth || window.innerWidth * 0.9;

  // devicePixelRatio limité à 2 pour éviter des canvas trop lourds sur écrans 3×
  const scale = (containerWidth / baseViewport.width) * Math.min(window.devicePixelRatio, 2);
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement('canvas');
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  // CSS : la largeur s'adapte au conteneur ; la hauteur suit le ratio
  canvas.style.cssText = 'width:100%;height:auto;display:block;margin-bottom:6px;border-radius:2px;';

  container.appendChild(canvas);
  await page.render({ canvasContext: canvas.getContext('2d')!, viewport }).promise;
  page.cleanup();
}

/**
 * Charge un PDF (URL ou blob:) et rend toutes ses pages en scroll continu.
 * Gère les états loading / erreur.
 */
export async function openPdfViewer(
  url: string,
  container: HTMLElement,
  loadingEl: HTMLElement,
  pageInfoEl: HTMLElement,
): Promise<void> {
  _container = container;

  container.innerHTML = '';
  loadingEl.style.display = '';
  pageInfoEl.style.display = 'none';

  // Détruire le document précédent pour libérer la mémoire
  if (_pdf) { _pdf.destroy(); _pdf = null; }

  try {
    _pdf = await pdfjsLib.getDocument(url).promise;

    for (let i = 1; i <= _pdf.numPages; i++) {
      await renderPage(_pdf, i, container);
    }

    if (_pdf.numPages > 1) {
      pageInfoEl.textContent = `${_pdf.numPages} pages`;
      pageInfoEl.style.display = '';
    }
  } catch (err) {
    console.error('[pdfViewer] échec chargement', url, err);
    container.innerHTML =
      '<p style="padding:1rem;color:#dc2626;font-size:0.875rem;">Impossible de charger ce PDF.</p>';
  } finally {
    loadingEl.style.display = 'none';
  }
}

/** Détruit le document PDF en mémoire et vide le conteneur. */
export function closePdfViewer(): void {
  if (_pdf) { _pdf.destroy(); _pdf = null; }
  if (_container) _container.innerHTML = '';
}
