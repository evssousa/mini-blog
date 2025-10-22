class PostModel {
  constructor(db) {
    this.db = db
    this.db.run(`CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL
    )`)
  }

  getAll() {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM posts ORDER BY id DESC', [], (err, rows) => {
        if (err) reject(err)
        else resolve(rows)
      })
    })
  }

  create(title, content) {
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO posts (title, content) VALUES (?, ?)',
        [title, content],
        function (err) {
          if (err) reject(err)
          else resolve({ id: this.lastID, title, content })
        }
      )
    })
  }

  update(id, title, content) {
    return new Promise((resolve, reject) => {
      this.db.run(
        'UPDATE posts SET title = ?, content = ? WHERE id = ?',
        [title, content, id],
        function (err) {
          if (err) reject(err)
          else resolve(this.changes)
        }
      )
    })
  }

  delete(id) {
    return new Promise((resolve, reject) => {
      this.db.run('DELETE FROM posts WHERE id = ?', [id], function (err) {
        if (err) reject(err)
        else resolve(this.changes)
      })
    })
  }
}

module.exports = PostModel
