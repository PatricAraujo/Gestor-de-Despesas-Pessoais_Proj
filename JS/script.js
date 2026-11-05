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
//tabela
const tBody = document.getElementById('lista-corpo');
//Categorias
let categoriaAtual = "todas";
let idEdicao = null;


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
    let temaStorage = "";

    console.log(temaAtual);

    if (temaAtual === "light" || !temaAtual) {

        tag.setAttribute('data-bs-theme', 'dark');
        iTema.classList.remove('fa-moon');
        iTema.classList.add('fa-sun');
        temaStorage = "dark";
    }
    else {
        tag.setAttribute('data-bs-theme', 'light');
        iTema.classList.remove('fa-sun');
        iTema.classList.add('fa-moon');
        temaStorage = "light";
    }
    localStorage.setItem('tema', temaStorage);
})

//CARREGAR TEMA
function carregarTema(){
    const temaSalvo = localStorage.getItem('tema');
    //vai la buscar a raiz HTML
    let tag = document.documentElement;

    //se tiver tema no storage
    if (temaSalvo) {
        //aplica o tema guardado
        tag.setAttribute('data-bs-theme', temaSalvo);

        //ajusta o ícone corretamente de acordo com o tema salvo
        if (temaSalvo === 'dark') {
            iTema.classList.remove('fa-moon');
            iTema.classList.add('fa-sun');
        } else {
            iTema.classList.remove('fa-sun');
            iTema.classList.add('fa-moon');
        }
    }
}

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

    //a funcao async pq vai fazer um pedido externoe o await faz esperar uns milisegundos pra obter resposta
    const respostaAPI = await fetch(url);
    //converto a resposta num objeto json
    const data = await respostaAPI.json();
    console.log(data);
    console.log(data.current_weather);

    //validar antes de mexer no html diretamente
    if (data && data.current_weather) {
        const temperatura = data.current_weather.temperature;
        tempo.textContent = temperatura + '°C';
        console.log(tempo.textContent)
    }
    else {
        tempo.textContent = "Indisponível";
    }
}

//ATUALIZAR RESUMOS
function atualizarResumos() {
    let dados = localStorage.getItem('movimentos');

    let totalReceitas = 0;
    let totalDespesas = 0;
    let saldoTotal = 0;


    // verificar se existem dados
    if (dados) {
        //converter as strings em um array de objetos
        let movimentos = JSON.parse(dados);
        // console.log("linha de dados dos mov: ")
        // console.log(movimentos);

        // Percorrer o array de movimentos
        for (let contaMov = 0; contaMov < movimentos.length; contaMov++) {
            let item = movimentos[contaMov];
            let valorMovimento = parseFloat(item.valor);

            //verifica se deve somar nos resumos
            let deveSomarNoResumo = false;

            //se o filtro ativo for uma das 3, o resumo fica padrão
            if (categoriaAtual === "todas" || categoriaAtual === "receitas-geral" || categoriaAtual === "despesas-geral") {
                deveSomarNoResumo = true;
            } 
            //se for uma categoria específica, filtra o resumo só para essa categoria
            else if (item.categoria === categoriaAtual) {
                deveSomarNoResumo = true;
            }

            //se passou na regra do resumo, soma os valores
            if (deveSomarNoResumo) {
                if (item.tipo === "receita") {
                    totalReceitas = totalReceitas + valorMovimento;
                } 
                else if (item.tipo === "despesa") {
                    totalDespesas = totalDespesas + valorMovimento;
                }
            }
        } // fim do for

    }//fim do if

    // calcular o saldo final receitas - despesas
    saldoTotal = totalReceitas - totalDespesas;

    //atualizar os campos
    let valorReceitas = document.getElementById('total-receitas');
    let valorDespesas = document.getElementById('total-despesas');
    let valorSaldo = document.getElementById('saldo-total');

    valorReceitas.innerHTML = totalReceitas.toFixed(2) + ' €';
    valorDespesas.innerHTML = totalDespesas.toFixed(2) + ' €';
    valorSaldo.innerHTML = saldoTotal.toFixed(2) + ' €';

}//fim da funcao atualizarResumos


//TABELA

