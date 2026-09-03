
// PERFIL - SKILLMATCH
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



// ELEMENTOS DO PERFIL


const perfilNome =
    document.getElementById("perfil-nome");

const perfilCargo =
    document.getElementById("perfil-cargo");

const perfilSetor =
    document.getElementById("perfil-setor");

const perfilStatus =
    document.getElementById("perfil-status");

const perfilMatricula =
    document.getElementById("perfil-matricula");

const perfilContato =
    document.getElementById("perfil-contato");

const perfilAdmissao =
    document.getElementById("perfil-admissao");

const topoNome =
    document.getElementById("topo-nome");


const infoCargo =
    document.getElementById("info-cargo");

const infoSetor =
    document.getElementById("info-setor");

const infoStatus =
    document.getElementById("info-status");

const infoAdmissao =
    document.getElementById("info-admissao");



// FOTO


const inputFoto =
    document.getElementById("input-foto");

const fotoPerfil =
    document.getElementById("foto-perfil");

const fotoPlaceholder =
    document.getElementById("foto-placeholder");



// FORMATAR DATA


function formatarDataPerfil(data) {

    if (!data) {
        return "-";
    }


    const partes =
        data.split("-");


    if (partes.length !== 3) {
        return data;
    }


    return (
        partes[2] +
        "/" +
        partes[1] +
        "/" +
        partes[0]
    );

}



// CARREGAR PERFIL PRINCIPAL


async function carregarPerfil() {

    try {

        if (!idColaborador) {

            console.error(
                "ID do colaborador não encontrado."
            );

            window.location.href =
                "index.html";

            return;

        }


        
        // COLABORADOR
        

        const respostaColaborador =
            await fetch(

                `${SUPABASE_URL}/colaborador?id_colaborador=eq.${idColaborador}`,

                {
                    headers:
                        headersSupabase
                }

            );


        if (!respostaColaborador.ok) {

            const mensagem =
                await respostaColaborador.text();


            console.error(
                mensagem
            );


            throw new Error(
                "Erro ao buscar colaborador."
            );

        }


        const colaboradores =
            await respostaColaborador.json();


        if (colaboradores.length === 0) {

            throw new Error(
                "Colaborador não encontrado."
            );

        }


        const colaborador =
            colaboradores[0];


        
        // CARGO
        

        let nomeCargo = "-";


        if (colaborador.id_cargo) {

            const respostaCargo =
                await fetch(

                    `${SUPABASE_URL}/cargo?id_cargo=eq.${colaborador.id_cargo}`,

                    {
                        headers:
                            headersSupabase
                    }

                );


            if (respostaCargo.ok) {

                const cargos =
                    await respostaCargo.json();


                if (cargos.length > 0) {

                    nomeCargo =
                        cargos[0].nome_cargo;

                }

            }

        }


        
        // SETOR
        

        let nomeSetor = "-";


        if (colaborador.id_setor) {

            const respostaSetor =
                await fetch(

                    `${SUPABASE_URL}/setor?id_setor=eq.${colaborador.id_setor}`,

                    {
                        headers:
                            headersSupabase
                    }

                );


            if (respostaSetor.ok) {

                const setores =
                    await respostaSetor.json();


                if (setores.length > 0) {

                    nomeSetor =
                        setores[0].nome_setor;

                }

            }

        }


        
        // STATUS
        

        const status =
            colaborador.status
                ? "Ativo"
                : "Inativo";


        
        // ADMISSÃO
        

        const admissao =
            formatarDataPerfil(
                colaborador.data_admissao
            );


        
        // PREENCHER PERFIL
        

        if (perfilNome) {

            perfilNome.textContent =
                colaborador.nome;

        }


        if (topoNome) {

            topoNome.textContent =
                colaborador.nome;

        }


        if (perfilCargo) {

            perfilCargo.textContent =
                nomeCargo;

        }


        if (infoCargo) {

            infoCargo.textContent =
                nomeCargo;

        }


        if (perfilSetor) {

            perfilSetor.textContent =
                nomeSetor;

        }


        if (infoSetor) {

            infoSetor.textContent =
                nomeSetor;

        }


        if (perfilStatus) {

            perfilStatus.textContent =
                status;

        }


        if (infoStatus) {

            infoStatus.textContent =
                status;

        }


        if (perfilMatricula) {

            perfilMatricula.textContent =
                colaborador.matricula;

        }


        if (perfilContato) {

            perfilContato.textContent =
                colaborador.contato;

        }


        if (perfilAdmissao) {

            perfilAdmissao.textContent =
                admissao;

        }


        if (infoAdmissao) {

            infoAdmissao.textContent =
                admissao;

        }


        
        // FOTO SALVA NO BANCO
        

        if (
            colaborador.foto &&
            fotoPerfil &&
            fotoPlaceholder
        ) {

            fotoPerfil.src =
                colaborador.foto;

            fotoPerfil.hidden =
                false;

            fotoPlaceholder.style.display =
                "none";

        }


    } catch (erro) {

        console.error(
            "Erro ao carregar perfil:",
            erro
        );

    }

}



