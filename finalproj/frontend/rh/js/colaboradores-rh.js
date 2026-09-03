
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


let colaboradores = [];

let setores = [];

let cargos = [];

let usuarios = [];

let modoEdicao = false;



// ELEMENTOS


const topoNome =
    document.getElementById(
        "topo-nome"
    );


const usuarioAvatar =
    document.getElementById(
        "usuario-avatar"
    );


const totalColaboradores =
    document.getElementById(
        "total-colaboradores"
    );


const totalAtivos =
    document.getElementById(
        "total-ativos"
    );


const totalInativos =
    document.getElementById(
        "total-inativos"
    );


const pesquisaColaborador =
    document.getElementById(
        "pesquisa-colaborador"
    );


const filtroSetor =
    document.getElementById(
        "filtro-setor"
    );


const filtroCargo =
    document.getElementById(
        "filtro-cargo"
    );


const filtroStatus =
    document.getElementById(
        "filtro-status"
    );


const corpoTabela =
    document.getElementById(
        "corpo-tabela-colaboradores"
    );



// MODAL CADASTRO


const modalColaborador =
    document.getElementById(
        "modal-colaborador"
    );


const abrirModalColaborador =
    document.getElementById(
        "abrir-modal-colaborador"
    );


const fecharModalColaborador =
    document.getElementById(
        "fechar-modal-colaborador"
    );


const cancelarColaborador =
    document.getElementById(
        "cancelar-colaborador"
    );


const formColaborador =
    document.getElementById(
        "form-colaborador"
    );


const tituloModalColaborador =
    document.getElementById(
        "titulo-modal-colaborador"
    );


const descricaoModalColaborador =
    document.getElementById(
        "descricao-modal-colaborador"
    );


const colaboradorId =
    document.getElementById(
        "colaborador-id"
    );


const colaboradorNome =
    document.getElementById(
        "colaborador-nome"
    );


const colaboradorMatricula =
    document.getElementById(
        "colaborador-matricula"
    );


const colaboradorContato =
    document.getElementById(
        "colaborador-contato"
    );


const colaboradorSetor =
    document.getElementById(
        "colaborador-setor"
    );


const colaboradorCargo =
    document.getElementById(
        "colaborador-cargo"
    );


const colaboradorAdmissao =
    document.getElementById(
        "colaborador-admissao"
    );


const colaboradorStatus =
    document.getElementById(
        "colaborador-status"
    );


const colaboradorLogin =
    document.getElementById(
        "colaborador-login"
    );


const colaboradorSenha =
    document.getElementById(
        "colaborador-senha"
    );


const areaLogin =
    document.getElementById(
        "area-login"
    );


const campoLogin =
    document.getElementById(
        "campo-login"
    );


const campoSenha =
    document.getElementById(
        "campo-senha"
    );


const mensagemFormulario =
    document.getElementById(
        "mensagem-formulario"
    );


const salvarColaborador =
    document.getElementById(
        "salvar-colaborador"
    );



// MODAL DETALHES


const modalDetalhes =
    document.getElementById(
        "modal-detalhes"
    );


const fecharModalDetalhes =
    document.getElementById(
        "fechar-modal-detalhes"
    );


const detalhesColaborador =
    document.getElementById(
        "detalhes-colaborador"
    );



// FUNÇÕES AUXILIARES


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


