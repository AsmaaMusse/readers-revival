$(document).ready(() => {
    hamburgerDropDown();
});

const hamburgerDropDown = () => {
    const toggleActive = () => {
        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        $(".navbar-burger").toggleClass("is-active");
        $(".navbar-menu").toggleClass("is-active");
    }

    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(toggleActive)
};

const getBookData = async bookName => {
    const bookUrl = `https://www.googleapis.com/books/v1/volumes?q=${bookName}`;
    // console.log(bookUrl)
    const bookDataResponse = await fetch(bookUrl);
    const bookData = await bookDataResponse.json();
    // console.log(bookData.items)
};

getBookData("harry potter");