class PostModel {
    constructor(db) {
        this.db = db
        this.db.run(`CREATE TABLE IF NOT EXISTS post (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                content TEXT NOT NULL
            )
        `)
    }

    // CRUD:
    // C: CREATE    -> CRIAR
    // R: READ      -> LER
    // U: UPDATE    -> ATUALIZAR
    // D: DELETE    -> APAGAR

    // Método ver
    getAll() {
        return new Promise((resolve, reject) => {
            this.db.all("SELECT * FROM posts ORDER BY id DESC", [], (err, rows) => {
                if (err) reject(err)
                else resolve(rows)
            })
        })
    }

    // Método criar
    create(title, content) {
        return new Promise((resolve, reject) => {
            this.db.run(
                "INSERT INTO posts (title, content) VALUES (?, ?)",
                [title, content],
                function (err) {
                    if (err) reject(err)
                    else resolve({ id: this.lastID, title, content })
                }
            )
        })
    }

    // Método atualizar
    update(id, title, content) {
        return new Promise((resolve, reject) => {
            this.db.run(
                "UPDATE posts SET title = ?, content = ? WHERE id = ?",
                [title, content, id],
                function (err) {
                    if (err) reject(err)
                    else resolve(this.changes)
                }
            )
        })
    }

    // Método deletar
    delete(id) {
        return new Promise((resolve, reject) => {
            this.db.run(
                "DELETE FROM posts WHERE id = ?",
                [id],
                function (err) {
                    if (err) reject(err)
                    else resolve(this.changes) 
                }
            )
        })
    }
}

module.exports = PostModel