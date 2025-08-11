import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('should redirect to login when not authenticated', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL('/login')
  })

  test('should login with demo credentials', async ({ page }) => {
    await page.goto('/login')
    
    // Check if login page elements exist
    await expect(page.locator('text=Welcome Back')).toBeVisible()
    
    // Click demo credentials button
    await page.click('text=Use Demo Credentials')
    
    // Verify credentials are filled
    await expect(page.locator('input[type="email"]')).toHaveValue('admin@example.com')
    await expect(page.locator('input[type="password"]')).toHaveValue('admin123')
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard')
    await expect(page.locator('text=Dashboard')).toBeVisible()
  })

  test('should show validation errors for invalid form', async ({ page }) => {
    await page.goto('/login')
    
    // Try to submit empty form
    await page.click('button[type="submit"]')
    
    // Should still be on login page
    await expect(page).toHaveURL('/login')
  })

  test('should logout successfully', async ({ page }) => {
    // First login
    await page.goto('/login')
    await page.click('text=Use Demo Credentials')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('/dashboard')
    
    // Then logout
    await page.click('button:has-text("Admin User")')
    await page.click('text=Logout')
    
    // Should redirect back to login
    await expect(page).toHaveURL('/login')
  })
})