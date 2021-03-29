Cypress.on('uncaught:exception', (err, runnable) => {
    alert(err)
    // чтобы тест не падал на неожиданных ошибках
    return false
})

let token = ''
Cypress.Cookies.defaults({
    // чтобы пройти авторизацию.
    preserve: ['JSESSIONID', '790C8CFCE06CF045C926E7785996A800'],
})


describe('Поиск в журнале завершенных', function () {
    let site = '192.168.83.53:6080'
    beforeEach(function () {
        cy.viewport(1280, 720);
        cy.getCookie('').then(cook => {
            if (!cook || !cook.name) {
                cy.visit(`http://${site}/ambulance/login`)
                cy.get('input[placeholder="Логин"]').type('adminSMP')
                cy.get('input[placeholder="Пароль"]').type('ambulance17')
                cy.contains('Войти').click()
                cy.title().should('eq', 'СМП 3.0')

                cy.getCookie('').then(cookie => {
                    console.log('coo2222kie', cookie);
                    token = cookie.value
                })
            }

            cy.visit('http://' + site + '/ambulance/#/journal')
        })


    })

    it('Завершенные за неделю', function () {
        cy.contains('Добавить фильтр ').then(el => {
            cy.get(el).click({ force: true })
                .then((res) => {
                    console.log('res', res);
                    cy.log('55555 =5', res)
                    cy.get('#filter-search').type('завершен')

                    cy.get('[title="Сведения об обслуживании"] > :nth-child(4) > .ivh-treeview > :nth-child(23) > .ivh-treeview-node-content > .ivh-treeview-checkbox-wrapper > span > .ivh-treeview-checkbox').click()
                    cy.get('[style="display: flex;"] > chosen.ng-pristine > .chosen-container > .chosen-single').click()
                    cy.get('#filter135 > [style="display: flex;"] > .ng-untouched > .chosen-container > .chosen-drop > .chosen-results > .active').click()

                    cy.get('[ng-click="find(ctrl.filters);"]').click()
                    //cy.get('[ng-model="ctrl.filters.periodStart"]').type('13.03.2021').should('have.value','13.03.2021')
                })
        })

    })
})