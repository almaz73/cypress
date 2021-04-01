describe('Доступность сайтов', () => {
    [
        { name: '192.168.83.53:3080 (Тест - Мурманск)', link: '192.168.83.53:3080' },
        { name: '192.168.92.80:28080 (Тест - Чувашия)', link: '192.168.92.80:28080' },
        { name: '192.168.92.80:8080 (Чувашия)', link: '192.168.92.80:8080' },
        { name: '192.168.83.53:7080 (Тесто - Курск)', link: '192.168.83.53:7080' },
        { name: 'prime:42080 (Тестовый Казань)', link: 'prime:42080' },
        { name: 'prime:40080 (Казань)', link: 'prime:40080' },
        { name: '192.168.83.138:8080 (Якутия)', link: '192.168.83.138:8080' },
        { name: '192.168.83.53:5080 (Тест2 - Чувашия)', link: '192.168.83.53:5080' },
        { name: '192.168.83.198:50280 (Тест - Кострома)', link: '192.168.83.198:50280' },
        { name: '192.168.83.120:28080 (Тест - Кемерова)', link: '192.168.83.120:28080' }

    ].forEach(element => {
        it(element.name, () => {
            /*var ImageObject = new Image();
            ImageObject.src = "http://" + element.link + "/ambulance/resources/img/systemL.png?cachebreaker="+new Date().getTime();
            
            if (ImageObject.height > 0) {
                cy.log("Ping worked!");
            } else {
                cy.log("Ping failed :(");
            }*/

            // старый медленный подход
            /*cy.visit('http://' + element.link + '/ambulance/login')
                .title().should('eq', 'Вход в систему')*/ 

            cy.request('http://' + element.link + '/ambulance/login')
                .its('body')
                .should('include', '<title>')
                .and('include', 'Вход в систему')
                .and('include', '</html>')

        })
    });
})
