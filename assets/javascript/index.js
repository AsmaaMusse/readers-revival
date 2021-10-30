const searchForm = $("#search-form");
const searchInputContainer = $("#search-input-container");

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
        return {
            title: bookItem.volumeInfo.title,
            description: bookItem.volumeInfo.description,
            img: bookItem.volumeInfo.imageLinks.smallThumbnail,
        };
    };
    return books.items.slice(0, 6).map(callback);
};

const getBookData = async(bookName) => {
    const bookUrl = `https://www.googleapis.com/books/v1/volumes?q=${bookName}`;
    const bookDataResponse = await fetch(bookUrl);
    const bookData = await bookDataResponse.json();

    const bookCard = getBookCardsData(bookData);

    console.log(bookCard);
};

const getFromLS = () => {
    const book = JSON.parse(localStorage.getItem("recentBook")) ?
        JSON.parse(localStorage.getItem("recentBook")) :
        [];

    return book;
};

// Save books into Local Storage
const setBooksInLS = (bookName) => {
    // get books from LS
    const book = getFromLS();

    // if book does not exist
    if (!book.includes(bookName)) {
        // insert bookName in book
        book.push(bookName);

        // set book in LS
        localStorage.setItem("recentBook", JSON.stringify(book));
    }
};

const renderBookInfo = () => {};

const handleSearch = async(event) => {
    event.preventDefault();

    const bookTitle = $("#search-input").val();
    console.log(bookTitle);
};

const handleReady = () => {
    // renderRecentSearches();

    // Get book from LS
    const book = getFromLS();

    // if there are recent book get the info for the most recent book
    if (book.length) {
        const bookName = book[book.length - 1];
        renderBookInfo(bookName);
    }
};

getBookData("harry potter and the cursed child");

// Add event listener
$("#search-form").on("submit", handleSearch);

$(document).ready(() => {
    hamburgerDropDown();
    handleReady();
});