
// USUÁRIO LOGADO


const usuarioLogadoJSON =
    localStorage.getItem(
        "usuarioLogado"
    );


if (!usuarioLogadoJSON) {

    window.location.href =
        "../index.html";

}


const usuarioLogado =
    JSON.parse(
        usuarioLogadoJSON
    );


const idColaboradorLogado =
    usuarioLogado.id_colaborador;


const idPerfil =
    Number(
        usuarioLogado.id_perfil
    );


if (idPerfil !== 2) {

    window.location.href =
        "../perfil.html";

}



// HEADERS


const headersSupabase = {

    "apikey":
        SUPABASE_KEY,

    "Content-Type":
        "application/json"

};



// ELEMENTOS


const topoNome =
    document.getElementById(
        "topo-nome"
    );


const usuarioAvatar =
    document.getElementById(
        "usuario-avatar"
    );


const perfilAvatar =
    document.getElementById(
        "perfil-avatar"
    );


const perfilNome =
    document.getElementById(
        "perfil-nome"
    );


const perfilCargo =
    document.getElementById(
        "perfil-cargo"
    );


const perfilSetor =
    document.getElementById(
        "perfil-setor"
    );


const perfilMatricula =
    document.getElementById(
        "perfil-matricula"
    );


const perfilContato =
    document.getElementById(
        "perfil-contato"
    );


const perfilLogin =
    document.getElementById(
        "perfil-login"
    );


const perfilStatus =
    document.getElementById(
        "perfil-status"
    );


const notifColaboradores =
    document.getElementById(
        "notif-colaboradores"
    );


const notifProjetos =
    document.getElementById(
        "notif-projetos"
    );


const notifMatching =
    document.getElementById(
        "notif-matching"
    );


const mensagemPreferencia =
    document.getElementById(
        "mensagem-preferencia"
    );


const botaoSair =
    document.getElementById(
        "botao-sair"
    );



// DADOS


let colaboradorAtual = null;

let cargos = [];

let setores = [];



// AUXILIARES


function obterIniciais(nome) {

    if (!nome) {

        return "RH";

    }


    const partes =
        nome
            .trim()
            .split(/\s+/)
            .filter(Boolean);


    if (
        partes.length === 1
    ) {

        return partes[0]
            .substring(
                0,
                2
            )
            .toUpperCase();

    }


    return (
        partes[0][0] +
        partes[
            partes.length - 1
        ][0]
    ).toUpperCase();

}


function normalizarTexto(texto) {

    return String(
        texto || ""
    )
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .toLowerCase()
        .trim();

}



// BUSCAR CARGO


function buscarCargo(
    idCargo
) {

    const cargo =
        cargos.find(

            function (item) {

                return (
                    Number(
                        item.id_cargo
                    ) ===
                    Number(
                        idCargo
                    )
                );

            }

        );


    return cargo
        ? cargo.nome_cargo
        : "Cargo não informado";

}



// BUSCAR SETOR


function buscarSetor(
    idSetor
) {

    const setor =
        setores.find(

            function (item) {

                return (
                    Number(
                        item.id_setor
                    ) ===
                    Number(
                        idSetor
                    )
                );

            }

        );


    return setor
        ? setor.nome_setor
        : "Setor não informado";

}



// CARREGAR COLABORADOR


async function carregarColaborador() {

    const resposta =
        await fetch(

            `${SUPABASE_URL}/colaborador?select=id_colaborador,nome,matricula,contato,status,id_setor,id_cargo&id_colaborador=eq.${idColaboradorLogado}`,

            {

                method:
                    "GET",

                headers:
                    headersSupabase

            }

        );


    if (!resposta.ok) {

        throw new Error(
            "Erro ao carregar dados do RH."
        );

    }


    const dados =
        await resposta.json();


    if (
        dados.length === 0
    ) {

        throw new Error(
            "Colaborador RH não encontrado."
        );

    }


    colaboradorAtual =
        dados[0];

}



// CARGOS


