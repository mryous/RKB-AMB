describe('Navigation', () => {
    it('should load the home page', () => {
        cy.visit('/')
        cy.contains('Selamat Datang Keluarga Besar')
    })
})

describe('Admin Login', () => {
    it('should login as admin', () => {
        cy.visit('/login')
        cy.get('input[type="text"]').type('admin@rkb-amb.org')
        cy.get('input[type="password"]').type('admin123')
        cy.get('button[type="submit"]').click()

        // Should redirect to admin
        cy.url().should('include', '/admin')
    })
})
