import { test, expect } from '@playwright/test';

test.describe('Pruebas Automatizadas E2E en Wikipedia (La Enciclopedia Libre)', () => {

  test.beforeEach(async ({ page }) => {
    // Abrir la portada oficial de Wikipedia en español
    await page.goto('/wiki/Wikipedia:Portada');
  });

  test('CP-01 Búsqueda directa del artículo Adidas con ficha corporativa', async ({ page }) => {
    // 1. Ingresar "Adidas" en el buscador principal y presionar Enter
    const searchInput = page.locator('input[name="search"]').first();
    await searchInput.fill('Adidas');
    await searchInput.press('Enter');

    // 2. Verificaciones del artículo
    await expect(page).toHaveURL(/.*wiki\/Adidas/);
    const heading = page.locator('#firstHeading');
    await expect(heading).toHaveText('Adidas');

    // Verificar presencia de la ficha técnica/infobox corporativa
    const infobox = page.locator('.infobox');
    await expect(infobox).toBeVisible();
    await expect(infobox).toContainText('Fundación');

    // Tomar captura de evidencia
    await page.screenshot({ path: 'evidencias/CP-01-busqueda-adidas.png' });
  });

  test('CP-02 Búsqueda de artículo temático Ingeniería de software', async ({ page }) => {
    // 1. Buscar "Ingeniería de software"
    const searchInput = page.locator('input[name="search"]').first();
    await searchInput.fill('Ingeniería de software');
    await searchInput.press('Enter');

    // 2. Verificaciones de la página
    await expect(page).toHaveURL(/.*wiki\/Ingenier%C3%ADa_de_software/);
    const heading = page.locator('#firstHeading');
    await expect(heading).toHaveText('Ingeniería de software');

    // Verificar contenido del primer párrafo y presencia de la tabla de contenidos
    await expect(page.locator('#mw-content-text p').first()).toContainText('software');
    await expect(page.locator('#vector-toc').first()).toBeVisible();

    // Tomar captura de evidencia
    await page.screenshot({ path: 'evidencias/CP-02-busqueda-ingenieria-software.png' });
  });

  test('CP-03 Manejo de búsqueda sin resultados con término inexistente', async ({ page }) => {
    // 1. Ingresar una cadena alfanumérica sin sentido
    const searchInput = page.locator('input[name="search"]').first();
    await searchInput.fill('xyzqwerty987654321');
    await searchInput.press('Enter');

    // 2. Verificar que se despliega la pantalla informativa de no coincidencias
    await expect(page).toHaveURL(/.*search=xyzqwerty987654321.*/);
    const noResultMsg = page.locator('.mw-search-nonefound, .mw-search-results-info').first();
    await expect(noResultMsg).toBeVisible();
    await expect(noResultMsg).toContainText('No hay resultados que cumplan los criterios de búsqueda');

    // Tomar captura de evidencia
    await page.screenshot({ path: 'evidencias/CP-03-busqueda-sin-resultados.png' });
  });

  test('CP-04 Cambio de idioma del artículo Adidas de Español a Inglés (English)', async ({ page }) => {
    // 1. Navegar directamente al artículo de Adidas
    await page.goto('/wiki/Adidas');
    await expect(page.locator('#firstHeading')).toHaveText('Adidas');

    // 2. Obtener enlace interidioma hacia la versión en inglés
    const englishLink = page.locator('a.interlanguage-link-target[hreflang="en"]').first();
    const englishHref = await englishLink.getAttribute('href');
    expect(englishHref).toBe('https://en.wikipedia.org/wiki/Adidas');

    // 3. Navegar a la versión en inglés y verificar
    await page.goto(englishHref!);
    await expect(page).toHaveURL('https://en.wikipedia.org/wiki/Adidas');
    const englishHeading = page.locator('#firstHeading');
    await expect(englishHeading).toHaveText('Adidas');
    await expect(page.locator('.infobox')).toBeVisible();

    // Tomar captura de evidencia
    await page.screenshot({ path: 'evidencias/CP-04-idioma-ingles.png' });
  });

  test('CP-05 Navegación a artículo aleatorio mediante función Especial:Aleatoria', async ({ page }) => {
    // 1. Navegar a la funcionalidad de página aleatoria
    await page.goto('/wiki/Especial:Aleatoria');

    // 2. Verificar que redirige a un artículo real con encabezado y contenido
    await expect(page).not.toHaveURL(/.*Especial:Aleatoria/);
    const heading = page.locator('#firstHeading');
    await expect(heading).toBeVisible();
    const headingText = await heading.innerText();
    expect(headingText.length).toBeGreaterThan(0);

    // Verificar que existe al menos un párrafo de texto en el cuerpo
    const bodyParagraph = page.locator('#mw-content-text p').first();
    await expect(bodyParagraph).toBeVisible();

    // Tomar captura de evidencia
    await page.screenshot({ path: 'evidencias/CP-05-articulo-aleatorio.png' });
  });

});
