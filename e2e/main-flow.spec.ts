import { test, expect } from '@playwright/test';

test.describe('MedLevel Primary Critical Flow', () => {
  test('should complete the critical journey: login, solve question, and see feedback', async ({ page }) => {
    // 1. Visit Login Page
    await page.goto('/login');
    await expect(page.locator('h3:has-text("Acesso ao MedLevel")')).toBeVisible();

    // 2. Submit Login Credentials
    await page.fill('#email', 'estudante@medlevel.com.br');
    await page.fill('#password', 'Senha123#');
    await page.click('button[type="submit"]');

    // 3. Navigate to Dashboard (/painel)
    await page.waitForURL('**/painel');
    await expect(page.locator('h1:has-text("Dra. Camila")')).toBeVisible();

    // 4. Navigate to Question Bank (/questoes)
    await page.click('a[href="/questoes"]');
    await page.waitForURL('**/questoes');
    await expect(page.locator('h1:has-text("Questões e Casos Clínicos")')).toBeVisible();

    // 5. Open First Question
    const solveButton = page.locator('button:has-text("Resolver")').first();
    await solveButton.click();
    await page.waitForURL('**/questoes/**');

    // 6. Select Alternative A and Confirm
    const alternativeA = page.locator('button:has-text("A")').first();
    await alternativeA.click();

    const confirmButton = page.locator('button:has-text("Confirmar Resposta")');
    await confirmButton.click();

    // 7. Verify Immediate Commented Rationale Feedback
    await expect(
      page.locator('h5:has-text("Gabarito"), div[role="alert"]')
    ).toBeVisible();
  });
});