// VALIDACAO E TRATAMENTO + GRAVACAO
formHtml.addEventListener("submit", function (event) {
    // previne o reload da página
    event.preventDefault();

    let campoDescricao = document.getElementById('descricao');
    let campoValor = document.getElementById('valor');
    let selectCategoria = document.getElementById('categoria');
    let selectTipo = document.getElementById('tipo');

    let descricao = campoDescricao.value.trim();
    let valor = parseFloat(campoValor.value);
    let categoria = selectCategoria.value;
    let tipo = selectTipo.value;

    //validação da descrição
    if (descricao === "") {
        alert("Por favor, insira uma descrição.");
        campoDescricao.focus();
        return; // Sai da função e não grava nada
    }

    //só aceita se for um numero e maior = a 0
    if (isNaN(valor) || valor <= 0) {
        alert("Por favor, insere um valor válido maior que zero.");
        campoValor.focus();
        return; // Sai da função e não grava nada
    }

    //se a categoria n tiver valor ou padrao entao alert
    if (categoria === "" || categoria === "Escolha...") {
        alert("Por favor, seleciona uma categoria.");
        selectCategoria.focus();
        return; // Sai da função e não grava nada
    }

    //FUNCIONALIDADE GRAVAR

    // Procurar se existe algo guardado anteriormente
    let listaMovimentos = [];
    const dadosAntigos = localStorage.getItem('movimentos');

    if (dadosAntigos !== null) {
        listaMovimentos = JSON.parse(dadosAntigos);
    }
    //verifica se o que estamos a gravar é um item novo ou um item em edição
    // se for item de edicao, vamos atualizar
    if (idEdicao !== null) {
        //percorro o array listaMovimentos e coloco os valores "editados"
        for (let i = 0; i < listaMovimentos.length; i++) {
            if (listaMovimentos[i].id === idEdicao) {
                listaMovimentos[i].descricao = descricao;
                listaMovimentos[i].valor = valor;
                listaMovimentos[i].categoria = categoria;
                listaMovimentos[i].tipo = tipo;
                break;
            }
        }
        // volto a deixar a var de edicao null.
        idEdicao = null;
    }
    else {
        // caso contrário, é um novo registo, entao faz push normalmente
        const movimento = {
            id: Date.now(),
            descricao: descricao,
            valor: valor,
            categoria: categoria,
            tipo: tipo
        };
        listaMovimentos.push(movimento);
    }

    // Guardar no localStorage com a chave "movimentos"
    localStorage.setItem('movimentos', JSON.stringify(listaMovimentos));

    // Limpar o formulário e atualizar a tabela/resumos
    formHtml.reset();
    atualizarTabela();
});

//ATUALIZA TABELA USANDO DADOS NO LOCALSTORAGE
function atualizarTabela() {

    // fiz essa var para acumular linhas, fazer como pu
    let linhasHtml = "";

    //buscar pela chave que guardei no "FUNCIONALIDADE"
    let dados = localStorage.getItem('movimentos');
    // console.log("inicio do atualiza Tabela:" + dados);
    //verifica se há algo guardado
    if (dados) {
        const dataForm = JSON.parse(dados);
        // console.log("como que foi convertido o JSON?" + dataForm);

        //tive q limpar a tabela e redesenhar pq tava aparecendo
        //duplicado quando adicionava itens
        tBody.innerHTML = "";

        //percorrer o array de movimentos
        for (let contaMov = 0; contaMov < dataForm.length; contaMov++) {
            const item = dataForm[contaMov];

            //decide o que vai ser filtrado na tabela
            let filtroEscreverTabela = false;

            //se a categora for "todas" entao exibe tudo
            if (categoriaAtual === "todas") {
                filtroEscreverTabela = true;
            }
            //se a categoria for receitas geral e o tipo do select for receita entao lista na tabela
            else if (categoriaAtual === "receitas-geral" && item.tipo === "receita") {
                filtroEscreverTabela = true;
            }
            //se a categoria for despesas geral e o tipo do select for despesas entao lista na tabela
            else if (categoriaAtual === "despesas-geral" && item.tipo === "despesa") {
                filtroEscreverTabela = true;
            }
            //lista se for uma das categorias da barra lateral
            else if (item.categoria === categoriaAtual) {
                filtroEscreverTabela = true;
            }

            //depois de validado, escreve as linhas da tabela
            if (filtroEscreverTabela) {
                // criar as var das "colunas"
                let colDescricao = "<td>" + item.descricao + "</td>";
                let colCategoria = "<td>" + item.categoria + "</td>";
                let colTipo = "<td>" + item.tipo + "</td>";
                let colValor = "<td>" + item.valor + "</td>";

                let colAcoes = "<td class='text-end'>" +
                    "<button data-id='" + item.id + "' class='btn btn-sm btn-warning me-1'>Editar</button>" +
                    "<button data-id='" + item.id + "' class='btn btn-sm btn-danger'>Apagar</button>" +
                    "</td>";

                let linha = "<tr>" + colDescricao + colCategoria + colTipo + colValor + colAcoes + "</tr>";
                linhasHtml = linhasHtml + linha;
            } // fim do if passaFiltro
        }//fim do for
    }//fim do if
    tBody.innerHTML = linhasHtml;
    atualizarResumos();
}

