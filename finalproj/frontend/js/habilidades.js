
// HABILIDADES - SKILLMATCH




// ELEMENTOS


const modalHabilidade =
    document.getElementById("modal-habilidade");

const abrirModalHabilidade =
    document.getElementById("abrir-modal-habilidade");

const fecharModalHabilidade =
    document.getElementById("fechar-modal-habilidade");

const cancelarHabilidade =
    document.getElementById("cancelar-habilidade");

const formHabilidade =
    document.getElementById("form-habilidade");

const campoHabilidade =
    document.getElementById("nova-habilidade");

const campoNivel =
    document.getElementById("nivel-habilidade");

const campoExperiencia =
    document.getElementById("experiencia-habilidade");

const tabelaHabilidades =
    document.getElementById("tabela-habilidades-corpo");

const contadorHabilidades =
    document.getElementById("contador-habilidades");

const tituloModal =
    document.getElementById("titulo-modal-habilidade");

const botaoSalvar =
    document.getElementById("salvar-habilidade");

const topoNome =
    document.getElementById("topo-nome");



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


// Registro atualmente sendo editado
let idColaboradorHabilidadeEdicao = null;


// Guarda habilidades cadastradas no sistema
let habilidadesDisponiveis = [];



// HEADERS


const headersSupabase = {

    "apikey": SUPABASE_KEY,

    "Content-Type": "application/json"

};



// NÍVEL


function nomeNivel(nivel) {

    const numero =
        Number(nivel);


    if (numero === 1) {
        return "Básico";
    }


    if (numero === 2) {
        return "Intermediário";
    }


    if (numero === 3) {
        return "Avançado";
    }


    return `Nível ${numero}`;

}


function classeNivel(nivel) {

    const numero =
        Number(nivel);


    if (numero === 1) {
        return "basico";
    }


    if (numero === 2) {
        return "intermediario";
    }


    return "avancado";

}



// ANOS DE EXPERIÊNCIA


function converterExperienciaParaAnos(
    experiencia
) {

    switch (experiencia) {

        case "Menos de 6 meses":
        case "6 meses":

            return 0;


        case "1 ano":

            return 1;


        case "2 anos":

            return 2;


        case "3 anos":

            return 3;


        case "4 anos":

            return 4;


        case "5 anos ou mais":

            return 5;


        default:

            return 0;

    }

}



// ABRIR MODAL


function abrirModal() {

    modalHabilidade.classList.add(
        "ativo"
    );


    modalHabilidade.setAttribute(
        "aria-hidden",
        "false"
    );

}



// FECHAR MODAL


function fecharModal() {

    modalHabilidade.classList.remove(
        "ativo"
    );


    modalHabilidade.setAttribute(
        "aria-hidden",
        "true"
    );


    formHabilidade.reset();


    idColaboradorHabilidadeEdicao =
        null;


    tituloModal.textContent =
        "Adicionar Habilidade";


    botaoSalvar.textContent =
        "Adicionar";

}



// CARREGAR NOME DO COLABORADOR


