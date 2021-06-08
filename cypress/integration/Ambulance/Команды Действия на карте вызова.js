Cypress.on('uncaught:exception', (err, runnable) => { // чтобы тест не падал на неожиданных ошибках
    return false
})

let token = '';
let foundCall;
Cypress.Cookies.defaults({ preserve: ['JSESSIONID', '790C8CFCE06CF045C926E7785996A800'] }); // борьба против повторных авторизаций

describe('Команды Действия в карте вызова', function () {
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
                    console.log(' - - - запоминаем прежний токен, чтобы повторно не авторизоваться - - - ');
                    token = cookie.value
                })
            }

            // Если вызов не найден ищем в журнале, если найден, открываем вызов.
            if (!foundCall) cy.visit('http://' + Cypress.env('url') + '/ambulance/#/journal')
            else cy.visit(foundCall)
        })

    })

    beforeEach(function () {
        if (!Cypress.$('#headerNavbar').length) {
            cy.clearCookie(''); // чистим старый токен
            cy.wait(1000).then(() => window.location.reload());
            console.log('- - - - - - - - - -почистили авторизацию, обновляемся- - - - - - - - - - - ',);
            return;
        }
    })

    beforeEach(function () {
        cy.url().then(url => {
            if (!url.includes('ambulance/#/callcard')) {
                cy.visit('http://' + Cypress.env('url') + '/ambulance/#/journal'); // переходим в журнал
                cy.get('[ng-model="ctrl.filters.callSignIds"]').click(); // открываем список "Признак вызова"
                cy.get('#filter18  .chosen-drop > .chosen-results > [name="2"]').click(); // выбираем "Скорая помощь"
                cy.get('[ng-model="ctrl.filters.periodStart"]').invoke('val').then((text) => { // выбираем интервал времени
                    text = text.split('.').reverse().join('-')
                    let oldDate = new Date(text);
                    let newDate = oldDate.setDate(oldDate.getDate() - 30); // за последние 30 дней

                    cy.get('[ng-model="ctrl.filters.periodStart"]')
                        .clear()
                        .type(`${new Date(newDate).toLocaleDateString()}{enter}`); // выбираем начальную дату

                    cy.get('[ng-click="find(ctrl.filters);"]').click(); // Нажимаем кнопку Применить
                });

                cy.get('[style=""] .ui-grid-cell-contents > a').click(); // Открываем первый вызов
            } else {

                cy.get('[style="margin: 0"]').click();
            }
        });


    })



    it(': Открытие панели Действия - Событие', function () {
        cy.url().then(url => {
            foundCall = url; // запоминаем найденный вызов СП
        });

        cy.get('[style="margin: 0"]').click(); // открываем меню Действия
        cy.get('[ng-click="changeEvent();"]').click(); // открываем панель Событие
        cy.contains('Основные данные'); // проверяем, содержится ли текст 
        cy.get('[ng-model="ctrl.ev.eventScaleId"]').click() // раcскроем комбобокс "Масштаб события"
    })

    it(': Открытие панели Действия - Назначить сотрудника', function () {
        cy.get('[ng-click="assignOrderStaff();"]').click();
        cy.contains('Назначение сотрудника'); // проверяем, содержится ли текст 
        cy.get('[ng-model="specialist.id"]').first().click() // раскроем комбобокс "ФИО сотрудника"

    })

    /*it(': Открытие панели Действия - Передать вызов в ДДС', function () {
        cy.get('[ng-click="transferCall();"]').click();
        cy.contains('Передача вызова в другие ДДС'); // проверяем, содержится ли текст 
        cy.get('[ng-model="externalService.externalService.id"]').first().click() // раскроем комбобокс "Служба"
    })*/

    it(': Открытие панели Действия - История передач в ДДС', function () {
        cy.get('[ng-click="showCallExternalServiceInfos();"]').click();
        cy.contains('История передач вызова в другие ДДС'); // проверяем, содержится ли текст 
    })

    it(': Открытие панели Действия - Обмен данными', function () {
        cy.get('[ng-click="showCallExternalServiceInfosDetails();"]').click();
        cy.contains('Взаимодействие с внешними службами'); // проверяем, содержится ли текст 
    })

    /// транспортировка

    it(': Открытие панели Действия - Отметки', function () {
        cy.get('[ng-click="changeMarks();"]').click();
        cy.contains('Отметки'); // проверяем, содержится ли текст 
        cy.get('[ng-model="mark.callerType"]').click()
    })

    it(': Открытие панели Действия - История', function () {
        cy.get('[ng-click="showHistory();"]').click();
        cy.contains('История'); // проверяем, содержится ли текст 
        cy.get('[ng-change="ctrl.updateGrid();"]').click()
    })

    it(': Открытие панели Действия - Идентифицировать пациента', function () {
        cy.get('[ng-click="checkOMS();"]').click();
        cy.contains('Поиск пациента в реестре'); // проверяем, содержится ли текст 
        cy.get('[ng-model="filters.sex"]').click()
    })

    it(': Открытие панели Действия - Поиск пациента в реестре', function () {
        cy.get('[ng-click="showSearchPatientModal();"]').click();
        cy.contains('Поиск пациента в реестре'); 
        cy.get('[ng-model="filters.sex"]').click()
    })

    // заблокировать/разблокировать

    it(': Открытие панели Действия - Телефонная книга', function () {
        cy.get('[ng-click="showPhoneBookModal()"]').click();
        cy.contains('Телефонный справочник'); 
        cy.get('[ng-model="ctrl.phoneGroupType"]').click()
    })

    it(': Открытие панели Действия - Поиск аудиозаписей', function () {
        cy.get('[ng-click="showAudioByCall()"]').click();
        cy.contains('Поиск аудиозаписей');
        cy.get('[ng-click="getAudio();"]').click()
    })

    // Создать ЭЦП


    it(': Открытие панели Действия - Просмотреть ЭЦП', function () {
        cy.get('[ ng-click="historySignature()"]').click();
        cy.contains('ЭЦП вызова'); 
    })

    it(': Открытие панели Действия - Показать диалог', function () {
        cy.get('[ng-click="showMessages()"]').click();
    })
    
    //Отправить Сопр.лист
    // запросить талон к сопрлисту
    // заполнить из шаблона
    // Вызов к пациенту


    it(': Открытие панели Действия - Отправка оповещения по вызову', function () {
        cy.get('[ng-click="sendMessageAboutCall()"]').click();
        cy.contains('Отправка оповещения по вызову');
        cy.get('[ng-model="selectedStation"]').click()
    })
})