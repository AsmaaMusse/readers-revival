$(document).ready(() => {
  hamburgerDropDown();
});

const hamburgerDropDown = () => {
  const toggleActive = () => {
    // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
    $(".navbar-burger").toggleClass("is-active");
    $(".navbar-menu").toggleClass("is-active");
  };

  // Check for click events on the navbar burger icon
  $(".navbar-burger").click(toggleActive);
};

const getBookCardsData = (books) => {
  const callback = (bookItem) => {
    return {
      title: bookItem.volumeInfo.title,
      description: bookItem.volumeInfo.description,
      img: bookItem.volumeInfo.imageLinks.smallThumbnail,
    };
  };
  return books.items.slice(0, 6).map(callback);
};

const getBookData = async (bookName) => {
  const bookUrl = `https://www.googleapis.com/books/v1/volumes?q=${bookName}`;
  const bookDataResponse = await fetch(bookUrl);
  const bookData = await bookDataResponse.json();

  const bookCard = getBookCardsData(bookData);

  console.log(bookCard);
};

getBookData("harry potter");