async function carregarNomeColaborador() {

    try {

        const resposta =
            await fetch(

                `${SUPABASE_URL}/colaborador?select=nome&id_colaborador=eq.${idColaborador}`,

                {
                    headers: headersSupabase
                }

            );


        if (!resposta.ok) {
            return;
        }


        const dados =
            await resposta.json();


        if (
            dados.length > 0 &&
            topoNome
        ) {

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



// CARREGAR HABILIDADES DISPONÍVEIS


async function carregarHabilidadesDisponiveis() {

    try {

        const resposta =
            await fetch(

                `${SUPABASE_URL}/habilidade?select=id_habilidade,nome_habilidade&order=nome_habilidade.asc`,

                {
                    headers: headersSupabase
                }

            );


        if (!resposta.ok) {

            throw new Error(
                "Erro ao consultar habilidades."
            );

        }


        habilidadesDisponiveis =
            await resposta.json();


        campoHabilidade.innerHTML = `

            <option value="">
                Selecione a habilidade
            </option>

        `;


        habilidadesDisponiveis.forEach(
            function (habilidade) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    habilidade.id_habilidade;


                option.textContent =
                    habilidade.nome_habilidade;


                campoHabilidade.appendChild(
                    option
                );

            }
        );


    } catch (erro) {

        console.error(
            "Erro ao carregar habilidades:",
            erro
        );


        campoHabilidade.innerHTML = `

            <option value="">
                Erro ao carregar habilidades
            </option>

        `;

    }

}



// CARREGAR HABILIDADES DO COLABORADOR


async function carregarHabilidadesColaborador() {

    try {

        contadorHabilidades.textContent =
            "Carregando habilidades...";


        const resposta =
            await fetch(

                `${SUPABASE_URL}/colaborador_habilidade?select=id_colaborador_habilidade,nivel,experiencia,anos_experiencia,id_habilidade&id_colaborador=eq.${idColaborador}&order=id_colaborador_habilidade.asc`,

                {
                    headers: headersSupabase
                }

            );


        if (!resposta.ok) {

            const erro =
                await resposta.text();


            console.error(
                erro
            );


            throw new Error(
                "Erro ao consultar habilidades do colaborador."
            );

        }


        const registros =
            await resposta.json();


        tabelaHabilidades.innerHTML =
            "";


        registros.forEach(
            function (registro) {

                adicionarLinhaTabela(
                    registro
                );

            }
        );


        atualizarContador();


    } catch (erro) {

        console.error(
            "Erro ao carregar habilidades:",
            erro
        );


        contadorHabilidades.textContent =
            "Não foi possível carregar as habilidades.";

    }

}



// ENCONTRAR NOME DA HABILIDADE


function obterNomeHabilidade(
    idHabilidade
) {

    const habilidade =
        habilidadesDisponiveis.find(
            function (item) {

                return (
                    Number(
                        item.id_habilidade
                    )
                    ===
                    Number(
                        idHabilidade
                    )
                );

            }
        );


    if (!habilidade) {

        return "Habilidade";

    }


    return habilidade.nome_habilidade;

}



// ADICIONAR LINHA NA TABELA


function adicionarLinhaTabela(
    registro
) {

    const linha =
        document.createElement("tr");


    const nomeHabilidade =
        obterNomeHabilidade(
            registro.id_habilidade
        );


    linha.dataset.id =
        registro.id_colaborador_habilidade;


    linha.dataset.idHabilidade =
        registro.id_habilidade;


    linha.dataset.nivel =
        registro.nivel;


    linha.dataset.experiencia =
        registro.experiencia;


    linha.innerHTML = `

        <td class="nome-habilidade">
            ${nomeHabilidade}
        </td>


        <td>

            <span class="nivel ${classeNivel(registro.nivel)}">
                ${nomeNivel(registro.nivel)}
            </span>

        </td>


        <td>
            ${registro.experiencia}
        </td>


        <td class="acoes">

            <button
                type="button"
                class="botao-acao editar"
                title="Editar habilidade"
            >
                ✎
            </button>


            <button
                type="button"
                class="botao-acao excluir"
                title="Remover habilidade"
            >
                ×
            </button>

        </td>

    `;


    tabelaHabilidades.appendChild(
        linha
    );

}



// CONTADOR


function atualizarContador() {

    const quantidade =
        tabelaHabilidades
            .querySelectorAll("tr")
            .length;


    if (quantidade === 1) {

        contadorHabilidades.textContent =
            "Mostrando 1 habilidade cadastrada.";

        return;

    }


    contadorHabilidades.textContent =
        `Mostrando ${quantidade} habilidades cadastradas.`;

}



// VERIFICAR DUPLICIDADE


function habilidadeJaExiste(
    idHabilidade,
    idIgnorado = null
) {

    const linhas =
        tabelaHabilidades
            .querySelectorAll("tr");


    return Array
        .from(linhas)
        .some(
            function (linha) {

                const mesmoRegistro =
                    String(linha.dataset.id)
                    ===
                    String(idIgnorado);


                if (mesmoRegistro) {
                    return false;
                }


                return (
                    Number(
                        linha.dataset.idHabilidade
                    )
                    ===
                    Number(
                        idHabilidade
                    )
                );

            }
        );

}



// ABRIR PARA ADICIONAR


abrirModalHabilidade.addEventListener(
    "click",
    function () {

        idColaboradorHabilidadeEdicao =
            null;


        formHabilidade.reset();


        tituloModal.textContent =
            "Adicionar Habilidade";


        botaoSalvar.textContent =
            "Adicionar";


        abrirModal();

    }
);



// SALVAR


formHabilidade.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const idHabilidade =
            Number(
                campoHabilidade.value
            );


        const nivel =
            Number(
                campoNivel.value
            );


        const experiencia =
            campoExperiencia.value;


        if (
            !idHabilidade ||
            !nivel ||
            !experiencia
        ) {

            alert(
                "Preencha todos os campos."
            );

            return;

        }


        
        // DUPLICIDADE
        

        if (
            habilidadeJaExiste(
                idHabilidade,
                idColaboradorHabilidadeEdicao
            )
        ) {

            alert(
                "Essa habilidade já está cadastrada no seu perfil."
            );

            return;

        }


        const dados = {

            nivel: nivel,

            experiencia: experiencia,

            anos_experiencia:
                converterExperienciaParaAnos(
                    experiencia
                ),

            id_habilidade:
                idHabilidade,

            id_colaborador:
                idColaborador

        };


        try {

            botaoSalvar.disabled =
                true;


            
            // EDITAR
            

            if (
                idColaboradorHabilidadeEdicao
            ) {

                const resposta =
                    await fetch(

                        `${SUPABASE_URL}/colaborador_habilidade?id_colaborador_habilidade=eq.${idColaboradorHabilidadeEdicao}`,

                        {
                            method: "PATCH",

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
                        erro
                    );


                    throw new Error(
                        "Erro ao editar habilidade."
                    );

                }

            }


            
            // ADICIONAR
            

            else {

                const resposta =
                    await fetch(

                        `${SUPABASE_URL}/colaborador_habilidade`,

                        {
                            method: "POST",

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
                        erro
                    );


                    throw new Error(
                        "Erro ao adicionar habilidade."
                    );

                }

            }


            fecharModal();


            // Recarrega direto do banco
            await carregarHabilidadesColaborador();


        } catch (erro) {

            console.error(
                erro
            );


            alert(
                "Não foi possível salvar a habilidade."
            );


        } finally {

            botaoSalvar.disabled =
                false;

        }

    }
);



