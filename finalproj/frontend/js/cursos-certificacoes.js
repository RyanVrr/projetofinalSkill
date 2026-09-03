
// CURSOS E CERTIFICAÇÕES - SKILLMATCH




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



// VARIÁVEIS


let cursosDisponiveis = [];

let cursoEmEdicao = null;

let certificacaoEmEdicao = null;



// FUNÇÕES GERAIS


function abrirModal(modal) {

    if (!modal) {
        return;
    }


    modal.classList.add(
        "ativo"
    );


    modal.setAttribute(
        "aria-hidden",
        "false"
    );

}


function fecharModal(modal) {

    if (!modal) {
        return;
    }


    modal.classList.remove(
        "ativo"
    );


    modal.setAttribute(
        "aria-hidden",
        "true"
    );

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
        partes[2]
        + "/"
        + partes[1]
        + "/"
        + partes[0]
    );

}



// NOME DO COLABORADOR


async function carregarNomeColaborador() {

    const topoNome =
        document.getElementById(
            "topo-nome"
        );


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



// CURSOS - ELEMENTOS


const modalCurso =
    document.getElementById(
        "modal-curso"
    );


const abrirModalCurso =
    document.getElementById(
        "abrir-modal-curso"
    );


const fecharModalCurso =
    document.getElementById(
        "fechar-modal-curso"
    );


const cancelarCurso =
    document.getElementById(
        "cancelar-curso"
    );


const formCurso =
    document.getElementById(
        "form-curso"
    );


const campoCurso =
    document.getElementById(
        "curso-nome"
    );


const cursoInstituicao =
    document.getElementById(
        "curso-instituicao"
    );


const cursoCarga =
    document.getElementById(
        "curso-carga"
    );


const cursoFim =
    document.getElementById(
        "curso-fim"
    );


const cursoSituacao =
    document.getElementById(
        "curso-situacao"
    );


const tituloModalCurso =
    document.getElementById(
        "titulo-modal-curso"
    );


const salvarCurso =
    document.getElementById(
        "salvar-curso"
    );


const corpoTabelaCursos =
    document.getElementById(
        "corpo-tabela-cursos"
    );



// CARREGAR CURSOS DISPONÍVEIS


async function carregarCursosDisponiveis() {

    try {

        const resposta =
            await fetch(
                `${SUPABASE_URL}/curso?select=id_curso,nome_curso,carga_horaria,descricao,instituicao&order=nome_curso.asc`,
                {
                    headers: headersSupabase
                }
            );


        if (!resposta.ok) {

            const mensagem = await resposta.text();

            console.error(
                "Erro no catálogo de cursos:",
                mensagem
            );

            return;

        }


        cursosDisponiveis =
            await resposta.json();

    } catch (erro) {

        console.error(
            "Erro ao carregar cursos:",
            erro
        );

    }

}



// ENCONTRAR CURSO


function encontrarCurso(idCurso) {

    return cursosDisponiveis.find(
        function (curso) {

            return (
                Number(curso.id_curso) ===
                Number(idCurso)
            );

        }
    );

}



// CARREGAR CURSOS DO COLABORADOR


async function carregarCursosColaborador() {

    try {

        const resposta =
            await fetch(

                `${SUPABASE_URL}/colaborador_curso?select=*&id_colaborador=eq.${idColaborador}`,

                {
                    headers:
                        headersSupabase
                }

            );


        if (!resposta.ok) {

            const mensagem =
                await resposta.text();


            console.error(
                "Erro colaborador_curso:",
                mensagem
            );


            return;

        }


        const registros =
            await resposta.json();


        corpoTabelaCursos.innerHTML =
            "";


        registros.forEach(
            function (registro) {

                const curso =
                    encontrarCurso(
                        registro.id_curso
                    );


                if (!curso) {
                    return;
                }


                const linha =
                    document.createElement(
                        "tr"
                    );


                linha.dataset.idCurso =
                    registro.id_curso;


                linha.dataset.dataInicio =
                    registro.data_inicio
                    || "";


                linha.dataset.dataFim =
                    registro.data_fim
                    || "";


                linha.dataset.situacao =
                    registro.situacao
                    || "";


                const classeSituacao =
                    registro.situacao
                    === "Concluído"
                        ? "concluido"
                        : "andamento";


                linha.innerHTML = `

                    <td class="nome-curso">
                        ${curso.nome_curso}
                    </td>


                    <td>
                        ${curso.instituicao}
                    </td>


                    <td>
                        ${curso.carga_horaria}h
                    </td>


                    <td>
                        ${formatarData(registro.data_fim)}
                    </td>


                    <td>

                        <span class="situacao ${classeSituacao}">
                            ${registro.situacao}
                        </span>

                    </td>


                    <td class="acoes">

                        <button
                            type="button"
                            class="botao-acao editar-curso"
                        >
                            ✎
                        </button>


                        <button
                            type="button"
                            class="botao-acao excluir-curso"
                        >
                            ×
                        </button>

                    </td>

                `;


                corpoTabelaCursos.appendChild(
                    linha
                );

            }
        );


        atualizarResumoCursos();


    } catch (erro) {

        console.error(
            "Erro ao carregar cursos:",
            erro
        );

    }

}



// ABRIR CURSO


abrirModalCurso.addEventListener(
    "click",
    function () {

        cursoEmEdicao =
            null;


        formCurso.reset();


        campoCurso.disabled =
            false;

        cursoInstituicao.disabled =
            false;

        cursoCarga.disabled =
            false;


        tituloModalCurso.textContent =
            "Adicionar Curso";


        salvarCurso.textContent =
            "Adicionar";


        abrirModal(
            modalCurso
        );

    }
);



// SALVAR CURSO


formCurso.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const nomeCurso =
            campoCurso.value.trim();

        const instituicao =
            cursoInstituicao.value.trim();

        const cargaHoraria =
            cursoCarga.value.trim();


        if (!nomeCurso) {

            alert(
                "Informe o nome do curso."
            );

            return;

        }


        if (!instituicao) {

            alert(
                "Informe a instituição."
            );

            return;

        }


        if (!cargaHoraria) {

            alert(
                "Informe a carga horária."
            );

            return;

        }


        if (!cursoSituacao.value) {

            alert(
                "Selecione a situação."
            );

            return;

        }


        const numeroCargaHoraria =
            Number(
                cargaHoraria.replace(",", ".").replace(/[^0-9.]/g, "")
            );


        if (!numeroCargaHoraria) {

            alert(
                "Informe uma carga horária válida, por exemplo: 40h."
            );

            return;

        }


        try {

            salvarCurso.disabled =
                true;


            
            // EDITAR
            

            if (cursoEmEdicao) {

                const respostaCurso =
                    await fetch(
                        `${SUPABASE_URL}/curso?id_curso=eq.${cursoEmEdicao}`,
                        {
                            method: "PATCH",
                            headers: headersSupabase,
                            body: JSON.stringify({
                                nome_curso: nomeCurso,
                                instituicao: instituicao,
                                carga_horaria: numeroCargaHoraria
                            })
                        }
                    );


                if (!respostaCurso.ok) {

                    const mensagem = await respostaCurso.text();

                    console.error(
                        "Erro ao editar dados do curso:",
                        mensagem
                    );

                    throw new Error(
                        `Erro ao editar curso: ${mensagem}`
                    );

                }


                const respostaRelacao =
                    await fetch(
                        `${SUPABASE_URL}/colaborador_curso?id_colaborador=eq.${idColaborador}&id_curso=eq.${cursoEmEdicao}`,
                        {
                            method: "PATCH",
                            headers: headersSupabase,
                            body: JSON.stringify({
                                data_fim: cursoFim.value || null,
                                situacao: cursoSituacao.value
                            })
                        }
                    );


                if (!respostaRelacao.ok) {

                    const mensagem = await respostaRelacao.text();

                    console.error(
                        "Erro ao editar vínculo do curso:",
                        mensagem
                    );

                    throw new Error(
                        `Erro ao editar curso: ${mensagem}`
                    );

                }

            }


            
            // ADICIONAR
            

            else {

                const respostaCurso =
                    await fetch(
                        `${SUPABASE_URL}/curso`,
                        {
                            method: "POST",
                            headers: {
                                ...headersSupabase,
                                "Prefer": "return=representation"
                            },
                            body: JSON.stringify({
                                nome_curso: nomeCurso,
                                instituicao: instituicao,
                                carga_horaria: numeroCargaHoraria
                            })
                        }
                    );


                if (!respostaCurso.ok) {

                    const mensagem = await respostaCurso.text();

                    console.error(
                        "Erro ao criar curso:",
                        mensagem
                    );

                    throw new Error(
                        `Erro ao adicionar curso: ${mensagem}`
                    );

                }


                const cursosCriados =
                    await respostaCurso.json();

                const novoCurso =
                    cursosCriados[0];


                if (!novoCurso || !novoCurso.id_curso) {

                    throw new Error(
                        "O curso foi criado, mas o ID não foi retornado pelo banco."
                    );

                }


                const respostaRelacao =
                    await fetch(
                        `${SUPABASE_URL}/colaborador_curso`,
                        {
                            method: "POST",
                            headers: {
                                ...headersSupabase,
                                "Prefer": "return=representation"
                            },
                            body: JSON.stringify({
                                id_curso: novoCurso.id_curso,
                                id_colaborador: idColaborador,
                                data_inicio: null,
                                data_fim: cursoFim.value || null,
                                situacao: cursoSituacao.value
                            })
                        }
                    );


                if (!respostaRelacao.ok) {

                    const mensagem = await respostaRelacao.text();

                    console.error(
                        "Erro ao vincular curso ao colaborador:",
                        mensagem
                    );

                    // Evita deixar um curso órfão se o vínculo falhar.
                    await fetch(
                        `${SUPABASE_URL}/curso?id_curso=eq.${novoCurso.id_curso}`,
                        {
                            method: "DELETE",
                            headers: headersSupabase
                        }
                    );

                    throw new Error(
                        `Erro ao salvar curso: ${mensagem}`
                    );

                }

            }


            fecharModal(
                modalCurso
            );


            await carregarCursosColaborador();


        } catch (erro) {

            console.error(
                erro
            );


            alert(
                erro.message
            );


        } finally {

            salvarCurso.disabled =
                false;

        }

    }
);



