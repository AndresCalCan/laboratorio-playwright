import { test, expect } from '@playwright/test';

test.describe('Pruebas del módulo de autenticación - The Internet', () => {

  // Antes de cada prueba, abrimos la página de login
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('CP-01 Login exitoso con credenciales correctas', async ({ page }) => {
    // 1. Ingresar credenciales válidas
    await page.getByLabel('Username').fill('tomsmith');
    await page.getByLabel('Password').fill('SuperSecretPassword!');
    await page.getByRole('button', { name: 'Login' }).click();

    // 2. Verificaciones
    await expect(page).toHaveURL(/secure/);
    await expect(page.locator('#flash')).toContainText('You logged into a secure area!');
    await expect(page.getByRole('link', { name: 'Logout' })).toBeVisible();

    // Tomar captura de evidencia
    await page.screenshot({ path: 'evidencias/CP-01-login-exitoso.png' });
  });

  test('CP-02 Login fallido con contraseña incorrecta', async ({ page }) => {
    // 1. Ingresar usuario válido pero contraseña equivocada
    await page.getByLabel('Username').fill('tomsmith');
    await page.getByLabel('Password').fill('PasswordIncorrecta123');
    await page.getByRole('button', { name: 'Login' }).click();

    // 2. Verificaciones
    await expect(page.locator('#flash')).toContainText('Your password is invalid!');
    await expect(page).toHaveURL(/login/);

    // Tomar captura de evidencia
    await page.screenshot({ path: 'evidencias/CP-02-password-invalido.png' });
  });

  test('CP-03 Login fallido con usuario no registrado', async ({ page }) => {
    // 1. Ingresar un usuario inexistente
    await page.getByLabel('Username').fill('usuario_falso');
    await page.getByLabel('Password').fill('SuperSecretPassword!');
    await page.getByRole('button', { name: 'Login' }).click();

    // 2. Verificaciones
    await expect(page.locator('#flash')).toContainText('Your username is invalid!');
    await expect(page).toHaveURL(/login/);

    // Tomar captura de evidencia
    await page.screenshot({ path: 'evidencias/CP-03-usuario-invalido.png' });
  });

  test('CP-04 Cerrar sesión (Logout) correctamente', async ({ page }) => {
    // 1. Iniciar sesión primero
    await page.getByLabel('Username').fill('tomsmith');
    await page.getByLabel('Password').fill('SuperSecretPassword!');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL(/secure/);

    // 2. Dar clic en el botón de Logout
    await page.getByRole('link', { name: 'Logout' }).click();

    // 3. Verificar que regresa al login con mensaje informativo
    await expect(page).toHaveURL(/login/);
    await expect(page.locator('#flash')).toContainText('You logged out of the secure area!');

    // Tomar captura de evidencia
    await page.screenshot({ path: 'evidencias/CP-04-logout-exitoso.png' });
  });

});
