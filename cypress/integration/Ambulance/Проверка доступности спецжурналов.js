let token;

Cypress.on('uncaught:exception', () => false); // чтобы тест не падал на неожиданных ошибках
Cypress.Cookies.defaults({ preserve: ['JSESSIONID', '790C8CFCE06CF045C926E7785996A800'] }); // борьба против повторных авторизаций

describe('Спецжурналы, доступность через комбобокс', function () {
    beforeEach(function () {
        cy.viewport(1280, 720);
        cy.getCookie('JSESSIONID').then(cook => {
            if (!cook || !cook.name) {
                // Авторизация, если не авторизовано
                cy.visit(`http://${Cypress.env('url')}/ambulance/login`)
                cy.get('input[placeholder="Логин"]').type(Cypress.env('login'))
                cy.get('input[placeholder="Пароль"]').type(Cypress.env('password'))
                cy.contains('Войти').click()
                cy.title().should('eq', 'СМП 3.0')

                cy.getCookie('JSESSIONID').then(cookie => {
                    console.log(' - - - запоминаем токен, чтобы повторно не авторизоваться - - - ');
                    token = cookie.value
                })
            }

            cy.wait(300);
            cy.visit('http://' + Cypress.env('url') + '/ambulance/#/journals')
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



    it('Переход через меню в Спецжурналы', function () {
        cy.get('.menu-icon-specJournal').click();
        cy.get('.chosen-single')
    })

    it('Журнал СПЦ вызовов', function () {
        cy.visit('http://' + Cypress.env('url') + '/ambulance/#/journals/journals/spc')
        cy.get('body').contains('Первичный')
        cy.get('[ng-click="find(ctrl.filters);"]')
    })

    it('Доступность Журнал повторных вызовов', function () {
        cy.visit('http://' + Cypress.env('url') + '/ambulance/#/journals/recall')
        cy.get('body').contains('Повторный')
        cy.get('[ng-click="find(ctrl.filters);"]')
    })

    it('Журнал срочного спец учета', function () {
        cy.visit('http://' + Cypress.env('url') + '/ambulance/#/journals/urgentSpecialAccountingJournal')
        cy.get('body').contains('Журнал срочного спец учета')
        cy.get('[ng-click="find(ctrl.filters);"]')
    })

    it('Журнал событий', function () {
        cy.visit('http://' + Cypress.env('url') + '/ambulance/#/journals/journals/eventJournal')
        cy.get('body').contains('Журнал событий')
        cy.get('[ng-click="find(ctrl.filters);"]')
    })


    it('Журнал вызовов с длительным временем обслуживания', function () {
        cy.visit('http://' + Cypress.env('url') + '/ambulance/#/journals/longtime')
        cy.get('body').contains('Журнал вызовов с длительным временем обслуживания')
        cy.get('[ng-click="find(ctrl.filters);"]')


        cy.get('[ng-model="ctrl.filters.periodStart"]').invoke('val').then((text) => {
            text = text.split('.').reverse().join('-')
            let oldDate = new Date(text);
            let newDate = oldDate.setDate(oldDate.getDate() - 180)

            cy.get('[ng-model="ctrl.filters.periodStart"]')
                .clear()
                .type(`${new Date(newDate).toLocaleDateString()}{enter}`)

            cy.wait(2000)
            cy.get('[ng-click="find(ctrl.filters);"]').click({ forse: true })
            //cy.get('[ng-click="find(ctrl.filters);"]').click()
        });

    })

     it('Журнал активных вызовов в поликлинике', function () {
        cy.visit('http://' + Cypress.env('url') + '/ambulance/#/journals/activecall')
        cy.get('body').contains('Журнал активных вызовов в поликлинике')
        cy.get('[ng-click="find(ctrl.filters);"]')
    })

    it('Журнал госпитализации', function () {
        cy.visit('http://' + Cypress.env('url') + '/ambulance/#/journals/hospitalization')
        cy.get('body').contains('Журнал госпитализации')
        cy.get('[ng-click="find(ctrl.filters);"]')
    })

    it('Журнал инфекционных больных', function () {
        cy.visit('http://' + Cypress.env('url') + '/ambulance/#/journals/infectiouspatients')
        cy.get('body').contains('Журнал инфекционных больных')
        cy.get('[ng-click="find(ctrl.filters);"]')
    })


    it('Журнал обслуживания онкологических больных', function () {
        cy.visit('http://' + Cypress.env('url') + '/ambulance/#/journals/oncologically')
        cy.get('body').contains('Журнал обслуживания онкологических больных')
        cy.get('[ng-click="find(ctrl.filters);"]')
    })

    it('Журнал использования наркотических средств', function () {
        cy.visit('http://' + Cypress.env('url') + '/ambulance/#/journals/narcotics')
        cy.get('body').contains('Журнал использования наркотических средств')
        cy.get('[ng-click="find(ctrl.filters);"]')
    })

     it('Журнал замечаний и поощрений', function () {
        cy.visit('http://' + Cypress.env('url') + '/ambulance/#/journals/reprimand')
        cy.get('body').contains('Журнал замечаний и поощрений')
        cy.get('[ng-click="find(ctrl.filters);"]')
    })

    it('Ведомости доплат по КТУ', function () {
        cy.visit('http://' + Cypress.env('url') + '/ambulance/#/journals/statements')
        cy.get('body').contains('Ведомости доплат по КТУ')
        cy.get('[ng-click="find(ctrl.filters);"]')
    })

    it('Пациенты, находящиеся на мониторинге', function () {
        cy.visit('http://' + Cypress.env('url') + '/ambulance/#/journals/patientmonitoring')
        cy.get('body').contains('Пациенты, находящиеся на мониторинге')
        cy.get('[ng-click="find(ctrl.filters);"]')
    })

    it('Заявки на вылет санавиации', function () {
        cy.visit('http://' + Cypress.env('url') + '/ambulance/#/journals/flightorder')
        cy.get('body').contains('Заявки на вылет санавиации')
        cy.get('[ng-click="find(ctrl.filters);"]')
    })

     it('Учёт контрактов с авиакомпаниями', function () {
        cy.visit('http://' + Cypress.env('url') + '/ambulance/#/journals/aviaсontracts')
        cy.get('body').contains('Учёт контрактов с авиакомпаниями')
        cy.get('[ng-click="find(ctrl.filters);"]')
    })

    it('Расчет стоимости заявок', function () {
        cy.visit('http://' + Cypress.env('url') + '/ambulance/#/journals/costFlightOrder')
        cy.get('body').contains('Расчет стоимости заявок')
        cy.get('[ng-click="find(ctrl.filters);"]')
    })

    it('Заявки, полученные через телеграм', function () {
        cy.visit('http://' + Cypress.env('url') + '/ambulance/#/journals/telegramJournal')
        cy.get('body').contains('Заявки, полученные через телеграм')
        cy.get('[ng-click="find(ctrl.filters);"]')
    })

    

    it('Оценка карт вызова', function () {
        cy.visit('http://' + Cypress.env('url') + '/ambulance/#/journals/evaluationCriteriaJournal')
        cy.get('body').contains('Оценка карт вызова')
        cy.get('[ng-click="find(ctrl.filters);"]')
    })



})