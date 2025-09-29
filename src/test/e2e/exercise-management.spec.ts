import { test, expect } from '@playwright/test';

test.describe('Exercise Management', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to exercise management page
    await page.goto('/gym/exercises');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
  });

  test('should display exercise list page correctly', async ({ page }) => {
    // Check page title
    await expect(page.locator('h1')).toContainText('Ejercicios');
    
    // Check search input is present
    await expect(page.locator('[data-testid="search-input"]')).toBeVisible();
    
    // Check create exercise button is present
    await expect(page.locator('[data-testid="create-exercise"]')).toBeVisible();
    
    // Check exercise table is present
    await expect(page.locator('[data-testid="exercises-table"]')).toBeVisible();
  });

  test('should search exercises correctly', async ({ page }) => {
    // Type in search input
    await page.fill('[data-testid="search-input"]', 'Press');
    
    // Wait for search results
    await page.waitForTimeout(500); // Debounce delay
    
    // Check that results are filtered
    const exerciseRows = page.locator('[data-testid="exercise-row"]');
    await expect(exerciseRows.first()).toContainText('Press');
  });

  test('should filter exercises by muscle group', async ({ page }) => {
    // Open muscle group filter
    await page.click('[data-testid="muscle-group-filter"]');
    
    // Select chest muscle group
    await page.click('[data-testid="muscle-group-option-chest"]');
    
    // Apply filter
    await page.click('[data-testid="apply-filters"]');
    
    // Wait for results
    await page.waitForLoadState('networkidle');
    
    // Check that only chest exercises are shown
    const muscleGroupLabels = page.locator('[data-testid="exercise-muscle-group"]');
    const count = await muscleGroupLabels.count();
    
    for (let i = 0; i < count; i++) {
      await expect(muscleGroupLabels.nth(i)).toContainText('Pecho');
    }
  });

  test('should open exercise preview modal', async ({ page }) => {
    // Click on first exercise row
    await page.click('[data-testid="exercise-row"]:first-child [data-testid="view-exercise"]');
    
    // Check modal is opened
    await expect(page.locator('[data-testid="exercise-preview-modal"]')).toBeVisible();
    
    // Check modal contains exercise information
    await expect(page.locator('[data-testid="exercise-preview-modal"]')).toContainText('Vista Previa del Ejercicio');
  });

  test('should create new exercise', async ({ page }) => {
    // Click create exercise button
    await page.click('[data-testid="create-exercise"]');
    
    // Check we're on create page
    await expect(page.url()).toContain('/gym/exercises/create');
    
    // Fill exercise form
    await page.fill('[data-testid="exercise-name"]', 'Test Exercise');
    await page.fill('[data-testid="exercise-description"]', 'Test description for exercise');
    
    // Select muscle group
    await page.click('[data-testid="muscle-group-select"]');
    await page.click('[data-testid="muscle-group-option-chest"]');
    
    // Select equipment
    await page.click('[data-testid="equipment-select"]');
    await page.click('[data-testid="equipment-option-barbell"]');
    
    // Select difficulty
    await page.click('[data-testid="difficulty-select"]');
    await page.click('[data-testid="difficulty-option-beginner"]');
    
    // Fill instructions
    await page.fill('[data-testid="exercise-instructions"]', 'Step 1: Setup\nStep 2: Execute\nStep 3: Return');
    
    // Submit form
    await page.click('[data-testid="submit-exercise"]');
    
    // Check success message
    await expect(page.locator('[data-testid="toast-success"]')).toContainText('Ejercicio creado exitosamente');
    
    // Check redirect to exercise list
    await expect(page.url()).toContain('/gym/exercises');
  });

  test('should edit exercise', async ({ page }) => {
    // Click edit button on first exercise
    await page.click('[data-testid="exercise-row"]:first-child [data-testid="edit-exercise"]');
    
    // Check we're on edit page
    await expect(page.url()).toContain('/edit');
    
    // Update exercise name
    await page.fill('[data-testid="exercise-name"]', 'Updated Exercise Name');
    
    // Submit form
    await page.click('[data-testid="submit-exercise"]');
    
    // Check success message
    await expect(page.locator('[data-testid="toast-success"]')).toContainText('Ejercicio actualizado exitosamente');
  });

  test('should duplicate exercise', async ({ page }) => {
    // Setup dialog handler
    page.on('dialog', dialog => dialog.accept());
    
    // Click duplicate button on first exercise
    await page.click('[data-testid="exercise-row"]:first-child [data-testid="duplicate-exercise"]');
    
    // Check success message
    await expect(page.locator('[data-testid="toast-success"]')).toContainText('Ejercicio duplicado exitosamente');
  });

  test('should delete exercise with confirmation', async ({ page }) => {
    // Setup dialog handler
    page.on('dialog', dialog => dialog.accept());
    
    // Click delete button on first exercise
    await page.click('[data-testid="exercise-row"]:first-child [data-testid="delete-exercise"]');
    
    // Check success message
    await expect(page.locator('[data-testid="toast-success"]')).toContainText('Ejercicio eliminado exitosamente');
  });

  test('should bulk delete exercises', async ({ page }) => {
    // Select multiple exercises
    await page.check('[data-testid="exercise-row"]:nth-child(1) [data-testid="select-exercise"]');
    await page.check('[data-testid="exercise-row"]:nth-child(2) [data-testid="select-exercise"]');
    
    // Check bulk actions are visible
    await expect(page.locator('[data-testid="bulk-actions"]')).toBeVisible();
    
    // Setup dialog handler
    page.on('dialog', dialog => dialog.accept());
    
    // Click bulk delete
    await page.click('[data-testid="bulk-delete"]');
    
    // Check success message
    await expect(page.locator('[data-testid="toast-success"]')).toContainText('ejercicios eliminados exitosamente');
  });

  test('should filter by equipment', async ({ page }) => {
    // Open equipment filter
    await page.click('[data-testid="equipment-filter"]');
    
    // Select barbell equipment
    await page.click('[data-testid="equipment-option-barbell"]');
    
    // Apply filter
    await page.click('[data-testid="apply-filters"]');
    
    // Wait for results
    await page.waitForLoadState('networkidle');
    
    // Check that only barbell exercises are shown
    const equipmentLabels = page.locator('[data-testid="exercise-equipment"]');
    const count = await equipmentLabels.count();
    
    for (let i = 0; i < count; i++) {
      await expect(equipmentLabels.nth(i)).toContainText('Barra');
    }
  });

  test('should filter by difficulty', async ({ page }) => {
    // Open difficulty filter
    await page.click('[data-testid="difficulty-filter"]');
    
    // Select beginner difficulty
    await page.click('[data-testid="difficulty-option-beginner"]');
    
    // Apply filter
    await page.click('[data-testid="apply-filters"]');
    
    // Wait for results
    await page.waitForLoadState('networkidle');
    
    // Check that only beginner exercises are shown
    const difficultyBadges = page.locator('[data-testid="exercise-difficulty"]');
    const count = await difficultyBadges.count();
    
    for (let i = 0; i < count; i++) {
      await expect(difficultyBadges.nth(i)).toContainText('Principiante');
    }
  });

  test('should sort exercises by name', async ({ page }) => {
    // Click on name column header to sort
    await page.click('[data-testid="sort-name"]');
    
    // Wait for sorting
    await page.waitForLoadState('networkidle');
    
    // Check sort indicator is visible
    await expect(page.locator('[data-testid="sort-name"] [data-testid="sort-indicator"]')).toBeVisible();
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

  test('should validate exercise form', async ({ page }) => {
    // Navigate to create exercise page
    await page.click('[data-testid="create-exercise"]');
    
    // Try to submit empty form
    await page.click('[data-testid="submit-exercise"]');
    
    // Check validation errors
    await expect(page.locator('[data-testid="name-error"]')).toContainText('El nombre es requerido');
    await expect(page.locator('[data-testid="muscle-group-error"]')).toContainText('El grupo muscular es requerido');
  });

  test('should clear all filters', async ({ page }) => {
    // Apply some filters first
    await page.fill('[data-testid="search-input"]', 'test');
    await page.click('[data-testid="muscle-group-filter"]');
    await page.click('[data-testid="muscle-group-option-chest"]');
    
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
    
    // Check table is responsive (might show as cards on mobile)
    await expect(page.locator('[data-testid="exercises-table"], [data-testid="exercises-grid"]')).toBeVisible();
  });
});