function obterIniciais(nome) {

    if (!nome) {

        return "?";

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



// BUSCAR SETOR


function buscarNomeSetor(
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



// BUSCAR CARGO


function buscarNomeCargo(
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



// BUSCAR USUÁRIO DO COLABORADOR


function buscarUsuarioPorColaborador(
    idColaborador
) {

    return usuarios.find(

        function (usuario) {

            return (
                Number(
                    usuario.id_colaborador
                ) ===
                Number(
                    idColaborador
                )
            );

        }

    );

}



// FILTRAR SOMENTE FUNCIONÁRIOS


function obterColaboradoresFuncionarios() {

    return colaboradores.filter(

        function (colaborador) {

            const usuario =
                buscarUsuarioPorColaborador(
                    colaborador.id_colaborador
                );


            // Se possuir usuário, somente perfil 1
            // será mostrado na gestão.

            if (usuario) {

                return (
                    Number(
                        usuario.id_perfil
                    ) === 1
                );

            }


            // Se ainda não possuir usuário,
            // continua aparecendo como colaborador.

            return true;

        }

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
                "Erro ao buscar RH."
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
            "Erro ao carregar usuário RH:",
            erro
        );

    }

}



// SETORES


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
            "Erro ao buscar setores."
        );

    }


    setores =
        await resposta.json();


    filtroSetor.innerHTML = `

        <option value="">
            Todos os setores
        </option>

    `;


    colaboradorSetor.innerHTML = `

        <option value="">
            Selecione
        </option>

    `;


    setores.forEach(

        function (setor) {

            filtroSetor.innerHTML += `

                <option
                    value="${setor.id_setor}"
                >

                    ${escaparHTML(
                        setor.nome_setor
                    )}

                </option>

            `;


            colaboradorSetor.innerHTML += `

                <option
                    value="${setor.id_setor}"
                >

                    ${escaparHTML(
                        setor.nome_setor
                    )}

                </option>

            `;

        }

    );

}



// CARGOS


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
            "Erro ao buscar cargos."
        );

    }


    cargos =
        await resposta.json();


    filtroCargo.innerHTML = `

        <option value="">
            Todos os cargos
        </option>

    `;


    colaboradorCargo.innerHTML = `

        <option value="">
            Selecione
        </option>

    `;


    cargos.forEach(

        function (cargo) {

            filtroCargo.innerHTML += `

                <option
                    value="${cargo.id_cargo}"
                >

                    ${escaparHTML(
                        cargo.nome_cargo
                    )}

                </option>

            `;


            colaboradorCargo.innerHTML += `

                <option
                    value="${cargo.id_cargo}"
                >

                    ${escaparHTML(
                        cargo.nome_cargo
                    )}

                </option>

            `;

        }

    );

}



// USUÁRIOS


async function carregarUsuarios() {

    const resposta =
        await fetch(

            `${SUPABASE_URL}/usuario?select=id_usuario,login,ativo,id_colaborador,id_perfil`,

            {

                method:
                    "GET",

                headers:
                    headersSupabase

            }

        );


    if (!resposta.ok) {

        throw new Error(
            "Erro ao buscar usuários."
        );

    }


    usuarios =
        await resposta.json();

}



// COLABORADORES


