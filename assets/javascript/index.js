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

/*const getBookData = async (bookName) => {
  const bookUrl = `${BASEURL}/books/v1/volumes?q=${bookName}`;
  const bookDataResponse = await fetch(bookUrl);
  const bookData = await bookDataResponse.json();

  const bookCard = getBookCardsData(bookData);

  return {
    bookCard: bookCard,
  };
};*/

// Set in Local Storage
const setInLS = (key, value) => {
  const lsKey = getFromLS(key);
  if (lsKey) {
    lsKey.push(value);
    localStorage.setItem(key, JSON.stringify(lsKey));
  } else {
    let arrayValues = [];
    arrayValues.push(value);
    localStorage.setItem(key, JSON.stringify(arrayValues));
  }
};

const renderBookCard = (book) => {
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

// Take the book title then construct url and send request
const renderBookInfo = async (title) => {
  const url = `books/v1/volumes?q=${title}`;
  const bookInfo = await getBookData(url);

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

const getDateValue = () => {
  return $("#datepicker").datepicker().val();
};

const checkBookInLS = (arr, bookId) => {
  return arr.find((book) => book.bookId == bookId);
};

const notification = (type, message) => {
  const notificationDiv = `<div class="notification is-${type}" id="notificationDiv">${message}</div>`;
  $(".navbar").after(notificationDiv);
  $("html, body").animate({ scrollTop: "0px" });
  setTimeout(() => {
    $("#notificationDiv").remove();
  }, 2500);
};

const constructModal = (books, bookId) => {
  const modal = $(`.modal`);
  modal.addClass(`is-active`);

  const book = bookId;

  const removeModal = () => modal.removeClass("is-active");

  $("#datepicker").datepicker({
    onSelect: function (selectedDate) {
      // Save book functions
      const bookObj = {
        bookId: book,
        selectedDate,
      };
      console.log(bookObj);
      setInLS("books", bookObj);
      notification("success", "Book saved in planner successfully.");
      removeModal();
      $(this).datepicker("destroy");
    },
  });

  $(modal).on("click", (event) => {
    const target = $(event.target);
    if (target.hasClass("modal-close") && target.is("button")) {
      removeModal();
    }
  });
};

const handleAddToPlannerClick = (event) => {
  const target = $(event.target);
  if (target.is("button")) {
    // Get ID of the button
    const bookId = target.attr("id");
    // Get book ID from parent element
    const books = getFromLS("books");

    if (checkBookInLS(books, bookId)) {
      notification("danger", "Book already exists in planner.");
    } else {
      constructModal(books, bookId);
    }
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
