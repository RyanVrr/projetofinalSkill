
// LOGIN - SKILLMATCH




// MOSTRAR / OCULTAR SENHA


const senha =
    document.getElementById("senha");


const mostrarSenha =
    document.getElementById(
        "mostrar-senha"
    );


const riscoOlho =
    document.getElementById(
        "risco-olho"
    );


mostrarSenha.addEventListener(

    "click",

    function () {

        if (
            senha.type ===
            "password"
        ) {

            senha.type =
                "text";


            riscoOlho.style.display =
                "none";


            mostrarSenha.setAttribute(
                "aria-label",
                "Ocultar senha"
            );

        } else {

            senha.type =
                "password";


            riscoOlho.style.display =
                "block";


            mostrarSenha.setAttribute(
                "aria-label",
                "Mostrar senha"
            );

        }

    }

);



// LOGIN


const formLogin =
    document.getElementById(
        "form-login"
    );


const mensagemLogin =
    document.getElementById(
        "mensagem-login"
    );


formLogin.addEventListener(

    "submit",

    async function (event) {

        event.preventDefault();


        const email =
            document
                .getElementById(
                    "email"
                )
                .value
                .trim();


        const senhaDigitada =
            document
                .getElementById(
                    "senha"
                )
                .value;


        mensagemLogin.textContent =
            "";


        try {

            const resposta =
                await fetch(

                    `${SUPABASE_URL}/usuario?login=eq.${encodeURIComponent(email)}&senha=eq.${encodeURIComponent(senhaDigitada)}&ativo=eq.true`,

                    {

                        method:
                            "GET",

                        headers: {

                            "apikey":
                                SUPABASE_KEY

                        }

                    }

                );


            if (!resposta.ok) {

                const erroResposta =
                    await resposta.text();


                console.error(
                    "Resposta do Supabase:",
                    erroResposta
                );


                throw new Error(
                    "Erro ao consultar usuário."
                );

            }


            const usuarios =
                await resposta.json();


            
            // LOGIN CORRETO
            

            if (
                usuarios.length > 0
            ) {

                const usuario =
                    usuarios[0];


                // Guarda o usuário logado
                localStorage.setItem(

                    "usuarioLogado",

                    JSON.stringify(
                        usuario
                    )

                );


                console.log(
                    "Usuário logado:",
                    usuario
                );


                
                // REDIRECIONAMENTO POR PERFIL
                

                if (
                    Number(
                        usuario.id_perfil
                    ) === 2
                ) {

                    
                    // RH
                    

                    window.location.href =
                        "rh/dashboard-rh.html";


                } else {

                    
                    // FUNCIONÁRIO
                    

                    window.location.href =
                        "perfil.html";

                }


            } else {

                mensagemLogin.textContent =
                    "E-mail ou senha incorretos.";

            }


        } catch (erro) {

            console.error(
                "Erro:",
                erro
            );


            mensagemLogin.textContent =
                "Não foi possível realizar o login.";

        }

    }

);