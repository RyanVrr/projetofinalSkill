
// RELATÓRIOS RH - SKILLMATCH




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



// DADOS


let colaboradores = [];

let usuarios = [];

let habilidades = [];

let colaboradorHabilidades = [];

let setores = [];

let cargos = [];

let projetos = [];



// ELEMENTOS


const topoNome =
    document.getElementById(
        "topo-nome"
    );


const usuarioAvatar =
    document.getElementById(
        "usuario-avatar"
    );


const relTotalColaboradores =
    document.getElementById(
        "rel-total-colaboradores"
    );


const relTotalHabilidades =
    document.getElementById(
        "rel-total-habilidades"
    );


const relProjetosAtivos =
    document.getElementById(
        "rel-projetos-ativos"
    );


const relProjetosConcluidos =
    document.getElementById(
        "rel-projetos-concluidos"
    );


const rankingHabilidades =
    document.getElementById(
        "ranking-habilidades"
    );


const rankingColaboradores =
    document.getElementById(
        "ranking-colaboradores"
    );


const distribuicaoSetores =
    document.getElementById(
        "distribuicao-setores"
    );


const relStatusAtivos =
    document.getElementById(
        "rel-status-ativos"
    );


const relStatusPlanejados =
    document.getElementById(
        "rel-status-planejados"
    );


const relStatusConcluidos =
    document.getElementById(
        "rel-status-concluidos"
    );


const pesquisaRelatorio =
    document.getElementById(
        "pesquisa-relatorio"
    );


const corpoRelatorioColaboradores =
    document.getElementById(
        "corpo-relatorio-colaboradores"
    );



// AUXILIARES


function escaparHTML(valor) {

    if (
        valor === null ||
        valor === undefined
    ) {

        return "";

    }


    return String(valor)

        .replaceAll("&", "&amp;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;")

        .replaceAll('"', "&quot;")

        .replaceAll("'", "&#039;");

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


    return `${ano}-${mes}-${dia}`;

}



// CARGO


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
        : "Não informado";

}



// SETOR


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
        : "Não informado";

}



// COLABORADORES FUNCIONÁRIOS


function obterColaboradoresFuncionarios() {

    return colaboradores.filter(

        function (colaborador) {

            const usuario =
                usuarios.find(

                    function (item) {

                        return (
                            Number(
                                item.id_colaborador
                            ) ===
                            Number(
                                colaborador.id_colaborador
                            )
                        );

                    }

                );


            if (!usuario) {

                return true;

            }


            return (
                Number(
                    usuario.id_perfil
                ) === 1
            );

        }

    );

}



// STATUS PROJETO


function obterStatusProjeto(
    projeto
) {

    const hoje =
        obterDataAtual();


    if (
        projeto.data_fim &&
        projeto.data_fim < hoje
    ) {

        return "concluido";

    }


    if (
        projeto.data_inicio &&
        projeto.data_inicio > hoje
    ) {

        return "planejado";

    }


    return "ativo";

}



// CARREGAR RH


async function carregarUsuarioRH() {

    try {

        const resposta =
            await fetch(

                `${SUPABASE_URL}/colaborador?select=id_colaborador,nome&id_colaborador=eq.${idColaboradorLogado}`,

                {

                    method:
                        "GET",

                    headers:
                        headersSupabase

                }

            );


        if (!resposta.ok) {

            throw new Error(
                "Erro ao carregar usuário RH."
            );

        }


        const dados =
            await resposta.json();


        if (
            dados.length > 0
        ) {

            topoNome.textContent =
                dados[0].nome;


            usuarioAvatar.textContent =
                obterIniciais(
                    dados[0].nome
                );

        }


    } catch (erro) {

        console.error(
            "Erro usuário RH:",
            erro
        );

    }

}



// BUSCAS SUPABASE


async function carregarColaboradores() {

    const resposta =
        await fetch(

            `${SUPABASE_URL}/colaborador?select=id_colaborador,nome,matricula,status,id_setor,id_cargo&order=nome.asc`,

            {

                method:
                    "GET",

                headers:
                    headersSupabase

            }

        );


    if (!resposta.ok) {

        throw new Error(
            "Erro ao carregar colaboradores."
        );

    }


    colaboradores =
        await resposta.json();

}


async function carregarUsuarios() {

    const resposta =
        await fetch(

            `${SUPABASE_URL}/usuario?select=id_usuario,id_colaborador,id_perfil,ativo`,

            {

                method:
                    "GET",

                headers:
                    headersSupabase

            }

        );


    if (!resposta.ok) {

        throw new Error(
            "Erro ao carregar usuários."
        );

    }


    usuarios =
        await resposta.json();

}


