//const { get } = require("http");

let site = "192.168.83.53:7080" 
let token;

Cypress.on('uncaught:exception', () => false); // чтобы тест не падал на неожиданных ошибках

Cypress.Cookies.defaults({ preserve: ['JSESSIONID', 'C9AB6D5557F3BDF397301269069FB649'] }); // борьба против повторных авторизаций

describe('Создание вызова для '+site, function () {
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

            cy.wait(300);
            cy.visit('http://' + site + '/ambulance/#/callcard/')
        })
    })
    beforeEach(function () {
        if (!Cypress.$('#headerNavbar').length) {
            cy.clearCookie(''); // чистим старый токен
            cy.wait(500).then(() => window.location.reload());
            console.log('- - - - - - - - - -почистили авторизацию, обновляемся- - - - - - - - - - - ',);
            return;
        }
    })

    it('создание вызова для всех сайтов', function () {
        cy.wait(300);
        cy.get('body').then((body) => {
            if (Cypress.$('.modal-open').length) {
                cy.get('.modal-dialog').contains('СП/НП').then(modal => {
                    // Если выскакивает окно "Признак вызова", закрывает по кнопке Далее 
                    cy.get('.modal-content button').contains('Далее').click()
                })
            }
        })

       
        cy.get('chosen[ng-model="call.spnp.reasonType"]')
            .click() // нажимаю на комбобокс повод
            .then(() => cy.get('chosen[ng-model="call.spnp.reasonType"]').contains('падение с высоты').click()) //выбираю повод "падение с высоты"
        cy.get('call-place [ng-model="$parent.callPlace"]').click() // нажимаю Тип места вызова
            .then(() => {
                cy.get('call-place [ng-model="$parent.callPlace"] li:first').click() // выбираю первый элемент
            });
        cy.get('call-place [ng-model="address.cityAddress.mo"]')
            .click() // выбираю МО места вызова
            .then(() => cy.get('call-place [ng-model="address.cityAddress.mo"] li:first').click()) // выбираю первый элемент            
        cy.get('button').contains('Сохранить').click(); // нажимаю сохранить вызов


        cy.wait(300);
        cy.get('body').then((body) => {
            if (body[0].innerText.indexOf('Пожалуйста, выберите зону') > -1) {
                cy.get('[ng-model="call.zoneId"]').click()
                    .then(() => {
                        cy.get('[ng-model="call.zoneId"] li:first').click()
                        cy.get('.modal-dialog').contains('Выбрать').click()
                    })
            }
        })


        cy.wait(300);
        cy.get('body').then((body) => {
            if (body[0].innerText.indexOf('Выберите повторный и/или задвоенный вызов') > -1) {
                cy.get('.modal-dialog').contains('Продолжить').click()
            }

        })


        cy.wait(300);
        cy.get('body').then((body) => {
            if (body.find('.modal-dialog').length > 0) {
                if (body[0].innerText.indexOf('Событие') > -1) {
                    cy.get('[ng-model="ctrl.ev.eventScaleId"]').click()
                        .then(() => {
                            cy.get('[ng-model="ctrl.ev.eventScaleId"] li:first').click()
                            cy.get('.modal-dialog').contains('Сохранить').click()
                        })
                }
            }
        })



        cy.hash().should('match', /\d+/)
    })
})