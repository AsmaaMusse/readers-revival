const searchForm = $("#search-form");
const searchInputContainer = $("#search-input-container");
const booksContainer = $("#books-container");
const btnGenerateRandom = $("#btn-generate");
const recentButtons = $("#recent-buttons");

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
    // Sometimes the thumbnail is not available, so we're using a placeholder
    if (!bookItem.volumeInfo.imageLinks) {
      bookItem.volumeInfo.imageLinks = {
        thumbnail: "./assets/images/placeholder.png",
      };
    }
    return {
      id: bookItem.id,
      title: bookItem.volumeInfo.title,
      authors: bookItem.volumeInfo.authors,
      description: bookItem.volumeInfo.description,
      img: bookItem.volumeInfo.imageLinks.thumbnail,
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

// Get from Local Storage
const getFromLS = (key) => {
  const item = JSON.parse(localStorage.getItem(`${key}`));
  return item;
};

// Set in Local Storage
const setInLS = (key, value) => {
  const lsKey = getFromLS(key);
  if (lsKey) {
    lsKey.push(`${value}`);
    localStorage.setItem(key, JSON.stringify(lsKey));
  } else {
    let arrayValues = [];
    arrayValues.push(value);
    localStorage.setItem(key, JSON.stringify(arrayValues));
  }
};

const renderBookCard = (book) => {
  const constructCard = (each) => {
    return `<div class="book-card" book-id="${each.id}">
                    <a href="./">
                        <img class="book-image" src="${each.img}" />
                    </a>
                    <div class="book-info">
                        <h3 class="book-title">${each.title}</h3>
                        <h4 class="book-author">${each.authors}</h4>
                    </div>
                    <button class="button is-rounded" id="addToPlanner">Add to Planner</button>
                </div>`;
  };

  booksContainer.empty();

  const bookCard = book.map(constructCard);

  // To handle duplicates (the same random book appearing more than once)
  const randomList = [];

  for (let i = 0; i < numberBooksToDisplay; i++) {
    let randomBook = Math.floor(Math.random() * bookCard.length);

    while (randomList.includes(randomBook)) {
      randomBook = Math.floor(Math.random() * bookCard.length);
    }

    randomList.push(randomBook);

    booksContainer.append(bookCard[randomBook]);
  }
};

const renderBookInfo = async (title) => {
  const bookInfo = await getBookData(title);

  renderBookCard(bookInfo.bookCard);
};

const generateRandomBooks = () => {
  // Get random books by using "" as search query in the Google Books API
  renderBookInfo(`""`);
};

const handleSearch = async (event) => {
  event.preventDefault();

  const search = $("#search-input").val();

  if (search) {
    renderBookInfo(`${search}`);
    const previousSearches = getFromLS(`recents`);
    setInLS(`recents`, `${search}`);
    // Will reload the recents section
    loadRecentSearches();
  } else {
    return alert("Please enter a book title!");
  }
};

const loadRecentSearches = () => {
  // Get recent searches from LS
  const recents = getFromLS(`recents`);

  // if there are recent searches in LS, display on page
  if (recents) {
    recents.reverse();
    while (recents.length > 5) {
      recents.pop();
    }
    recentButtons.empty();
    const recentsTitle = `<h2>Recent Searches</h2>`;
    recentButtons.append(recentsTitle);
    recents.forEach((element) => {
      const recentButton = `<button class="button" id="recent-button">${element}</button>`;
      recentButtons.append(recentButton);
    });
  }
};

const handleRecentBtnClick = (event) => {
  if (event.target.id === "recent-button") {
    const searchQuery = $(event.target).text();
    renderBookInfo(`${searchQuery}`);
  }
};

const constructUserPrompt = () => {
  const currentMonth = moment().format(`YYYY-MM-DD`);
  console.log(currentMonth);
  return `<div class="dropdown">
  <div class="dropdown-trigger">
    <button class="button" aria-haspopup="true" aria-controls="dropdown-menu3">
      <span>Click me</span>
      <span class="icon is-small">
        <i class="fas fa-angle-down" aria-hidden="true"></i>
      </span>
    </button>
  </div>
  <div class="dropdown-menu" id="dropdown-menu3" role="menu">
    <div class="dropdown-content">
      <a href="#" class="dropdown-item">
        Overview
      </a>
      <a href="#" class="dropdown-item">
        Modifiers
      </a>
      <a href="#" class="dropdown-item">
        Grid
      </a>
      <a href="#" class="dropdown-item">
        Form
      </a>
      <a href="#" class="dropdown-item">
        Elements
      </a>
      <a href="#" class="dropdown-item">
        Components
      </a>
      <a href="#" class="dropdown-item">
        Layout
      </a>
      <hr class="dropdown-divider">
      <a href="#" class="dropdown-item">
        More
      </a>
    </div>
  </div>
</div>`;
};

const handleAddToPlannerClick = (event) => {
  if (event.target.id === "addToPlanner") {
    // Get book ID from parent element
    const bookId = $(event.target.parentNode).attr("book-id");

    const divUserPrompt = constructUserPrompt();
    $(event.target).after(divUserPrompt);

    let savedIDs = getFromLS("savedIDs");
    let notification;
    if (savedIDs && savedIDs.includes(bookId)) {
      console.log("Error: book already saved in LS.");
      notification = `<div class="notification is-danger" id="notification">Book already exists in your planner.</div>`;
    } else {
      setInLS("savedIDs", `${bookId}`);
      notification = `<div class="notification is-success" id="notification">Book added to your planner successfully.</div>`;
    }
    $(".navbar").after(notification);
    $("html, body").animate({ scrollTop: "0px" });
    setTimeout(() => {
      $("#notification").remove();
    }, 1500);
  }
};

$(document).ready(() => {
  searchForm.on("submit", handleSearch);
  recentButtons.on("click", handleRecentBtnClick);
  btnGenerateRandom.on("click", generateRandomBooks);
  booksContainer.on("click", handleAddToPlannerClick);
  hamburgerDropDown();
  loadRecentSearches();
  generateRandomBooks();
});