//APAGAR DADOS DA TABELA
function apagarMovimento(id) {
    let dados = localStorage.getItem('movimentos');

    if (dados) {
        let dataForm = JSON.parse(dados);
        let newList = [];
        console.log(dataForm + " funcao apagar")

        for (let contaMov = 0; contaMov < dataForm.length; contaMov++) {
            //compara o id do item que clicou até encontrar
            if (dataForm[contaMov].id !== id) {
                //vai conter todos mov menos o ID que "apagou"
                newList.push(dataForm[contaMov]);
            }

        }//fim do for

        //atualiza o localstorage
        const JsonString = JSON.stringify(newList);
        console.log('JSON STRING: ' + JsonString);
        //guardar o formulario com a chave "movimentos"
        localStorage.setItem('movimentos', JsonString);
        atualizarTabela();

    }//fim do if
}//fim da funcao apagarMovimento

//EDITAR DADOS DA TABELA
function editarMov(id) {
    let dados = localStorage.getItem('movimentos');

    if (dados) {
        let movimentos = JSON.parse(dados);

        //percorre o array movimentos
        for (let i = 0; i < movimentos.length; i++) {

            //se o id for igual ao selecionado no editar
            if (movimentos[i].id === id) {
                // entao preenche os inputs do formulário com os dados atuais do item
                let desc = document.getElementById('descricao');
                let val = document.getElementById('valor');
                let cat = document.getElementById('categoria');
                let type = document.getElementById('tipo');

                desc.value = movimentos[i].descricao;
                val.value = movimentos[i].valor;
                cat.value = movimentos[i].categoria;
                type.value = movimentos[i].tipo;


                // Define o ID em edição
                idEdicao = id;
                break;
            }
        }
    }

}




//CATEGORIAS

//vou pegar todos os botoes do aside dentro da categoria
let categorias = document.querySelectorAll("#categorias-list button");

//percorrer os botoes da cetegoria
for (let contaBtn = 0; contaBtn < categorias.length; contaBtn++) {
    categorias[contaBtn].addEventListener('click', function () {

        //vou remover a classe active dos botoes antigo e manter só do botao selecionado
        for (let i = 0; i < categorias.length; i++) {
            categorias[i].classList.remove('active');
        }
        this.classList.add('active');

        //capturar o valor do atributo do botão clicado
        categoriaAtual = this.getAttribute('data-categoria');
        console.log('categoria atual : ' + categoriaAtual);

        //atualiza o valor do badge depois de clicar na categoria
        let badgeFiltro = document.getElementById('filtro-ativo-badge');
        // console.log(badgeFiltro);

        if (badgeFiltro) {
            //se for "todas", mostra "Categoria: Todas"
            if (categoriaAtual === "todas") {
                badgeFiltro.textContent = "Categoria: Todas";
            }
            //senão mostra o nome da categoria selecionada
            else {
                badgeFiltro.textContent = "Categoria: " + categoriaAtual;
            }
        }
        atualizarTabela();

    });

}//fim do for categoria


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

//EVENTOS RELACIONADOS AOS BOTOES DA TABELA
tBody.addEventListener('click', function (event) {

    //verificar se apertou o botao apagar
    if (event.target.classList.contains('btn-danger')) {

        const idMov = parseInt(event.target.getAttribute('data-id'));
        console.log("id do movimento é: " + idMov);
        apagarMovimento(idMov);
    }

    // Verificar se apertou o botão editar
    if (event.target.classList.contains('btn-warning')) {
        const idMov = parseInt(event.target.getAttribute('data-id'));
        editarMov(idMov);
    }
});



//funcoes
carregarTema();
atualizarTabela();
atualizarResumos();
checkUsuario();
diaDataHora();
setInterval(diaDataHora, 1000);//cada 1 seg 
buscarClima();
setInterval(buscarClima, 600000);// cada 10 min 