// EDITAR / EXCLUIR CURSO


corpoTabelaCursos.addEventListener(
    "click",
    async function (event) {

        const editar =
            event.target.closest(
                ".editar-curso"
            );


        const excluir =
            event.target.closest(
                ".excluir-curso"
            );


        const linha =
            event.target.closest(
                "tr"
            );


        if (!linha) {
            return;
        }


        const idCurso =
            Number(
                linha.dataset.idCurso
            );


        
        // EDITAR
        

        if (editar) {

            cursoEmEdicao =
                idCurso;


            const curso =
                encontrarCurso(idCurso);


            if (!curso) {

                alert(
                    "Não foi possível carregar os dados do curso."
                );

                return;

            }


            campoCurso.value =
                curso.nome_curso || "";


            cursoInstituicao.value =
                curso.instituicao || "";


            cursoCarga.value =
                curso.carga_horaria != null
                    ? `${curso.carga_horaria}h`
                    : "";


            campoCurso.disabled =
                false;


            cursoInstituicao.disabled =
                false;


            cursoCarga.disabled =
                false;


            cursoFim.value =
                linha.dataset.dataFim;


            cursoSituacao.value =
                linha.dataset.situacao;


            tituloModalCurso.textContent =
                "Editar Curso";


            salvarCurso.textContent =
                "Salvar alterações";


            abrirModal(
                modalCurso
            );


            return;

        }


        
        // EXCLUIR
        

        if (excluir) {

            const nome =
                linha
                    .querySelector(
                        ".nome-curso"
                    )
                    .textContent
                    .trim();


            const confirmar =
                window.confirm(
                    `Deseja remover o curso "${nome}"?`
                );


            if (!confirmar) {
                return;
            }


            const resposta =
                await fetch(

                    `${SUPABASE_URL}/colaborador_curso?id_colaborador=eq.${idColaborador}&id_curso=eq.${idCurso}`,

                    {
                        method:
                            "DELETE",

                        headers:
                            headersSupabase
                    }

                );


            if (!resposta.ok) {

                alert(
                    "Não foi possível excluir o curso."
                );


                return;

            }


            await carregarCursosColaborador();

        }

    }
);



