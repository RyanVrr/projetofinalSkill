
// MATCHING RH - SKILLMATCH



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

let colaboradores = [];

let colaboradorHabilidades = [];

let cargos = [];

let setores = [];

let usuarios = [];


// ELEMENTOS

const topoNome =
    document.getElementById(
        "topo-nome"
    );


const usuarioAvatar =
    document.getElementById(
        "usuario-avatar"
    );


const projetoMatching =
    document.getElementById(
        "projeto-matching"
    );


const chatMensagens =
    document.getElementById(
        "chat-mensagens"
    );


const chatForm =
    document.getElementById(
        "chat-form"
    );


const mensagemChat =
    document.getElementById(
        "mensagem-chat"
    );


const enviarMensagem =
    document.getElementById(
        "enviar-mensagem"
    );


const botoesSugestao =
    document.querySelectorAll(
        ".botao-sugestao"
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
    )
    .toUpperCase();

}


// NORMALIZAR TEXTO

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


// CONVERTER NÍVEL
// Aceita número ou texto

function converterNivel(
    nivel
) {

    if (
        nivel === null ||
        nivel === undefined
    ) {

        return 0;

    }


    const numero =
        Number(
            nivel
        );


    if (
        !Number.isNaN(numero) &&
        numero >= 1
    ) {

        return Math.min(
            numero,
            5
        );

    }


    const texto =
        normalizarTexto(
            nivel
        );


    if (
        texto.includes(
            "especialista"
        )
    ) {

        return 5;

    }


    if (
        texto.includes(
            "avanc"
        )
    ) {

        return 4;

    }


    if (
        texto.includes(
            "intermedi"
        )
    ) {

        return 3;

    }


    if (
        texto.includes(
            "basico"
        ) ||
        texto.includes(
            "iniciante"
        )
    ) {

        return 1;

    }


    return 0;

}


// TEXTO NÍVEL

function textoNivel(
    nivel
) {

    const numero =
        converterNivel(
            nivel
        );


    const niveis = {

        1:
            "Básico",

        2:
            "Básico/Intermediário",

        3:
            "Intermediário",

        4:
            "Avançado",

        5:
            "Especialista"

    };


    return (
        niveis[numero] ||
        "Não informado"
    );

}


// TEXTO IMPORTÂNCIA

function textoImportancia(
    importancia
) {

    const valor =
        Number(
            importancia
        );


    const niveis = {

        1:
            "Muito baixa",

        2:
            "Baixa",

        3:
            "Média",

        4:
            "Alta",

        5:
            "Essencial"

    };


    return (
        niveis[valor] ||
        `Nível ${importancia}`
    );

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


// BUSCAR HABILIDADE

function buscarHabilidade(
    idHabilidade
) {

    return habilidades.find(

        function (item) {

            return (
                Number(
                    item.id_habilidade
                ) ===
                Number(
                    idHabilidade
                )
            );

        }

    );

}


// BUSCAR PROJETO

function obterProjetoSelecionado() {

    const idProjeto =
        Number(
            projetoMatching.value
        );


    if (!idProjeto) {

        return null;

    }


    return projetos.find(

        function (projeto) {

            return (
                Number(
                    projeto.id_projeto
                ) ===
                idProjeto
            );

        }

    );

}


// BUSCAR REQUISITOS

function obterRequisitosProjeto(
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

    );

}


// SOMENTE FUNCIONÁRIOS
// Exclui RH

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
                ) ===
                1
            );

        }

    );

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
                "Erro ao buscar usuário RH."
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


// CARREGAR PROJETOS

async function carregarProjetos() {

    const resposta =
        await fetch(

            `${SUPABASE_URL}/projeto?select=id_projeto,nome_projeto,descricao,data_inicio,data_fim&order=nome_projeto.asc`,

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


    preencherProjetos();

}


// PREENCHER PROJETOS

function preencherProjetos() {

    projetoMatching.innerHTML = `

        <option value="">
            Selecione um projeto
        </option>

    `;


    projetos.forEach(

        function (projeto) {

            projetoMatching.innerHTML += `

                <option
                    value="${projeto.id_projeto}"
                >

                    ${escaparHTML(
                        projeto.nome_projeto
                    )}

                </option>

            `;

        }

    );

}


// CARREGAR HABILIDADES

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

}


// PROJETO HABILIDADES

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
            "Erro ao carregar requisitos dos projetos."
        );

    }


    projetoHabilidades =
        await resposta.json();

}


// COLABORADORES

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


