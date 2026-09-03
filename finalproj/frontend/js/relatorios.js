
// RELATÓRIOS - SKILLMATCH

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


const totalHabilidades =
    document.getElementById(
        "total-habilidades"
    );


const totalCursosConcluidos =
    document.getElementById(
        "total-cursos-concluidos"
    );


const totalCertificacoes =
    document.getElementById(
        "total-certificacoes"
    );


const totalExperiencias =
    document.getElementById(
        "total-experiencias"
    );


const listaHabilidades =
    document.getElementById(
        "lista-habilidades-relatorio"
    );


const desenvolvimentoCursosConcluidos =
    document.getElementById(
        "desenvolvimento-cursos-concluidos"
    );


const desenvolvimentoCursosAndamento =
    document.getElementById(
        "desenvolvimento-cursos-andamento"
    );


const desenvolvimentoCertificacoes =
    document.getElementById(
        "desenvolvimento-certificacoes"
    );


const desenvolvimentoExperiencias =
    document.getElementById(
        "desenvolvimento-experiencias"
    );


const principalHabilidade =
    document.getElementById(
        "principal-habilidade"
    );


const nivelMaisAlto =
    document.getElementById(
        "nivel-mais-alto"
    );


const tempoExperiencia =
    document.getElementById(
        "tempo-experiencia"
    );


const ultimaAtualizacao =
    document.getElementById(
        "ultima-atualizacao"
    );



// NÍVEL


function obterNomeNivel(nivel) {

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


    return "-";
}



// PORCENTAGEM


function obterPorcentagemNivel(nivel) {

    const numero =
        Number(nivel);


    if (numero === 1) {
        return 40;
    }


    if (numero === 2) {
        return 70;
    }


    if (numero === 3) {
        return 90;
    }


    return 0;
}



// COR DA BARRA


function obterClasseNivel(nivel) {

    const numero =
        Number(nivel);


    if (numero === 3) {
        return "verde";
    }


    if (numero === 2) {
        return "azul";
    }


    return "cinza";
}



// CARREGAR NOME


async function carregarNome() {

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



// CARREGAR HABILIDADES


async function carregarHabilidades() {

    try {

        const resposta =
            await fetch(

                `${SUPABASE_URL}/colaborador_habilidade?select=id_habilidade,nivel,anos_experiencia&id_colaborador=eq.${idColaborador}`,

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


            return [];

        }


        const registros =
            await resposta.json();


        
        // CONTADOR
        

        if (totalHabilidades) {

            totalHabilidades.textContent =
                registros.length;

        }


        
        // CATÁLOGO
        

        const respostaCatalogo =
            await fetch(

                `${SUPABASE_URL}/habilidade?select=id_habilidade,nome_habilidade`,

                {
                    headers:
                        headersSupabase
                }

            );


        if (!respostaCatalogo.ok) {

            return registros;

        }


        const catalogo =
            await respostaCatalogo.json();


        
        // JUNTAR DADOS
        

        const habilidades =
            registros.map(
                function (registro) {

                    const habilidade =
                        catalogo.find(
                            function (item) {

                                return (
                                    Number(
                                        item.id_habilidade
                                    )
                                    ===
                                    Number(
                                        registro.id_habilidade
                                    )
                                );

                            }
                        );


                    return {

                        ...registro,

                        nome_habilidade:
                            habilidade
                                ? habilidade.nome_habilidade
                                : "Habilidade"

                    };

                }
            );


        
        // ORDENAR
        

        habilidades.sort(
            function (a, b) {

                if (
                    Number(b.nivel) !==
                    Number(a.nivel)
                ) {

                    return (
                        Number(b.nivel) -
                        Number(a.nivel)
                    );

                }


                return (
                    Number(
                        b.anos_experiencia || 0
                    )
                    -
                    Number(
                        a.anos_experiencia || 0
                    )
                );

            }
        );


        
        // MONTAR LISTA
        

        if (listaHabilidades) {

            listaHabilidades.innerHTML =
                "";


            if (
                habilidades.length === 0
            ) {

                listaHabilidades.innerHTML = `

                    <p style="
                        color: #7d8794;
                        font-size: 13px;
                    ">
                        Nenhuma habilidade cadastrada.
                    </p>

                `;

            }


            habilidades
                .slice(0, 5)
                .forEach(
                    function (habilidade) {

                        const nivel =
                            obterNomeNivel(
                                habilidade.nivel
                            );


                        const porcentagem =
                            obterPorcentagemNivel(
                                habilidade.nivel
                            );


                        const classe =
                            obterClasseNivel(
                                habilidade.nivel
                            );


                        const item =
                            document.createElement(
                                "div"
                            );


                        item.className =
                            "habilidade";


                        item.innerHTML = `

                            <div class="habilidade-info">

                                <span>
                                    ${habilidade.nome_habilidade}
                                </span>

                                <strong>
                                    ${nivel}
                                </strong>

                            </div>


                            <div class="barra">

                                <div
                                    class="progresso ${classe}"
                                    style="width: ${porcentagem}%"
                                >
                                </div>

                            </div>

                        `;


                        listaHabilidades.appendChild(
                            item
                        );

                    }
                );

        }


        
        // RESUMO PROFISSIONAL
        

        if (
            habilidades.length > 0
        ) {

            const melhor =
                habilidades[0];


            if (principalHabilidade) {

                principalHabilidade.textContent =
                    melhor.nome_habilidade;

            }


            if (nivelMaisAlto) {

                nivelMaisAlto.textContent =
                    obterNomeNivel(
                        melhor.nivel
                    );

            }


            if (tempoExperiencia) {

                const anos =
                    Number(
                        melhor.anos_experiencia
                        || 0
                    );


                tempoExperiencia.textContent =
                    anos === 1
                        ? "1 ano"
                        : `${anos} anos`;

            }

        } else {

            if (principalHabilidade) {

                principalHabilidade.textContent =
                    "-";

            }


            if (nivelMaisAlto) {

                nivelMaisAlto.textContent =
                    "-";

            }


            if (tempoExperiencia) {

                tempoExperiencia.textContent =
                    "-";

            }

        }


        return habilidades;


    } catch (erro) {

        console.error(
            "Erro ao carregar habilidades:",
            erro
        );


        return [];

    }

}



// CARREGAR CURSOS


async function carregarCursos() {

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

            return [];

        }


        const cursos =
            await resposta.json();


        let concluidos = 0;
        let andamento = 0;


        cursos.forEach(
            function (curso) {

                if (
                    curso.situacao ===
                    "Concluído"
                ) {

                    concluidos++;

                }


                if (
                    curso.situacao ===
                    "Em andamento"
                ) {

                    andamento++;

                }

            }
        );


        if (totalCursosConcluidos) {

            totalCursosConcluidos.textContent =
                concluidos;

        }


        if (
            desenvolvimentoCursosConcluidos
        ) {

            desenvolvimentoCursosConcluidos.textContent =
                concluidos;

        }


        if (
            desenvolvimentoCursosAndamento
        ) {

            desenvolvimentoCursosAndamento.textContent =
                andamento;

        }


        return cursos;


    } catch (erro) {

        console.error(
            "Erro ao carregar cursos:",
            erro
        );


        return [];

    }

}