// RESUMO CURSOS


function atualizarResumoCursos() {

    const linhas =
        corpoTabelaCursos
            .querySelectorAll(
                "tr"
            );


    let concluidos = 0;

    let andamento = 0;


    linhas.forEach(
        function (linha) {

            const status =
                linha.dataset.situacao;


            if (
                status ===
                "Concluído"
            ) {

                concluidos++;

            }


            if (
                status ===
                "Em andamento"
            ) {

                andamento++;

            }

        }
    );


    document.getElementById(
        "total-cursos"
    ).textContent =
        linhas.length;


    document.getElementById(
        "total-concluidos"
    ).textContent =
        concluidos;


    document.getElementById(
        "total-andamento"
    ).textContent =
        andamento;

}



// CERTIFICAÇÕES - ELEMENTOS


const modalCertificacao =
    document.getElementById(
        "modal-certificacao"
    );


const abrirModalCertificacao =
    document.getElementById(
        "abrir-modal-certificacao"
    );


const fecharModalCertificacao =
    document.getElementById(
        "fechar-modal-certificacao"
    );


const cancelarCertificacao =
    document.getElementById(
        "cancelar-certificacao"
    );


const formCertificacao =
    document.getElementById(
        "form-certificacao"
    );


const campoCertificacaoNome =
    document.getElementById(
        "certificacao-nome"
    );


