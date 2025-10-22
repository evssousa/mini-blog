class BlogApp {
  constructor(apiUrl) {
    this.apiUrl = apiUrl

    this.form = document.getElementById('postForm')
    this.titleInput = document.getElementById('title')
    this.contentInput = document.getElementById('content')
    this.postIdInput = document.getElementById('postId')
    this.postsContainer = document.getElementById('posts')

    this.form.addEventListener('submit', (e) => this.handleSubmit(e))

    this.loadPosts()
  }

  async loadPosts() {
    try {
      const res = await fetch(this.apiUrl)
      const posts = await res.json()

      this.postsContainer.innerHTML = ''
      posts.forEach(post => {
        const card = document.createElement('div')
        card.className = 'post-card'
        card.innerHTML = `
          <h2>${post.title}</h2>
          <p>${post.content}</p>
          <div class="actions">
            <button class="edit-btn">Editar</button>
            <button class="delete-btn">Excluir</button>
          </div>
        `

        card.querySelector('.edit-btn').addEventListener('click', () => this.editPost(post))
        card.querySelector('.delete-btn').addEventListener('click', () => this.deletePost(post.id))

        this.postsContainer.appendChild(card)
      })
    } catch (err) {
      alert('Erro ao carregar posts: ' + err.message)
    }
  }

  async handleSubmit(e) {
    e.preventDefault()

    const id = this.postIdInput.value
    const title = this.titleInput.value.trim()
    const content = this.contentInput.value.trim()

    if (!title || !content) {
      alert('Por favor, preencha todos os campos!')
      return
    }

    const post = { title, content }
    const method = id ? 'PUT' : 'POST'
    const url = id ? `${this.apiUrl}/${id}` : this.apiUrl

    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      })

      this.form.reset()
      this.postIdInput.value = ''
      this.loadPosts()
    } catch (err) {
      alert('Erro ao salvar post: ' + err.message)
    }
  }

  editPost(post) {
    this.postIdInput.value = post.id
    this.titleInput.value = post.title
    this.contentInput.value = post.content
  }

  async deletePost(id) {
    if (confirm('Deseja realmente excluir este post?')) {
      try {
        await fetch(`${this.apiUrl}/${id}`, { method: 'DELETE' })
        this.loadPosts()
      } catch (err) {
        alert('Erro ao deletar post: ' + err.message)
      }
    }
  }
}

const app = new BlogApp('http://localhost:3000/posts')
