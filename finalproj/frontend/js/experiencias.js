
// EXPERIÊNCIAS - SKILLMATCH
// CRUD COM SUPABASE




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



// SUPABASE


const headersSupabase = {

    "apikey": SUPABASE_KEY,

    "Content-Type": "application/json"

};



// ELEMENTOS


const modalExperiencia =
    document.getElementById("modal-experiencia");

const abrirModalExperiencia =
    document.getElementById("abrir-modal-experiencia");

const fecharModalExperiencia =
    document.getElementById("fechar-modal-experiencia");

const cancelarExperiencia =
    document.getElementById("cancelar-experiencia");

const formExperiencia =
    document.getElementById("form-experiencia");

const listaExperiencias =
    document.getElementById("lista-experiencias");

const tituloModalExperiencia =
    document.getElementById("titulo-modal-experiencia");

const botaoSalvarExperiencia =
    document.getElementById("salvar-experiencia");


const campoCargo =
    document.getElementById("experiencia-cargo");

const campoEmpresa =
    document.getElementById("experiencia-empresa");

const campoInicio =
    document.getElementById("experiencia-inicio");

const campoFim =
    document.getElementById("experiencia-fim");

const campoAtual =
    document.getElementById("experiencia-atual");

const campoDescricao =
    document.getElementById("experiencia-descricao");

const campoCompetencias =
    document.getElementById("experiencia-competencias");


let experienciaEmEdicao =
    null;



// NOME REAL DO COLABORADOR


async function carregarNomeColaborador() {

    const topoNome =
        document.getElementById("topo-nome");


    if (
        !topoNome ||
        !idColaborador
    ) {

        return;

    }


    try {

        const resposta =
            await fetch(

                `${SUPABASE_URL}/colaborador?select=nome&id_colaborador=eq.${idColaborador}`,

                {
                    headers:
                        headersSupabase
                }

            );


        if (!resposta.ok) {

            const mensagem =
                await resposta.text();


            console.error(
                "Erro ao buscar colaborador:",
                mensagem
            );


            return;

        }


        const dados =
            await resposta.json();


        if (dados.length > 0) {

            topoNome.textContent =
                dados[0].nome;

        }


    } catch (erro) {

        console.error(
            "Erro ao carregar nome:",
            erro
        );

    }

}



// MODAL


function abrirModal() {

    modalExperiencia
        .classList
        .add("ativo");


    modalExperiencia.setAttribute(
        "aria-hidden",
        "false"
    );

}


function fecharModal() {

    modalExperiencia
        .classList
        .remove("ativo");


    modalExperiencia.setAttribute(
        "aria-hidden",
        "true"
    );


    formExperiencia.reset();


    campoFim.disabled =
        false;


    experienciaEmEdicao =
        null;


    tituloModalExperiencia.textContent =
        "Adicionar Experiência";


    botaoSalvarExperiencia.textContent =
        "Adicionar";

}



// DATA


function formatarData(data) {

    if (!data) {

        return "";

    }


    const partes =
        data.split("-");


    return (
        partes[2]
        + "/"
        + partes[1]
        + "/"
        + partes[0]
    );

}



// TAGS


function criarTags(competencias) {

    if (!competencias) {

        return "";

    }


    return competencias
        .split(",")
        .map(
            function (competencia) {

                return competencia.trim();

            }
        )
        .filter(
            function (competencia) {

                return competencia !== "";

            }
        )
        .map(
            function (competencia) {

                return (
                    "<span>"
                    +
                    competencia
                    +
                    "</span>"
                );

            }
        )
        .join("");

}



// CARREGAR EXPERIÊNCIAS


async function carregarExperiencias() {

    try {

        const resposta =
            await fetch(

                `${SUPABASE_URL}/experiencia?select=*&id_colaborador=eq.${idColaborador}&order=data_inicio.desc`,

                {
                    headers:
                        headersSupabase
                }

            );


        if (!resposta.ok) {

            const mensagem =
                await resposta.text();


            console.error(
                mensagem
            );


            return;

        }


        const experiencias =
            await resposta.json();


        listaExperiencias.innerHTML =
            "";


        experiencias.forEach(
            function (experiencia) {

                criarCardExperiencia(
                    experiencia
                );

            }
        );


        atualizarResumo();


    } catch (erro) {

        console.error(
            "Erro ao carregar experiências:",
            erro
        );

    }

}