const campoCertificacaoOrgao =
    document.getElementById(
        "certificacao-orgao"
    );


const campoObtencao =
    document.getElementById(
        "certificacao-obtencao"
    );


const campoEmissao =
    document.getElementById(
        "certificacao-emissao"
    );


const campoValidade =
    document.getElementById(
        "certificacao-validade"
    );


const tituloModalCertificacao =
    document.getElementById(
        "titulo-modal-certificacao"
    );


const salvarCertificacao =
    document.getElementById(
        "salvar-certificacao"
    );


const listaCertificacoes =
    document.getElementById(
        "lista-certificacoes"
    );



// CARREGAR CERTIFICAÇÕES


async function carregarCertificacoesColaborador() {

    try {

        const resposta =
            await fetch(

                `${SUPABASE_URL}/colaborador_certificacao?select=*&id_colaborador=eq.${idColaborador}`,

                {
                    headers:
                        headersSupabase
                }

            );


        if (!resposta.ok) {

            const mensagem =
                await resposta.text();


            console.error(
                "Erro colaborador_certificacao:",
                mensagem
            );


            return;

        }


        const registros =
            await resposta.json();


        listaCertificacoes.innerHTML =
            "";


        for (
            const registro
            of registros
        ) {

            // Busca os dados da certificação
            const respostaCertificacao =
                await fetch(

                    `${SUPABASE_URL}/certificacao?id_certificacao=eq.${registro.id_certificacao}`,

                    {
                        headers:
                            headersSupabase
                    }

                );


            if (
                !respostaCertificacao.ok
            ) {

                continue;

            }


            const certificacoes =
                await respostaCertificacao
                    .json();


            if (
                certificacoes.length === 0
            ) {

                continue;

            }


            const certificacao =
                certificacoes[0];


            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "certificacao-card";


            card.dataset.id =
                registro
                    .id_colaborador_certificacao;


            card.dataset.idCertificacao =
                registro.id_certificacao;


            card.dataset.nome =
                certificacao.nome_certificacao;


            card.dataset.orgao =
                certificacao.orgao_emissor
                || "";


            card.dataset.obtencao =
                registro.data_obtencao
                || "";


            card.dataset.emissao =
                registro.data_emissao
                || "";


            card.dataset.validade =
                registro.data_validade
                || "";


            card.innerHTML = `

                <div class="certificacao-topo">

                    <div class="certificacao-icone">
                        ✓
                    </div>

                    <span class="certificacao-status valida">
                        Válida
                    </span>

                </div>


                <h3 class="nome-certificacao">
                    ${certificacao.nome_certificacao}
                </h3>


                <p class="orgao">
                    ${certificacao.orgao_emissor || "-"}
                </p>


                <div class="certificacao-dados">

                    <div>

                        <span>
                            Emissão
                        </span>

                        <strong>
                            ${formatarData(registro.data_emissao)}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Validade
                        </span>

                        <strong>
                            ${formatarData(registro.data_validade)}
                        </strong>

                    </div>

                </div>


                <div class="certificacao-acoes">

                    <button
                        type="button"
                        class="editar-certificacao"
                    >
                        Editar
                    </button>


                    <button
                        type="button"
                        class="excluir-certificacao"
                    >
                        Remover
                    </button>

                </div>

            `;


            listaCertificacoes.appendChild(
                card
            );

        }


        document.getElementById(
            "total-certificacoes"
        ).textContent =
            registros.length;


    } catch (erro) {

        console.error(
            "Erro ao carregar certificações:",
            erro
        );

    }

}



