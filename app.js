const API_URL = "https://jsonplaceholder.typicode.com/posts";
const contentEl = document.getElementById("content");
const searchInput = document.getElementById("searchInput");

let allPosts = [];

function showState(message, isError = false, showRetry = false) {
  contentEl.innerHTML = `
    <div class="${isError ? "error-box" : "state-box"}">
      ${isError ? "" : '<div class="spinner"></div>'}
      <p>${message}</p>
      ${showRetry ? '<button type="button" id="retryBtn">Qayta urinish</button>' : ""}
    </div>
  `;

  if (showRetry) {
    document.getElementById("retryBtn").addEventListener("click", fetchPosts);
  }
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function filterPosts(query) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return allPosts;
  }

  return allPosts.filter((post) => {
    const idMatch = String(post.id).includes(normalizedQuery);
    const titleMatch = post.title.toLowerCase().includes(normalizedQuery);
    const bodyMatch = post.body.toLowerCase().includes(normalizedQuery);
    return idMatch || titleMatch || bodyMatch;
  });
}

function renderPosts(posts) {
  if (!posts.length) {
    contentEl.innerHTML = '<div class="state-box"><p>Hech qanday post topilmadi.</p></div>';
    return;
  }

  const grid = document.createElement("div");
  grid.className = "grid";

  posts.forEach((post) => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <span class="id">${post.id}</span>
      <h3>${escapeHtml(post.title)}</h3>
      <p>${escapeHtml(post.body)}</p>
    `;
    grid.appendChild(card);
  });

  contentEl.innerHTML = "";
  contentEl.appendChild(grid);
}

async function fetchPosts() {
  showState("Yuklanmoqda...");

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("APIdan ma'lumot olishda xatolik yuz berdi.");
    }
    const posts = await response.json();
    allPosts = posts;
    renderPosts(filterPosts(searchInput.value));
  } catch (error) {
    console.error("Error fetching posts:", error);
    showState(error.message, true, true);
  }
}

searchInput.addEventListener("input", (event) => {
  renderPosts(filterPosts(event.target.value));
});

fetchPosts();









