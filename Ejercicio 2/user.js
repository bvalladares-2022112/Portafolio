/*
//CALLBACK
function getUsersWithCallbacks(callback) {
    fetch('https://randomuser.me/api/') //Consulta o busqueda
        .then(response => response.json()) //Traducir el json
        .then(data => {
            const { results } = data
            callback(null, results)
        })
        .catch(error => {
            console.error(error)
            callback(error, null)
        })
}

getUsersWithCallbacks((error, results)=>{
    if(error) console.error(error)
    const name = document.getElementById('name')
    const surname = document.getElementById('surname')
    const phone = document.getElementById('phone')
    for (const user of results) {
        name.innerText = user.name.first
        surname.innerText = user.name.last
        phone.innerText = user.phone
    }
})
*/

/*
//Promise
const getUsersWithPromise = () => {
    return new Promise((resolve, reject) => {
        fetch('https://randomuser.me/api/')
        .then(response => response.json())
        then(data => {  
            const {results} = data
            resolve(results)
        })
        .catch(error => reject(error))
    })
}

getUsersWithPromise()
    .then(results => {
        const name = document.getElementById('name')
        const surname = document.getElementById('surname')
        const phone = document.getElementById('phone')
        for(const user of results){
            name.innerText = user.name.first
            surname.innerText = user.name.last
            phone.innerText = user.phone
        }
    })
    .catch(error => console.error(error))
*/

//Async / Await
const getUserWithAsync = async () => {
    try {
        const response = await fetch('https://randomuser.me/api/?results=10')
        const { results } = await response.json()
        const users = document.getElementById('users')
        for (const user of results) {
            users.innerHTML += `
                <tr>
                    <td>${user.name.first}</td>
                    <td>${user.name.last}</td>
                    <td>${user.phone}</td>
                </tr>
            `
        }
    } catch (error) {
        console.error(error)
    }
}

getUserWithAsync()