// EDITAR / EXCLUIR


tabelaHabilidades.addEventListener(
    "click",
    async function (event) {

        const botaoEditar =
            event.target.closest(
                ".editar"
            );


        const botaoExcluir =
            event.target.closest(
                ".excluir"
            );


        const linha =
            event.target.closest(
                "tr"
            );


        if (!linha) {
            return;
        }


        
        // EDITAR
        

        if (botaoEditar) {

            idColaboradorHabilidadeEdicao =
                linha.dataset.id;


            campoHabilidade.value =
                linha.dataset.idHabilidade;


            campoNivel.value =
                linha.dataset.nivel;


            campoExperiencia.value =
                linha.dataset.experiencia;


            tituloModal.textContent =
                "Editar Habilidade";


            botaoSalvar.textContent =
                "Salvar alterações";


            abrirModal();


            return;

        }


        
        // EXCLUIR
        

        if (botaoExcluir) {

            const nome =
                linha
                    .querySelector(
                        ".nome-habilidade"
                    )
                    .textContent
                    .trim();


            const confirmar =
                window.confirm(

                    `Deseja realmente remover a habilidade "${nome}"?`

                );


            if (!confirmar) {
                return;
            }


            try {

                const idRegistro =
                    linha.dataset.id;


                const resposta =
                    await fetch(

                        `${SUPABASE_URL}/colaborador_habilidade?id_colaborador_habilidade=eq.${idRegistro}`,

                        {
                            method: "DELETE",

                            headers:
                                headersSupabase
                        }

                    );


                if (!resposta.ok) {

                    const erro =
                        await resposta.text();


                    console.error(
                        erro
                    );


                    throw new Error(
                        "Erro ao remover habilidade."
                    );

                }


                // Recarrega do banco
                await carregarHabilidadesColaborador();


            } catch (erro) {

                console.error(
                    erro
                );


                alert(
                    "Não foi possível remover a habilidade."
                );

            }

        }

    }
);



// FECHAR MODAL


fecharModalHabilidade.addEventListener(
    "click",
    fecharModal
);


cancelarHabilidade.addEventListener(
    "click",
    fecharModal
);


modalHabilidade.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            modalHabilidade
        ) {

            fecharModal();

        }

    }
);



// ESC


document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            modalHabilidade
                .classList
                .contains("ativo")
        ) {

            fecharModal();

        }

    }
);



// INICIAR PÁGINA


async function iniciarPagina() {

    if (!idColaborador) {

        console.error(
            "ID do colaborador não encontrado."
        );


        window.location.href =
            "index.html";


        return;

    }


    // Primeiro precisamos conhecer
    // todas as habilidades existentes.
    await carregarHabilidadesDisponiveis();


    // Depois carregamos as relações
    // do colaborador.
    await carregarHabilidadesColaborador();


    await carregarNomeColaborador();

}


iniciarPagina();