// ABRIR CERTIFICAÇÃO


abrirModalCertificacao.addEventListener(
    "click",
    function () {

        certificacaoEmEdicao =
            null;


        formCertificacao.reset();


        tituloModalCertificacao.textContent =
            "Adicionar Certificação";


        salvarCertificacao.textContent =
            "Adicionar";


        abrirModal(
            modalCertificacao
        );

    }
);



// SALVAR CERTIFICAÇÃO


formCertificacao.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const nome =
            campoCertificacaoNome
                .value
                .trim();


        const orgao =
            campoCertificacaoOrgao
                .value
                .trim();


        if (
            !nome ||
            !orgao ||
            !campoObtencao.value ||
            !campoEmissao.value ||
            !campoValidade.value
        ) {

            alert(
                "Preencha todos os campos."
            );


            return;

        }


        try {

            salvarCertificacao.disabled =
                true;


            
            // EDITAR
            

            if (certificacaoEmEdicao) {

                const card =
                    listaCertificacoes
                        .querySelector(
                            `.certificacao-card[data-id="${certificacaoEmEdicao}"]`
                        );


                if (!card) {

                    throw new Error(
                        "Certificação não encontrada na tela."
                    );

                }


                const idCertificacao =
                    card.dataset.idCertificacao;


                // Atualiza nome e órgão
                const respostaCertificacao =
                    await fetch(

                        `${SUPABASE_URL}/certificacao?id_certificacao=eq.${idCertificacao}`,

                        {
                            method:
                                "PATCH",

                            headers:
                                headersSupabase,

                            body:
                                JSON.stringify({

                                    nome_certificacao:
                                        nome,

                                    orgao_emissor:
                                        orgao

                                })
                        }

                    );


                if (
                    !respostaCertificacao.ok
                ) {

                    const mensagem =
                        await respostaCertificacao
                            .text();


                    console.error(
                        mensagem
                    );


                    throw new Error(
                        "Erro ao editar certificação."
                    );

                }


                // Atualiza as datas da relação
                const respostaRelacao =
                    await fetch(

                        `${SUPABASE_URL}/colaborador_certificacao?id_colaborador_certificacao=eq.${certificacaoEmEdicao}`,

                        {
                            method:
                                "PATCH",

                            headers:
                                headersSupabase,

                            body:
                                JSON.stringify({

                                    data_obtencao:
                                        campoObtencao.value,

                                    data_emissao:
                                        campoEmissao.value,

                                    data_validade:
                                        campoValidade.value

                                })
                        }

                    );


                if (
                    !respostaRelacao.ok
                ) {

                    const mensagem =
                        await respostaRelacao
                            .text();


                    console.error(
                        mensagem
                    );


                    throw new Error(
                        "Erro ao editar vínculo da certificação."
                    );

                }

            }


            
            // ADICIONAR
            

            else {

                // PRIMEIRO:
                // cria a certificação
                const respostaCertificacao =
                    await fetch(

                        `${SUPABASE_URL}/certificacao`,

                        {
                            method:
                                "POST",

                            headers: {

                                ...headersSupabase,

                                "Prefer":
                                    "return=representation"

                            },

                            body:
                                JSON.stringify({

                                    nome_certificacao:
                                        nome,

                                    orgao_emissor:
                                        orgao

                                })
                        }

                    );


                if (
                    !respostaCertificacao.ok
                ) {

                    const mensagem =
                        await respostaCertificacao
                            .text();


                    console.error(
                        "Erro certificacao:",
                        mensagem
                    );


                    throw new Error(
                        "Erro ao cadastrar certificação."
                    );

                }


                const certificacoesCriadas =
                    await respostaCertificacao
                        .json();


                const novaCertificacao =
                    certificacoesCriadas[0];


                if (!novaCertificacao) {

                    throw new Error(
                        "O Supabase não retornou a certificação criada."
                    );

                }


                // SEGUNDO:
                // relaciona ao colaborador
                const respostaRelacao =
                    await fetch(

                        `${SUPABASE_URL}/colaborador_certificacao`,

                        {
                            method:
                                "POST",

                            headers: {

                                ...headersSupabase,

                                "Prefer":
                                    "return=representation"

                            },

                            body:
                                JSON.stringify({

                                    id_certificacao:
                                        novaCertificacao
                                            .id_certificacao,

                                    id_colaborador:
                                        idColaborador,

                                    data_obtencao:
                                        campoObtencao.value,

                                    data_emissao:
                                        campoEmissao.value,

                                    data_validade:
                                        campoValidade.value

                                })
                        }

                    );


                if (
                    !respostaRelacao.ok
                ) {

                    const mensagem =
                        await respostaRelacao
                            .text();


                    console.error(
                        "Erro colaborador_certificacao:",
                        mensagem
                    );


                    throw new Error(
                        "Erro ao vincular certificação ao colaborador."
                    );

                }

            }


            fecharModal(
                modalCertificacao
            );


            formCertificacao.reset();


            await carregarCertificacoesColaborador();


        } catch (erro) {

            console.error(
                "Erro ao salvar certificação:",
                erro
            );


            alert(
                "Não foi possível salvar a certificação."
            );


        } finally {

            salvarCertificacao.disabled =
                false;

        }

    }
);



