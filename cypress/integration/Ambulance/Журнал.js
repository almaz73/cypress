let site = '192.168.83.53:8080'

Cypress.on('uncaught:exception', (err, runnable) => { // чтобы тест не падал на неожиданных ошибках
    return false
})

let token = '';
Cypress.Cookies.defaults({ preserve: ['JSESSIONID', '790C8CFCE06CF045C926E7785996A800'] }); // борьба против повторных авторизаций

describe('Фильтрация в журнале', function () {
    beforeEach(function () {
        cy.viewport(1280, 720);
        cy.getCookie('JSESSIONID').then(cook => {
            if (!cook || !cook.name) {
                // Авторизация, если не авторизовано
                cy.visit(`http://${site}/ambulance/login`)
                cy.get('input[placeholder="Логин"]').type('adminSMP')
                cy.get('input[placeholder="Пароль"]').type('ambulance17')
                cy.contains('Войти').click()
                cy.title().should('eq', 'СМП 3.0')

                cy.getCookie('JSESSIONID').then(cookie => {
                    console.log(' - - - запоминаем прежний токен, чтобы повторно не авторизоваться - - - ');
                    token = cookie.value
                })
            }

            cy.visit('http://' + site + '/ambulance/#/journal')
        })

    })

    it(': завершенные вызовы', function () {
        if (!Cypress.$('#headerNavbar').length) {
            cy.clearCookie(''); // чистим старый токен
            cy.wait(1000).then(() => window.location.reload());
            console.log('- - - - - - - - - -почистили авторизацию, обновляемся- - - - - - - - - - - ',);
            return;
        }

        cy.contains('Добавить фильтр ').then(el => {
            cy.get(el).click({ force: true })
                .then((res) => {
                    cy.get('#filter-search').type('завершен')

                    cy.get('[title="Сведения об обслуживании"] > :nth-child(4) > .ivh-treeview > :nth-child(23) > .ivh-treeview-node-content > .ivh-treeview-checkbox-wrapper > span > .ivh-treeview-checkbox').click()

                    cy.get('[ng-model="ctrl.filters.completed"]').click()

                    cy.get('[ng-model="ctrl.filters.completed"]').contains('Да').click()

                    cy.get('[ng-click="find(ctrl.filters);"]').click()
                })
        })

    })

    it(': вызовы с пациентом по фамилии Петров', function () {
        cy.contains('Добавить фильтр ').then(el => {
            cy.get(el).click({ force: true })
                .then((res) => {
                    cy.get('#filter-search').type('Фамилия')

                    cy.get('[title="Сведения о пациенте"] > :nth-child(4) > :nth-child(1) > :nth-child(1) > .ivh-treeview-node-content > .ivh-treeview-checkbox-wrapper > span > .ivh-treeview-checkbox').click()

                    cy.get('input[ng-model="ctrl.filters.surname"]').type('Петров', { force: true }).then(res => {
                        console.log('00000 res', res);
                    });

                    cy.get('#filter6 > chosen.ng-pristine > .chosen-container > .chosen-single').click()

                    cy.get('[ng-model="ctrl.filters.surnameFullEntry"] li').first().click()

                    cy.get('[ng-click="find(ctrl.filters);"]').click()
                })
        })

    })

    it(': вызовы за последнюю неделю', function () {

        cy.get('[ng-model="ctrl.filters.periodStart"]').invoke('val').then((text) => {
            text = text.split('.').reverse().join('-')
            let oldDate = new Date(text);
            let newDate = oldDate.setDate(oldDate.getDate() - 7)

            cy.get('[ng-model="ctrl.filters.periodStart"]')
                .clear()
                .type(`${new Date(newDate).toLocaleDateString()}{enter}`)

            cy.get('[ng-click="find(ctrl.filters);"]').click()
        });
    })
})