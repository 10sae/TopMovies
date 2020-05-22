/**
 * NAME: Tensae Woldeselassie
 * DATE: October 31th, 2019
 * SECTION/TA: AL / Wolman
 *
 * This is my movies.js file that adjusts the behavior of the movies.html page. It retrieves api
 * responses from themoviedb and newsapi and displays the top 3 movies of a user selected year onto
 * the html page. It also displays an article headline relating to the selected year.
 */

"use strict";
(function() {
  window.addEventListener("load", init);

  const MOVIE_BASE = "https://api.themoviedb.org/3/discover/movie?api_key=17b75d85ed764c1c66aaa44c3a529914&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&year=";
  const MOVIE_IMG_BASE = "https://image.tmdb.org/t/p/w500/";
  const NEWS_BASE = "https://newsapi.org/v2/everything?q=";
  const NEWS_END = "&apiKey=902d188bdcec4440bb5fafb8783df35f";

  /**
   * Listens for a year to be selected in order to generate page.
   */
  function init() {
    let yearSelector = id("year-selector");
    yearSelector.addEventListener("change", generateUrl);
  }

  /**
   * Generates unique urls based on users seleceted year. Passes along the urls to make a request
   */
  function generateUrl() {
    let year = this.value;
    let movieUrl = MOVIE_BASE + year;
    let newsUrl = NEWS_BASE + year + NEWS_END;
    makeMovieRequest(movieUrl);
    makeNewsRequest(newsUrl);
  }

  /**
   * Creates a request from the themoviedb. Converts the response into JSON and passes the responses
   * to be processed onto the webpage.
   * @param {string} url - the address of the api
   */
  function makeMovieRequest(url) {
    fetch(url)
      .then(checkStatus)
      .then(resp => resp.json())
      .then(processMovieData)
      .catch(handleError);
  }

  /**
   * Creates a request from newsapi. Converts the response into JSON and passes the responses
   * to be processed onto the webpage.
   * @param {string} url - the address of the api
   */
  function makeNewsRequest(url) {
    fetch(url)
      .then(checkStatus)
      .then(resp => resp.json())
      .then(processNewsData)
      .catch(handleError);
  }

  /**
   * Displays an error message onto the html page if an error arises.
   */
  function handleError() {
    let errorText = gen("p");
    errorText.textContent = "Something went wrong. Please try selecting a year again.";
    id("movie-output").appendChild(errorText);
  }

  /**
   * Checks if the response has and error. Throws an error if it isn't ok. Returns the responseData
   * if it's ok.
   * @param {object} response - resonse of api after a fetch call
   * @return {object} the same response that is passed through
   */
  function checkStatus(response) {
    if (!response.ok) {
      throw Error("Error in request: " + response.statusText);
    }
    return response;
  }

  /**
   * Goes through the response json and retrieves the top 3 most popular movies in the selected
   * year. Adds the title and images of these movies onto the html of the movies.html website.
   * @param {object} responseData - resonse of api after a fetch call in JSON form.
   */
  function processMovieData(responseData) {
    id("movie-output").innerHTML = "";
    let movieList = responseData.results;
    for (let i = 0; i < 3; i++) {
      let newMovieDiv = gen("div");
      let newMovieTitle = gen("h2");
      let newMovieImg = gen("img");
      newMovieTitle.textContent = movieList[i]["original_title"];
      newMovieImg.src = MOVIE_IMG_BASE + movieList[i]["backdrop_path"];
      newMovieImg.alt = movieList[i]["original_title"] + " poster";
      newMovieDiv.appendChild(newMovieTitle);
      newMovieDiv.appendChild(newMovieImg);
      id("movie-output").appendChild(newMovieDiv);
    }
  }

  /**
   * Goes through the response json and retrieves a random article relating to the selected year.
   * Adds the headline, link, and image of the article onto the html of the movies.html website.
   * @param {object} responseData - resonse of api after a fetch call in JSON form.
   */
  function processNewsData(responseData) {
    id("news-output").innerHTML = "";
    let randomIndice = Math.floor(Math.random() * 20);
    let randomArticle = responseData["articles"][randomIndice];
    let newNewsDiv = gen("div");
    let newNewsTitle = gen("h2");
    let newNewsLink = gen("a");
    let newNewsImg = gen("img");
    let newsIntro = gen("p");
    newsIntro.textContent = "Here's a random article about this year:";
    newNewsLink.textContent = randomArticle["title"];
    newNewsImg.src = randomArticle["urlToImage"];
    newNewsImg.alt = "news-post image";
    newNewsLink.href = randomArticle["url"];
    newNewsTitle.appendChild(newNewsLink);
    newNewsDiv.appendChild(newNewsTitle);
    newNewsDiv.appendChild(newNewsImg);
    id("news-output").appendChild(newsIntro);
    id("news-output").appendChild(newNewsDiv);
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} idName - element ID
   * @returns {object} DOM object associated with id.
   */
  function id(idName) {
    return document.getElementById(idName);
  }

  /**
   * Creates and returns a new DOM object.
   * @param {String} elType - The type of the element.
   * @returns {object} The new DOM object created.
   */
  function gen(elType) {
    return document.createElement(elType);
  }
})();