async function carregarColaboradores() {

    try {

        const resposta =
            await fetch(

                `${SUPABASE_URL}/colaborador?select=id_colaborador,matricula,nome,contato,status,data_admissao,foto,id_setor,id_cargo&order=nome.asc`,

                {

                    method:
                        "GET",

                    headers:
                        headersSupabase

                }

            );


        if (!resposta.ok) {

            throw new Error(
                "Erro ao buscar colaboradores."
            );

        }


        colaboradores =
            await resposta.json();


        atualizarResumo();


        aplicarFiltros();


    } catch (erro) {

        console.error(
            "Erro colaboradores:",
            erro
        );


        corpoTabela.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="tabela-vazia"
                >

                    Não foi possível carregar
                    os colaboradores.

                </td>

            </tr>

        `;

    }

}



// RESUMO


function atualizarResumo() {

    const funcionarios =
        obterColaboradoresFuncionarios();


    totalColaboradores.textContent =
        funcionarios.length;


    totalAtivos.textContent =
        funcionarios.filter(

            function (colaborador) {

                return (
                    colaborador.status ===
                    true
                );

            }

        ).length;


    totalInativos.textContent =
        funcionarios.filter(

            function (colaborador) {

                return (
                    colaborador.status ===
                    false
                );

            }

        ).length;

}



// FILTROS


function aplicarFiltros() {

    const pesquisa =
        pesquisaColaborador
            .value
            .trim()
            .toLowerCase();


    const setorSelecionado =
        filtroSetor.value;


    const cargoSelecionado =
        filtroCargo.value;


    const statusSelecionado =
        filtroStatus.value;


    
    // SOMENTE FUNCIONÁRIOS
    

    const funcionarios =
        obterColaboradoresFuncionarios();


    const resultado =
        funcionarios.filter(

            function (colaborador) {

                const nome =
                    colaborador.nome
                        .toLowerCase();


                const correspondePesquisa =
                    nome.includes(
                        pesquisa
                    );


                const correspondeSetor =
                    !setorSelecionado ||

                    Number(
                        colaborador.id_setor
                    ) ===
                    Number(
                        setorSelecionado
                    );


                const correspondeCargo =
                    !cargoSelecionado ||

                    Number(
                        colaborador.id_cargo
                    ) ===
                    Number(
                        cargoSelecionado
                    );


                let correspondeStatus =
                    true;


                if (
                    statusSelecionado !== ""
                ) {

                    correspondeStatus =
                        colaborador.status ===
                        (
                            statusSelecionado ===
                            "true"
                        );

                }


                return (

                    correspondePesquisa &&

                    correspondeSetor &&

                    correspondeCargo &&

                    correspondeStatus

                );

            }

        );


    renderizarColaboradores(
        resultado
    );

}



// RENDERIZAR


function renderizarColaboradores(
    lista
) {

    if (
        !lista ||
        lista.length === 0
    ) {

        corpoTabela.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="tabela-vazia"
                >

                    Nenhum colaborador encontrado.

                </td>

            </tr>

        `;


        return;

    }


    corpoTabela.innerHTML =
        lista
            .map(

                function (colaborador) {

                    const cargo =
                        buscarNomeCargo(
                            colaborador.id_cargo
                        );


                    const setor =
                        buscarNomeSetor(
                            colaborador.id_setor
                        );


                    const usuario =
                        buscarUsuarioPorColaborador(
                            colaborador.id_colaborador
                        );


                    const login =
                        usuario
                            ? usuario.login
                            : colaborador.contato;


                    return `

                        <tr>


                            <td>

                                <div
                                    class="colaborador-info"
                                >

                                    <div
                                        class="avatar-tabela"
                                    >

                                        ${obterIniciais(
                                            colaborador.nome
                                        )}

                                    </div>


                                    <div>

                                        <strong>

                                            ${escaparHTML(
                                                colaborador.nome
                                            )}

                                        </strong>


                                        <span>

                                            ${escaparHTML(
                                                login || ""
                                            )}

                                        </span>

                                    </div>

                                </div>

                            </td>


                            <td>

                                ${escaparHTML(
                                    colaborador.matricula
                                )}

                            </td>


                            <td>

                                ${escaparHTML(
                                    cargo
                                )}

                            </td>


                            <td>

                                ${escaparHTML(
                                    setor
                                )}

                            </td>


                            <td>

                                <span
                                    class="
                                        status-colaborador
                                        ${
                                            colaborador.status
                                                ? "ativo"
                                                : "inativo"
                                        }
                                    "
                                >

                                    ${
                                        colaborador.status
                                            ? "Ativo"
                                            : "Inativo"
                                    }

                                </span>

                            </td>


                            <td>

                                ${formatarData(
                                    colaborador.data_admissao
                                )}

                            </td>


                            <td>

                                <div
                                    class="acoes-tabela"
                                >

                                    <button
                                        type="button"
                                        class="botao-acao"
                                        onclick="
                                            abrirDetalhes(
                                                ${colaborador.id_colaborador}
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
                                            editarColaborador(
                                                ${colaborador.id_colaborador}
                                            )
                                        "
                                    >
                                        Editar
                                    </button>


                                    ${
                                        colaborador.status
                                            ? `
                                                <button
                                                    type="button"
                                                    class="botao-acao desligar"
                                                    onclick="
                                                        desligarColaborador(
                                                            ${colaborador.id_colaborador}
                                                        )
                                                    "
                                                >
                                                    Desligar
                                                </button>
                                            `
                                            : `
                                                <button
                                                    type="button"
                                                    class="botao-acao desligar"
                                                    onclick="
                                                        desligarColaborador(
                                                            ${colaborador.id_colaborador}
                                                        )
                                                    "
                                                >
                                                    Excluir
                                                </button>
                                            `
                                    }

                                </div>

                            </td>


                        </tr>

                    `;

                }

            )
            .join("");

}



// NOVO COLABORADOR


