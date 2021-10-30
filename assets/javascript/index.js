const searchForm = $("#search-form");
const searchInputContainer = $("#search-input-container");
const booksContainer = $("#books-container");

// How many books to display on the page
let numberBooksToDisplay = 6;

const hamburgerDropDown = () => {
  const toggleActive = () => {
    // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
    $(".navbar-burger").toggleClass("is-active");
    $(".navbar-menu").toggleClass("is-active");
  };

  // Check for click events on the navbar burger icon
  $(".navbar-burger").click(toggleActive);
};

// Get book card from API
const getBookCardsData = (books) => {
  const callback = (bookItem) => {
    return {
      title: bookItem.volumeInfo.title,
      authors: bookItem.volumeInfo.authors,
      description: bookItem.volumeInfo.description,
      img: bookItem.volumeInfo.imageLinks.smallThumbnail,
    };
  };
  return books.items.map(callback);
};

const getBookData = async (bookName) => {
  const bookUrl = `https://www.googleapis.com/books/v1/volumes?q=${bookName}`;
  const bookDataResponse = await fetch(bookUrl);
  const bookData = await bookDataResponse.json();

  const bookCard = getBookCardsData(bookData);

  return {
    bookCard: bookCard,
  };
};

const getFromLS = () => {
  const book = JSON.parse(localStorage.getItem("recentBook"))
    ? JSON.parse(localStorage.getItem("recentBook"))
    : [];

  return book;
};

// Save books into Local Storage
const setBooksInLS = (bookName) => {
  // get books from LS
  const book = getFromLS();

  // if book does not exist
  if (!book.includes(bookName)) {
    // insert bookName in book
    book.push(bookName);

    // set book in LS
    localStorage.setItem("recentBook", JSON.stringify(book));
  }
};

const renderBookCard = (book) => {
  const constructCard = (each) => {
    return `<div class="book-card">
                    <a href="./">
                        <img class="book-image" src="${each.img}" />
                    </a>
                    <div class="book-info">
                        <h3 class="book-title">${each.title}</h3>
                        <h4 class="book-author">${each.authors}</h4>
                        <!-- Add book to planner button -->
                        <button class="button is-rounded">Add to Planner</button>
                    </div>
                </div>`;
  };

  const bookCard = book.map(constructCard);

  for (let i = 0; i < numberBooksToDisplay; i++) {
    const randomBook = Math.floor(Math.random() * bookCard.length);

    booksContainer.append(bookCard[randomBook]);
  }
};

const renderBookInfo = async (title) => {
  const bookInfo = await getBookData(title);

  renderBookCard(bookInfo.bookCard);
};

const handleSearch = async (event) => {
  event.preventDefault();

  const bookTitle = $("#search-input").val();

  if (bookTitle) {
    renderBookInfo(bookTitle);
    setBooksInLS(bookTitle);
    // renderRecentSearches();
  } else {
    return alert("Please enter a book title!");
  }
};

const handleReady = () => {
  // Get book from LS
  const book = getFromLS();

  // if there are recent book get the info for the most recent book
  if (book.length) {
    const bookName = book[book.length - 1];
    // renderRecentSearches(bookName);
  }
};

const generateRandomBooks = () => {
  // Get random books by using "" as search query in the Google Books API
  renderBookInfo(`""`);
};

// Add event listener
$("#search-form").on("submit", handleSearch);

$(document).ready(() => {
  hamburgerDropDown();
  handleReady();
  generateRandomBooks();
});
