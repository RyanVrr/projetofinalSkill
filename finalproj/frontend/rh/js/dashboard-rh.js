
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


const idColaborador =
    usuarioLogado.id_colaborador;


const idPerfil =
    Number(
        usuarioLogado.id_perfil
    );



// PROTEÇÃO DA ÁREA RH


if (idPerfil !== 2) {

    window.location.href =
        "../perfil.html";

}



// HEADERS SUPABASE


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


const nomeBoasVindas =
    document.getElementById(
        "nome-boas-vindas"
    );


const usuarioAvatar =
    document.getElementById(
        "usuario-avatar"
    );


const totalColaboradores =
    document.getElementById(
        "total-colaboradores"
    );


const totalProjetosAtivos =
    document.getElementById(
        "total-projetos-ativos"
    );


const totalProjetosConcluidos =
    document.getElementById(
        "total-projetos-concluidos"
    );


const totalHabilidades =
    document.getElementById(
        "total-habilidades"
    );


const listaHabilidades =
    document.getElementById(
        "lista-habilidades"
    );


const tabelaProjetos =
    document.getElementById(
        "tabela-projetos"
    );



// ESCAPAR HTML


function escaparHTML(valor) {

    if (
        valor === null ||
        valor === undefined
    ) {

        return "";

    }


    return String(valor)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}



// FORMATAR DATA


function formatarData(data) {

    if (!data) {

        return "-";

    }


    const partes =
        data.split("-");


    if (partes.length !== 3) {

        return data;

    }


    return (
        `${partes[2]}/${partes[1]}/${partes[0]}`
    );

}



// DATA ATUAL


function obterDataAtual() {

    const agora =
        new Date();


    const ano =
        agora.getFullYear();


    const mes =
        String(
            agora.getMonth() + 1
        )
        .padStart(
            2,
            "0"
        );


    const dia =
        String(
            agora.getDate()
        )
        .padStart(
            2,
            "0"
        );


    return (
        `${ano}-${mes}-${dia}`
    );

}



// INICIAIS


