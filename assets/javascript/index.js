const searchForm = $("#search-form");
const searchInputContainer = $("#search-input-container");
const quoteContainer = $("#quote-container");
const booksContainer = $("#books-container");
const btnGenerateRandom = $("#btn-generate");
const recentButtons = $("#recent-buttons");

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

const getRandomQuote = (quoteObject) => {
    const callback = (quote) => {
        if (quote.tag === "motivational") {
            const text = quote.text;
            const author = quote.author;
            const tag = quote.tag;

            return {
                text: text,
                author: author,
                tag: tag,
            };
        }
    };
    const quotesArray = quoteObject.quotes.map(callback);
    const quotes = quotesArray.filter((object) => {
        return object !== undefined;
    });

    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

    return randomQuote;
};

const getQuotesData = async() => {
    const quotesURL = `https://goquotes-api.herokuapp.com/api/v1/all/quotes`;
    const quotesResponse = await fetch(quotesURL);
    const quotesData = await quotesResponse.json();

    const quote = getRandomQuote(quotesData);

    return quote;
};

/*const getBookData = async (bookName) => {
  const bookUrl = `${BASEURL}/books/v1/volumes?q=${bookName}`;
  const bookDataResponse = await fetch(bookUrl);
  const bookData = await bookDataResponse.json();

    const bookCard = getBookCardsData(bookData);

  return {
    bookCard: bookCard,
  };
};*/

const constructQuote = (data) => {
    const quote = ` <h2 class="subtitle">"${data.text}"</h2>
                    <h3>Author: ${data.author}</h3>`;
    return quote;
};

const renderQuote = async() => {
    const quoteData = await getQuotesData();
    const constructedQuote = constructQuote(quoteData);
    quoteContainer.append(constructedQuote);
};

// Set in Local Storage
const setInLS = (key, value) => {
    const lsKey = getFromLS(key);
    if (lsKey) {
        lsKey.push(value);
        localStorage.setItem(key, JSON.stringify(lsKey));
    } else {
        console.log(value);
        localStorage.setItem(key, JSON.stringify(value));
    }
};

const renderBookCard = (book) => {
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

// Take the book title then construct url and send request
const renderBookInfo = async(title) => {
    const url = `books/v1/volumes?q=${title}`;
    const bookInfo = await getBookData(url);

    renderBookCard(bookInfo.bookCard);
};

const generateRandomBooks = () => {
    // Get random books by using "" as search query in the Google Books API
    renderBookInfo(`""`);
};

const handleSearch = async(event) => {
    event.preventDefault();

    const search = $("#search-input").val();

    if (search) {
        quoteContainer.remove();
        renderBookInfo(search);
        const previousSearches = getFromLS("recents");
        console.log(search);
        console.log(previousSearches);
        previousSearches.push(search);
        console.log(previousSearches);
        localStorage.setItem(`recents`, JSON.stringify(previousSearches));
        // Will reload the recents section
        loadRecentSearches();
    } else {
        return alert("Please enter a book title!");
    }
};

const loadRecentSearches = () => {
    // Get recent searches from LS
    recentButtons.empty();
    const recents = getFromLS("recents");
    if (recents) {
        recents.reverse();
        while (recents.length > 5) {
            recents.pop();
        }

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
        quoteContainer.remove();
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

const checkBookInLS = (arr = [], bookId) => {
    if (arr.length > 0 && !arr) {
        return arr.find((book) => book.bookId == bookId);
    }
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

const getMonthFromDate = (date) => {
    return moment(date).format("MMMM");
};

const constructModal = (books, bookId) => {
    const modal = $(`.modal`);
    modal.addClass(`is-active`);

    const book = bookId;

    const removeModal = () => modal.removeClass("is-active");

    const id = bookId;

    let bookObj = {
        bookId,
        //date,
    };

    $("#datepicker").datepicker({
        onSelect: (selectedDate) => {
            const newId = id;
            // Save book functions
            bookObj.date = selectedDate;
            const pickedMonth = getMonthFromDate(selectedDate);
            console.log(pickedMonth);
            console.log(newId);
            setInLS(pickedMonth, bookId);
            notification("success", "Book saved in planner successfully.");
            removeModal();
            $(this).datepicker("destroy");
            loadNotificationBadge();
        },
    });

    //setInLS("books", bookObj);

    $(modal).on("click", (event) => {
        const target = $(event.target);
        if (target.hasClass("modal-close") && target.is("button")) {
            removeModal();
        }
    });
};

const handleAddToPlannerClick = (event) => {
    const target = $(event.target);
    if (target.is("button")) {
        // Get ID of the button
        const bookId = target.attr("id");
        // Get book ID from parent element
        const books = getFromLS("books") || [];

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

const initializeLS = () => {
    months.forEach((month) => {
        const lsMonth = getFromLS(month);
        console.log(lsMonth);
        if (!lsMonth) {
            setInLS(month, []);
        }
    });

    // Initialise recent searches if not there
    const recents = getFromLS("recents");
    if (!recents) {
        setInLS("recents", []);
    }
};

$(document).ready(() => {
    initializeLS();
    searchForm.on("submit", handleSearch);
    recentButtons.on("click", handleRecentBtnClick);
    btnGenerateRandom.on("click", generateRandomBooks);
    booksContainer.on("click", handleAddToPlannerClick);
    hamburgerDropDown();
    loadRecentSearches();
    loadNotificationBadge();
    renderQuote();
    generateRandomBooks();
});