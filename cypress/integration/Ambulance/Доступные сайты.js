describe('Доступность сайтов', () => {
    [
        
        
        { name: '192.168.83.53:8080 (Тест - Калининград)', link: '192.168.83.53:8080' },
        
        { name: '192.168.83.53:5080 (Тест - Татарстан)', link: '192.168.83.53:5080' },
        { name: '192.168.83.53:4080 (Тест - Кемерово)', link: '192.168.83.53:4080' },

        { name: '192.168.92.80:8080 (Чувашия)', link: '192.168.92.80:8080' },
        { name: '192.168.92.80:28080 (Тест - Чувашия)', link: '192.168.92.80:28080' },
        { name: '192.168.83.53:6080 (Тест - Чувашия)', link: '192.168.83.53:6080' },
     

        { name: '192.168.83.53:7080 (Тест - Курск)', link: '192.168.83.53:7080' },

        { name: 'prime:42080 (Тест Татарстан)', link: 'prime:42080' },
        { name: 'prime:40080 (Татарстан)', link: 'prime:40080' },

        { name: '192.168.83.138:8080 (Якутия)', link: '192.168.83.138:8080' },
        { name: '192.168.83.138:28081 (Тест - Якутия)', link: '192.168.83.138:28081' },
 
        { name: '192.168.83.198:50280 (Тест - Кострома)', link: '192.168.83.198:50280' },
        { name: '192.168.83.53:3080 (Тест2 - Кострома)', link: '192.168.83.53:3080' },  

        { name: '192.168.83.120:38080 (Кемерово)', link: '192.168.83.120:38080' }, 
        { name: '192.168.83.120:28080 (Тест - Кемерова)', link: '192.168.83.120:28080' },
        { name: '192.168.83.120:48080 (Тест2 - Кемерова)', link: '192.168.83.120:48080' }
      

    ].forEach(element => {
        it(element.name, () => {
            cy.request('http://' + element.link + '/ambulance/login')
                .its('body')
                .should('include', '<title>')
                .and('include', 'Вход в систему')
                .and('include', '</html>')

        })
    });
})