function obterIniciais(nome) {

    if (!nome) {

        return "RH";

    }


    const partes =
        nome
            .trim()
            .split(/\s+/)
            .filter(Boolean);


    if (partes.length === 1) {

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



// CARREGAR USUÁRIO RH


async function carregarUsuario() {

    try {

        const resposta =
            await fetch(

                `${SUPABASE_URL}/colaborador?select=id_colaborador,nome&id_colaborador=eq.${idColaborador}`,

                {

                    method: "GET",

                    headers:
                        headersSupabase

                }

            );


        if (!resposta.ok) {

            throw new Error(
                "Erro ao buscar colaborador."
            );

        }


        const dados =
            await resposta.json();


        if (dados.length === 0) {

            topoNome.textContent =
                "Usuário RH";


            nomeBoasVindas.textContent =
                "RH";


            return;

        }


        const colaborador =
            dados[0];


        topoNome.textContent =
            colaborador.nome;


        nomeBoasVindas.textContent =
            colaborador.nome;


        usuarioAvatar.textContent =
            obterIniciais(
                colaborador.nome
            );


    } catch (erro) {

        console.error(
            "Erro ao carregar usuário:",
            erro
        );


        topoNome.textContent =
            "Usuário RH";

    }

}



// TOTAL DE COLABORADORES
// SOMENTE PERFIL 1


async function carregarTotalColaboradores() {

    try {

        // Busca todos os usuários
        const respostaUsuarios =
            await fetch(

                `${SUPABASE_URL}/usuario?select=id_colaborador,id_perfil`,

                {

                    method: "GET",

                    headers:
                        headersSupabase

                }

            );


        if (!respostaUsuarios.ok) {

            throw new Error(
                "Erro ao buscar usuários."
            );

        }


        const usuarios =
            await respostaUsuarios.json();


        // Filtra somente funcionários
        const usuariosFuncionarios =
            usuarios.filter(

                function (usuario) {

                    return (
                        Number(
                            usuario.id_perfil
                        ) === 1
                    );

                }

            );


        // IDs dos colaboradores que são funcionários
        const idsFuncionarios =
            usuariosFuncionarios.map(

                function (usuario) {

                    return Number(
                        usuario.id_colaborador
                    );

                }

            );


        // Busca colaboradores
        const respostaColaboradores =
            await fetch(

                `${SUPABASE_URL}/colaborador?select=id_colaborador`,

                {

                    method: "GET",

                    headers:
                        headersSupabase

                }

            );


        if (!respostaColaboradores.ok) {

            throw new Error(
                "Erro ao buscar colaboradores."
            );

        }


        const colaboradores =
            await respostaColaboradores.json();


        // Mantém somente quem é perfil 1
        const funcionarios =
            colaboradores.filter(

                function (colaborador) {

                    return idsFuncionarios.includes(
                        Number(
                            colaborador.id_colaborador
                        )
                    );

                }

            );


        totalColaboradores.textContent =
            funcionarios.length;


    } catch (erro) {

        console.error(
            "Erro colaboradores:",
            erro
        );


        totalColaboradores.textContent =
            "-";

    }

}



// TOTAL DE HABILIDADES


async function carregarTotalHabilidades() {

    try {

        const resposta =
            await fetch(

                `${SUPABASE_URL}/habilidade?select=id_habilidade`,

                {

                    method: "GET",

                    headers:
                        headersSupabase

                }

            );


        if (!resposta.ok) {

            throw new Error(
                "Erro ao buscar habilidades."
            );

        }


        const habilidades =
            await resposta.json();


        totalHabilidades.textContent =
            habilidades.length;


    } catch (erro) {

        console.error(
            "Erro habilidades:",
            erro
        );


        totalHabilidades.textContent =
            "-";

    }

}



// SITUAÇÃO DO PROJETO


function obterSituacaoProjeto(
    projeto
) {

    const hoje =
        obterDataAtual();


    if (
        projeto.data_fim &&
        projeto.data_fim < hoje
    ) {

        return {

            texto:
                "Concluído",

            classe:
                "status-concluido"

        };

    }


    if (
        projeto.data_inicio &&
        projeto.data_inicio > hoje
    ) {

        return {

            texto:
                "Planejado",

            classe:
                "status-futuro"

        };

    }


    return {

        texto:
            "Ativo",

        classe:
            "status-ativo"

    };

}



// CARREGAR PROJETOS


async function carregarProjetos() {

    try {

        const resposta =
            await fetch(

                `${SUPABASE_URL}/projeto?select=id_projeto,nome_projeto,descricao,data_inicio,data_fim&order=data_inicio.desc`,

                {

                    method: "GET",

                    headers:
                        headersSupabase

                }

            );


        if (!resposta.ok) {

            throw new Error(
                "Erro ao buscar projetos."
            );

        }


        const projetos =
            await resposta.json();


        const hoje =
            obterDataAtual();


        const ativos =
            projetos.filter(

                function (projeto) {

                    return (

                        projeto.data_inicio <= hoje &&

                        (
                            !projeto.data_fim ||

                            projeto.data_fim >= hoje
                        )

                    );

                }

            );


        const concluidos =
            projetos.filter(

                function (projeto) {

                    return (

                        projeto.data_fim &&

                        projeto.data_fim < hoje

                    );

                }

            );


        totalProjetosAtivos.textContent =
            ativos.length;


        totalProjetosConcluidos.textContent =
            concluidos.length;


        renderizarProjetos(

            projetos.slice(
                0,
                5
            )

        );


    } catch (erro) {

        console.error(
            "Erro projetos:",
            erro
        );


        totalProjetosAtivos.textContent =
            "-";


        totalProjetosConcluidos.textContent =
            "-";


        tabelaProjetos.innerHTML = `

            <tr>

                <td
                    colspan="4"
                    class="tabela-vazia"
                >

                    Não foi possível
                    carregar os projetos.

                </td>

            </tr>

        `;

    }

}



// RENDERIZAR PROJETOS


function renderizarProjetos(
    projetos
) {

    if (
        !projetos ||
        projetos.length === 0
    ) {

        tabelaProjetos.innerHTML = `

            <tr>

                <td
                    colspan="4"
                    class="tabela-vazia"
                >

                    Nenhum projeto cadastrado.

                </td>

            </tr>

        `;


        return;

    }


    tabelaProjetos.innerHTML =
        projetos
            .map(

                function (projeto) {

                    const situacao =
                        obterSituacaoProjeto(
                            projeto
                        );


                    return `

                        <tr>

                            <td>

                                <span
                                    class="projeto-nome"
                                >

                                    ${escaparHTML(
                                        projeto.nome_projeto
                                    )}

                                </span>

                            </td>


                            <td>

                                ${formatarData(
                                    projeto.data_inicio
                                )}

                            </td>


                            <td>

                                ${formatarData(
                                    projeto.data_fim
                                )}

                            </td>


                            <td>

                                <span
                                    class="
                                        status
                                        ${situacao.classe}
                                    "
                                >

                                    ${situacao.texto}

                                </span>

                            </td>

                        </tr>

                    `;

                }

            )
            .join("");

}



// HABILIDADES MAIS COMUNS
// SOMENTE FUNCIONÁRIOS


async function carregarHabilidadesMaisComuns() {

    try {

        
        // USUÁRIOS FUNCIONÁRIOS
        

        const respostaUsuarios =
            await fetch(

                `${SUPABASE_URL}/usuario?select=id_colaborador,id_perfil`,

                {

                    method: "GET",

                    headers:
                        headersSupabase

                }

            );


        if (!respostaUsuarios.ok) {

            throw new Error(
                "Erro ao buscar usuários."
            );

        }


        const usuarios =
            await respostaUsuarios.json();


        const idsFuncionarios =
            usuarios
                .filter(

                    function (usuario) {

                        return (
                            Number(
                                usuario.id_perfil
                            ) === 1
                        );

                    }

                )
                .map(

                    function (usuario) {

                        return Number(
                            usuario.id_colaborador
                        );

                    }

                );


        
        // HABILIDADES DOS COLABORADORES
        

        const respostaRelacionamentos =
            await fetch(

                `${SUPABASE_URL}/colaborador_habilidade?select=id_habilidade,id_colaborador`,

                {

                    method: "GET",

                    headers:
                        headersSupabase

                }

            );


        if (!respostaRelacionamentos.ok) {

            throw new Error(
                "Erro ao buscar habilidades dos colaboradores."
            );

        }


        const relacionamentosTodos =
            await respostaRelacionamentos.json();


        // Remove habilidades do RH
        const relacionamentos =
            relacionamentosTodos.filter(

                function (item) {

                    return idsFuncionarios.includes(
                        Number(
                            item.id_colaborador
                        )
                    );

                }

            );


        if (
            relacionamentos.length === 0
        ) {

            listaHabilidades.innerHTML = `

                <div class="estado-carregando">

                    Nenhuma habilidade
                    associada aos colaboradores.

                </div>

            `;


            return;

        }


        
        // CATÁLOGO DE HABILIDADES
        

        const respostaHabilidades =
            await fetch(

                `${SUPABASE_URL}/habilidade?select=id_habilidade,nome_habilidade`,

                {

                    method: "GET",

                    headers:
                        headersSupabase

                }

            );


        if (!respostaHabilidades.ok) {

            throw new Error(
                "Erro ao buscar catálogo de habilidades."
            );

        }


        const habilidades =
            await respostaHabilidades.json();


        const mapaNomes =
            {};


        habilidades.forEach(

            function (habilidade) {

                mapaNomes[
                    habilidade.id_habilidade
                ] =
                    habilidade.nome_habilidade;

            }

        );


        
        // CONTAGEM
        

        const contagem =
            {};


        relacionamentos.forEach(

            function (item) {

                const id =
                    item.id_habilidade;


                if (!contagem[id]) {

                    contagem[id] =
                        0;

                }


                contagem[id]++;

            }

        );


        const ranking =
            Object
                .entries(
                    contagem
                )
                .map(

                    function (
                        [id, quantidade]
                    ) {

                        return {

                            id:
                                Number(id),

                            nome:
                                mapaNomes[id] ||
                                "Habilidade",

                            quantidade:
                                quantidade

                        };

                    }

                )
                .sort(

                    function (a, b) {

                        return (

                            b.quantidade -
                            a.quantidade

                        );

                    }

                )
                .slice(
                    0,
                    5
                );


        renderizarHabilidades(
            ranking
        );


    } catch (erro) {

        console.error(
            "Erro ranking habilidades:",
            erro
        );


        listaHabilidades.innerHTML = `

            <div class="estado-carregando">

                Não foi possível
                carregar as habilidades.

            </div>

        `;

    }

}



// RENDERIZAR HABILIDADES


function renderizarHabilidades(
    ranking
) {

    if (
        !ranking ||
        ranking.length === 0
    ) {

        listaHabilidades.innerHTML = `

            <div class="estado-carregando">

                Nenhuma habilidade encontrada.

            </div>

        `;


        return;

    }


    const maiorQuantidade =
        ranking[0].quantidade;


    listaHabilidades.innerHTML =
        ranking
            .map(

                function (habilidade) {

                    const porcentagem =
                        Math.round(

                            (
                                habilidade.quantidade /
                                maiorQuantidade
                            ) * 100

                        );


                    return `

                        <div
                            class="habilidade-item"
                        >


                            <div
                                class="habilidade-nome"
                            >

                                ${escaparHTML(
                                    habilidade.nome
                                )}

                            </div>


                            <div
                                class="habilidade-barra"
                            >

                                <div
                                    class="habilidade-progresso"
                                    style="
                                        width:
                                        ${porcentagem}%;
                                    "
                                >
                                </div>

                            </div>


                            <div
                                class="habilidade-quantidade"
                            >

                                ${habilidade.quantidade}

                            </div>


                        </div>

                    `;

                }

            )
            .join("");

}



// INICIAR DASHBOARD


async function iniciarDashboard() {

    await Promise.all([

        carregarUsuario(),

        carregarTotalColaboradores(),

        carregarTotalHabilidades(),

        carregarProjetos(),

        carregarHabilidadesMaisComuns()

    ]);

}


iniciarDashboard();