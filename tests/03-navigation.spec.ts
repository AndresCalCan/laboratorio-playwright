import { test, expect } from '@playwright/test';

test.describe('HU-03: Navegación Estructural, Historial y Portada - Wikipedia', () => {

  test('CP-07 Exploración y elementos principales de la Portada oficial de Wikipedia', async ({ page }) => {
    // 1. Acceder a la portada oficial de Wikipedia en español
    await page.goto('/wiki/Wikipedia:Portada');

    // 2. Verificaciones del diseño y componentes institucionales
    await expect(page).toHaveTitle(/Wikipedia, la enciclopedia libre/);
    const logo = page.locator('.mw-logo');
    await expect(logo).toBeVisible();

    // Verificar saludo de bienvenida institucional en la portada
    const welcomeBanner = page.getByText('Bienvenidos a Wikipedia,');
    await expect(welcomeBanner).toBeVisible();

    // Tomar captura de evidencia
    await page.screenshot({ path: 'evidencias/CP-07-portada-wikipedia.png' });
  });

  test('CP-08 Navegación a artículo aleatorio mediante función Especial:Aleatoria', async ({ page }) => {
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
    await page.screenshot({ path: 'evidencias/CP-08-articulo-aleatorio.png' });
  });

  test('CP-09 Consulta del historial de revisiones y versiones de un artículo', async ({ page }) => {
    // 1. Ir al artículo de Adidas y acceder a la pestaña de historial
    await page.goto('/wiki/Adidas');
    const historyTab = page.locator('#ca-history a');
    await expect(historyTab).toBeVisible();
    await historyTab.click();

    // 2. Validar que nos encontramos en la página de historial
    await expect(page).toHaveURL(/.*action=history/);
    await expect(page.locator('#firstHeading')).toContainText('Historial de «Adidas»');

    // Verificar lista de revisiones históricas con usuarios y fechas
    const historyEntries = page.locator('#pagehistory li');
    const entriesCount = await historyEntries.count();
    expect(entriesCount).toBeGreaterThanOrEqual(10);

    // Tomar captura de evidencia
    await page.screenshot({ path: 'evidencias/CP-09-historial-revisiones.png' });
  });

  test('CP-10 Navegación interactiva mediante la Tabla de Contenidos (TOC)', async ({ page }) => {
    // 1. Ingresar al artículo de Ingeniería de Software
    await page.goto('/wiki/Ingenier%C3%ADa_de_software');

    // 2. Localizar un enlace de sección en la tabla de contenidos lateral
    const tocSectionLink = page.locator('.vector-toc-link[href*="#"]').nth(1);
    await expect(tocSectionLink).toBeVisible();
    const sectionHref = await tocSectionLink.getAttribute('href');

    // 3. Hacer clic en el enlace del índice
    await tocSectionLink.click();

    // 4. Verificar que la URL ahora contiene el ancla de la sección
    if (sectionHref) {
      await expect(page).toHaveURL(new RegExp(sectionHref));
    }

    // Tomar captura de evidencia
    await page.screenshot({ path: 'evidencias/CP-10-tabla-contenidos.png' });
  });

});
