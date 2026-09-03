
// PROJETOS RH - SKILLMATCH




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



// PROTEÇÃO RH


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


let projetos = [];

let habilidades = [];

let projetoHabilidades = [];

let modoEdicao = false;

let idProjetoExcluir = null;

let idProjetoHabilidadesAtual = null;



// ELEMENTOS


const topoNome =
    document.getElementById(
        "topo-nome"
    );


const usuarioAvatar =
    document.getElementById(
        "usuario-avatar"
    );


const totalProjetos =
    document.getElementById(
        "total-projetos"
    );


const totalAtivos =
    document.getElementById(
        "total-ativos"
    );


const totalPlanejados =
    document.getElementById(
        "total-planejados"
    );


const totalConcluidos =
    document.getElementById(
        "total-concluidos"
    );


const pesquisaProjeto =
    document.getElementById(
        "pesquisa-projeto"
    );


const filtroStatus =
    document.getElementById(
        "filtro-status"
    );


const corpoTabela =
    document.getElementById(
        "corpo-tabela-projetos"
    );



// MODAL PROJETO


const modalProjeto =
    document.getElementById(
        "modal-projeto"
    );


const abrirModalProjeto =
    document.getElementById(
        "abrir-modal-projeto"
    );


const fecharModalProjeto =
    document.getElementById(
        "fechar-modal-projeto"
    );


const cancelarProjeto =
    document.getElementById(
        "cancelar-projeto"
    );


const formProjeto =
    document.getElementById(
        "form-projeto"
    );


const projetoId =
    document.getElementById(
        "projeto-id"
    );


const projetoNome =
    document.getElementById(
        "projeto-nome"
    );


const projetoDescricao =
    document.getElementById(
        "projeto-descricao"
    );


const projetoDataInicio =
    document.getElementById(
        "projeto-data-inicio"
    );


const projetoDataFim =
    document.getElementById(
        "projeto-data-fim"
    );


const tituloModalProjeto =
    document.getElementById(
        "titulo-modal-projeto"
    );


const descricaoModalProjeto =
    document.getElementById(
        "descricao-modal-projeto"
    );


const mensagemFormulario =
    document.getElementById(
        "mensagem-formulario"
    );


const salvarProjeto =
    document.getElementById(
        "salvar-projeto"
    );



// MODAL HABILIDADES


const modalHabilidades =
    document.getElementById(
        "modal-habilidades"
    );


const fecharModalHabilidades =
    document.getElementById(
        "fechar-modal-habilidades"
    );


const nomeProjetoHabilidades =
    document.getElementById(
        "nome-projeto-habilidades"
    );


const formHabilidadeProjeto =
    document.getElementById(
        "form-habilidade-projeto"
    );


const habilidadeProjeto =
    document.getElementById(
        "habilidade-projeto"
    );


const nivelRequerido =
    document.getElementById(
        "nivel-requerido"
    );


const nivelImportancia =
    document.getElementById(
        "nivel-importancia"
    );


const adicionarHabilidade =
    document.getElementById(
        "adicionar-habilidade"
    );


const mensagemHabilidade =
    document.getElementById(
        "mensagem-habilidade"
    );


const listaHabilidadesProjeto =
    document.getElementById(
        "lista-habilidades-projeto"
    );



// DETALHES


const modalDetalhes =
    document.getElementById(
        "modal-detalhes"
    );


const fecharModalDetalhes =
    document.getElementById(
        "fechar-modal-detalhes"
    );


const detalhesProjeto =
    document.getElementById(
        "detalhes-projeto"
    );



// EXCLUSÃO


const modalExcluir =
    document.getElementById(
        "modal-excluir"
    );


const fecharModalExcluir =
    document.getElementById(
        "fechar-modal-excluir"
    );


const cancelarExclusao =
    document.getElementById(
        "cancelar-exclusao"
    );


const confirmarExclusao =
    document.getElementById(
        "confirmar-exclusao"
    );