// EDITAR / EXCLUIR CERTIFICAÇÃO


listaCertificacoes.addEventListener(
    "click",
    async function (event) {

        const editar =
            event.target.closest(
                ".editar-certificacao"
            );


        const excluir =
            event.target.closest(
                ".excluir-certificacao"
            );


        const card =
            event.target.closest(
                ".certificacao-card"
            );


        if (!card) {
            return;
        }


        
        // EDITAR
        

        if (editar) {

            certificacaoEmEdicao =
                card.dataset.id;


            campoCertificacaoNome.value =
                card.dataset.nome;


            campoCertificacaoOrgao.value =
                card.dataset.orgao;


            campoObtencao.value =
                card.dataset.obtencao;


            campoEmissao.value =
                card.dataset.emissao;


            campoValidade.value =
                card.dataset.validade;


            tituloModalCertificacao.textContent =
                "Editar Certificação";


            salvarCertificacao.textContent =
                "Salvar alterações";


            abrirModal(
                modalCertificacao
            );


            return;

        }


        
        // EXCLUIR
        

        if (excluir) {

            const nome =
                card.dataset.nome;


            const confirmar =
                window.confirm(
                    `Deseja remover a certificação "${nome}"?`
                );


            if (!confirmar) {
                return;
            }


            try {

                const idRelacao =
                    card.dataset.id;


                const idCertificacao =
                    card.dataset.idCertificacao;


                // Primeiro remove vínculo
                const respostaRelacao =
                    await fetch(

                        `${SUPABASE_URL}/colaborador_certificacao?id_colaborador_certificacao=eq.${idRelacao}&id_colaborador=eq.${idColaborador}`,

                        {
                            method:
                                "DELETE",

                            headers:
                                headersSupabase
                        }

                    );


                if (
                    !respostaRelacao.ok
                ) {

                    const mensagem =
                        await respostaRelacao
                            .text();


                    console.error(
                        mensagem
                    );


                    throw new Error(
                        "Erro ao remover certificação do perfil."
                    );

                }


                /*
                    Como agora cada certificação é
                    cadastrada pelo próprio colaborador,
                    removemos também o cadastro dela.
                */

                const respostaCertificacao =
                    await fetch(

                        `${SUPABASE_URL}/certificacao?id_certificacao=eq.${idCertificacao}`,

                        {
                            method:
                                "DELETE",

                            headers:
                                headersSupabase
                        }

                    );


                if (
                    !respostaCertificacao.ok
                ) {

                    const mensagem =
                        await respostaCertificacao
                            .text();


                    console.error(
                        "Não foi possível apagar cadastro da certificação:",
                        mensagem
                    );

                }


                await carregarCertificacoesColaborador();


            } catch (erro) {

                console.error(
                    erro
                );


                alert(
                    "Não foi possível remover a certificação."
                );

            }

        }

    }
);



