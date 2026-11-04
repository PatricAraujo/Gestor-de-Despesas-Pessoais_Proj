//login 
const formLogin = document.getElementById('formLogin');
const loginBtn = document.querySelector('#btn-login-modal');
const loginMsg = document.querySelector('#user-name');
//tema
const modoPage = document.getElementById('btn-tema');
const iTema = document.getElementById('icon-tema');
//tempo
const tempo = document.getElementById('tempo-txt');
const dataHora = document.getElementById('data-hora');
//formulario
const formHtml = document.getElementById('formDespesa');



// Funções
// LOGIN
function checkUsuario() {
    const user = localStorage.getItem('user');
    console.log("checkUsuario user:", user);

    // Se já tiver sessão
    if (user) {
        loginMsg.textContent = "Olá, " + user;
        console.log(loginMsg.textContent);

        // Muda a aparencia do botão 'login' pra 'logout'
        loginBtn.textContent = "Logout";
        loginBtn.classList.remove('btn-outline-success');
        loginBtn.classList.add('btn-danger');

        // Remove os atributos do modal para o clique fazer o logout limpo
        loginBtn.removeAttribute('data-bs-toggle');
        loginBtn.removeAttribute('data-bs-target');
    }
    // Se não tiver logado
    else {
        loginMsg.textContent = "Olá, Utilizador";
        console.log(loginMsg.textContent);

        loginBtn.textContent = "Login";
        loginBtn.classList.remove('btn-danger');
        loginBtn.classList.add('btn-outline-success');

        // Devolve os atributos para o modal de login funcionar novamente
        loginBtn.setAttribute('data-bs-toggle', 'modal');
        loginBtn.setAttribute('data-bs-target', '#loginModal');
    }
}

// MODO LIGHT - DARK
modoPage.addEventListener('click', function () {

    let tag = document.documentElement;
    console.log(tag);
    let temaAtual = tag.getAttribute("data-bs-theme");
    console.log(temaAtual);

    if (temaAtual === "light" || !temaAtual) {

        tag.setAttribute('data-bs-theme', 'dark');
        iTema.classList.remove('fa-moon');
        iTema.classList.add('fa-sun');
    }
    else {
        tag.setAttribute('data-bs-theme', 'light');
        iTema.classList.remove('fa-sun');
        iTema.classList.add('fa-moon');
    }
})

// DATA HORA
function diaDataHora() {

    const datenow = new Date();
    // console.log(datenow);

    const dia = datenow.getDate();
    // console.log(dia);
    const mes = datenow.getMonth() + 1;
    // console.log(mes);
    const ano = datenow.getFullYear();
    // console.log(ano);
    const horas = datenow.getHours();
    // console.log(horas);
    const min = datenow.getMinutes();
    // console.log(min);

    // procurei no google um jeito de mostrar 2 casas em mim e hora...
    const diaNow = dia < 10 ? '0' + dia : dia;
    const mesNow = mes < 10 ? '0' + mes : mes;
    const horaNow = horas < 10 ? '0' + horas : horas;
    const minNow = min < 10 ? '0' + min : min;

    const diaDataHoraAtual = diaNow + '/' + mesNow + '/' + ano + ' - ' + horaNow + ':' + minNow;
    // console.log(diaDataHoraAtual);
    if (dataHora) {
        dataHora.textContent = diaDataHoraAtual;
    }

}

//CLIMA
async function buscarClima() {

    //api (integração Open-Meteo do tempo)
    const url = `https://api.open-meteo.com/v1/forecast?latitude=38.7167&longitude=-9.1333&current_weather=true`;

    //junto com async só correr o codigo se obtiver resposta
    const respostaAPI = await fetch(url);
    const data = await respostaAPI.json();
    console.log(data);
    console.log(data.current_weather);

    if (data && data.current_weather) {
        const temperatura = data.current_weather.temperature;
        tempo.textContent = temperatura + '°C';
        console.log(tempo.textContent)
    }
    else {
        tempo.textContent = "Indisponível";
    }
}

//FUNCIONALIDADE
if (formHtml) {
    formHtml.addEventListener('submit', function (event) {
        event.preventDefault();
        
        const formData = new FormData(this);
        const descricao = formData.get('descricao');        
        const valorString = formData.get('valor');        
        const categoria = formData.get('categoria');        

        if(descricao === "" || valorString === "" || categoria === ""){
            alert("Por favor, preenche todos os campos.");
            return;//sai do if
        }
        const valor = parseFloat(valorString);
        console.log(descricao);
        console.log(valor);
        console.log(categoria);

        //criar um objeto com os dados pra guardar no localstorange
        const movimento = {
            id:Date.now(),
            descricao: descricao,
            valor: valor,
            categoria: categoria
        };
        console.log(movimento);
        const JsonString = JSON.stringify(movimento);
        console.log('JSON STRING: ' + JsonString);
        localStorage.setItem('movimentos', JsonString);
        formHtml.reset();
    })
}

// Eventos

if (formLogin) {
    formLogin.addEventListener('submit', function (e) {
        e.preventDefault();

        const dataLogin = new FormData(this);
        const userN = dataLogin.get('inputNome');
        console.log(userN);

        if (userN) {
            localStorage.setItem('user', userN);
            window.location.reload();
        }
    })
}

if (loginBtn) {
    loginBtn.addEventListener('click', function () {
        console.log("testando o click do botaologin");

        // Se já estiver logado, ao clicar limpa a sessão e recarrega
        if (localStorage.getItem('user')) {
            console.log("Fazendo logout, limpando localStorage...");
            localStorage.removeItem('user');
            window.location.reload();
        }
    })
}


checkUsuario();
diaDataHora();
setInterval(diaDataHora, 1000);
buscarClima();
setInterval(buscarClima, 600000);