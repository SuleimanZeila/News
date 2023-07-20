const apiKey = '59fe021ff0984e6d86513de31be73201'; // Replace with your NewsAPI API key
const pageSize = 20;
let currentPage = 1;
let currentCategory = 'general';
let totalResults = 0;

// Function to fetch news articles from the NewsAPI
async function fetchNews(searchTerm, category) {
  let apiUrl = `https://newsapi.org/v2/everything?q=${searchTerm}&apiKey=${apiKey}&sortBy=publishedAt&pageSize=${pageSize}&page=${currentPage}`;

  if (category && category !== 'general') {
    apiUrl += `&category=${category}`;
  }

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    totalResults = data.totalResults;
    console.log(data.articles)
    return data.articles;
  } catch (error) {
    console.log('Error fetching news:', error);
    return [];
  }
}

// Function to create Bootstrap cards based on the news articles
function createCards(articles) {
  const cardContainer = document.getElementById('cardContainer');
  cardContainer.innerHTML = '';

  articles.forEach((article) => {
    const cardHtml = `
      <div class="col-md-4">
        <div class="card mb-3">
          <img src="${article.urlToImage}" class="card-img-top" alt="Article Image">
          <div class="card-body">
            <h5 class="card-title">${article.title}</h5>
            <h6 class="card-title"> <span style = 'background:blue;padding:2px;border-radius:3px;color:white;'>Author:</span> ${article.author}</h6>
            <h6 class="card-title"><span style = 'background:blue;padding:2px;border-radius:3px;color:white'>Published At:</span> ${article.publishedAt}</h6>

            <p class="card-text">${article.description}</p>
            <a href="${article.url}" class="btn btn-primary">Read More</a>
          </div>
        </div>
      </div>
    `;
    cardContainer.innerHTML += cardHtml;
  });
}

// Function to perform a search and display the results
async function searchNews() {
  const searchTerm = document.getElementById('searchInput').value;
  const articles = await fetchNews(searchTerm, currentCategory);
  createCards(articles);
}

// Function to handle category selection
function handleCategorySelection() {
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach((navLink) => {
    navLink.addEventListener('click', function (event) {
      event.preventDefault();
      currentCategory = this.dataset.category;
      currentPage = 1;
      searchNews();
    });
  });
}

// Function to handle pagination buttons
function handlePagination() {
  document.getElementById('prevButton').addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      searchNews();
    }
  });

  document.getElementById('nextButton').addEventListener('click', () => {
    const totalPages = Math.ceil(totalResults / pageSize);
    if (currentPage < totalPages) {
      currentPage++;
      searchNews();
    }
  });
}

// Event listener for the search button
document.getElementById('searchButton').addEventListener('click', async function(){
  searchNews()
  const titleh1 = document.getElementById('titleh1')
  const searchTerm = document.getElementById('searchInput').value;
  const articles = await fetchNews(searchTerm, currentCategory);
  console.log(articles)
  titleh1.innerHTML = `Here are ${totalResults} News related to ${searchTerm}.`

}
);

// Initialize category selection and pagination
handleCategorySelection();
handlePagination();

// Initial search to load all news sorted by latest
searchNews();