function abrirNovoColaborador() {

    modoEdicao =
        false;


    formColaborador.reset();


    colaboradorId.value =
        "";


    colaboradorStatus.value =
        "true";


    tituloModalColaborador.textContent =
        "Novo colaborador";


    descricaoModalColaborador.textContent =
        "Cadastre um novo funcionário no SkillMatch.";


    salvarColaborador.textContent =
        "Salvar colaborador";


    areaLogin.hidden =
        false;


    campoLogin.hidden =
        false;


    campoSenha.hidden =
        false;


    colaboradorLogin.required =
        true;


    colaboradorSenha.required =
        true;


    mensagemFormulario.textContent =
        "";


    modalColaborador.hidden =
        false;

}



// FECHAR MODAL


function fecharModalCadastro() {

    modalColaborador.hidden =
        true;


    mensagemFormulario.textContent =
        "";

}



// CADASTRAR COLABORADOR


async function cadastrarColaborador() {

    const dadosColaborador = {

        matricula:
            Number(
                colaboradorMatricula.value
            ),

        nome:
            colaboradorNome
                .value
                .trim(),

        contato:
            colaboradorContato
                .value
                .trim(),

        status:
            colaboradorStatus.value ===
            "true",

        data_admissao:
            colaboradorAdmissao.value,

        foto:
            "",

        id_setor:
            Number(
                colaboradorSetor.value
            ),

        id_cargo:
            Number(
                colaboradorCargo.value
            )

    };


    const respostaColaborador =
        await fetch(

            `${SUPABASE_URL}/colaborador`,

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
                        dadosColaborador
                    )

            }

        );


    if (!respostaColaborador.ok) {

        const erro =
            await respostaColaborador.text();


        console.error(
            "Erro colaborador:",
            erro
        );


        throw new Error(
            "Não foi possível cadastrar o colaborador."
        );

    }


    const colaboradoresCriados =
        await respostaColaborador.json();


    const novoColaborador =
        colaboradoresCriados[0];


    
    // CRIAR USUÁRIO
    

    const dadosUsuario = {

        login:
            colaboradorLogin
                .value
                .trim(),

        senha:
            colaboradorSenha
                .value,

        ativo:
            true,

        data_criacao:
            new Date()
                .toISOString()
                .split("T")[0],

        id_colaborador:
            novoColaborador
                .id_colaborador,

        
        // PERFIL 1 = FUNCIONÁRIO
        

        id_perfil:
            1

    };


    const respostaUsuario =
        await fetch(

            `${SUPABASE_URL}/usuario`,

            {

                method:
                    "POST",

                headers:
                    headersSupabase,

                body:
                    JSON.stringify(
                        dadosUsuario
                    )

            }

        );


    if (!respostaUsuario.ok) {

        const erroUsuario =
            await respostaUsuario.text();


        console.error(
            "Erro usuário:",
            erroUsuario
        );


        
        // REMOVE O COLABORADOR CASO O USUÁRIO
        // NÃO POSSA SER CRIADO
        

        await fetch(

            `${SUPABASE_URL}/colaborador?id_colaborador=eq.${novoColaborador.id_colaborador}`,

            {

                method:
                    "DELETE",

                headers:
                    headersSupabase

            }

        );


        throw new Error(
            "Não foi possível criar o usuário do colaborador."
        );

    }

}



// DESLIGAR / EXCLUIR COLABORADOR


