//const { debug } = require("console")

let site = '192.168.83.53:6080'

Cypress.on('uncaught:exception', (err, runnable) => {
    //alert(err)
    // returning false here prevents Cypress from
    // failing the test
    cy.log("========", err)
    return false
})



context('Амибулансе', () => {
    beforeEach(() => {
        // авторизация
        cy.viewport(1280, 720)
        cy.visit('http://' + site + '/ambulance/login')
        cy.get('input[placeholder="Логин"]').type("adminSMP").should('have.value', 'adminSMP')
        cy.get('input[placeholder="Пароль"]').type("ambulance17")
        cy.contains('Войти').click()
        cy.title().should('eq', 'СМП 3.0')
    })

    beforeEach(() => {
        cy.visit('http://' + site + '/ambulance/#/callcard/') // перехожу на "Новый КТ"
    })

    it('Создание вызова', () => {

        //if (['192.168.83.53:6080'].includes(site)) 
     //   cy.get('body').then((body) => {
      //      if (Cypress.$('.modal-dialog').length) {
             //   cy.get('.modal-dialog').then(ress => {
            //        console.log('ress', ress);
                    cy.get('.modal-dialog').contains('[title="Скорая/неотложная помощь"]').then(modal => {
                        console.log('91919191919919191919191',);
                        cy.get('.modal-content button').then(div => {
                            cy.log(' = = =  =div', div)
                            if (div) { // Если выскакивает окно "Признак вызова", закрывает по кнопке Далее 
                                cy.get('.modal-content button').contains('Далее').click()
                            }
                        })
                    })
           //     })
       //     }
      //  })

/*
        cy.get('chosen[ng-model="call.spnp.reasonType"]').click() // нажимаю на комбобокс повод
            .then(() => {
                cy.get('chosen[ng-model="call.spnp.reasonType"]').contains('падение с высоты').click() //выбираю повод "падение с высоты"
            })
        cy.get('call-place [ng-model="$parent.callPlace"]').click() // нажимаю Тип места вызова
        cy.get('call-place [ng-model="$parent.callPlace"] li:first').click() // выбираю первый элемент

        cy.get('call-place [ng-model="address.cityAddress.mo"]').click() // выбираю МО места вызова
            .then(() => {
                cy.get('call-place [ng-model="address.cityAddress.mo"] li:first').click() // выбираю первый элемент
            })
        cy.get('button').contains('Сохранить').click(); // нажимаю сохранить вызов


       



        console.log('Пожалуйста, выберите зону',);

        cy.get('.modal-dialog').contains('Пожалуйста, выберите зону').then(modal => {
            if (modal) {
                cy.get('[ng-model="call.zoneId"]').click()
                    .then(() => {
                        cy.get('[ng-model="call.zoneId"] li:first').click()
                        cy.get('.modal-dialog').contains('Выбрать').click()
                    })
            }
        })





        cy.get('body').then((body) => {
            if (body.find('.modal-dialog').length > 0) {


                cy.get('.modal-dialog').contains('Выберите повторный и/или задвоенный вызов').then(modal => {
                    if (modal) {
                        cy.get('.modal-dialog').contains('Продолжить').click()
                    }
                })
            }
        })


        cy.get('body').then((body) => {
            if (body.find('.modal-dialog').length > 0) {

                cy.get('.modal-dialog').contains('Событие').then(modal => {

                    if (modal) {
                        cy.get('[ng-model="ctrl.ev.eventScaleId"]').click()
                            .then(() => {
                                cy.get('[ng-model="ctrl.ev.eventScaleId"] li:first').click()
                                cy.get('.modal-dialog').contains('Сохранить').click()
                            })
                    }
                })

            }
        })


        //cy.get('.modal-dialog button').contains('Продолжить').click()


        cy.hash().should('match', /\d+/)

        */
    })

})







