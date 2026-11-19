import { test, expect } from '@playwright/test';

test.describe('HU-03: Proceso de Compra y Checkout End-to-End - SauceDemo', () => {

  test.beforeEach(async ({ page }) => {
    // Autenticarse antes de realizar el flujo de checkout
    await page.goto('/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('CP-09 Compra completa End-to-End con confirmación de despacho', async ({ page }) => {
    // 1. Agregar "Sauce Labs Backpack" al carrito
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    // 2. Ir al carrito de compras
    await page.locator('.shopping_cart_link').click();
    await expect(page).toHaveURL(/.*cart.html/);
    await expect(page.locator('.inventory_item_name')).toHaveText('Sauce Labs Backpack');

    // 3. Proceder al Checkout (Paso 1: Información del cliente)
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(/.*checkout-step-one.html/);

    await page.locator('[data-test="firstName"]').fill('Andres');
    await page.locator('[data-test="lastName"]').fill('Calderon');
    await page.locator('[data-test="postalCode"]').fill('110111');
    await page.locator('[data-test="continue"]').click();

    // 4. Revisión del resumen de compra (Paso 2: Overview)
    await expect(page).toHaveURL(/.*checkout-step-two.html/);
    await expect(page.locator('.summary_subtotal_label')).toContainText('Item total: $29.99');
    await expect(page.locator('.summary_total_label')).toContainText('Total: $32.39');

    // 5. Finalizar la orden
    await page.locator('[data-test="finish"]').click();

    // 6. Validaciones de la confirmación final
    await expect(page).toHaveURL(/.*checkout-complete.html/);
    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
    await expect(page.locator('.complete-text')).toContainText('Your order has been dispatched');

    // Tomar evidencia fotográfica
    await page.screenshot({ path: 'evidencias/CP-09-compra-exitosa.png', fullPage: true });
  });

  test('CP-10 Validación de campos obligatorios en formulario de Checkout', async ({ page }) => {
    // 1. Agregar producto e ir al checkout
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(/.*checkout-step-one.html/);

    // 2. Diligenciar solo Nombre y Apellido (dejando el código postal vacío)
    await page.locator('[data-test="firstName"]').fill('Andres');
    await page.locator('[data-test="lastName"]').fill('Calderon');
    await page.locator('[data-test="continue"]').click();

    // 3. Validar mensaje de error específico
    const errorAlert = page.locator('[data-test="error"]');
    await expect(errorAlert).toBeVisible();
    await expect(errorAlert).toContainText('Error: Postal Code is required');

    // Tomar evidencia fotográfica
    await page.screenshot({ path: 'evidencias/CP-10-checkout-campos-requeridos.png' });
  });

});