// CONTADORES DO PERFIL


async function carregarContadores() {

    try {

        const [
            respostaHabilidades,
            respostaCursos,
            respostaCertificacoes,
            respostaExperiencias
        ] = await Promise.all([

            fetch(
                `${SUPABASE_URL}/colaborador_habilidade?select=id_colaborador_habilidade&id_colaborador=eq.${idColaborador}`,
                {
                    headers:
                        headersSupabase
                }
            ),

            fetch(
                `${SUPABASE_URL}/colaborador_curso?select=id_curso&id_colaborador=eq.${idColaborador}`,
                {
                    headers:
                        headersSupabase
                }
            ),

            fetch(
                `${SUPABASE_URL}/colaborador_certificacao?select=id_colaborador_certificacao&id_colaborador=eq.${idColaborador}`,
                {
                    headers:
                        headersSupabase
                }
            ),

            fetch(
                `${SUPABASE_URL}/experiencia?select=id_experiencia&id_colaborador=eq.${idColaborador}`,
                {
                    headers:
                        headersSupabase
                }
            )

        ]);


        const habilidades =
            respostaHabilidades.ok
                ? await respostaHabilidades.json()
                : [];


        const cursos =
            respostaCursos.ok
                ? await respostaCursos.json()
                : [];


        const certificacoes =
            respostaCertificacoes.ok
                ? await respostaCertificacoes.json()
                : [];


        const experiencias =
            respostaExperiencias.ok
                ? await respostaExperiencias.json()
                : [];


        
        // CARDS
        

        const cards =
            document.querySelectorAll(
                ".cards-resumo .resumo-card strong"
            );


        /*
            Ordem atual do HTML:

            0 = Habilidades
            1 = Cursos
            2 = Certificações
            3 = Experiências
        */


        if (cards[0]) {

            cards[0].textContent =
                habilidades.length;

        }


        if (cards[1]) {

            cards[1].textContent =
                cursos.length;

        }


        if (cards[2]) {

            cards[2].textContent =
                certificacoes.length;

        }


        if (cards[3]) {

            cards[3].textContent =
                experiencias.length;

        }


    } catch (erro) {

        console.error(
            "Erro ao carregar contadores:",
            erro
        );

    }

}



// NÍVEL → TEXTO


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



// NÍVEL → PORCENTAGEM


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



// PRINCIPAIS HABILIDADES