async function desligarColaborador(id) {

    const confirmar = confirm(
        "Deseja realmente remover este colaborador?\n\n" +
        "Todos os dados relacionados a ele serão excluídos."
    );

    if (!confirmar) {
        return;
    }

    try {

        // 1. Descobrir o usuário vinculado
        const respostaUsuario = await fetch(
            `${SUPABASE_URL}/usuario?select=id_usuario&id_colaborador=eq.${id}`,
            { headers: headersSupabase }
        );

        if (!respostaUsuario.ok) {
            throw new Error("Não foi possível localizar o usuário do colaborador.");
        }

        const usuariosColaborador = await respostaUsuario.json();

        // 2. Excluir histórico e usuário
        for (const usuario of usuariosColaborador) {

            const respostaHistorico = await fetch(
                `${SUPABASE_URL}/historico_alteracao?id_usuario=eq.${usuario.id_usuario}`,
                { method: "DELETE", headers: headersSupabase }
            );

            if (!respostaHistorico.ok) {
                const mensagem = await respostaHistorico.text();
                throw new Error(`Não foi possível excluir o histórico: ${mensagem}`);
            }

            const respostaExcluirUsuario = await fetch(
                `${SUPABASE_URL}/usuario?id_usuario=eq.${usuario.id_usuario}`,
                { method: "DELETE", headers: headersSupabase }
            );

            if (!respostaExcluirUsuario.ok) {
                const mensagem = await respostaExcluirUsuario.text();
                throw new Error(`Não foi possível excluir o usuário: ${mensagem}`);
            }
        }

        // 3. Excluir vínculos do colaborador
        const tabelasRelacionadas = [
            "colaborador_curso",
            "colaborador_certificacao",
            "colaborador_habilidade",
            "projeto_colaborador"
        ];

        for (const tabela of tabelasRelacionadas) {

            const resposta = await fetch(
                `${SUPABASE_URL}/${tabela}?id_colaborador=eq.${id}`,
                { method: "DELETE", headers: headersSupabase }
            );

            if (!resposta.ok) {
                const mensagem = await resposta.text();
                throw new Error(`Não foi possível excluir dados de ${tabela}: ${mensagem}`);
            }
        }

        // 4. Finalmente, excluir o colaborador
        const respostaColaborador = await fetch(
            `${SUPABASE_URL}/colaborador?id_colaborador=eq.${id}`,
            { method: "DELETE", headers: headersSupabase }
        );

        if (!respostaColaborador.ok) {
            const mensagem = await respostaColaborador.text();
            throw new Error(`Não foi possível excluir o colaborador: ${mensagem}`);
        }

        alert("Colaborador removido com sucesso!");

        await carregarUsuarios();
        await carregarColaboradores();

    } catch (erro) {

        console.error("Erro ao remover colaborador:", erro);
        alert(erro.message);
    }

}



// EDITAR


function editarColaborador(
    id
) {

    const colaborador =
        colaboradores.find(

            function (item) {

                return (
                    Number(
                        item.id_colaborador
                    ) ===
                    Number(id)
                );

            }

        );


    if (!colaborador) {

        return;

    }


    modoEdicao =
        true;


    colaboradorId.value =
        colaborador.id_colaborador;


    colaboradorNome.value =
        colaborador.nome;


    colaboradorMatricula.value =
        colaborador.matricula;


    colaboradorContato.value =
        colaborador.contato;


    colaboradorSetor.value =
        colaborador.id_setor;


    colaboradorCargo.value =
        colaborador.id_cargo;


    colaboradorAdmissao.value =
        colaborador.data_admissao;


    colaboradorStatus.value =
        String(
            colaborador.status
        );


    tituloModalColaborador.textContent =
        "Editar colaborador";


    descricaoModalColaborador.textContent =
        "Atualize os dados do funcionário.";


    salvarColaborador.textContent =
        "Salvar alterações";


    
    // LOGIN NÃO É RECRIADO
    

    areaLogin.hidden =
        true;


    campoLogin.hidden =
        true;


    campoSenha.hidden =
        true;


    colaboradorLogin.required =
        false;


    colaboradorSenha.required =
        false;


    mensagemFormulario.textContent =
        "";


    modalColaborador.hidden =
        false;

}



// ATUALIZAR COLABORADOR


async function atualizarColaborador() {

    const id =
        colaboradorId.value;


    const dados = {

        matricula:
            Number(
                colaboradorMatricula.value
            ),

        nome:
            colaboradorNome
                .value
                .trim(),

        contato:
            colaboradorContato
                .value
                .trim(),

        status:
            colaboradorStatus.value ===
            "true",

        data_admissao:
            colaboradorAdmissao.value,

        id_setor:
            Number(
                colaboradorSetor.value
            ),

        id_cargo:
            Number(
                colaboradorCargo.value
            )

    };


    const resposta =
        await fetch(

            `${SUPABASE_URL}/colaborador?id_colaborador=eq.${id}`,

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
            "Não foi possível atualizar o colaborador."
        );

    }

}



// SUBMIT


