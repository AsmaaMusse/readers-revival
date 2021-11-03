const searchForm = $("#search-form");
const searchInputContainer = $("#search-input-container");
const booksContainer = $("#books-container");
const btnGenerateRandom = $("#btn-generate");
const recentButtons = $("#recent-buttons");

// Declare months Array
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

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
  console.log(lsKey);
  if (lsKey) {
    lsKey.push(value);
    localStorage.setItem(key, JSON.stringify(lsKey));
  } else {
    console.log(value);
    localStorage.setItem(key, JSON.stringify(value));
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
                    </div>
                    <button class="button is-rounded" id="addToPlanner" book-id="${each.id}">Add to Planner</button>
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
  if (recents) {
    recents.reverse();
    while (recents.length > 5) {
      recents.pop();
    }
    recentButtons.empty();
    // Flex container to container the Recent Searches title and Clear button
    const divRecents = `<div class="recents">
      <h2>Recent Searches</h2>
      <button class="clear-btn" id="clear-btn">clear</button>
      </div>`;

    $(recentButtons).append(divRecents);
    if (recents.length > 0) {
      recents.forEach((element) => {
        const recentButton = `<button class="button" id="recent-button">${element}</button>`;
        recentButtons.append(recentButton);
      });
    } else {
      const noRecentsText = `<p class="no-recents">no recent searches</p>`;
      $("#clear-btn").remove();
      recentButtons.append(noRecentsText);
    }
  }
};

const handleRecentBtnClick = (event) => {
  // Clicked on a recent search
  if (event.target.id === "recent-button") {
    const searchQuery = $(event.target).text();
    renderBookInfo(`${searchQuery}`);
  }
  // Clicked on the clear button
  if (event.target.id === "clear-btn") {
    localStorage.removeItem("recents");
    loadRecentSearches();
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
  $("html, body").animate({
    scrollTop: "0px",
  });
  setTimeout(() => {
    $("#notificationDiv").remove();
  }, 2500);
};

const constructModal = (books, bookId) => {
  const modal = $(`.modal`);
  modal.addClass(`is-active`);
  const removeModal = () => modal.removeClass("is-active");

  let bookObj = {
    bookId,
    //date,
  };

  $("#datepicker").datepicker({
    onSelect: (selectedDate) => {
      // Save book functions
      bookObj.date = selectedDate;
      notification("success", "Book saved in planner successfully.");
      removeModal();
      loadNotificationBadge();
    },
  });

  setInLS("books", bookObj);

  $(modal).on("click", (event) => {
    const target = $(event.target);
    if (target.hasClass("modal-close") && target.is("button")) {
      removeModal();
    }
  });
};

const handleAddToPlannerClick = (event) => {
  if (event.target.id === "addToPlanner") {
    // Get book ID from parent element
    const books = getFromLS("books");
    const bookId = $(event.target).attr("book-id");

    if (checkBookInLS(books, bookId)) {
      notification("danger", "Book already exists in planner.");
    } else {
      constructModal(books, bookId);
    }
  }
};

const loadNotificationBadge = () => {
  // Get how many books there are in LS
  const numberOfBooks = getFromLS("books");
  // If there are (more than 0), display notification
  if (numberOfBooks) {
    if ($("#badge")) $("#badge").remove();
    const spanNotification = `<span id="badge">${numberOfBooks}</span>`;
    $("#notification-box").append(spanNotification);
  }
};

const initializePlanner = () => {
  months.forEach((month) => {
    const lsMonth = getFromLS(month);
    if (!lsMonth) {
      setInLS(month, []);
    }
  });
};

$(document).ready(() => {
  initializePlanner();
  searchForm.on("submit", handleSearch);
  recentButtons.on("click", handleRecentBtnClick);
  btnGenerateRandom.on("click", generateRandomBooks);
  booksContainer.on("click", handleAddToPlannerClick);
  hamburgerDropDown();
  loadRecentSearches();
  loadNotificationBadge();
  generateRandomBooks();
});