// CERTIFICAÇÕES


async function carregarCertificacoes() {

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

            return [];

        }


        const certificacoes =
            await resposta.json();


        if (totalCertificacoes) {

            totalCertificacoes.textContent =
                certificacoes.length;

        }


        if (
            desenvolvimentoCertificacoes
        ) {

            desenvolvimentoCertificacoes.textContent =
                certificacoes.length;

        }


        return certificacoes;


    } catch (erro) {

        console.error(
            "Erro ao carregar certificações:",
            erro
        );


        return [];

    }

}



// EXPERIÊNCIAS


async function carregarExperiencias() {

    try {

        const resposta =
            await fetch(

                `${SUPABASE_URL}/experiencia?select=*&id_colaborador=eq.${idColaborador}`,

                {
                    headers:
                        headersSupabase
                }

            );


        if (!resposta.ok) {

            return [];

        }


        const experiencias =
            await resposta.json();


        if (totalExperiencias) {

            totalExperiencias.textContent =
                experiencias.length;

        }


        if (
            desenvolvimentoExperiencias
        ) {

            desenvolvimentoExperiencias.textContent =
                experiencias.length;

        }


        return experiencias;


    } catch (erro) {

        console.error(
            "Erro ao carregar experiências:",
            erro
        );


        return [];

    }

}



// DATA ATUAL


function atualizarData() {

    if (!ultimaAtualizacao) {
        return;
    }


    const hoje =
        new Date();


    ultimaAtualizacao.textContent =
        hoje.toLocaleDateString(
            "pt-BR"
        );

}



// INICIAR


async function iniciarRelatorios() {

    if (!idColaborador) {

        console.error(
            "ID do colaborador não encontrado."
        );


        window.location.href =
            "index.html";


        return;

    }


    try {

        await Promise.all([

            carregarNome(),

            carregarHabilidades(),

            carregarCursos(),

            carregarCertificacoes(),

            carregarExperiencias()

        ]);


        atualizarData();


        console.log(
            "Relatórios carregados com dados reais."
        );


    } catch (erro) {

        console.error(
            "Erro ao iniciar relatórios:",
            erro
        );

    }

}


iniciarRelatorios();