async function carregarCargos() {

    const resposta =
        await fetch(

            `${SUPABASE_URL}/cargo?select=id_cargo,nome_cargo,nivel_hierarquico`,

            {

                method:
                    "GET",

                headers:
                    headersSupabase

            }

        );


    if (!resposta.ok) {

        throw new Error(
            "Erro ao carregar cargos."
        );

    }


    cargos =
        await resposta.json();

}



// SETORES


async function carregarSetores() {

    const resposta =
        await fetch(

            `${SUPABASE_URL}/setor?select=id_setor,nome_setor,ativo`,

            {

                method:
                    "GET",

                headers:
                    headersSupabase

            }

        );


    if (!resposta.ok) {

        throw new Error(
            "Erro ao carregar setores."
        );

    }


    setores =
        await resposta.json();

}



// RENDERIZAR PERFIL


function renderizarPerfil() {

    if (!colaboradorAtual) {

        return;

    }


    const iniciais =
        obterIniciais(
            colaboradorAtual.nome
        );


    topoNome.textContent =
        colaboradorAtual.nome;


    usuarioAvatar.textContent =
        iniciais;


    perfilAvatar.textContent =
        iniciais;


    perfilNome.textContent =
        colaboradorAtual.nome;


    perfilCargo.textContent =
        buscarCargo(
            colaboradorAtual.id_cargo
        );


    perfilSetor.textContent =
        buscarSetor(
            colaboradorAtual.id_setor
        );


    perfilMatricula.textContent =
        colaboradorAtual.matricula ||
        "-";


    perfilContato.textContent =
        colaboradorAtual.contato ||
        "-";


    perfilLogin.textContent =
        usuarioLogado.login ||
        "-";


    const status =
        normalizarTexto(
            colaboradorAtual.status
        );


    if (
        status === "inativo"
    ) {

        perfilStatus.textContent =
            "Inativo";


        perfilStatus.className =
            "status-conta inativo";

    } else {

        perfilStatus.textContent =
            "Ativo";


        perfilStatus.className =
            "status-conta ativo";

    }

}



// PREFERÊNCIAS


function carregarPreferencias() {

    const preferenciasSalvas =
        localStorage.getItem(
            "preferenciasRH"
        );


    if (!preferenciasSalvas) {

        return;

    }


    try {

        const preferencias =
            JSON.parse(
                preferenciasSalvas
            );


        notifColaboradores.checked =
            preferencias.colaboradores !== false;


        notifProjetos.checked =
            preferencias.projetos !== false;


        notifMatching.checked =
            preferencias.matching !== false;


    } catch (erro) {

        console.error(
            "Erro ao carregar preferências:",
            erro
        );

    }

}



// SALVAR PREFERÊNCIAS


function salvarPreferencias() {

    const preferencias = {

        colaboradores:
            notifColaboradores.checked,

        projetos:
            notifProjetos.checked,

        matching:
            notifMatching.checked

    };


    localStorage.setItem(

        "preferenciasRH",

        JSON.stringify(
            preferencias
        )

    );


    mensagemPreferencia.textContent =
        "Preferências salvas.";


    setTimeout(

        function () {

            mensagemPreferencia.textContent =
                "";

        },

        1800

    );

}



// EVENTOS PREFERÊNCIAS


notifColaboradores.addEventListener(

    "change",

    salvarPreferencias

);


notifProjetos.addEventListener(

    "change",

    salvarPreferencias

);


notifMatching.addEventListener(

    "change",

    salvarPreferencias

);



// GERENCIAR CARGOS E SETORES


const novoSetor =
    document.getElementById(
        "novo-setor"
    );

const adicionarSetor =
    document.getElementById(
        "adicionar-setor"
    );

const listaSetores =
    document.getElementById(
        "lista-setores"
    );

const novoCargo =
    document.getElementById(
        "novo-cargo"
    );

const novoCargoNivel =
    document.getElementById(
        "novo-cargo-nivel"
    );

const adicionarCargo =
    document.getElementById(
        "adicionar-cargo"
    );

const listaCargos =
    document.getElementById(
        "lista-cargos"
    );


