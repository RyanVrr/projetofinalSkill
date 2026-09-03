
// SKILLMATCH - FUNÇÕES GLOBAIS

// OBTER USUÁRIO LOGADO


function obterUsuarioLogado() {

    const usuario =
        localStorage.getItem("usuarioLogado");

    if (!usuario) {
        return null;
    }

    return JSON.parse(usuario);

}



// SALVAR USUÁRIO LOGADO


function salvarUsuarioLogado(usuario) {

    localStorage.setItem(
        "usuarioLogado",
        JSON.stringify(usuario)
    );

}



// REMOVER USUÁRIO LOGADO


function removerUsuarioLogado() {

    localStorage.removeItem(
        "usuarioLogado"
    );

    sessionStorage.removeItem(
        "usuarioLogado"
    );

}



// FORMATAR DATA


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
        partes[2] +
        "/" +
        partes[1] +
        "/" +
        partes[0]
    );

}