// CRIAR CARD


function criarCardExperiencia(
    experiencia
) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "experiencia-card";


    card.dataset.idExperiencia =
        experiencia.id_experiencia;

    card.dataset.cargo =
        experiencia.cargo;

    card.dataset.empresa =
        experiencia.empresa;

    card.dataset.dataInicio =
        experiencia.data_inicio;

    card.dataset.dataFim =
        experiencia.data_fim || "";

    card.dataset.atual =
        experiencia.atual;

    card.dataset.descricao =
        experiencia.descricao;

    card.dataset.competencias =
        experiencia.competencias || "";


    const classeSituacao =
        experiencia.atual
            ? "atual"
            : "concluida";


    const textoSituacao =
        experiencia.atual
            ? "Atual"
            : "Concluída";


    const fim =
        experiencia.atual
            ? "Atual"
            : formatarData(
                experiencia.data_fim
            );


    card.innerHTML = `

        <div class="experiencia-topo">

            <div>

                <h3 class="experiencia-cargo">
                    ${experiencia.cargo}
                </h3>

                <p class="empresa">
                    ${experiencia.empresa}
                </p>

            </div>


            <span class="situacao ${classeSituacao}">
                ${textoSituacao}
            </span>

        </div>


        <div class="experiencia-periodo">

            <span class="data-inicio">
                ${formatarData(experiencia.data_inicio)}
            </span>

            <span>
                —
            </span>

            <span class="data-fim">
                ${fim}
            </span>

        </div>


        <p class="descricao">
            ${experiencia.descricao}
        </p>


        <div class="experiencia-tags">

            ${criarTags(
                experiencia.competencias
            )}

        </div>


        <div class="experiencia-acoes">

            <button
                type="button"
                class="editar"
            >
                Editar
            </button>


            <button
                type="button"
                class="excluir"
            >
                Excluir
            </button>

        </div>

    `;


    listaExperiencias.appendChild(
        card
    );

}



// ADICIONAR


abrirModalExperiencia.addEventListener(
    "click",
    function () {

        experienciaEmEdicao =
            null;


        formExperiencia.reset();


        campoFim.disabled =
            false;


        abrirModal();

    }
);



// EMPREGO ATUAL


campoAtual.addEventListener(
    "change",
    function () {

        if (campoAtual.checked) {

            campoFim.value =
                "";

            campoFim.disabled =
                true;

        } else {

            campoFim.disabled =
                false;

        }

    }
);



// SALVAR


formExperiencia.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const atual =
            campoAtual.checked;


        const dados = {

            cargo:
                campoCargo.value.trim(),

            empresa:
                campoEmpresa.value.trim(),

            data_inicio:
                campoInicio.value,

            data_fim:
                atual
                    ? null
                    : campoFim.value,

            atual:
                atual,

            descricao:
                campoDescricao.value.trim(),

            competencias:
                campoCompetencias.value.trim()
                || null,

            id_colaborador:
                idColaborador

        };


        if (
            !dados.cargo ||
            !dados.empresa ||
            !dados.data_inicio ||
            !dados.descricao
        ) {

            alert(
                "Preencha os campos obrigatórios."
            );

            return;

        }


        if (
            !atual &&
            !dados.data_fim
        ) {

            alert(
                "Informe a data de término ou marque que trabalha atualmente nesta função."
            );

            return;

        }


        try {

            botaoSalvarExperiencia.disabled =
                true;


            if (experienciaEmEdicao) {

                const resposta =
                    await fetch(

                        `${SUPABASE_URL}/experiencia?id_experiencia=eq.${experienciaEmEdicao}&id_colaborador=eq.${idColaborador}`,

                        {
                            method:
                                "PATCH",

                            headers:
                                headersSupabase,

                            body:
                                JSON.stringify({
                                    cargo:
                                        dados.cargo,

                                    empresa:
                                        dados.empresa,

                                    data_inicio:
                                        dados.data_inicio,

                                    data_fim:
                                        dados.data_fim,

                                    atual:
                                        dados.atual,

                                    descricao:
                                        dados.descricao,

                                    competencias:
                                        dados.competencias
                                })
                        }

                    );


                if (!resposta.ok) {

                    throw new Error(
                        "Erro ao editar experiência."
                    );

                }

            } else {

                const resposta =
                    await fetch(

                        `${SUPABASE_URL}/experiencia`,

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

                    const mensagem =
                        await resposta.text();


                    console.error(
                        mensagem
                    );


                    throw new Error(
                        "Erro ao adicionar experiência."
                    );

                }

            }


            fecharModal();


            await carregarExperiencias();


        } catch (erro) {

            console.error(
                erro
            );


            alert(
                "Não foi possível salvar a experiência."
            );


        } finally {

            botaoSalvarExperiencia.disabled =
                false;

        }

    }
);



