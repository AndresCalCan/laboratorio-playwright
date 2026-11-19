import { test, expect } from '@playwright/test';

test.describe('HU-01: Módulo de Autenticación y Control de Acceso - SauceDemo', () => {

  test.beforeEach(async ({ page }) => {
    // Abrir la página principal de SauceDemo
    await page.goto('/');
  });

  test('CP-01 Login exitoso con credenciales estándar', async ({ page }) => {
    // 1. Ingresar credenciales válidas
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // 2. Verificaciones
    await expect(page).toHaveURL(/.*inventory.html/);
    await expect(page.locator('.title')).toHaveText('Products');
    await expect(page.locator('.inventory_item')).toHaveCount(6);

    // Tomar evidencia fotográfica
    await page.screenshot({ path: 'evidencias/CP-01-login-exitoso.png', fullPage: true });
  });

  test('CP-02 Login bloqueado con usuario suspendido (locked_out_user)', async ({ page }) => {
    // 1. Ingresar credenciales de usuario bloqueado
    await page.locator('[data-test="username"]').fill('locked_out_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // 2. Verificaciones de alerta de bloqueo
    const errorAlert = page.locator('[data-test="error"]');
    await expect(errorAlert).toBeVisible();
    await expect(errorAlert).toContainText('Epic sadface: Sorry, this user has been locked out.');
    await expect(page).toHaveURL('https://www.saucedemo.com/');

    // Tomar evidencia fotográfica
    await page.screenshot({ path: 'evidencias/CP-02-usuario-bloqueado.png' });
  });

  test('CP-03 Login fallido con contraseña incorrecta', async ({ page }) => {
    // 1. Ingresar usuario válido con contraseña equivocada
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('PasswordErroneo123!');
    await page.locator('[data-test="login-button"]').click();

    // 2. Verificaciones de mensaje de credenciales inválidas
    const errorAlert = page.locator('[data-test="error"]');
    await expect(errorAlert).toBeVisible();
    await expect(errorAlert).toContainText('Epic sadface: Username and password do not match any user in this service');

    // Tomar evidencia fotográfica
    await page.screenshot({ path: 'evidencias/CP-03-password-invalido.png' });
  });

  test('CP-04 Login fallido con campos obligatorios vacíos', async ({ page }) => {
    // 1. Clic directo en el botón de login sin diligenciar credenciales
    await page.locator('[data-test="login-button"]').click();

    // 2. Verificar advertencia de campo requerido
    const errorAlert = page.locator('[data-test="error"]');
    await expect(errorAlert).toBeVisible();
    await expect(errorAlert).toContainText('Epic sadface: Username is required');

    // Tomar evidencia fotográfica
    await page.screenshot({ path: 'evidencias/CP-04-campos-vacios.png' });
  });

  test('CP-05 Cerrar sesión (Logout) correctamente desde el menú lateral', async ({ page }) => {
    // 1. Iniciar sesión previamente
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/.*inventory.html/);

    // 2. Abrir menú hamburguesa y hacer clic en Logout
    await page.locator('#react-burger-menu-btn').click();
    const logoutBtn = page.locator('#logout_sidebar_link');
    await expect(logoutBtn).toBeVisible();
    await logoutBtn.click();

    // 3. Verificar que regresa a la pantalla inicial de inicio de sesión
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();

    // Tomar evidencia fotográfica
    await page.screenshot({ path: 'evidencias/CP-05-logout-exitoso.png' });
  });

});
