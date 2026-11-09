import os
import psycopg2

from flask import Flask, jsonify, request

app = Flask(__name__)


def conectar_banco():
    return psycopg2.connect(
        host=os.getenv("DB_HOST"),
        database=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD")
    )


@app.route("/")
def inicio():
    return jsonify({
        "mensagem": "API do Projeto Docker funcionando!"
    })


@app.route("/api/status")
def status():
    return jsonify({
        "status": "online",
        "servico": "backend"
    })


@app.route("/api/posts")
def listar_posts():
    conexao = conectar_banco()
    cursor = conexao.cursor()

    cursor.execute("""
        SELECT id, titulo, descricao
        FROM posts
        ORDER BY id
    """)

    registros = cursor.fetchall()

    cursor.close()
    conexao.close()

    posts = []

    for registro in registros:
        posts.append({
            "id": registro[0],
            "titulo": registro[1],
            "descricao": registro[2]
        })

    return jsonify(posts)

@app.route("/api/posts", methods=["POST"])
def criar_post():
    dados = request.get_json()

    titulo = dados.get("titulo")
    descricao = dados.get("descricao")

    if not titulo or not descricao:
        return jsonify({
            "erro": "Titulo e descricao sao obrigatorios."
        }), 400

    conexao = conectar_banco()
    cursor = conexao.cursor()

    cursor.execute(
        """
        INSERT INTO posts (titulo, descricao)
        VALUES (%s, %s)
        RETURNING id
        """,
        (titulo, descricao)
    )

    novo_id = cursor.fetchone()[0]

    conexao.commit()

    cursor.close()
    conexao.close()

    return jsonify({
        "id": novo_id,
        "titulo": titulo,
        "descricao": descricao
    }), 201

@app.route("/api/posts/<int:id>", methods=["PUT"])
def atualizar_post(id):
    dados = request.get_json()

    titulo = dados.get("titulo")
    descricao = dados.get("descricao")

    if not titulo or not descricao:
        return jsonify({
            "erro": "Titulo e descricao sao obrigatorios."
        }), 400

    conexao = conectar_banco()
    cursor = conexao.cursor()

    cursor.execute(
        """
        UPDATE posts
        SET titulo = %s,
            descricao = %s
        WHERE id = %s
        """,
        (titulo, descricao, id)
    )

    if cursor.rowcount == 0:
        cursor.close()
        conexao.close()

        return jsonify({
            "erro": "Post nao encontrado."
        }), 404

    conexao.commit()

    cursor.close()
    conexao.close()

    return jsonify({
        "id": id,
        "titulo": titulo,
        "descricao": descricao
    })

@app.route("/api/posts/<int:id>", methods=["DELETE"])
def excluir_post(id):
    conexao = conectar_banco()
    cursor = conexao.cursor()

    cursor.execute(
        """
        DELETE FROM posts
        WHERE id = %s
        """,
        (id,)
    )

    if cursor.rowcount == 0:
        cursor.close()
        conexao.close()

        return jsonify({
            "erro": "Post nao encontrado."
        }), 404

    conexao.commit()

    cursor.close()
    conexao.close()

    return jsonify({
        "mensagem": "Post excluido com sucesso.",
        "id": id
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
