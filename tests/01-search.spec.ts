import { test, expect } from '@playwright/test';

test.describe('HU-01: Búsqueda y Localización de Artículos - Wikipedia', () => {

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

    // 2. Verificar que se despliega la pantalla de resultados con alerta de no coincidencias
    await expect(page).toHaveURL(/.*search=xyzqwerty987654321.*/);
    const noResultMsg = page.locator('.mw-search-nonefound, .mw-search-results-info').first();
    await expect(noResultMsg).toBeVisible();
    await expect(noResultMsg).toContainText('No hay resultados que cumplan los criterios de búsqueda');

    // Tomar captura de evidencia
    await page.screenshot({ path: 'evidencias/CP-03-busqueda-sin-resultados.png' });
  });

  test('CP-04 Despliegue interactivo de sugerencias de autocompletado en vivo', async ({ page }) => {
    // 1. Digitar parcialmente un término de marca en el campo de búsqueda sin presionar Enter
    const searchInput = page.locator('input[name="search"]').first();
    await searchInput.fill('Adida');

    // 2. Esperar y verificar el menú flotante de sugerencias reactivas
    const suggestionMenu = page.locator('.cdx-menu, [role="listbox"]').first();
    await expect(suggestionMenu).toBeVisible();
    await expect(suggestionMenu).toContainText('Adidas');

    // Tomar captura de evidencia
    await page.screenshot({ path: 'evidencias/CP-04-sugerencias-en-vivo.png' });
  });

});
