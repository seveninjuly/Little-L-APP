'use strict';

const apiKey = 'DDZYPSGDIAVdxntvzF5XP2Yk24vir955';
const searchGif = 'https://api.giphy.com/v1/gifs/search';
let imageMode = true;
let lastQuery = null;
let offset = 0;

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

//send request to access GIPHY api
function getGifs(query) {
    const params = {
        api_key: apiKey,
        q: query,
        limit: 50,
        offset: offset
    };

    console.log('lastQuery: ', lastQuery);
    console.log('query: ', query);
    console.log('offset: ', offset);

    if (lastQuery === query) {
        offset += 50;
        params.offset = offset;

        console.log('params.offset: ', params.offset);
    }

    lastQuery = query;

    const queryString = formatQueryParams(params);
    const url = searchGif + '?' + queryString;

    console.log(url);

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayGifResults(responseJson))
        .catch(err => {
            alert('Nothing found, please try again!');
        });
}

//display user's search result of gifs
function displayGifResults(responseJson) {
    console.log(responseJson);
    $('.hidden').show();
    for (let i = 0; i < responseJson.data.length; i++) {
        if (window.innerWidth < 500) {
            $('.results').append(
                `<ul>
                  <li><img src="${responseJson.data[i].images.fixed_width_downsampled.url}" alt="preview">
                  </li>
                 </ul>`
            );
        }
        else {
            $('.results').append(
                `<ul>
                  <li><img src="${responseJson.data[i].images.fixed_height_downsampled.url}" alt="preview">
                  </li>
                 </ul>`
            );
        }

    }
    console.log('Displaying gifs works!');
}

//get user input to search for results
function watchGifForm() {
    $('#start-search-btn,#second-search').on('click', function () {
        event.preventDefault();
        let userInput = $('#full-input').val();
        if (!userInput) {
            userInput = $('#search-input').val();
        }
        if (!userInput) {
            return alert(`Don't wanna search for anything?`);
        }
        else {
            $('.results').empty();
            $('#start-container').hide();
            $('#about-container').hide();
            getGifs(userInput);
        }
        console.log(userInput);
    });
}

//send request to get jokes
function getJokes() {
    fetch(`https://official-joke-api.appspot.com/jokes/random`)
        .then(response => response.json())
        .then(responseJson => displayJokes(responseJson))
        .catch(error => alert('Something went wrong, please try later.'));
}

//display joke randomly
function displayJokes(responseJson) {
    console.log(responseJson);
    $('.results').addClass('joke');
    $('.hidden').show();
    if (responseJson.length == 0) {
        $('.results').append('Something went wrong, please try later.');
    }
    else {
        $('#more-results').text('Want more?');
        $('.results').append(
            `<ul>
              <li>
                <p class="beginning">${responseJson.setup}</p>
                <p>${responseJson.punchline}</p>
              </li>
            </ul>`
        );
    }

    console.log('Displaying jokes works!');
}

//listen to click event when user want to see jokes
function watchJokeForm() {
    $('.for-jokes').on('click', function () {
        event.preventDefault();
        $('.results').empty();
        imageMode = false;
        getJokes();
    })
}

//use the same button to get both image and text results
function handleBtnClick() {
    $('#more-results').on('click', function () {
        $('.results').empty();
        if (imageMode) {
            getGifs(lastQuery);
        }
        else {
            getJokes();
        }
    })
}

//show and hide the full screen search bar when clicking the search icon on the main page
function fullScreenSearch() {
    $('.icon').on('click', function () {
        $('.search-bar').toggleClass('active');
        imageMode = true;
    })
    $('#second-search').on('click', function () {
        $('.icon').click();
    })
    $('.start-search').on('submit', function () {
        event.preventDefault();
        $('#second-search').click();
    })
}

//animation of the text on the start screen
function baffleText() {
    const text = baffle('.baffle');
    text.set({
        characters: '░▒< ▒░▒██ <░░█▒ █<█ █><░▒ ▓░▓▓ ░/█ <░▒▒ █░▓░',
        speed: 30
    });
    text.start();
    text.reveal(4000);
}

//back to top button function
function backToTop() {
    const toTopBtn = document.querySelector('#to-top-btn');
    toTopBtn.addEventListener('click', function () {
        $('body,html').animate({ scrollTop: 0 }, 'slow');
    })
}

$(function () {
    console.log('App loaded! Waiting for submit!');
    $('.hidden').hide();
    watchGifForm();
    watchJokeForm();
    handleBtnClick();
    fullScreenSearch();
    baffleText();
    backToTop();
})