async function carregarHabilidades() {

    const resposta =
        await fetch(

            `${SUPABASE_URL}/habilidade?select=id_habilidade,nome_habilidade,tipo&order=nome_habilidade.asc`,

            {

                method:
                    "GET",

                headers:
                    headersSupabase

            }

        );


    if (!resposta.ok) {

        throw new Error(
            "Erro ao carregar habilidades."
        );

    }


    habilidades =
        await resposta.json();

}


async function carregarColaboradorHabilidades() {

    const resposta =
        await fetch(

            `${SUPABASE_URL}/colaborador_habilidade?select=id_colaborador_habilidade,id_colaborador,id_habilidade,nivel,anos_experiencia`,

            {

                method:
                    "GET",

                headers:
                    headersSupabase

            }

        );


    if (!resposta.ok) {

        throw new Error(
            "Erro ao carregar habilidades dos colaboradores."
        );

    }


    colaboradorHabilidades =
        await resposta.json();

}


async function carregarSetores() {

    const resposta =
        await fetch(

            `${SUPABASE_URL}/setor?select=id_setor,nome_setor,ativo&order=nome_setor.asc`,

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


async function carregarCargos() {

    const resposta =
        await fetch(

            `${SUPABASE_URL}/cargo?select=id_cargo,nome_cargo,nivel_hierarquico&order=nome_cargo.asc`,

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


async function carregarProjetos() {

    const resposta =
        await fetch(

            `${SUPABASE_URL}/projeto?select=id_projeto,nome_projeto,data_inicio,data_fim`,

            {

                method:
                    "GET",

                headers:
                    headersSupabase

            }

        );


    if (!resposta.ok) {

        throw new Error(
            "Erro ao carregar projetos."
        );

    }


    projetos =
        await resposta.json();

}



// CARDS


function atualizarCards() {

    const funcionarios =
        obterColaboradoresFuncionarios();


    relTotalColaboradores.textContent =
        funcionarios.length;


    relTotalHabilidades.textContent =
        habilidades.length;


    let ativos = 0;

    let concluidos = 0;


    projetos.forEach(

        function (projeto) {

            const status =
                obterStatusProjeto(
                    projeto
                );


            if (
                status === "ativo"
            ) {

                ativos++;

            }


            if (
                status === "concluido"
            ) {

                concluidos++;

            }

        }

    );


    relProjetosAtivos.textContent =
        ativos;


    relProjetosConcluidos.textContent =
        concluidos;

}



// RANKING HABILIDADES


function montarRankingHabilidades() {

    const funcionarios =
        obterColaboradoresFuncionarios();


    const idsFuncionarios =
        funcionarios.map(

            function (item) {

                return Number(
                    item.id_colaborador
                );

            }

        );


    const contagem = {};


    colaboradorHabilidades.forEach(

        function (relacao) {

            if (

                !idsFuncionarios.includes(

                    Number(
                        relacao.id_colaborador
                    )

                )

            ) {

                return;

            }


            const id =
                Number(
                    relacao.id_habilidade
                );


            if (!contagem[id]) {

                contagem[id] = 0;

            }


            contagem[id]++;

        }

    );


    const ranking =
        Object.entries(
            contagem
        )

            .map(

                function (
                    entrada
                ) {

                    const id =
                        Number(
                            entrada[0]
                        );


                    const quantidade =
                        entrada[1];


                    const habilidade =
                        habilidades.find(

                            function (item) {

                                return (
                                    Number(
                                        item.id_habilidade
                                    ) ===
                                    id
                                );

                            }

                        );


                    return {

                        nome:
                            habilidade
                                ? habilidade.nome_habilidade
                                : "Habilidade",

                        tipo:
                            habilidade
                                ? habilidade.tipo
                                : "",

                        quantidade:
                            quantidade

                    };

                }

            )

            .sort(

                function (
                    a,
                    b
                ) {

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


    if (
        ranking.length === 0
    ) {

        rankingHabilidades.innerHTML = `

            <div class="estado-vazio">
                Nenhuma habilidade vinculada aos colaboradores.
            </div>

        `;


        return;

    }


    rankingHabilidades.innerHTML =
        ranking
            .map(

                function (
                    item,
                    indice
                ) {

                    return `

                        <div class="ranking-item">

                            <div class="ranking-info">

                                <div class="ranking-posicao">
                                    ${indice + 1}
                                </div>

                                <div class="ranking-texto">

                                    <strong>
                                        ${escaparHTML(
                                            item.nome
                                        )}
                                    </strong>

                                    <span>
                                        ${escaparHTML(
                                            item.tipo || "Competência"
                                        )}
                                    </span>

                                </div>

                            </div>

                            <span class="ranking-valor">
                                ${item.quantidade}
                            </span>

                        </div>

                    `;

                }

            )
            .join("");

}



// RANKING COLABORADORES


function montarRankingColaboradores() {

    const funcionarios =
        obterColaboradoresFuncionarios();


    const ranking =
        funcionarios

            .map(

                function (
                    colaborador
                ) {

                    const quantidade =
                        colaboradorHabilidades.filter(

                            function (relacao) {

                                return (
                                    Number(
                                        relacao.id_colaborador
                                    ) ===
                                    Number(
                                        colaborador.id_colaborador
                                    )
                                );

                            }

                        ).length;


                    return {

                        colaborador:
                            colaborador,

                        quantidade:
                            quantidade

                    };

                }

            )

            .sort(

                function (
                    a,
                    b
                ) {

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


    if (
        ranking.length === 0
    ) {

        rankingColaboradores.innerHTML = `

            <div class="estado-vazio">
                Nenhum colaborador encontrado.
            </div>

        `;


        return;

    }


    rankingColaboradores.innerHTML =
        ranking
            .map(

                function (
                    item,
                    indice
                ) {

                    const colaborador =
                        item.colaborador;


                    return `

                        <div class="ranking-item">

                            <div class="ranking-info">

                                <div class="ranking-posicao">
                                    ${indice + 1}
                                </div>

                                <div class="ranking-texto">

                                    <strong>
                                        ${escaparHTML(
                                            colaborador.nome
                                        )}
                                    </strong>

                                    <span>
                                        ${escaparHTML(
                                            buscarCargo(
                                                colaborador.id_cargo
                                            )
                                        )}
                                    </span>

                                </div>

                            </div>

                            <span class="ranking-valor">
                                ${item.quantidade}
                            </span>

                        </div>

                    `;

                }

            )
            .join("");

}



// DISTRIBUIÇÃO SETORES


function montarDistribuicaoSetores() {

    const funcionarios =
        obterColaboradoresFuncionarios();


    const contagem = {};


    funcionarios.forEach(

        function (
            colaborador
        ) {

            const id =
                colaborador.id_setor;


            if (!contagem[id]) {

                contagem[id] = 0;

            }


            contagem[id]++;

        }

    );


    const resultado =
        Object.entries(
            contagem
        )

            .map(

                function (
                    entrada
                ) {

                    const idSetor =
                        entrada[0];


                    const quantidade =
                        entrada[1];


                    return {

                        nome:
                            buscarSetor(
                                idSetor
                            ),

                        quantidade:
                            quantidade

                    };

                }

            )

            .sort(

                function (
                    a,
                    b
                ) {

                    return (
                        b.quantidade -
                        a.quantidade
                    );

                }

            );


    if (
        resultado.length === 0
    ) {

        distribuicaoSetores.innerHTML = `

            <div class="estado-vazio">
                Nenhum setor encontrado.
            </div>

        `;


        return;

    }


    const maiorQuantidade =
        resultado[0].quantidade;


    distribuicaoSetores.innerHTML =
        resultado
            .map(

                function (
                    item
                ) {

                    const percentual =
                        maiorQuantidade > 0
                            ? Math.round(
                                (
                                    item.quantidade /
                                    maiorQuantidade
                                ) *
                                100
                            )
                            : 0;


                    return `

                        <div class="barra-item">

                            <div class="barra-topo">

                                <span>
                                    ${escaparHTML(
                                        item.nome
                                    )}
                                </span>

                                <strong>
                                    ${item.quantidade}
                                </strong>

                            </div>

                            <div class="barra-fundo">

                                <div
                                    class="barra-progresso"
                                    style="
                                        width:
                                        ${percentual}%;
                                    "
                                ></div>

                            </div>

                        </div>

                    `;

                }

            )
            .join("");

}



// SITUAÇÃO PROJETOS


function montarSituacaoProjetos() {

    let ativos = 0;

    let planejados = 0;

    let concluidos = 0;


    projetos.forEach(

        function (
            projeto
        ) {

            const status =
                obterStatusProjeto(
                    projeto
                );


            if (
                status === "ativo"
            ) {

                ativos++;

            }


            if (
                status === "planejado"
            ) {

                planejados++;

            }


            if (
                status === "concluido"
            ) {

                concluidos++;

            }

        }

    );


    relStatusAtivos.textContent =
        ativos;


    relStatusPlanejados.textContent =
        planejados;


    relStatusConcluidos.textContent =
        concluidos;

}



// TABELA


function renderizarTabela(
    lista
) {

    if (
        !lista ||
        lista.length === 0
    ) {

        corpoRelatorioColaboradores.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="tabela-vazia"
                >
                    Nenhum colaborador encontrado.
                </td>

            </tr>

        `;


        return;

    }


    corpoRelatorioColaboradores.innerHTML =
        lista
            .map(

                function (
                    colaborador
                ) {

                    const quantidadeHabilidades =
                        colaboradorHabilidades.filter(

                            function (
                                relacao
                            ) {

                                return (
                                    Number(
                                        relacao.id_colaborador
                                    ) ===
                                    Number(
                                        colaborador.id_colaborador
                                    )
                                );

                            }

                        ).length;


                    const status =
                        normalizarTexto(
                            colaborador.status
                        ) === "inativo"
                            ? "inativo"
                            : "ativo";


                    return `

                        <tr>

                            <td>

                                <div class="colaborador-relatorio">

                                    <strong>
                                        ${escaparHTML(
                                            colaborador.nome
                                        )}
                                    </strong>

                                    <span>
                                        ${escaparHTML(
                                            colaborador.matricula || "-"
                                        )}
                                    </span>

                                </div>

                            </td>


                            <td>
                                ${escaparHTML(
                                    buscarCargo(
                                        colaborador.id_cargo
                                    )
                                )}
                            </td>


                            <td>
                                ${escaparHTML(
                                    buscarSetor(
                                        colaborador.id_setor
                                    )
                                )}
                            </td>


                            <td>
                                ${quantidadeHabilidades}
                            </td>


                            <td>

                                <span
                                    class="
                                        status-colaborador-relatorio
                                        ${status}
                                    "
                                >

                                    ${
                                        status === "ativo"
                                            ? "Ativo"
                                            : "Inativo"
                                    }

                                </span>

                            </td>

                        </tr>

                    `;

                }

            )
            .join("");

}



// FILTRO


function aplicarFiltroTabela() {

    const pesquisa =
        normalizarTexto(
            pesquisaRelatorio.value
        );


    const funcionarios =
        obterColaboradoresFuncionarios();


    const resultado =
        funcionarios.filter(

            function (
                colaborador
            ) {

                const nome =
                    normalizarTexto(
                        colaborador.nome
                    );


                const matricula =
                    normalizarTexto(
                        colaborador.matricula
                    );


                const cargo =
                    normalizarTexto(
                        buscarCargo(
                            colaborador.id_cargo
                        )
                    );


                const setor =
                    normalizarTexto(
                        buscarSetor(
                            colaborador.id_setor
                        )
                    );


                return (

                    nome.includes(
                        pesquisa
                    )

                    ||

                    matricula.includes(
                        pesquisa
                    )

                    ||

                    cargo.includes(
                        pesquisa
                    )

                    ||

                    setor.includes(
                        pesquisa
                    )

                );

            }

        );


    renderizarTabela(
        resultado
    );

}



// RENDERIZAR TUDO


function renderizarRelatorios() {

    atualizarCards();

    montarRankingHabilidades();

    montarRankingColaboradores();

    montarDistribuicaoSetores();

    montarSituacaoProjetos();

    renderizarTabela(
        obterColaboradoresFuncionarios()
    );

}



// EVENTO PESQUISA


pesquisaRelatorio.addEventListener(

    "input",

    aplicarFiltroTabela

);



// INICIAR


async function iniciarPagina() {

    try {

        await carregarUsuarioRH();


        await Promise.all([

            carregarColaboradores(),

            carregarUsuarios(),

            carregarHabilidades(),

            carregarColaboradorHabilidades(),

            carregarSetores(),

            carregarCargos(),

            carregarProjetos()

        ]);


        renderizarRelatorios();


    } catch (erro) {

        console.error(
            "Erro ao iniciar relatórios:",
            erro
        );


        corpoRelatorioColaboradores.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="tabela-vazia"
                >
                    Não foi possível carregar os relatórios.
                    Verifique o console.
                </td>

            </tr>

        `;

    }

}


iniciarPagina();