const { exists } = require("fs");

let site = '192.168.83.53:6080'

Cypress.on('uncaught:exception', (err, runnable) => { // чтобы тест не падал на неожиданных ошибках
    return false
})

let token = '';
Cypress.Cookies.defaults({ preserve: ['JSESSIONID', '790C8CFCE06CF045C926E7785996A800'] }); // борьба против повторных авторизаций

describe('Фильтрация в журнале', function () {
    beforeEach(function () {
        cy.viewport(1600, 900);
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
        })
    })

    it(': завершенные вызовы', function () {
        if (!Cypress.$('#headerNavbar').length) {
            cy.clearCookie(''); // чистим старый токен
            cy.wait(1000).then(() => window.location.reload());
            console.log('- - - - - - - - - -почистили авторизацию, обновляемся- - - - - - - - - - - ',);
            return;
        }
    })
    
    it(': Создание СП вызова', function () {
        cy.contains("ТЕСТОВЫЙ СЕРВЕР").should('exist') // Защита запуска только на тестовый сервер
        cy.visit('http://' + site + '/ambulance/#/callcard/') // Заходим на адерс создания КВ
       cy.get('#change-call-sign').click() // Нажимаем кнопку "Изменить признак вызова", если на сайте окно открывается автоматиески, строку требуется закомментировать
        // Если требуется создать вызов, отличный от СП/НП, сюда надо добавить ссылку на кнопку в окне ПП или другое
        cy.get('.modal-window > .buttons > .save-btn-with-img').click() // нажимаем Сохранить
        cy.get('[ng-show="[1,2,3].indexOf(call.callSign.id) > -1"] > :nth-child(2) > .ng-untouched > .chosen-container > .chosen-single > div > b').click() // Открываем меню выбора Повода
        cy.contains("боли в груди").click() // Здесь поиск выполняется по содержимому контейнера
        cy.get('[ng-show="[1,2,3].indexOf(call.callSign.id) > -1"] > :nth-child(4) > .ng-pristine').type("Тест сайпресс") // Так как поле для всех одно, берем фиксированную ссылку
        cy.get('[ng-include="contentUrl"] > :nth-child(3) > :nth-child(2) > chosen.ng-pristine > .chosen-container > .chosen-single > div > b').click() //Открываем выбор места вызова
        cy.contains("Квартира").click() // Выполняем поиск по содержимому  - Contains
        cy.get(':nth-child(2) > [style="flex: 1"] > :nth-child(1) > .ng-untouched > .chosen-container > .chosen-single > div > b').click()
        cy.contains("Чувашская Республика").click() // выбираем регион, актуально для аккаунта adminSMP
        cy.get('[style="flex: 1"] > :nth-child(2) > .ng-untouched > .chosen-container > .chosen-single > div > b').click() 
        cy.get('[style="flex: 1"] > :nth-child(2) > .ng-untouched > .chosen-container > .chosen-drop > .chosen-results > .active').click()
        cy.get('[style="flex: 1"] > :nth-child(3) > chosen.ng-pristine > .chosen-container > .chosen-single > div > b').click() // Заполняем Населенный пункт и регион, не требуется для локальных армов
        cy.get(':nth-child(3) > .ng-untouched > .chosen-container > .chosen-drop > .chosen-results > .active').click() // Выбирает село
        cy.get(':nth-child(4) > [style="flex: 1"] > :nth-child(1) > .ng-untouched > .chosen-container > .chosen-single > div > b').click() // выбираем улицу, в данном случае вариантов нет, оставляем пустой. Для других серверов нужно будет дописать выборку
        // Здесь можно дописать выборку дома и квартиры, если улица не пустая
        cy.get('.scrollable-block > :nth-child(1) > :nth-child(2) > .ng-pristine').click().type("Кириллов")
        cy.get('[style="margin: 0 3px"] > .ng-pristine').click().type("Иван")
        cy.get('.scrollable-block > :nth-child(1) > :nth-child(4) > .ng-pristine').click().type("Арнольдович")
        cy.get('.scrollable-block > :nth-child(2) > :nth-child(2) > :nth-child(2) > .ng-pristine').click().type("55") // Заполняем ФИО и возраст пациента
        cy.get('.save-btn-with-img').first().click() // Сохраняем КВ
        
            cy.contains('Выберите признак вызова').then(() => {
                cy.get('[style="padding: 7px"] > :nth-child(1) > :nth-child(1) > .ng-pristine').click({ force: true })
                cy.get('.save-btn-with-img').first().click()
            })
                    .then(() => {    
        
        cy.get('[style="padding: 7px"] > .block-row > .block-row-element > chosen.ng-pristine > .chosen-container > .chosen-single > div > b').click()
        cy.get('[style="padding: 7px"] > .block-row > .block-row-element > .ng-untouched > .chosen-container > .chosen-drop > .chosen-results > .active').click() // Выбираем зону обслуживания
        // Пока в выпадающих списках выбираем элемент по курсору, то есть первый в списке, пока способ брать другие элементы на разных сайтах не придумали
        cy.get('[style="padding: 7px"] > .buttons > .save-btn-with-img').click().wait(3000) // Сохраняем зону
        cy.get('.save-btn-with-img').eq(0).click() // Выбираем первый элемент выбранного массива по кнопке. (Первая сохранение КВ) Пропускаем окно повторности. На этом этапе тест может отработать не с первого раза
        
        // В целом тест еще требует дороаботки, но на его основе можно выполнять тест по созданию других типов вызовов
                
        
                    
                })
       
    })
})