async function carregarPrincipaisHabilidades() {

    try {

        
        // RELAÇÕES DO COLABORADOR
        

        const resposta =
            await fetch(

                `${SUPABASE_URL}/colaborador_habilidade?select=id_habilidade,nivel,anos_experiencia&id_colaborador=eq.${idColaborador}`,

                {
                    headers:
                        headersSupabase
                }

            );


        if (!resposta.ok) {

            throw new Error(
                "Erro ao carregar habilidades."
            );

        }


        let habilidadesColaborador =
            await resposta.json();


        
        // ORDENAR
        

        habilidadesColaborador.sort(
            function (a, b) {

                // Primeiro maior nível
                if (
                    Number(b.nivel) !==
                    Number(a.nivel)
                ) {

                    return (
                        Number(b.nivel) -
                        Number(a.nivel)
                    );

                }


                // Depois mais anos
                return (
                    Number(
                        b.anos_experiencia
                    )
                    -
                    Number(
                        a.anos_experiencia
                    )
                );

            }
        );


        // Máximo 4
        habilidadesColaborador =
            habilidadesColaborador.slice(
                0,
                4
            );


        
        // CATÁLOGO DE HABILIDADES
        

        const respostaCatalogo =
            await fetch(

                `${SUPABASE_URL}/habilidade?select=id_habilidade,nome_habilidade`,

                {
                    headers:
                        headersSupabase
                }

            );


        if (!respostaCatalogo.ok) {

            throw new Error(
                "Erro ao carregar catálogo de habilidades."
            );

        }


        const catalogo =
            await respostaCatalogo.json();


        
        // LOCALIZAR CARD
        

        const cartoes =
            document.querySelectorAll(
                ".grid-inferior .cartao"
            );


        const cardHabilidades =
            cartoes[0];


        if (!cardHabilidades) {
            return;
        }


        /*
            Mantemos somente o título
            e recriamos as habilidades.
        */

        cardHabilidades.innerHTML = `

            <h2>
                Principais Habilidades
            </h2>

        `;


        
        // NENHUMA HABILIDADE
        

        if (
            habilidadesColaborador.length === 0
        ) {

            const mensagem =
                document.createElement(
                    "p"
                );


            mensagem.className =
                "sem-habilidades";


            mensagem.textContent =
                "Nenhuma habilidade cadastrada.";


            mensagem.style.marginTop =
                "20px";


            mensagem.style.fontSize =
                "13px";


            mensagem.style.color =
                "#7b8491";


            cardHabilidades.appendChild(
                mensagem
            );


            return;

        }


        
        // MONTAR HABILIDADES
        

        habilidadesColaborador.forEach(
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


                if (!habilidade) {
                    return;
                }


                const porcentagem =
                    obterPorcentagemNivel(
                        registro.nivel
                    );


                const nomeNivel =
                    obterNomeNivel(
                        registro.nivel
                    );


                const bloco =
                    document.createElement(
                        "div"
                    );


                bloco.className =
                    "habilidade";


                bloco.innerHTML = `

                    <div class="habilidade-info">

                        <span>
                            ${habilidade.nome_habilidade}
                        </span>

                        <strong>
                            ${nomeNivel}
                        </strong>

                    </div>


                    <div class="barra">

                        <div
                            class="progresso azul"
                            style="width: ${porcentagem}%"
                        >
                        </div>

                    </div>

                `;


                cardHabilidades.appendChild(
                    bloco
                );

            }
        );


    } catch (erro) {

        console.error(
            "Erro nas principais habilidades:",
            erro
        );

    }

}



// TROCAR FOTO VISUALMENTE


if (
    inputFoto &&
    fotoPerfil &&
    fotoPlaceholder
) {

    inputFoto.addEventListener(
        "change",
        function () {

            const arquivo =
                inputFoto.files[0];


            if (!arquivo) {
                return;
            }


            if (
                !arquivo.type.startsWith(
                    "image/"
                )
            ) {

                alert(
                    "Selecione uma imagem válida."
                );


                inputFoto.value =
                    "";


                return;

            }


            
            // LIMITE 5 MB
            

            const limite =
                5 * 1024 * 1024;


            if (
                arquivo.size > limite
            ) {

                alert(
                    "A imagem deve ter no máximo 5 MB."
                );


                inputFoto.value =
                    "";


                return;

            }


            const imagemTemporaria =
                URL.createObjectURL(
                    arquivo
                );


            fotoPerfil.src =
                imagemTemporaria;


            fotoPerfil.hidden =
                false;


            fotoPlaceholder.style.display =
                "none";


            fotoPerfil.onload =
                function () {

                    URL.revokeObjectURL(
                        imagemTemporaria
                    );

                };

        }
    );

}



// INICIAR PERFIL


async function iniciarPerfil() {

    if (!idColaborador) {

        window.location.href =
            "index.html";

        return;

    }


    try {

        await Promise.all([

            carregarPerfil(),

            carregarContadores(),

            carregarPrincipaisHabilidades()

        ]);


        console.log(
            "Perfil carregado com dados reais."
        );


    } catch (erro) {

        console.error(
            "Erro ao iniciar perfil:",
            erro
        );

    }

}


iniciarPerfil();