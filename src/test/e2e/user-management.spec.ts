import { test, expect } from '@playwright/test';

test.describe('User Management', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to user management page
    await page.goto('/admin/users');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
  });

  test('should display user list page correctly', async ({ page }) => {
    // Check page title
    await expect(page.locator('h1')).toContainText('Gestión de Usuarios');
    
    // Check search input is present
    await expect(page.locator('[data-testid="search-input"]')).toBeVisible();
    
    // Check create user button is present
    await expect(page.locator('[data-testid="create-user"]')).toBeVisible();
    
    // Check user table is present
    await expect(page.locator('[data-testid="users-table"]')).toBeVisible();
  });

  test('should search users correctly', async ({ page }) => {
    // Type in search input
    await page.fill('[data-testid="search-input"]', 'Juan');
    
    // Wait for search results
    await page.waitForTimeout(500); // Debounce delay
    
    // Check that results are filtered
    const userRows = page.locator('[data-testid="user-row"]');
    await expect(userRows.first()).toContainText('Juan');
  });

  test('should open user detail modal', async ({ page }) => {
    // Click on first user row
    await page.click('[data-testid="user-row"]:first-child [data-testid="view-user"]');
    
    // Check modal is opened
    await expect(page.locator('[data-testid="user-detail-modal"]')).toBeVisible();
    
    // Check modal contains user information
    await expect(page.locator('[data-testid="user-detail-modal"]')).toContainText('Información del Usuario');
  });

  test('should filter users by role', async ({ page }) => {
    // Open role filter
    await page.click('[data-testid="role-filter"]');
    
    // Select admin role
    await page.click('[data-testid="role-option-admin"]');
    
    // Apply filter
    await page.click('[data-testid="apply-filters"]');
    
    // Wait for results
    await page.waitForLoadState('networkidle');
    
    // Check that only admin users are shown
    const roleLabels = page.locator('[data-testid="user-role"]');
    const count = await roleLabels.count();
    
    for (let i = 0; i < count; i++) {
      await expect(roleLabels.nth(i)).toContainText('Admin');
    }
  });

  test('should create new user', async ({ page }) => {
    // Click create user button
    await page.click('[data-testid="create-user"]');
    
    // Check create user modal is opened
    await expect(page.locator('[data-testid="create-user-modal"]')).toBeVisible();
    
    // Fill user form
    await page.fill('[data-testid="first-name-input"]', 'Test');
    await page.fill('[data-testid="last-name-input"]', 'User');
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="phone-input"]', '+54 9 11 1234-5678');
    
    // Select role
    await page.click('[data-testid="role-select"]');
    await page.click('[data-testid="role-option-member"]');
    
    // Submit form
    await page.click('[data-testid="submit-user-form"]');
    
    // Check success message
    await expect(page.locator('[data-testid="toast-success"]')).toContainText('Usuario creado exitosamente');
    
    // Check modal is closed
    await expect(page.locator('[data-testid="create-user-modal"]')).not.toBeVisible();
  });

  test('should edit user', async ({ page }) => {
    // Click edit button on first user
    await page.click('[data-testid="user-row"]:first-child [data-testid="edit-user"]');
    
    // Check edit modal is opened
    await expect(page.locator('[data-testid="edit-user-modal"]')).toBeVisible();
    
    // Update user name
    await page.fill('[data-testid="first-name-input"]', 'Updated Name');
    
    // Submit form
    await page.click('[data-testid="submit-user-form"]');
    
    // Check success message
    await expect(page.locator('[data-testid="toast-success"]')).toContainText('Usuario actualizado exitosamente');
  });

  test('should delete user with confirmation', async ({ page }) => {
    // Setup dialog handler
    page.on('dialog', dialog => dialog.accept());
    
    // Click delete button on first user
    await page.click('[data-testid="user-row"]:first-child [data-testid="delete-user"]');
    
    // Check success message
    await expect(page.locator('[data-testid="toast-success"]')).toContainText('Usuario eliminado exitosamente');
  });

  test('should assign professor to member', async ({ page }) => {
    // Find a member user and click assign professor
    await page.click('[data-testid="user-row"][data-user-type="member"]:first-child [data-testid="assign-professor"]');
    
    // Check assign professor modal is opened
    await expect(page.locator('[data-testid="assign-professor-modal"]')).toBeVisible();
    
    // Select a professor
    await page.click('[data-testid="professor-select"]');
    await page.click('[data-testid="professor-option"]:first-child');
    
    // Submit assignment
    await page.click('[data-testid="submit-assignment"]');
    
    // Check success message
    await expect(page.locator('[data-testid="toast-success"]')).toContainText('Profesor asignado exitosamente');
  });

  test('should toggle user status', async ({ page }) => {
    // Setup dialog handler
    page.on('dialog', dialog => dialog.accept());
    
    // Click toggle status button
    await page.click('[data-testid="user-row"]:first-child [data-testid="toggle-status"]');
    
    // Check success message
    await expect(page.locator('[data-testid="toast-success"]')).toContainText('Estado actualizado exitosamente');
  });

  test('should verify user email', async ({ page }) => {
    // Click verify email button
    await page.click('[data-testid="user-row"]:first-child [data-testid="verify-email"]');
    
    // Check success message
    await expect(page.locator('[data-testid="toast-success"]')).toContainText('Email verificado exitosamente');
  });

  test('should reset user password', async ({ page }) => {
    // Setup dialog handler
    page.on('dialog', dialog => dialog.accept());
    
    // Click reset password button
    await page.click('[data-testid="user-row"]:first-child [data-testid="reset-password"]');
    
    // Check success message
    await expect(page.locator('[data-testid="toast-success"]')).toContainText('Email de reseteo enviado');
  });

  test('should handle pagination', async ({ page }) => {
    // Check pagination is present
    await expect(page.locator('[data-testid="pagination"]')).toBeVisible();
    
    // Click next page
    await page.click('[data-testid="next-page"]');
    
    // Wait for new data to load
    await page.waitForLoadState('networkidle');
    
    // Check page number changed
    await expect(page.locator('[data-testid="current-page"]')).toContainText('2');
  });

  test('should clear all filters', async ({ page }) => {
    // Apply some filters first
    await page.fill('[data-testid="search-input"]', 'test');
    await page.click('[data-testid="role-filter"]');
    await page.click('[data-testid="role-option-admin"]');
    
    // Check filter chips are visible
    await expect(page.locator('[data-testid="filter-chips"]')).toBeVisible();
    
    // Clear all filters
    await page.click('[data-testid="clear-all-filters"]');
    
    // Check filters are cleared
    await expect(page.locator('[data-testid="search-input"]')).toHaveValue('');
    await expect(page.locator('[data-testid="filter-chips"]')).not.toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check mobile layout
    await expect(page.locator('[data-testid="mobile-menu-button"]')).toBeVisible();
    
    // Check table is responsive
    await expect(page.locator('[data-testid="users-table"]')).toBeVisible();
  });
});