// EDITAR / EXCLUIR


listaExperiencias.addEventListener(
    "click",
    async function (event) {

        const editar =
            event.target.closest(
                ".editar"
            );


        const excluir =
            event.target.closest(
                ".excluir"
            );


        const card =
            event.target.closest(
                ".experiencia-card"
            );


        if (!card) {
            return;
        }


        if (editar) {

            experienciaEmEdicao =
                card.dataset.idExperiencia;


            campoCargo.value =
                card.dataset.cargo;

            campoEmpresa.value =
                card.dataset.empresa;

            campoInicio.value =
                card.dataset.dataInicio;

            campoDescricao.value =
                card.dataset.descricao;

            campoCompetencias.value =
                card.dataset.competencias;


            const atual =
                card.dataset.atual ===
                "true";


            campoAtual.checked =
                atual;


            if (atual) {

                campoFim.value =
                    "";

                campoFim.disabled =
                    true;

            } else {

                campoFim.disabled =
                    false;

                campoFim.value =
                    card.dataset.dataFim;

            }


            tituloModalExperiencia.textContent =
                "Editar Experiência";


            botaoSalvarExperiencia.textContent =
                "Salvar alterações";


            abrirModal();


            return;

        }


        if (excluir) {

            const confirmar =
                window.confirm(
                    `Deseja excluir a experiência "${card.dataset.cargo}"?`
                );


            if (!confirmar) {

                return;

            }


            try {

                const resposta =
                    await fetch(

                        `${SUPABASE_URL}/experiencia?id_experiencia=eq.${card.dataset.idExperiencia}&id_colaborador=eq.${idColaborador}`,

                        {
                            method:
                                "DELETE",

                            headers:
                                headersSupabase
                        }

                    );


                if (!resposta.ok) {

                    throw new Error(
                        "Erro ao excluir experiência."
                    );

                }


                await carregarExperiencias();


            } catch (erro) {

                console.error(
                    erro
                );


                alert(
                    "Não foi possível excluir a experiência."
                );

            }

        }

    }
);



// RESUMO


function atualizarResumo() {

    const experiencias =
        listaExperiencias
            .querySelectorAll(
                ".experiencia-card"
            );


    let atuais = 0;
    let concluidas = 0;


    experiencias.forEach(
        function (card) {

            const status =
                card
                    .querySelector(
                        ".situacao"
                    )
                    .textContent
                    .trim();


            if (
                status === "Atual"
            ) {

                atuais++;

            }


            if (
                status === "Concluída"
            ) {

                concluidas++;

            }

        }
    );


    document.getElementById(
        "total-experiencias"
    ).textContent =
        experiencias.length;


    document.getElementById(
        "total-atuais"
    ).textContent =
        atuais;


    document.getElementById(
        "total-concluidas"
    ).textContent =
        concluidas;

}



// FECHAR


fecharModalExperiencia.addEventListener(
    "click",
    fecharModal
);


cancelarExperiencia.addEventListener(
    "click",
    fecharModal
);


modalExperiencia.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            modalExperiencia
        ) {

            fecharModal();

        }

    }
);



// INICIAR


async function iniciarPagina() {

    if (!idColaborador) {

        window.location.href =
            "index.html";

        return;

    }


    await carregarNomeColaborador();

    await carregarExperiencias();

}


iniciarPagina();