// FECHAR MODAIS


fecharModalCurso.addEventListener(
    "click",
    function () {

        fecharModal(
            modalCurso
        );

    }
);


cancelarCurso.addEventListener(
    "click",
    function () {

        fecharModal(
            modalCurso
        );

    }
);


fecharModalCertificacao.addEventListener(
    "click",
    function () {

        fecharModal(
            modalCertificacao
        );

    }
);


cancelarCertificacao.addEventListener(
    "click",
    function () {

        fecharModal(
            modalCertificacao
        );

    }
);



// CLICAR FORA DO MODAL


document
    .querySelectorAll(
        ".modal-overlay"
    )
    .forEach(
        function (modal) {

            modal.addEventListener(
                "click",
                function (event) {

                    if (
                        event.target ===
                        modal
                    ) {

                        fecharModal(
                            modal
                        );

                    }

                }
            );

        }
    );



// ESC


document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key !==
            "Escape"
        ) {

            return;

        }


        document
            .querySelectorAll(
                ".modal-overlay.ativo"
            )
            .forEach(
                function (modal) {

                    fecharModal(
                        modal
                    );

                }
            );

    }
);



// INICIAR PÁGINA


async function iniciarPagina() {

    if (!idColaborador) {

        window.location.href =
            "index.html";


        return;

    }


    try {

        await carregarCursosDisponiveis();

        await carregarCursosColaborador();

        await carregarCertificacoesColaborador();

        await carregarNomeColaborador();


    } catch (erro) {

        console.error(
            "Erro ao iniciar página:",
            erro
        );

    }

}


iniciarPagina();    