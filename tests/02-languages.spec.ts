import { test, expect } from '@playwright/test';

test.describe('HU-02: Internacionalización y Cambio de Idioma (I18n) - Wikipedia', () => {

  test.beforeEach(async ({ page }) => {
    // Abrir directamente el artículo de Adidas en español
    await page.goto('/wiki/Adidas');
    await expect(page.locator('#firstHeading')).toHaveText('Adidas');
  });

  test('CP-05 Cambio de idioma del artículo Adidas de Español a Inglés (English)', async ({ page }) => {
    // 1. Obtener enlace interidioma hacia la versión en inglés
    const englishLink = page.locator('a.interlanguage-link-target[hreflang="en"]').first();
    const englishHref = await englishLink.getAttribute('href');
    expect(englishHref).toBe('https://en.wikipedia.org/wiki/Adidas');

    // 2. Navegar a la versión en inglés
    await page.goto(englishHref!);

    // 3. Verificaciones en Wikipedia en Inglés
    await expect(page).toHaveURL('https://en.wikipedia.org/wiki/Adidas');
    const englishHeading = page.locator('#firstHeading');
    await expect(englishHeading).toHaveText('Adidas');
    await expect(page.locator('.infobox')).toBeVisible();

    // Tomar captura de evidencia
    await page.screenshot({ path: 'evidencias/CP-05-idioma-ingles.png' });
  });

  test('CP-06 Cambio de idioma del artículo Adidas de Español a Alemán (Deutsch)', async ({ page }) => {
    // 1. Obtener enlace interidioma hacia la versión en alemán (país de origen)
    const germanLink = page.locator('a.interlanguage-link-target[hreflang="de"]').first();
    const germanHref = await germanLink.getAttribute('href');
    expect(germanHref).toBe('https://de.wikipedia.org/wiki/Adidas');

    // 2. Navegar a la versión en alemán
    await page.goto(germanHref!);

    // 3. Verificaciones en Wikipedia en Alemán
    await expect(page).toHaveURL('https://de.wikipedia.org/wiki/Adidas');
    const germanHeading = page.locator('#firstHeading');
    await expect(germanHeading).toHaveText('Adidas');
    await expect(page.locator('.infobox, table.toptextcells').first()).toBeVisible();

    // Tomar captura de evidencia
    await page.screenshot({ path: 'evidencias/CP-06-idioma-aleman.png' });
  });

});
