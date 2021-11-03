const BASEURL = "https://www.googleapis.com";

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
const getBookData = async (bookId) => {
  const bookUrl = `${BASEURL}/books/v1/volumes/${bookId}`;
  const bookDataResponse = await fetch(bookUrl);
  const bookData = await bookDataResponse.json();

  const bookCard = getBookCardsData(bookData);

  return {
    bookCard: bookCard,
  };
};
