
// CONFIGURAÇÕES - SKILLMATCH




// USUÁRIO LOGADO


const usuarioSalvo =
    localStorage.getItem("usuarioLogado");


if (!usuarioSalvo) {

    window.location.href =
        "index.html";

}


const usuarioLogado =
    usuarioSalvo
        ? JSON.parse(usuarioSalvo)
        : null;


const idColaborador =
    usuarioLogado
        ? usuarioLogado.id_colaborador
        : null;



// CONFIGURAÇÃO SUPABASE


const headersSupabase = {

    "apikey": SUPABASE_KEY,

    "Content-Type": "application/json"

};



// ELEMENTOS


const topoNome =
    document.getElementById(
        "topo-nome"
    );


const configEmail =
    document.getElementById(
        "config-email"
    );


const botaoSair =
    document.getElementById(
        "botao-sair"
    );


const botaoAlterarSenha =
    document.getElementById(
        "alterar-senha"
    );


const notificacaoPerfil =
    document.getElementById(
        "notificacao-perfil"
    );


const notificacaoCursos =
    document.getElementById(
        "notificacao-cursos"
    );


const notificacaoProjetos =
    document.getElementById(
        "notificacao-projetos"
    );



// CARREGAR DADOS DA CONTA


async function carregarConfiguracoes() {

    try {

        if (
            !usuarioLogado ||
            !idColaborador
        ) {

            window.location.href =
                "index.html";

            return;

        }


        
        // LOGIN / E-MAIL
        

        if (configEmail) {

            configEmail.textContent =
                usuarioLogado.login || "-";

        }


        
        // BUSCAR COLABORADOR
        

        const resposta =
            await fetch(

                `${SUPABASE_URL}/colaborador?select=nome&id_colaborador=eq.${idColaborador}`,

                {
                    method: "GET",

                    headers:
                        headersSupabase
                }

            );


        if (!resposta.ok) {

            const mensagem =
                await resposta.text();


            console.error(
                "Erro Supabase:",
                mensagem
            );


            throw new Error(
                "Erro ao buscar colaborador."
            );

        }


        const colaboradores =
            await resposta.json();


        if (
            colaboradores.length === 0
        ) {

            console.error(
                "Colaborador não encontrado."
            );

            return;

        }


        const colaborador =
            colaboradores[0];


        
        // NOME
        

        if (topoNome) {

            topoNome.textContent =
                colaborador.nome;

        }


    } catch (erro) {

        console.error(
            "Erro ao carregar configurações:",
            erro
        );

    }

}



// NOTIFICAÇÕES
// SALVAR NO NAVEGADOR


function carregarPreferencias() {

    const preferenciasSalvas =
        localStorage.getItem(
            `preferencias_${idColaborador}`
        );


    if (!preferenciasSalvas) {

        return;

    }


    try {

        const preferencias =
            JSON.parse(
                preferenciasSalvas
            );


        if (notificacaoPerfil) {

            notificacaoPerfil.checked =
                preferencias.perfil
                ?? true;

        }


        if (notificacaoCursos) {

            notificacaoCursos.checked =
                preferencias.cursos
                ?? true;

        }


        if (notificacaoProjetos) {

            notificacaoProjetos.checked =
                preferencias.projetos
                ?? true;

        }


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

        perfil:
            notificacaoPerfil
                ? notificacaoPerfil.checked
                : true,

        cursos:
            notificacaoCursos
                ? notificacaoCursos.checked
                : true,

        projetos:
            notificacaoProjetos
                ? notificacaoProjetos.checked
                : true

    };


    localStorage.setItem(

        `preferencias_${idColaborador}`,

        JSON.stringify(
            preferencias
        )

    );

}



// EVENTOS DAS NOTIFICAÇÕES


if (notificacaoPerfil) {

    notificacaoPerfil.addEventListener(
        "change",
        salvarPreferencias
    );

}


if (notificacaoCursos) {

    notificacaoCursos.addEventListener(
        "change",
        salvarPreferencias
    );

}


if (notificacaoProjetos) {

    notificacaoProjetos.addEventListener(
        "change",
        salvarPreferencias
    );

}



// ALTERAR SENHA


if (botaoAlterarSenha) {

    botaoAlterarSenha.addEventListener(
        "click",
        function () {

            alert(
                "A alteração de senha será implementada futuramente."
            );

        }
    );

}



// SAIR DA CONTA


if (botaoSair) {

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


            
            // REMOVER SESSÃO
            

            localStorage.removeItem(
                "usuarioLogado"
            );


            sessionStorage.removeItem(
                "usuarioLogado"
            );


            
            // VOLTAR AO LOGIN
            

            window.location.href =
                "index.html";

        }
    );

}



// INICIAR


async function iniciarConfiguracoes() {

    if (!idColaborador) {

        window.location.href =
            "index.html";

        return;

    }


    await carregarConfiguracoes();

    carregarPreferencias();


    console.log(
        "Configurações carregadas."
    );

}


iniciarConfiguracoes();