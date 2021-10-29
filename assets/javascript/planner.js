//declare months
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
//declare const
const previous = $("#prev-btn");
const next = $("#next-btn");
const currentMonth = moment().format("MMMM");

const renderCurrentMonth = function () {
  $("#month").text(currentMonth);
};

//display month function
const displayNextMonth = function () {
  //listen for current month
  const callback = function (element) {
    return element === currentMonth;
  };
  //look inside months array and find the next month
  const currentMonthIndex = months.findIndex(callback);
  //render on to page
  const nextMonth = months[currentMonthIndex + 1];

  $("#month").text(nextMonth);
};

const displayPreviousMonth = function () {
  console.log("previous");
};

const onReady = function () {
  renderCurrentMonth();
};

$(document).ready(onReady);

//add event listener
previous.on("click", displayPreviousMonth);
next.on("click", displayNextMonth);

//render the book cards that were added on to my planner on the box
// sort book card data into the months it was scheduled for
