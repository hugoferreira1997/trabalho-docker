// ==========================================
// LISTAR POSTS
// ==========================================

async function carregarPosts() {
    const areaPosts = document.getElementById("posts");

    try {
        const resposta = await fetch("/api/posts");

        if (!resposta.ok) {
            throw new Error("Erro ao consultar a API");
        }

        const posts = await resposta.json();

        areaPosts.innerHTML = "";

        posts.forEach(post => {
            const card = document.createElement("div");
            card.classList.add("card");

            card.innerHTML = `
                <h3>${post.titulo}</h3>

                <p>${post.descricao}</p>

                <div class="acoes">

                    <button onclick="editarPost(
                        ${post.id},
                        '${escaparTexto(post.titulo)}',
                        '${escaparTexto(post.descricao)}'
                    )">
                        Editar
                    </button>

                    <button onclick="excluirPost(${post.id})">
                        Excluir
                    </button>

                </div>
            `;

            areaPosts.appendChild(card);
        });

    } catch (erro) {
        areaPosts.innerHTML = `
            <div class="card">
                <h3>Erro</h3>
                <p>Não foi possível carregar os dados da API.</p>
            </div>
        `;

        console.error(erro);
    }
}


// ==========================================
// ADICIONAR POST
// ==========================================

async function adicionarPost(evento) {
    evento.preventDefault();

    const titulo = document.getElementById("titulo").value;
    const descricao = document.getElementById("descricao").value;

    try {
        const resposta = await fetch("/api/posts", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                titulo: titulo,
                descricao: descricao
            })
        });

        if (!resposta.ok) {
            throw new Error("Erro ao adicionar post");
        }

        document.getElementById("form-post").reset();

        await carregarPosts();

    } catch (erro) {
        alert("Não foi possível adicionar o post.");
        console.error(erro);
    }
}


// ==========================================
// EDITAR POST
// ==========================================

async function editarPost(id, tituloAtual, descricaoAtual) {

    const novoTitulo = prompt(
        "Digite o novo título:",
        tituloAtual
    );

    if (novoTitulo === null) {
        return;
    }

    const novaDescricao = prompt(
        "Digite a nova descrição:",
        descricaoAtual
    );

    if (novaDescricao === null) {
        return;
    }

    if (
        novoTitulo.trim() === "" ||
        novaDescricao.trim() === ""
    ) {
        alert("Título e descrição são obrigatórios.");
        return;
    }

    try {
        const resposta = await fetch(`/api/posts/${id}`, {
            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                titulo: novoTitulo,
                descricao: novaDescricao
            })
        });

        if (!resposta.ok) {
            throw new Error("Erro ao atualizar post");
        }

        await carregarPosts();

    } catch (erro) {
        alert("Não foi possível atualizar o post.");
        console.error(erro);
    }
}


// ==========================================
// EXCLUIR POST
// ==========================================

async function excluirPost(id) {

    const confirmar = confirm(
        "Tem certeza que deseja excluir este post?"
    );

    if (!confirmar) {
        return;
    }

    try {
        const resposta = await fetch(`/api/posts/${id}`, {
            method: "DELETE"
        });

        if (!resposta.ok) {
            throw new Error("Erro ao excluir post");
        }

        await carregarPosts();

    } catch (erro) {
        alert("Não foi possível excluir o post.");
        console.error(erro);
    }
}


// ==========================================
// EVITAR PROBLEMAS COM ASPAS NOS TEXTOS
// ==========================================

function escaparTexto(texto) {
    return texto
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'")
        .replace(/\n/g, " ");
}


// ==========================================
// EVENTOS
// ==========================================

document
    .getElementById("form-post")
    .addEventListener("submit", adicionarPost);


// Carrega os posts quando a página abre
carregarPosts();