function escaparHTML(texto) {

    return String(texto || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


function renderizarGerenciamento() {

    if (listaSetores) {

        listaSetores.innerHTML = setores
            .filter(function (setor) {
                return setor.ativo !== false;
            })
            .map(function (setor) {
                return `
                    <div class="item-gerenciamento">
                        <span>${escaparHTML(setor.nome_setor)}</span>
                    </div>
                `;
            })
            .join("");

    }


    if (listaCargos) {

        listaCargos.innerHTML = cargos
            .map(function (cargo) {
                return `
                    <div class="item-gerenciamento">
                        <span>${escaparHTML(cargo.nome_cargo)}</span>
                        <small>Nível ${escaparHTML(cargo.nivel_hierarquico)}</small>
                    </div>
                `;
            })
            .join("");

    }

}


async function cadastrarSetor() {

    const nome = novoSetor.value.trim();

    if (!nome) {
        alert("Informe o nome do setor.");
        novoSetor.focus();
        return;
    }


    adicionarSetor.disabled = true;


    try {

        const resposta = await fetch(
            `${SUPABASE_URL}/setor`,
            {
                method: "POST",
                headers: {
                    ...headersSupabase,
                    "Prefer": "return=representation"
                },
                body: JSON.stringify({
                    nome_setor: nome,
                    ativo: true
                })
            }
        );


        if (!resposta.ok) {
            const mensagem = await resposta.text();
            throw new Error(mensagem);
        }


        novoSetor.value = "";
        await carregarSetores();
        renderizarGerenciamento();

    } catch (erro) {

        console.error("Erro ao cadastrar setor:", erro);
        alert(`Não foi possível cadastrar o setor.\n${erro.message}`);

    } finally {
        adicionarSetor.disabled = false;
    }

}


async function cadastrarCargo() {

    const nome = novoCargo.value.trim();
    const nivel = Number(novoCargoNivel.value);

    if (!nome) {
        alert("Informe o nome do cargo.");
        novoCargo.focus();
        return;
    }


    adicionarCargo.disabled = true;


    try {

        const resposta = await fetch(
            `${SUPABASE_URL}/cargo`,
            {
                method: "POST",
                headers: {
                    ...headersSupabase,
                    "Prefer": "return=representation"
                },
                body: JSON.stringify({
                    nome_cargo: nome,
                    nivel_hierarquico: nivel
                })
            }
        );


        if (!resposta.ok) {
            const mensagem = await resposta.text();
            throw new Error(mensagem);
        }


        novoCargo.value = "";
        novoCargoNivel.value = "2";
        await carregarCargos();
        renderizarGerenciamento();

    } catch (erro) {

        console.error("Erro ao cadastrar cargo:", erro);
        alert(`Não foi possível cadastrar o cargo.\n${erro.message}`);

    } finally {
        adicionarCargo.disabled = false;
    }

}


adicionarSetor.addEventListener(
    "click",
    cadastrarSetor
);


adicionarCargo.addEventListener(
    "click",
    cadastrarCargo
);


novoSetor.addEventListener(
    "keydown",
    function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            cadastrarSetor();
        }
    }
);


novoCargo.addEventListener(
    "keydown",
    function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            cadastrarCargo();
        }
    }
);



// LOGOUT


botaoSair.addEventListener(

    "click",

    function () {

        const confirmar =
            window.confirm(
                "Deseja realmente sair da sua conta?"
            );


        if (!confirmar) {

            return;

        }


        localStorage.removeItem(
            "usuarioLogado"
        );


        window.location.href =
            "../index.html";

    }

);



// INICIAR


async function iniciarPagina() {

    try {

        carregarPreferencias();


        await Promise.all([

            carregarColaborador(),

            carregarCargos(),

            carregarSetores()

        ]);


        renderizarPerfil();
        renderizarGerenciamento();


    } catch (erro) {

        console.error(
            "Erro ao iniciar configurações:",
            erro
        );


        topoNome.textContent =
            "Erro ao carregar";

    }

}


iniciarPagina();