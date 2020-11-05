// import React from 'react';
// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

import React, { Component, Fragment } from 'react';
import shuffle from 'lodash/fp/shuffle';
import random from 'lodash/fp/random';
import "./index.css";

const GIPHY_API_KEY = "";
const data = [
  {
    title: "All the Bob's Burgers Christmas Episodes",
    query: "bobs+burgers+christmas",
    href: "https://giphy.com/search/bobs-burgers-christmas",
    limit: 5
  },
  {
    title: "A Christmas Story",
    query: "a+christmas+story+movie+1983",
    href: "https://giphy.com/search/a-christmas-story-movie-1983"
  },
  {
    title: "A Charlie Brown's Christmas",
    query: "a+charlie+brown+christmas+movie+1965",
    href: "https://giphy.com/search/a-charlie-brown-christmas-movie-1965"
  },
  {
    title: "Christmas Vacation",
    query: "national+lampoons+christmas+vacation+movie+1989",
    href:
      "https://giphy.com/search/national-lampoons-christmas-vacation-movie-1989"
  },
  {
    title: "Die Hard",
    query: "die+hard",
    href: "https://giphy.com/search/die-hard"
  },
  {
    title: "Elf",
    query: "elf+movie+2003",
    href: "https://giphy.com/search/elf-movie-2003"
  },
  {
    title: "Home Alone",
    query: "home+alone+movie+1990",
    href: "https://giphy.com/search/home-alone-movie-1990"
  },
  {
    title: "How the Grinch Stole Christmas!",
    query: "dr+seuss+how+the+grinch+stole+christmas+movie+1966",
    href:
      "https://giphy.com/search/dr-seuss-how-the-grinch-stole-christmas-movie-1966"
  },
  {
    title: "Jingle All The Way",
    query: "jingle+all+the+way+movie+1996",
    href: "https://giphy.com/search/jingle-all-the-way-movie-1996"
  },
  {
    title: "The Muppet Christmas Carol",
    query: "the+muppet+christmas+carol-movie+1992",
    href: "https://giphy.com/search/the-muppet-christmas-carol-movie-1992"
  },
  {
    title: "The Nightmare Before Christmas",
    query: "the+nightmare+before+christmas+movie+1993",
    href: "https://giphy.com/search/the-nightmare-before-christmas-movie-1993"
  }
];

const finalFiveDateLabels = ["12/20", "12/21", "12/22", "12/23", "12/24"];

interface Movie {
  title: string;
  query: string;
  href: string;
}

interface AppState {
  giphyData: any[],
  enableFinalFiveLogic: boolean;
  finalFiveMovies: Movie[];
  isLoading: boolean;
  nextMovie: Movie;
}

class App extends Component<{}, AppState> {
  constructor() {
    super({});

    this.setNextMovie = this.setNextMovie.bind(this);
    this.setFinalFiveMovies = this.setFinalFiveMovies.bind(this);

    // const enableFinalFiveLogic = new Date().getDate() === 20;
    // const enableFinalFiveLogic = true;
    const enableFinalFiveLogic = false;

    this.state = {
      enableFinalFiveLogic,
      giphyData: [],
      finalFiveMovies: [],
      isLoading: false,
      nextMovie: {
        title: '',
        query: '',
        href: ''
      }
    };
  }

  setNextMovie() {
    const movies = shuffle(data);
    const targetIndex = random(0, movies.length - 1);
    const movie = movies[targetIndex];

    this.setState({
      isLoading: true
    });

    const url = `https://api.giphy.com/v1/gifs/search?q=${
      movie.query
    }&api_key=${GIPHY_API_KEY}&limit=${movie.limit || 15}`;

    fetch(url)
      .then(response => response.json())
      .then(giphyData => {
        this.setState({
          giphyData: giphyData.data,
          isLoading: false,
          nextMovie: movies[targetIndex]
        });
      })
      .catch(error => {
        console.log("Error: ", error);

        this.setState({
          isLoading: false
        });
      });
  }

  setFinalFiveMovies() {
    const { finalFiveMovies } = this.state;

    if (finalFiveMovies.length) {
      return;
    }

    const movies = shuffle(data);

    this.setState({
      finalFiveMovies: movies
    });
  }

  get selectAMovieBtn() {
    const { enableFinalFiveLogic } = this.state;

    return (
      <button
        className="cma-select-a-movie-btn"
        onClick={
          enableFinalFiveLogic ? this.setFinalFiveMovies : this.setNextMovie
        }
      >
        What Should We Watch?
      </button>
    );
  }

  get nextMovie() {
    console.log("this.state.giphyData", this.state.giphyData);

    const { giphyData, nextMovie } = this.state;

    console.log("giphyData:", giphyData);

    if (!giphyData || !giphyData.length) {
      return null;
    }

    // const randomIndex = random(0, giphyData.length - 1);
    // const embedUrl = giphyData[randomIndex].embed_url;
    const embedUrl = giphyData[3].embed_url;

    return (
      <Fragment>
        <h2 className="cma-movie-title">{nextMovie.title}</h2>
        <iframe
          title="giphy"
          src={embedUrl}
          width="480"
          height="265"
          frameBorder="0"
          allowFullScreen
        />
      </Fragment>
    );
  }

  get finalFiveMovies() {
    const { finalFiveMovies } = this.state;

    if (!finalFiveMovies.length) {
      return null;
    }

    return (
      <ul className="cma-final-five-movies">
        {finalFiveMovies.map((movie, index) => (
          <li key={index} className="cma-final-five-movie">
            {finalFiveDateLabels[index]} - {movie.title} -{" "}
            <a
              className="cma-final-five-movie-link"
              href={movie.href}
              target="_blank"
              rel="noreferrer"
            >
              find a gif
            </a>
          </li>
        ))}
      </ul>
    );
  }

  get bodyContent() {
    const { enableFinalFiveLogic } = this.state;

    if (enableFinalFiveLogic) {
      return (
        <Fragment>
          <h1 className="cma-heading">The Final Five 🎄Movies Are:</h1>
          <h2 className="cma-final-five-instructions">
            leave this tab open, click <em>"find a gif"</em> on each day, choose
            a gif, and text it to me
          </h2>
          {this.finalFiveMovies}
        </Fragment>
      );
    }

    return (
      <Fragment>
        <h1 className="cma-heading">Our Next 🎄 Movie Is...</h1>
        {this.nextMovie}
      </Fragment>
    );
  }

  render() {
    return (
      <div className="cma">
        {this.selectAMovieBtn}
        {this.bodyContent}
      </div>
    );
  }
}

export default App;