const nomeProjetoExcluir =
    document.getElementById(
        "nome-projeto-excluir"
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



// STATUS


function obterStatusProjeto(
    projeto
) {

    const hoje =
        obterDataAtual();


    if (
        projeto.data_fim &&
        projeto.data_fim < hoje
    ) {

        return {

            codigo:
                "concluido",

            texto:
                "Concluído"

        };

    }


    if (
        projeto.data_inicio &&
        projeto.data_inicio > hoje
    ) {

        return {

            codigo:
                "planejado",

            texto:
                "Planejado"

        };

    }


    return {

        codigo:
            "ativo",

        texto:
            "Ativo"

    };

}



// TEXTOS DOS NÍVEIS


function textoNivel(
    nivel
) {

    const niveis = {

        1: "Básico",

        2: "Básico/Intermediário",

        3: "Intermediário",

        4: "Avançado",

        5: "Especialista"

    };


    return (
        niveis[nivel] ||
        `Nível ${nivel}`
    );

}


function textoImportancia(
    nivel
) {

    const niveis = {

        1: "Muito baixa",

        2: "Baixa",

        3: "Média",

        4: "Alta",

        5: "Essencial"

    };


    return (
        niveis[nivel] ||
        `Nível ${nivel}`
    );

}



// USUÁRIO RH


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
                "Erro ao buscar usuário RH."
            );

        }


        const dados =
            await resposta.json();


        if (dados.length > 0) {

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



// CARREGAR CATÁLOGO DE HABILIDADES


async function carregarHabilidades() {

    const resposta =
        await fetch(

            `${SUPABASE_URL}/habilidade?select=id_habilidade,nome_habilidade,descricao,tipo&order=nome_habilidade.asc`,

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


    preencherSelectHabilidades();

}



// SELECT HABILIDADES


function preencherSelectHabilidades() {

    habilidadeProjeto.innerHTML = `

        <option value="">
            Selecione
        </option>

    `;


    habilidades.forEach(

        function (habilidade) {

            habilidadeProjeto.innerHTML += `

                <option
                    value="${habilidade.id_habilidade}"
                >

                    ${escaparHTML(
                        habilidade.nome_habilidade
                    )}

                </option>

            `;

        }

    );

}



// CARREGAR RELAÇÕES PROJETO/HABILIDADE


async function carregarProjetoHabilidades() {

    const resposta =
        await fetch(

            `${SUPABASE_URL}/projeto_habilidade?select=id_projeto_habilidade,id_projeto,id_habilidade,nivel_requerido,nivel_importancia`,

            {

                method:
                    "GET",

                headers:
                    headersSupabase

            }

        );


    if (!resposta.ok) {

        throw new Error(
            "Erro ao carregar habilidades dos projetos."
        );

    }


    projetoHabilidades =
        await resposta.json();

}



// CONTAR HABILIDADES DO PROJETO


function contarHabilidadesProjeto(
    idProjeto
) {

    return projetoHabilidades.filter(

        function (item) {

            return (
                Number(
                    item.id_projeto
                ) ===
                Number(
                    idProjeto
                )
            );

        }

    ).length;

}



// BUSCAR NOME DA HABILIDADE


function buscarHabilidade(
    idHabilidade
) {

    return habilidades.find(

        function (habilidade) {

            return (
                Number(
                    habilidade.id_habilidade
                ) ===
                Number(
                    idHabilidade
                )
            );

        }

    );

}



// CARREGAR PROJETOS


async function carregarProjetos() {

    try {

        const resposta =
            await fetch(

                `${SUPABASE_URL}/projeto?select=id_projeto,nome_projeto,descricao,data_inicio,data_fim&order=data_inicio.desc`,

                {

                    method:
                        "GET",

                    headers:
                        headersSupabase

                }

            );


        if (!resposta.ok) {

            throw new Error(
                "Erro ao buscar projetos."
            );

        }


        projetos =
            await resposta.json();


        atualizarResumo();


        aplicarFiltros();


    } catch (erro) {

        console.error(
            "Erro projetos:",
            erro
        );


        corpoTabela.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="tabela-vazia"
                >

                    Não foi possível carregar
                    os projetos.

                </td>

            </tr>

        `;

    }

}



// RESUMO


function atualizarResumo() {

    totalProjetos.textContent =
        projetos.length;


    let ativos = 0;

    let planejados = 0;

    let concluidos = 0;


    projetos.forEach(

        function (projeto) {

            const status =
                obterStatusProjeto(
                    projeto
                );


            if (
                status.codigo ===
                "ativo"
            ) {

                ativos++;

            }


            if (
                status.codigo ===
                "planejado"
            ) {

                planejados++;

            }


            if (
                status.codigo ===
                "concluido"
            ) {

                concluidos++;

            }

        }

    );


    totalAtivos.textContent =
        ativos;


    totalPlanejados.textContent =
        planejados;


    totalConcluidos.textContent =
        concluidos;

}



// FILTROS


function aplicarFiltros() {

    const pesquisa =
        pesquisaProjeto
            .value
            .trim()
            .toLowerCase();


    const statusSelecionado =
        filtroStatus.value;


    const resultado =
        projetos.filter(

            function (projeto) {

                const nome =
                    (
                        projeto.nome_projeto ||
                        ""
                    )
                    .toLowerCase();


                const descricao =
                    (
                        projeto.descricao ||
                        ""
                    )
                    .toLowerCase();


                const correspondePesquisa =
                    nome.includes(
                        pesquisa
                    ) ||
                    descricao.includes(
                        pesquisa
                    );


                const status =
                    obterStatusProjeto(
                        projeto
                    );


                const correspondeStatus =
                    !statusSelecionado ||

                    status.codigo ===
                    statusSelecionado;


                return (
                    correspondePesquisa &&
                    correspondeStatus
                );

            }

        );


    renderizarProjetos(
        resultado
    );

}



// RENDERIZAR PROJETOS


function renderizarProjetos(
    lista
) {

    if (
        !lista ||
        lista.length === 0
    ) {

        corpoTabela.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="tabela-vazia"
                >

                    Nenhum projeto encontrado.

                </td>

            </tr>

        `;


        return;

    }


    corpoTabela.innerHTML =
        lista
            .map(

                function (projeto) {

                    const status =
                        obterStatusProjeto(
                            projeto
                        );


                    const quantidadeHabilidades =
                        contarHabilidadesProjeto(
                            projeto.id_projeto
                        );


                    return `

                        <tr>

                            <td>

                                <div
                                    class="projeto-info"
                                >

                                    <strong>

                                        ${escaparHTML(
                                            projeto.nome_projeto
                                        )}

                                    </strong>

                                    <span>

                                        ${escaparHTML(
                                            projeto.descricao || ""
                                        )}

                                    </span>

                                </div>

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
                                        status-projeto
                                        ${status.codigo}
                                    "
                                >

                                    ${status.texto}

                                </span>

                            </td>


                            <td>

                                <span
                                    class="contador-habilidades"
                                >

                                    ${quantidadeHabilidades}

                                </span>

                            </td>


                            <td>

                                <div
                                    class="acoes-tabela"
                                >

                                    <button
                                        type="button"
                                        class="
                                            botao-acao
                                            habilidades
                                        "
                                        onclick="
                                            abrirHabilidadesProjeto(
                                                ${projeto.id_projeto}
                                            )
                                        "
                                    >
                                        Habilidades
                                    </button>


                                    <button
                                        type="button"
                                        class="botao-acao"
                                        onclick="
                                            abrirDetalhesProjeto(
                                                ${projeto.id_projeto}
                                            )
                                        "
                                    >
                                        Ver
                                    </button>


                                    <button
                                        type="button"
                                        class="
                                            botao-acao
                                            editar
                                        "
                                        onclick="
                                            editarProjeto(
                                                ${projeto.id_projeto}
                                            )
                                        "
                                    >
                                        Editar
                                    </button>


                                    <button
                                        type="button"
                                        class="
                                            botao-acao
                                            excluir
                                        "
                                        onclick="
                                            abrirExclusaoProjeto(
                                                ${projeto.id_projeto}
                                            )
                                        "
                                    >
                                        Excluir
                                    </button>

                                </div>

                            </td>

                        </tr>

                    `;

                }

            )
            .join("");

}



// ABRIR HABILIDADES


async function abrirHabilidadesProjeto(
    idProjeto
) {

    const projeto =
        projetos.find(

            function (item) {

                return (
                    Number(
                        item.id_projeto
                    ) ===
                    Number(
                        idProjeto
                    )
                );

            }

        );


    if (!projeto) {

        return;

    }


    idProjetoHabilidadesAtual =
        projeto.id_projeto;


    nomeProjetoHabilidades.textContent =
        projeto.nome_projeto;


    mensagemHabilidade.textContent =
        "";


    habilidadeProjeto.value =
        "";


    nivelRequerido.value =
        "3";


    nivelImportancia.value =
        "3";


    modalHabilidades.hidden =
        false;


    renderizarHabilidadesProjeto();

}



// RENDERIZAR HABILIDADES DO PROJETO


function renderizarHabilidadesProjeto() {

    const relacionadas =
        projetoHabilidades.filter(

            function (item) {

                return (
                    Number(
                        item.id_projeto
                    ) ===
                    Number(
                        idProjetoHabilidadesAtual
                    )
                );

            }

        );


    if (
        relacionadas.length === 0
    ) {

        listaHabilidadesProjeto.innerHTML = `

            <div
                class="estado-vazio-habilidades"
            >

                Nenhuma habilidade foi adicionada
                a este projeto ainda.

            </div>

        `;


        return;

    }


    listaHabilidadesProjeto.innerHTML =
        relacionadas
            .map(

                function (relacao) {

                    const habilidade =
                        buscarHabilidade(
                            relacao.id_habilidade
                        );


                    const nome =
                        habilidade
                            ? habilidade.nome_habilidade
                            : "Habilidade";


                    const tipo =
                        habilidade &&
                        habilidade.tipo
                            ? habilidade.tipo
                            : "Competência";


                    return `

                        <div
                            class="habilidade-projeto-item"
                        >

                            <div
                                class="habilidade-projeto-nome"
                            >

                                <strong>

                                    ${escaparHTML(
                                        nome
                                    )}

                                </strong>

                                <span>

                                    ${escaparHTML(
                                        tipo
                                    )}

                                </span>

                            </div>


                            <div
                                class="habilidade-dado"
                            >

                                <span>
                                    Nível requerido
                                </span>

                                <strong>

                                    ${relacao.nivel_requerido}
                                    -
                                    ${textoNivel(
                                        relacao.nivel_requerido
                                    )}

                                </strong>

                            </div>


                            <div
                                class="habilidade-dado"
                            >

                                <span>
                                    Importância
                                </span>

                                <strong>

                                    ${relacao.nivel_importancia}
                                    -
                                    ${textoImportancia(
                                        relacao.nivel_importancia
                                    )}

                                </strong>

                            </div>


                            <button
                                type="button"
                                class="
                                    botao-remover-habilidade
                                "
                                onclick="
                                    removerHabilidadeProjeto(
                                        ${relacao.id_projeto_habilidade}
                                    )
                                "
                            >

                                Remover

                            </button>

                        </div>

                    `;

                }

            )
            .join("");

}



// ADICIONAR HABILIDADE


formHabilidadeProjeto.addEventListener(

    "submit",

    async function (event) {

        event.preventDefault();


        mensagemHabilidade.textContent =
            "";


        if (!idProjetoHabilidadesAtual) {

            return;

        }


        const idHabilidade =
            Number(
                habilidadeProjeto.value
            );


        if (!idHabilidade) {

            mensagemHabilidade.textContent =
                "Selecione uma habilidade.";


            return;

        }


        const jaExiste =
            projetoHabilidades.some(

                function (item) {

                    return (

                        Number(
                            item.id_projeto
                        ) ===
                        Number(
                            idProjetoHabilidadesAtual
                        )

                        &&

                        Number(
                            item.id_habilidade
                        ) ===
                        idHabilidade

                    );

                }

            );


        if (jaExiste) {

            mensagemHabilidade.textContent =
                "Esta habilidade já foi adicionada ao projeto.";


            return;

        }


        adicionarHabilidade.disabled =
            true;


        adicionarHabilidade.textContent =
            "Adicionando...";


        try {

            const dados = {

                id_projeto:
                    Number(
                        idProjetoHabilidadesAtual
                    ),

                id_habilidade:
                    idHabilidade,

                nivel_requerido:
                    Number(
                        nivelRequerido.value
                    ),

                nivel_importancia:
                    Number(
                        nivelImportancia.value
                    )

            };


            const resposta =
                await fetch(

                    `${SUPABASE_URL}/projeto_habilidade`,

                    {

                        method:
                            "POST",

                        headers: {

                            ...headersSupabase,

                            "Prefer":
                                "return=representation"

                        },

                        body:
                            JSON.stringify(
                                dados
                            )

                    }

                );


            if (!resposta.ok) {

                const erro =
                    await resposta.text();


                console.error(
                    "Erro habilidade projeto:",
                    erro
                );


                throw new Error(
                    "Não foi possível adicionar a habilidade."
                );

            }


            await carregarProjetoHabilidades();


            habilidadeProjeto.value =
                "";


            nivelRequerido.value =
                "3";


            nivelImportancia.value =
                "3";


            renderizarHabilidadesProjeto();


            aplicarFiltros();


        } catch (erro) {

            console.error(
                erro
            );


            mensagemHabilidade.textContent =
                erro.message;


        } finally {

            adicionarHabilidade.disabled =
                false;


            adicionarHabilidade.textContent =
                "+ Adicionar";

        }

    }

);



// REMOVER HABILIDADE


async function removerHabilidadeProjeto(
    idProjetoHabilidade
) {

    const confirmar =
        window.confirm(
            "Deseja remover esta habilidade do projeto?"
        );


    if (!confirmar) {

        return;

    }


    try {

        const resposta =
            await fetch(

                `${SUPABASE_URL}/projeto_habilidade?id_projeto_habilidade=eq.${idProjetoHabilidade}`,

                {

                    method:
                        "DELETE",

                    headers:
                        headersSupabase

                }

            );


        if (!resposta.ok) {

            const erro =
                await resposta.text();


            console.error(
                "Erro remover habilidade:",
                erro
            );


            throw new Error(
                "Não foi possível remover a habilidade."
            );

        }


        await carregarProjetoHabilidades();


        renderizarHabilidadesProjeto();


        aplicarFiltros();


    } catch (erro) {

        console.error(
            erro
        );


        mensagemHabilidade.textContent =
            erro.message;

    }

}



// FECHAR HABILIDADES


function fecharHabilidades() {

    modalHabilidades.hidden =
        true;


    idProjetoHabilidadesAtual =
        null;


    mensagemHabilidade.textContent =
        "";

}



// NOVO PROJETO


function abrirNovoProjeto() {

    modoEdicao =
        false;


    formProjeto.reset();


    projetoId.value =
        "";


    tituloModalProjeto.textContent =
        "Novo projeto";


    descricaoModalProjeto.textContent =
        "Cadastre um novo projeto.";


    salvarProjeto.textContent =
        "Salvar projeto";


    mensagemFormulario.textContent =
        "";


    modalProjeto.hidden =
        false;

}



// EDITAR


function editarProjeto(
    id
) {

    const projeto =
        projetos.find(

            function (item) {

                return (
                    Number(
                        item.id_projeto
                    ) ===
                    Number(
                        id
                    )
                );

            }

        );


    if (!projeto) {

        return;

    }


    modoEdicao =
        true;


    projetoId.value =
        projeto.id_projeto;


    projetoNome.value =
        projeto.nome_projeto;


    projetoDescricao.value =
        projeto.descricao || "";


    projetoDataInicio.value =
        projeto.data_inicio || "";


    projetoDataFim.value =
        projeto.data_fim || "";


    tituloModalProjeto.textContent =
        "Editar projeto";


    descricaoModalProjeto.textContent =
        "Atualize os dados do projeto.";


    salvarProjeto.textContent =
        "Salvar alterações";


    mensagemFormulario.textContent =
        "";


    modalProjeto.hidden =
        false;

}



// FECHAR MODAL


function fecharModalCadastro() {

    modalProjeto.hidden =
        true;


    mensagemFormulario.textContent =
        "";

}



// VALIDAR DATAS


function validarDatas() {

    if (
        projetoDataFim.value &&
        projetoDataFim.value <
        projetoDataInicio.value
    ) {

        throw new Error(
            "A data de término não pode ser anterior à data de início."
        );

    }

}



// CADASTRAR PROJETO


async function cadastrarProjeto() {

    validarDatas();


    const dados = {

        nome_projeto:
            projetoNome
                .value
                .trim(),

        descricao:
            projetoDescricao
                .value
                .trim(),

        data_inicio:
            projetoDataInicio.value,

        data_fim:
            projetoDataFim.value ||
            null

    };


    const resposta =
        await fetch(

            `${SUPABASE_URL}/projeto`,

            {

                method:
                    "POST",

                headers: {

                    ...headersSupabase,

                    "Prefer":
                        "return=representation"

                },

                body:
                    JSON.stringify(
                        dados
                    )

            }

        );


    if (!resposta.ok) {

        const erro =
            await resposta.text();


        console.error(
            "Erro cadastro projeto:",
            erro
        );


        throw new Error(
            "Não foi possível cadastrar o projeto."
        );

    }

}



// ATUALIZAR PROJETO


async function atualizarProjeto() {

    validarDatas();


    const dados = {

        nome_projeto:
            projetoNome
                .value
                .trim(),

        descricao:
            projetoDescricao
                .value
                .trim(),

        data_inicio:
            projetoDataInicio.value,

        data_fim:
            projetoDataFim.value ||
            null

    };


    const resposta =
        await fetch(

            `${SUPABASE_URL}/projeto?id_projeto=eq.${projetoId.value}`,

            {

                method:
                    "PATCH",

                headers:
                    headersSupabase,

                body:
                    JSON.stringify(
                        dados
                    )

            }

        );


    if (!resposta.ok) {

        const erro =
            await resposta.text();


        console.error(
            "Erro atualização:",
            erro
        );


        throw new Error(
            "Não foi possível atualizar o projeto."
        );

    }

}



// SUBMIT PROJETO


formProjeto.addEventListener(

    "submit",

    async function (event) {

        event.preventDefault();


        mensagemFormulario.textContent =
            "";


        salvarProjeto.disabled =
            true;


        salvarProjeto.textContent =
            "Salvando...";


        try {

            if (modoEdicao) {

                await atualizarProjeto();

            } else {

                await cadastrarProjeto();

            }


            fecharModalCadastro();


            await carregarProjetos();


        } catch (erro) {

            console.error(
                erro
            );


            mensagemFormulario.textContent =
                erro.message;


        } finally {

            salvarProjeto.disabled =
                false;


            salvarProjeto.textContent =
                modoEdicao
                    ? "Salvar alterações"
                    : "Salvar projeto";

        }

    }

);



// DETALHES


function abrirDetalhesProjeto(
    id
) {

    const projeto =
        projetos.find(

            function (item) {

                return (
                    Number(
                        item.id_projeto
                    ) ===
                    Number(
                        id
                    )
                );

            }

        );


    if (!projeto) {

        return;

    }


    const status =
        obterStatusProjeto(
            projeto
        );


    const quantidadeHabilidades =
        contarHabilidadesProjeto(
            projeto.id_projeto
        );


    detalhesProjeto.innerHTML = `

        <div class="detalhe-item">

            <span>
                Nome
            </span>

            <strong>

                ${escaparHTML(
                    projeto.nome_projeto
                )}

            </strong>

        </div>


        <div class="detalhe-item">

            <span>
                Descrição
            </span>

            <strong>

                ${escaparHTML(
                    projeto.descricao || "-"
                )}

            </strong>

        </div>


        <div class="detalhe-item">

            <span>
                Data de início
            </span>

            <strong>

                ${formatarData(
                    projeto.data_inicio
                )}

            </strong>

        </div>


        <div class="detalhe-item">

            <span>
                Data de término
            </span>

            <strong>

                ${formatarData(
                    projeto.data_fim
                )}

            </strong>

        </div>


        <div class="detalhe-item">

            <span>
                Status
            </span>

            <strong>

                ${status.texto}

            </strong>

        </div>


        <div class="detalhe-item">

            <span>
                Habilidades exigidas
            </span>

            <strong>

                ${quantidadeHabilidades}

            </strong>

        </div>

    `;


    modalDetalhes.hidden =
        false;

}



// ABRIR EXCLUSÃO


function abrirExclusaoProjeto(
    id
) {

    const projeto =
        projetos.find(

            function (item) {

                return (
                    Number(
                        item.id_projeto
                    ) ===
                    Number(
                        id
                    )
                );

            }

        );


    if (!projeto) {

        return;

    }


    idProjetoExcluir =
        projeto.id_projeto;


    nomeProjetoExcluir.textContent =
        projeto.nome_projeto;


    modalExcluir.hidden =
        false;

}



// FECHAR EXCLUSÃO


function fecharExclusao() {

    modalExcluir.hidden =
        true;


    idProjetoExcluir =
        null;

}



// EXCLUIR PROJETO


async function excluirProjeto() {

    if (!idProjetoExcluir) {

        return;

    }


    confirmarExclusao.disabled =
        true;


    confirmarExclusao.textContent =
        "Excluindo...";


    try {

        // Primeiro remove relações
        // projeto_habilidade.

        const respostaRelacoes =
            await fetch(

                `${SUPABASE_URL}/projeto_habilidade?id_projeto=eq.${idProjetoExcluir}`,

                {

                    method:
                        "DELETE",

                    headers:
                        headersSupabase

                }

            );


        if (!respostaRelacoes.ok) {

            throw new Error(
                "Não foi possível remover as habilidades do projeto."
            );

        }


        const resposta =
            await fetch(

                `${SUPABASE_URL}/projeto?id_projeto=eq.${idProjetoExcluir}`,

                {

                    method:
                        "DELETE",

                    headers:
                        headersSupabase

                }

            );


        if (!resposta.ok) {

            throw new Error(
                "Não foi possível excluir o projeto."
            );

        }


        fecharExclusao();


        await carregarProjetoHabilidades();


        await carregarProjetos();


    } catch (erro) {

        console.error(
            erro
        );


        alert(
            erro.message
        );


    } finally {

        confirmarExclusao.disabled =
            false;


        confirmarExclusao.textContent =
            "Excluir";

    }

}



// EVENTOS FILTROS


pesquisaProjeto.addEventListener(

    "input",

    aplicarFiltros

);


filtroStatus.addEventListener(

    "change",

    aplicarFiltros

);



// EVENTOS PROJETO


abrirModalProjeto.addEventListener(

    "click",

    abrirNovoProjeto

);


fecharModalProjeto.addEventListener(

    "click",

    fecharModalCadastro

);


cancelarProjeto.addEventListener(

    "click",

    fecharModalCadastro

);



// EVENTOS HABILIDADES


fecharModalHabilidades.addEventListener(

    "click",

    fecharHabilidades

);



// EVENTOS DETALHES


fecharModalDetalhes.addEventListener(

    "click",

    function () {

        modalDetalhes.hidden =
            true;

    }

);



// EVENTOS EXCLUSÃO


fecharModalExcluir.addEventListener(

    "click",

    fecharExclusao

);


cancelarExclusao.addEventListener(

    "click",

    fecharExclusao

);


confirmarExclusao.addEventListener(

    "click",

    excluirProjeto

);



// FECHAR PELO FUNDO


modalProjeto
    .querySelector(
        ".modal-fundo"
    )
    .addEventListener(

        "click",

        fecharModalCadastro

    );


modalHabilidades
    .querySelector(
        ".modal-fundo"
    )
    .addEventListener(

        "click",

        fecharHabilidades

    );


modalDetalhes
    .querySelector(
        ".modal-fundo"
    )
    .addEventListener(

        "click",

        function () {

            modalDetalhes.hidden =
                true;

        }

    );


modalExcluir
    .querySelector(
        ".modal-fundo"
    )
    .addEventListener(

        "click",

        fecharExclusao

    );



// INICIAR


async function iniciarPagina() {

    try {

        await carregarUsuarioRH();


        await Promise.all([

            carregarHabilidades(),

            carregarProjetoHabilidades()

        ]);


        await carregarProjetos();


    } catch (erro) {

        console.error(
            "Erro ao iniciar página:",
            erro
        );

    }

}


iniciarPagina();