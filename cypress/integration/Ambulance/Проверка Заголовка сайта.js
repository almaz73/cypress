let site = "192.168.83.53:7080"
let token;

Cypress.on('uncaught:exception', () => false); // чтобы тест не падал на неожиданных ошибках

Cypress.Cookies.defaults({ preserve: ['JSESSIONID', 'C9AB6D5557F3BDF397301269069FB649'] }); // борьба против повторных авторизаций

describe('Проверка наличия всех элементов заголовка', function () {
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
                    console.log(' - - - запоминаем токен, чтобы повторно не авторизоваться - - - ');
                    token = cookie.value
                })
            }

            cy.wait(300);
            cy.visit('http://' + site + '/ambulance/#/operinfo/')
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

    it('Наличие часов', function () {
        cy.get('.server-time').contains(':')
    })

    it('Наличие информации о версии', function () {
        cy.get('.server-time-text').contains('Версия')
    })

    it('Наличие кнопки выхода', function () {
        cy.get('#headerNavbar').contains('li', 'Выход')
    })

    it('Открытие панели оповещения', function () {
        cy.get('#headerNavbar').contains('Оповещения').click()
            .then(() => cy.get('messenger-widget'))
    })
    it('Открытие панели Подписать', function () {
        cy.get('#headerNavbar').contains('Подписать').click()
            .then(() => cy.get('subscription-widget'))
    })

    it('Открытие панели Отправка сообщения в службу техподдержки', function () {
        cy.wait(500);
        cy.get('#headerNavbar').contains('✉').click()
            .then(modal => {
                cy.get('.modal-window > .header > .close-button').click()
            })
    })

    it('Открытие панели Технологический перерыв', function () {
        cy.wait(500);
        cy.get('#headerNavbar').contains('⏰').click()
            .then(modal => {
                cy.get('.modal-window > .header > :nth-child(2) > .close-button').click()
            })
    })


    it('Открытие панели Диагностика качества соединения', function () {
        cy.wait(500);
        cy.get('[ng-click="getNetPing()"]').click()
            .then(modal => {
                cy.get('.modal-window > .header > .close-button').click()
            })
    })

    it('Наличие ссылки на документацию', function () {
        cy.wait(500);
        cy.visit(`http://${site}/ambulance/docs/index.html`)
        cy.get('.close')
    })


    it('Наличие кнопки сброс кэша сервера', function () {
        cy.wait(500);
        cy.get('debug-panel').find('.clear-cache-btn')
    })

    it('Наличие Выбранной конфигурации АРМ', function () {
        cy.wait(500);
        cy.get('[title="Выбранная конфигурация АРМ"]').find('.caret')
    })

    it('Наличие Логина', function () {
        cy.wait(500);
        cy.get('[title="Логин"]').find('.glyphicon')
    })




   






})