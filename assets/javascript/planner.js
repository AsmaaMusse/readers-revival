// Declare const
const previous = $("#prev-btn");
const next = $("#next-btn");
const currentMonth = moment().format("MMMM");
const booksContainer = $("#books-container");
let displayedMonth = currentMonth;
let books;

// Render current months
const renderCurrentMonth = function () {
  $("#month").text(currentMonth);
};

const getCurrentMonthIndex = function () {
  const callback = function (element) {
    return element === displayedMonth;
  };
  //look inside months array and find the next month
  const currentMonthIndex = months.findIndex(callback);
  return currentMonthIndex;
};

// Display Next month function
const displayNextMonth = function () {
  //listen for current month
  const currentMonthIndex = getCurrentMonthIndex();
  let nextMonth;

  //render on to page
  if (currentMonthIndex === months.length - 1) {
    nextMonth = months[0];
    //filterMonthBooks(books, 0);
  } else {
    nextMonth = months[currentMonthIndex + 1];
    //filterMonthBooks(books, currentMonthIndex + 1);
  }
  displayedMonth = nextMonth;
  currentMonthSavedBooks(displayedMonth);
  $("#month").text(nextMonth);
};

// Display Previous month function
const displayPreviousMonth = function () {
  const currentMonthIndex = getCurrentMonthIndex();
  let previousMonth;

  // If current month is January
  if (currentMonthIndex === 0) {
    previousMonth = months[months.length - 1];
  } else {
    previousMonth = months[currentMonthIndex - 1];
  }
  displayedMonth = previousMonth;
  currentMonthSavedBooks(displayedMonth);
  $("#month").text(previousMonth);
};

const onReady = function () {
  renderCurrentMonth();
  currentMonthSavedBooks(displayedMonth);
};

$(document).ready(onReady);

//add event listener
previous.on("click", displayPreviousMonth);
next.on("click", displayNextMonth);

// Get a month and get the books IDs from that month in LS
const currentMonthSavedBooks = async function (month) {
  booksContainer.empty();
  const books = getFromLS(month);
  // Holds all the API requests
  const allBooks = [];
  for (book of books) {
    // Construct url
    const url = `books/v1/volumes/${book}`;
    // Prepare API call
    const getBook = getSingleBookData(url);
    allBooks.push(getBook);
  }
  // Use promise to request the available IDs
  const allBooksResponse = await Promise.all(allBooks);
  const booksResponse = getBookCardDataFromID(allBooksResponse);
  // Construct the book cards
  const bookCards = booksResponse.map(constructCard);
  booksContainer.append(bookCards);
};

//render book card
const displaySavedBooks = function () {
  if (currentSavedBooks === currentMonth) {
    //then render onto specific month
    $(".books-container").text();
  } else {
    //leave empty
  }
};
