import { expect, test } from '@playwright/test';

test('smoke: login e exibe grid de produtos', async ({ page }) => {
  const email = process.env.E2E_LOGIN_EMAIL ?? 'dinamica';
  const senha = process.env.E2E_LOGIN_PASSWORD ?? '123';

  await page.goto('/login');
  await page.getByLabel('E-mail', { exact: true }).fill(email);
  await page.getByLabel('Senha', { exact: true }).fill(senha);
  await page.getByRole('button', { name: 'Entrar' }).click();

  await expect(page).toHaveURL(/\/produtos/, { timeout: 30_000 });
  await expect(page.getByRole('heading', { name: 'Lista de produtos' })).toBeVisible();
  await expect(page.locator('article').first()).toBeVisible({ timeout: 30_000 });
});

test('seguranca: limpa storage e recarrega redireciona para login', async ({ page }) => {
  const email = process.env.E2E_LOGIN_EMAIL ?? 'dinamica';
  const senha = process.env.E2E_LOGIN_PASSWORD ?? '123';

  await page.goto('/login');
  await page.getByLabel('E-mail', { exact: true }).fill(email);
  await page.getByLabel('Senha', { exact: true }).fill(senha);
  await page.getByRole('button', { name: 'Entrar' }).click();

  await expect(page).toHaveURL(/\/produtos/, { timeout: 30_000 });

  await page.evaluate(() => localStorage.clear());
  await page.reload();

  await expect(page).toHaveURL(/\/login/, { timeout: 30_000 });
});
