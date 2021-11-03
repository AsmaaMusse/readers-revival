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

// Declare const
const previous = $("#prev-btn");
const next = $("#next-btn");
const currentMonth = moment().format("MMMM");
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
    filterMonthBooks(books, 0);
  } else {
    nextMonth = months[currentMonthIndex + 1];
    filterMonthBooks(books, currentMonthIndex + 1);
  }
  displayedMonth = nextMonth;
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
  $("#month").text(previousMonth);
};

const onReady = function () {
  renderCurrentMonth();
  currentSavedBooks();
  books = getFromLS("books");
};

$(document).ready(onReady);

//add event listener
previous.on("click", displayPreviousMonth);
next.on("click", displayNextMonth);

// read from local storage get saved books data
const currentSavedBooks = function () {
  const books = getFromLS("books");
  console.log(books);
  console.log(currentMonth);
};

const filterMonthBooks = function (arr, currentMonth) {
  const selectedDate = function (date) {
    return moment(date).month();
  };
  const currentBooks = arr.filter(
    (book) => currentMonth == selectedDate(book.selectedDate)
  );
  console.log(currentBooks);
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
