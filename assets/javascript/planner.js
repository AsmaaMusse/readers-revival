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
const previous = document.getElementById("prev-btn");
const next = document.getElementById("next");

//add event listener
previous.addEventListener("click", displayMonth);
next.addEventListener("click", displayMonth);

//display month function
const displayMonth = function (previous, next) {
  //if prev btn is clicked
  if (previous)
    //change the text of h1
    document.querySelector(".month h1").innerHTML = "January";
  //if next btn is clicked go forward
};

//render the book cards that were added on to my planner on the box
// sort book card data into the months it was scheduled for
