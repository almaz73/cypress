Cypress.on('uncaught:exception', (err, runnable) => {
    alert(err)
    // returning false here prevents Cypress from
    // failing the test
    return false
  })

context('Существование элемента html', function () {
    let site = '192.168.83.53:8080'
    beforeEach(function () {
       // cy.visit(`http://${site}/ambulance`)  
        
        cy.viewport(1280, 720)
        cy.visit('http://' + site + '/ambulance/login')
        cy.get('input[placeholder="Логин"]').type("adminSMP")
        cy.get('input[placeholder="Пароль"]').type("ambulance17")
        cy.contains('Войти').click()
        //cy.title().should('eq', 'СМП 3.0')
        cy.visit('http://' + site + '/ambulance/#/oper-situation')
    })

    

   /* it('first', function () {

        let zzz = Cypress.$('[plac77eholder="Логин"]')

        cy.log(zzz.length)

       // cy.get("body").then($body => {
       //     cy.find('')
       // })

        cy.get('[placeholder="Ло888гин"]').should('not.exist')

        if (Cypress.$('[placeholder="Логин"]').length) {
            cy.get('[placeholder="Логин"]').type('adminSMP')
        }


        cy.get('[placeholder="Пароль"]').type('ambulance17')
    })*/

    it('2222', function(){
        /*cy.wait('@OO').then(function(rrr){
            cy.log('rrr', rrr)
        })*/
    })
})