// HABILIDADES DOS COLABORADORES

async function carregarColaboradorHabilidades() {

    const resposta =
        await fetch(

            `${SUPABASE_URL}/colaborador_habilidade?select=id_colaborador_habilidade,id_colaborador,id_habilidade,nivel,experiencia,anos_experiencia`,

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


// USUÁRIOS

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


// ADICIONAR MENSAGEM USUÁRIO

function adicionarMensagemUsuario(
    texto
) {

    const html = `

        <div
            class="
                mensagem
                mensagem-usuario
            "
        >

            <div class="mensagem-conteudo">

                <span class="mensagem-remetente">
                    Você
                </span>

                <div
                    class="
                        balao
                        balao-usuario
                    "
                >

                    <p>

                        ${escaparHTML(
                            texto
                        )}

                    </p>

                </div>

            </div>

        </div>

    `;


    chatMensagens.insertAdjacentHTML(
        "beforeend",
        html
    );


    rolarChat();

}


// ADICIONAR MENSAGEM IA

function adicionarMensagemIA(
    html
) {

    const mensagem = `

        <div
            class="
                mensagem
                mensagem-ia
            "
        >

            <div class="mensagem-avatar">
                ✦
            </div>

            <div class="mensagem-conteudo">

                <span class="mensagem-remetente">
                    SkillMatch IA
                </span>

                <div
                    class="
                        balao
                        balao-ia
                    "
                >

                    ${html}

                </div>

            </div>

        </div>

    `;


    chatMensagens.insertAdjacentHTML(
        "beforeend",
        mensagem
    );


    rolarChat();

}


// DIGITANDO

function mostrarDigitando() {

    const html = `

        <div
            class="
                mensagem
                mensagem-ia
            "
            id="mensagem-digitando"
        >

            <div class="mensagem-avatar">
                ✦
            </div>

            <div class="mensagem-conteudo">

                <span class="mensagem-remetente">
                    SkillMatch IA
                </span>

                <div
                    class="
                        balao
                        balao-ia
                        digitando
                    "
                >

                    <span></span>
                    <span></span>
                    <span></span>

                </div>

            </div>

        </div>

    `;


    chatMensagens.insertAdjacentHTML(
        "beforeend",
        html
    );


    rolarChat();

}


// REMOVER DIGITANDO

function removerDigitando() {

    const elemento =
        document.getElementById(
            "mensagem-digitando"
        );


    if (elemento) {

        elemento.remove();

    }

}


// SCROLL

function rolarChat() {

    chatMensagens.scrollTop =
        chatMensagens.scrollHeight;

}


// CALCULAR MATCH DE UM COLABORADOR

function calcularMatch(
    colaborador,
    requisitos
) {

    let pontosObtidos = 0;

    let pontosPossiveis = 0;

    const detalhes = [];


    requisitos.forEach(

        function (requisito) {

            const nivelRequerido =
                Math.max(
                    1,
                    converterNivel(
                        requisito.nivel_requerido
                    )
                );


            const importancia =
                Math.max(
                    1,
                    Number(
                        requisito.nivel_importancia
                    ) || 1
                );


            const pesoMaximo =
                importancia;


            pontosPossiveis +=
                pesoMaximo;


            const habilidadeColaborador =
                colaboradorHabilidades.find(

                    function (item) {

                        return (

                            Number(
                                item.id_colaborador
                            ) ===
                            Number(
                                colaborador.id_colaborador
                            )

                            &&

                            Number(
                                item.id_habilidade
                            ) ===
                            Number(
                                requisito.id_habilidade
                            )

                        );

                    }

                );


            const habilidade =
                buscarHabilidade(
                    requisito.id_habilidade
                );


            const nomeHabilidade =
                habilidade
                    ? habilidade.nome_habilidade
                    : "Habilidade";


            if (!habilidadeColaborador) {

                detalhes.push({

                    nome:
                        nomeHabilidade,

                    situacao:
                        "falta",

                    nivelColaborador:
                        0,

                    nivelRequerido:
                        nivelRequerido

                });


                return;

            }


            const nivelColaborador =
                converterNivel(
                    habilidadeColaborador.nivel
                );


            let proporcao =
                nivelColaborador /
                nivelRequerido;


            if (
                proporcao > 1
            ) {

                proporcao = 1;

            }


            if (
                proporcao < 0
            ) {

                proporcao = 0;

            }


            pontosObtidos +=
                pesoMaximo *
                proporcao;


            let situacao =
                "atende";


            if (
                nivelColaborador <
                nivelRequerido
            ) {

                situacao =
                    "parcial";

            }


            detalhes.push({

                nome:
                    nomeHabilidade,

                situacao:
                    situacao,

                nivelColaborador:
                    nivelColaborador,

                nivelRequerido:
                    nivelRequerido

            });

        }

    );


    let percentual = 0;


    if (
        pontosPossiveis > 0
    ) {

        percentual =
            Math.round(

                (
                    pontosObtidos /
                    pontosPossiveis
                ) *
                100

            );

    }


    return {

        colaborador:
            colaborador,

        percentual:
            percentual,

        detalhes:
            detalhes

    };

}


// EXECUTAR MATCHING

function executarMatching(
    projeto
) {

    const requisitos =
        obterRequisitosProjeto(
            projeto.id_projeto
        );


    if (
        requisitos.length === 0
    ) {

        adicionarMensagemIA(`

            <p>
                O projeto
                <strong>
                    ${escaparHTML(
                        projeto.nome_projeto
                    )}
                </strong>
                ainda não possui habilidades
                exigidas cadastradas.
            </p>

            <p
                style="
                    margin-top: 8px;
                "
            >
                Cadastre as habilidades na
                página de Projetos antes de
                executar o Matching.
            </p>

        `);


        return;

    }


    const funcionarios =
        obterColaboradoresFuncionarios()
            .filter(

                function (
                    colaborador
                ) {

                    return (
                        normalizarTexto(
                            colaborador.status
                        ) !==
                        "inativo"
                    );

                }

            );


    if (
        funcionarios.length === 0
    ) {

        adicionarMensagemIA(`

            <p>
                Nenhum colaborador ativo foi
                encontrado para realizar a análise.
            </p>

        `);


        return;

    }


    const resultados =
        funcionarios

            .map(

                function (
                    colaborador
                ) {

                    return calcularMatch(
                        colaborador,
                        requisitos
                    );

                }

            )

            .sort(

                function (
                    a,
                    b
                ) {

                    return (
                        b.percentual -
                        a.percentual
                    );

                }

            );


    const melhores =
        resultados.slice(
            0,
            5
        );


    let html = `

        <p class="resultado-introducao">

            Analisei os requisitos de

            <strong>
                ${escaparHTML(
                    projeto.nome_projeto
                )}
            </strong>.

            Estes são os colaboradores com
            maior compatibilidade:

        </p>


        <div class="lista-candidatos">

    `;


    melhores.forEach(

        function (
            resultado,
            indice
        ) {

            const colaborador =
                resultado.colaborador;


            let classeCompatibilidade =
                "";


            if (
                resultado.percentual < 50
            ) {

                classeCompatibilidade =
                    "baixa";

            } else if (
                resultado.percentual < 75
            ) {

                classeCompatibilidade =
                    "media";

            }


            let tags = "";


            resultado.detalhes.forEach(

                function (
                    detalhe
                ) {

                    let classe =
                        "";


                    let texto =
                        "Atende";


                    if (
                        detalhe.situacao ===
                        "falta"
                    ) {

                        classe =
                            "falta";


                        texto =
                            "Não possui";

                    }


                    if (
                        detalhe.situacao ===
                        "parcial"
                    ) {

                        classe =
                            "parcial";


                        texto =
                            `Nível ${detalhe.nivelColaborador}/${detalhe.nivelRequerido}`;

                    }


                    tags += `

                        <span
                            class="
                                tag-habilidade
                                ${classe}
                            "
                        >

                            ${escaparHTML(
                                detalhe.nome
                            )}

                            ·

                            ${texto}

                        </span>

                    `;

                }

            );


            html += `

                <div
                    class="candidato-card"
                >

                    <div
                        class="candidato-cabecalho"
                    >

                        <div
                            class="candidato-identidade"
                        >

                            <strong>

                                ${indice + 1}.
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

                                ·

                                ${escaparHTML(
                                    buscarSetor(
                                        colaborador.id_setor
                                    )
                                )}

                            </span>

                        </div>


                        <span
                            class="
                                compatibilidade
                                ${classeCompatibilidade}
                            "
                        >

                            ${resultado.percentual}%
                            compatível

                        </span>

                    </div>


                    <div
                        class="candidato-habilidades"
                    >

                        ${tags}

                    </div>

                </div>

            `;

        }

    );


    html += `

        </div>

        <p
            style="
                margin-top: 13px;
                font-size: 11px;
                color: #818a97;
            "
        >
            A compatibilidade considera as
            habilidades exigidas, o nível requerido
            e a importância de cada competência.
        </p>

    `;


    adicionarMensagemIA(
        html
    );

}


// MOSTRAR REQUISITOS

function mostrarRequisitos(
    projeto
) {

    const requisitos =
        obterRequisitosProjeto(
            projeto.id_projeto
        );


    if (
        requisitos.length === 0
    ) {

        adicionarMensagemIA(`

            <p>
                O projeto
                <strong>
                    ${escaparHTML(
                        projeto.nome_projeto
                    )}
                </strong>
                ainda não possui requisitos
                de habilidades cadastrados.
            </p>

        `);


        return;

    }


    let html = `

        <p>

            Estes são os requisitos cadastrados para

            <strong>

                ${escaparHTML(
                    projeto.nome_projeto
                )}

            </strong>:

        </p>


        <div
            class="lista-requisitos-chat"
        >

    `;


    requisitos.forEach(

        function (
            requisito
        ) {

            const habilidade =
                buscarHabilidade(
                    requisito.id_habilidade
                );


            html += `

                <div
                    class="requisito-chat"
                >

                    <strong>

                        ${escaparHTML(
                            habilidade
                                ? habilidade.nome_habilidade
                                : "Habilidade"
                        )}

                    </strong>

                    <span>

                        ${textoNivel(
                            requisito.nivel_requerido
                        )}

                        ·

                        Importância:

                        ${textoImportancia(
                            requisito.nivel_importancia
                        )}

                    </span>

                </div>

            `;

        }

    );


    html += `

        </div>

    `;


    adicionarMensagemIA(
        html
    );

}


// MELHOR COLABORADOR

function mostrarMelhorColaborador(
    projeto
) {

    const requisitos =
        obterRequisitosProjeto(
            projeto.id_projeto
        );


    if (
        requisitos.length === 0
    ) {

        adicionarMensagemIA(`

            <p>
                Não consigo calcular a compatibilidade
                porque o projeto ainda não possui
                requisitos cadastrados.
            </p>

        `);


        return;

    }


    const funcionarios =
        obterColaboradoresFuncionarios()
            .filter(

                function (
                    colaborador
                ) {

                    return (
                        normalizarTexto(
                            colaborador.status
                        ) !==
                        "inativo"
                    );

                }

            );


    const resultados =
        funcionarios

            .map(

                function (
                    colaborador
                ) {

                    return calcularMatch(
                        colaborador,
                        requisitos
                    );

                }

            )

            .sort(

                function (
                    a,
                    b
                ) {

                    return (
                        b.percentual -
                        a.percentual
                    );

                }

            );


    if (
        resultados.length === 0
    ) {

        adicionarMensagemIA(`

            <p>
                Nenhum colaborador ativo foi encontrado.
            </p>

        `);


        return;

    }


    const melhor =
        resultados[0];


    adicionarMensagemIA(`

        <p>

            O colaborador com maior
            compatibilidade atualmente é

            <strong>

                ${escaparHTML(
                    melhor.colaborador.nome
                )}

            </strong>,

            com

            <strong>

                ${melhor.percentual}%

            </strong>

            de compatibilidade com o projeto.

        </p>

        <p
            style="
                margin-top: 9px;
            "
        >

            Cargo:

            <strong>

                ${escaparHTML(
                    buscarCargo(
                        melhor.colaborador.id_cargo
                    )
                )}

            </strong>.

        </p>

    `);

}


// INTERPRETAR PERGUNTA
// MVP SEM LLM

function interpretarPergunta(
    mensagem
) {

    const projeto =
        obterProjetoSelecionado();


    if (!projeto) {

        adicionarMensagemIA(`

            <p>
                Selecione primeiro um projeto
                no campo acima para que eu
                possa realizar a análise.
            </p>

        `);


        return;

    }


    const texto =
        normalizarTexto(
            mensagem
        );


    if (

        texto.includes(
            "requisito"
        ) ||

        texto.includes(
            "habilidade"
        ) &&

        (
            texto.includes(
                "projeto"
            ) ||
            texto.includes(
                "precisa"
            )
        )

    ) {

        mostrarRequisitos(
            projeto
        );


        return;

    }


    if (

        texto.includes(
            "maior compatibilidade"
        ) ||

        texto.includes(
            "melhor colaborador"
        ) ||

        texto.includes(
            "melhor candidato"
        ) ||

        texto.includes(
            "mais compativel"
        )

    ) {

        mostrarMelhorColaborador(
            projeto
        );


        return;

    }


    if (

        texto.includes(
            "melhores"
        ) ||

        texto.includes(
            "colaborador"
        ) ||

        texto.includes(
            "candidato"
        ) ||

        texto.includes(
            "matching"
        ) ||

        texto.includes(
            "encaixa"
        ) ||

        texto.includes(
            "compativel"
        )

    ) {

        executarMatching(
            projeto
        );


        return;

    }


    adicionarMensagemIA(`

        <p>
            Nesta primeira versão eu consigo
            analisar os colaboradores cadastrados
            para o projeto selecionado.
        </p>

        <p
            style="
                margin-top: 9px;
            "
        >
            Você pode perguntar, por exemplo:
            <strong>
                “Quais são os melhores colaboradores?”
            </strong>
            ou
            <strong>
                “Quais são os requisitos deste projeto?”
            </strong>
        </p>

        <p
            style="
                margin-top: 9px;
                font-size: 11px;
                color: #818a97;
            "
        >
            A interpretação livre da conversa será
            ampliada com a integração da LLM.
        </p>

    `);

}


// PROCESSAR MENSAGEM

async function processarMensagem(
    texto
) {

    adicionarMensagemUsuario(
        texto
    );


    mostrarDigitando();


    enviarMensagem.disabled =
        true;


    await new Promise(

        function (
            resolve
        ) {

            setTimeout(
                resolve,
                550
            );

        }

    );


    removerDigitando();


    interpretarPergunta(
        texto
    );


    enviarMensagem.disabled =
        false;

}


// SUBMIT

chatForm.addEventListener(

    "submit",

    async function (
        event
    ) {

        event.preventDefault();


        const texto =
            mensagemChat
                .value
                .trim();


        if (!texto) {

            return;

        }


        mensagemChat.value =
            "";


        mensagemChat.style.height =
            "auto";


        await processarMensagem(
            texto
        );

    }

);


// BOTÕES DE SUGESTÃO

botoesSugestao.forEach(

    function (
        botao
    ) {

        botao.addEventListener(

            "click",

            async function () {

                const mensagem =
                    botao.dataset.mensagem;


                await processarMensagem(
                    mensagem
                );

            }

        );

    }

);


// ENTER PARA ENVIAR
// SHIFT + ENTER QUEBRA LINHA

mensagemChat.addEventListener(

    "keydown",

    function (
        event
    ) {

        if (

            event.key ===
            "Enter"

            &&

            !event.shiftKey

        ) {

            event.preventDefault();


            chatForm.requestSubmit();

        }

    }

);


// TAMANHO AUTOMÁTICO TEXTAREA

mensagemChat.addEventListener(

    "input",

    function () {

        this.style.height =
            "auto";


        this.style.height =
            Math.min(
                this.scrollHeight,
                120
            ) +
            "px";

    }

);


// TROCA DE PROJETO

projetoMatching.addEventListener(

    "change",

    function () {

        const projeto =
            obterProjetoSelecionado();


        if (!projeto) {

            return;

        }


        adicionarMensagemIA(`

            <p>
                Projeto selecionado:
                <strong>
                    ${escaparHTML(
                        projeto.nome_projeto
                    )}
                </strong>.
            </p>

            <p
                style="
                    margin-top: 8px;
                "
            >
                Posso mostrar os requisitos
                cadastrados ou analisar os
                colaboradores mais compatíveis.
            </p>

        `);

    }

);


// INICIAR PÁGINA

async function iniciarPagina() {

    try {

        adicionarMensagemIA(`

            <p>
                Estou carregando os dados
                necessários para o Matching...
            </p>

        `);


        await carregarUsuarioRH();


        await Promise.all([

            carregarProjetos(),

            carregarHabilidades(),

            carregarProjetoHabilidades(),

            carregarColaboradores(),

            carregarColaboradorHabilidades(),

            carregarCargos(),

            carregarSetores(),

            carregarUsuarios()

        ]);


        adicionarMensagemIA(`

            <p>
                Dados carregados com sucesso.
                Selecione um projeto para começar.
            </p>

        `);


    } catch (erro) {

        console.error(
            "Erro ao iniciar Matching:",
            erro
        );


        adicionarMensagemIA(`

            <p>
                Não foi possível carregar todos
                os dados necessários para o Matching.
            </p>

            <p
                style="
                    margin-top: 8px;
                "
            >
                Verifique o console do navegador
                para identificar o erro.
            </p>

        `);

    }

}


iniciarPagina();