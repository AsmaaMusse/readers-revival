const BASEURL = "https://www.googleapis.com";

const constructCard = (each) => {
  return `<div class="book-card">
                  <a href="./">
                      <img class="book-image" src="${each.img}" />
                  </a>
                  <div class="book-info">
                      <h3 class="book-title">${each.title}</h3>
                      <h4 class="book-author">${each.authors}</h4>
                  </div>
                  <button class="button is-rounded" id="${each.id}">Add to Planner</button>
              </div>`;
};

// Get from Local Storage
const getFromLS = (key) => {
  const item = JSON.parse(localStorage.getItem(`${key}`)) || [];
  return item;
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

// Give me a URL and then I make the http call and return it
const getBookData = async (url) => {
  const bookUrl = `${BASEURL}/${url}`;
  const bookDataResponse = await fetch(bookUrl);
  const bookData = await bookDataResponse.json();

  const bookCard = getBookCardsData(bookData);

  return {
    bookCard: bookCard,
  };
};

// Give me a URL and then I make the http call and return it
const getSingleBookData = async (url) => {
  const bookUrl = `${BASEURL}/${url}`;
  const bookDataResponse = await fetch(bookUrl);
  const bookData = await bookDataResponse.json();

  return bookData;
};

const getBookCardDataFromID = (books) => {
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
  return books.map(callback);
};
