import { test, expect } from '@playwright/test';

test.describe('HU-02: Catálogo de Productos y Carrito de Compras - SauceDemo', () => {

  test.beforeEach(async ({ page }) => {
    // Autenticarse antes de interactuar con el catálogo
    await page.goto('/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('CP-06 Agregar productos al carrito y verificar insignia contadora', async ({ page }) => {
    // 1. Agregar "Sauce Labs Backpack" y "Sauce Labs Bike Light"
    const addBackpack = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
    const addBikeLight = page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]');

    await addBackpack.click();
    await addBikeLight.click();

    // 2. Verificar que los botones cambian su estado a "Remove"
    await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible();
    await expect(page.locator('[data-test="remove-sauce-labs-bike-light"]')).toBeVisible();

    // 3. Verificar que la insignia del carrito refleja la cantidad (2)
    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).toHaveText('2');

    // Tomar evidencia fotográfica
    await page.screenshot({ path: 'evidencias/CP-06-agregar-carrito.png' });
  });

  test('CP-07 Remover producto del carrito y verificar actualización', async ({ page }) => {
    // 1. Agregar dos productos
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');

    // 2. Remover uno de los productos ("Sauce Labs Bike Light")
    await page.locator('[data-test="remove-sauce-labs-bike-light"]').click();

    // 3. Verificar que el contador se decrementa a '1' y el botón vuelve a "Add to cart"
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
    await expect(page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]')).toBeVisible();

    // Tomar evidencia fotográfica
    await page.screenshot({ path: 'evidencias/CP-07-remover-carrito.png' });
  });

  test('CP-08 Ordenar productos por precio de menor a mayor (Low to High)', async ({ page }) => {
    // 1. Seleccionar la opción 'lohi' (Price low to high) en el selector de ordenamiento
    const sortDropdown = page.locator('[data-test="product-sort-container"]');
    await sortDropdown.selectOption('lohi');

    // 2. Extraer los precios de los productos mostrados
    const priceElements = page.locator('.inventory_item_price');
    const priceCount = await priceElements.count();
    const prices: number[] = [];

    for (let i = 0; i < priceCount; i++) {
      const priceText = await priceElements.nth(i).innerText();
      // Eliminar el símbolo $ y convertir a float
      prices.push(parseFloat(priceText.replace('$', '')));
    }

    // 3. Validar que la lista de precios esté estrictamente ordenada de menor a mayor
    const sortedPrices = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sortedPrices);
    expect(prices[0]).toBe(7.99); // El más económico es Sauce Labs Onesie ($7.99)

    // Tomar evidencia fotográfica
    await page.screenshot({ path: 'evidencias/CP-08-ordenar-precio.png', fullPage: true });
  });

});
