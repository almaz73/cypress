let site = '87.226.190.225:28081'

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
    
    it(': Сотрудники', function () {
        cy.contains("ТЕСТОВЫЙ СЕРВЕР").should('exist') // Защита запуска только на тестовый сервер
        cy.visit('http://' + site + '/ambulance/#/dictionaryGroup') // заходим в раздел справочники
        cy.get('.dict-chosen > .ng-untouched > .chosen-container > .chosen-single > div > b').click(); // выбираем справочник
        cy.get('[style=""] > .active-result > .item-container > .expand').click()  // Нажимаем на папку, открываем окно. Можно попробовать реализовать через поиск в поле и выбор первого результата
        cy.contains('Сотрудники').click();
        cy.get('.btn-create').click()
        cy.get('.ng-pristine').eq(0).click().type("Test") // Вводим ФИО Сотрудника, каждый раз заполяя первое поле, следующим пустым становится eq(0)
        cy.get('.ng-pristine').eq(0).click().type("Test2")
        cy.get('.ng-pristine').eq(0).click().type("Test3")
        cy.get('.ng-pristine').eq(0).click().type("01.01.1988")
        cy.get(':nth-child(4) > .col-xs-6 > .block-row-element > .ng-untouched > .chosen-container > .chosen-single > div > b').click().wait(4000)
        cy.get('.active-result').eq(1).click()
        cy.get('.form-control').eq(1).click().type("01.06.2021")
        cy.get('.btn-create').eq(0).click()
        cy.get('.modal-body > :nth-child(1) > .block-row-element > .ng-untouched > .chosen-container > .chosen-single > div > b').click()
        cy.get('.modal-body > :nth-child(1) > .block-row-element > .ng-untouched > .chosen-container > .chosen-drop > .chosen-results > .active').click()
        cy.get('.ng-pristine').eq(1).click().type("1") // Вводим ставку
        cy.get("body").then($body => {
            if ($body.find('.expand').length > -1) {   //evaluates as true
                cy.get('.modal-body > :nth-child(3) > .block-row-element > .ng-untouched > .chosen-container > .chosen-single > div > b')
                .click();
            }
            cy.get('.modal-body > :nth-child(3) > .block-row-element > .ng-untouched > .chosen-container > .chosen-single > div > b').click()
            cy.get(':nth-child(3) > .block-row-element > .ng-untouched > .chosen-container > .chosen-drop > .chosen-results > .top-level > .active-result > .item-container').click()
    
        });
        
        
       
        cy.get('.ng-pristine').eq(7).click().type("01.06.2021")
        cy.contains('Сохранить').first().click() 
        
        cy.get('.save-btn').eq(1).click() // сохраняем КВ

        cy.get('.flex-between-row > :nth-child(1) > .btn-sm').first().click({force:true})
        cy.get('.flex-row-wrap > :nth-child(1) > .block-row-element > .ng-valid').click().clear().type('Test Test2 Test3')
        cy.get('[ng-click="staffCtrl.search()"]').click().wait(2000)
        cy.get('.ui-grid-cell-contents').contains('Test Test2 Test3').click()  // выбираем позицию в таблице
        cy.get('.btn-change').click()
          // Далее проверим, можно ли изменить ФИО сотрудника. Если не успешно, на следующем этапе тест не найдет элемент, содержащий измененное ФИО
        cy.get('.modal-body > :nth-child(2) > :nth-child(1) > .ng-pristine').click().clear().type('Changed')
        cy.get('.modal-body > :nth-child(2) > :nth-child(2) > .ng-pristine').click().clear().type('by')
        cy.get('.modal-body > :nth-child(2) > :nth-child(3) > .ng-pristine').click().clear().type('Cypress')
        cy.contains('Сохранить').first().click().wait(4000)

      
        cy.get('.flex-row-wrap > :nth-child(1) > .block-row-element > .ng-valid').click().clear().type('Changed by Cypress')
        cy.get('[ng-click="staffCtrl.search()"]').click().wait(2000)
        cy.get('.ui-grid-cell-contents').contains('Changed by Cypress').click()


        cy.get('[ng-click="deleteStaff()"]').click()
        cy.get('[ng-click="save_function()"]').click().wait(22000) // Очень долго удаляется позиция, поэтому такое ожидание
        

        // Проверим, удалилась ли строка


        cy.get('.flex-row-wrap > :nth-child(1) > .block-row-element > .ng-valid').click().clear().type('Changed by Cypress')
        cy.get('[ng-click="staffCtrl.search()"]').click().wait(2000)
        
        cy.get('.ui-grid-cell-contents').contains("Changed by Cypress").should('not.exist') // Если строка найдена, то значит не удалилась. Что то пошло не так, тест выдаст ошибку
          
    })
})