formColaborador.addEventListener(

    "submit",

    async function (event) {

        event.preventDefault();


        mensagemFormulario.textContent =
            "";


        salvarColaborador.disabled =
            true;


        salvarColaborador.textContent =
            "Salvando...";


        try {

            if (modoEdicao) {

                await atualizarColaborador();

            } else {

                await cadastrarColaborador();

            }


            fecharModalCadastro();


            await carregarUsuarios();


            await carregarColaboradores();


        } catch (erro) {

            console.error(
                erro
            );


            mensagemFormulario.textContent =
                erro.message;


        } finally {

            salvarColaborador.disabled =
                false;


            salvarColaborador.textContent =
                modoEdicao
                    ? "Salvar alterações"
                    : "Salvar colaborador";

        }

    }

);



// DETALHES


function abrirDetalhes(
    id
) {

    const colaborador =
        colaboradores.find(

            function (item) {

                return (
                    Number(
                        item.id_colaborador
                    ) ===
                    Number(id)
                );

            }

        );


    if (!colaborador) {

        return;

    }


    const usuario =
        buscarUsuarioPorColaborador(
            colaborador.id_colaborador
        );


    detalhesColaborador.innerHTML = `

        <div class="detalhe-item">

            <span>
                Nome
            </span>

            <strong>
                ${escaparHTML(
                    colaborador.nome
                )}
            </strong>

        </div>


        <div class="detalhe-item">

            <span>
                Matrícula
            </span>

            <strong>
                ${escaparHTML(
                    colaborador.matricula
                )}
            </strong>

        </div>


        <div class="detalhe-item">

            <span>
                Login
            </span>

            <strong>

                ${
                    usuario
                        ? escaparHTML(
                            usuario.login
                        )
                        : "-"
                }

            </strong>

        </div>


        <div class="detalhe-item">

            <span>
                Contato
            </span>

            <strong>

                ${escaparHTML(
                    colaborador.contato
                )}

            </strong>

        </div>


        <div class="detalhe-item">

            <span>
                Cargo
            </span>

            <strong>

                ${escaparHTML(
                    buscarNomeCargo(
                        colaborador.id_cargo
                    )
                )}

            </strong>

        </div>


        <div class="detalhe-item">

            <span>
                Setor
            </span>

            <strong>

                ${escaparHTML(
                    buscarNomeSetor(
                        colaborador.id_setor
                    )
                )}

            </strong>

        </div>


        <div class="detalhe-item">

            <span>
                Data de admissão
            </span>

            <strong>

                ${formatarData(
                    colaborador.data_admissao
                )}

            </strong>

        </div>


        <div class="detalhe-item">

            <span>
                Status
            </span>

            <strong>

                ${
                    colaborador.status
                        ? "Ativo"
                        : "Inativo"
                }

            </strong>

        </div>

    `;


    modalDetalhes.hidden =
        false;

}



// EVENTOS FILTROS


pesquisaColaborador.addEventListener(

    "input",

    aplicarFiltros

);


filtroSetor.addEventListener(

    "change",

    aplicarFiltros

);


filtroCargo.addEventListener(

    "change",

    aplicarFiltros

);


filtroStatus.addEventListener(

    "change",

    aplicarFiltros

);



// EVENTOS MODAL


abrirModalColaborador.addEventListener(

    "click",

    abrirNovoColaborador

);


fecharModalColaborador.addEventListener(

    "click",

    fecharModalCadastro

);


cancelarColaborador.addEventListener(

    "click",

    fecharModalCadastro

);


fecharModalDetalhes.addEventListener(

    "click",

    function () {

        modalDetalhes.hidden =
            true;

    }

);



// FECHAR CLICANDO NO FUNDO


modalColaborador
    .querySelector(
        ".modal-fundo"
    )
    .addEventListener(

        "click",

        fecharModalCadastro

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



// INICIAR


async function iniciarPagina() {

    try {

        await carregarUsuarioRH();


        // Precisamos carregar usuários antes
        // de calcular quem é funcionário/RH.

        await Promise.all([

            carregarSetores(),

            carregarCargos(),

            carregarUsuarios()

        ]);


        await carregarColaboradores();


    } catch (erro) {

        console.error(
            "Erro ao iniciar página:",
            erro
        );

    }

}


iniciarPagina();