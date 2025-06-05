import "./App.css";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useDebounce } from "use-debounce";
import { updateSearchCount, trendingMovies } from "./appwrite";
import hero_bg from "./assets/hero-bg.png";
import hero from "./assets/hero.png";
import React from "react";
import { getWatchList } from "./appwrite2";
import MovieCard from "./components/MovieCard";
import Search from "./components/Search";
import { useState, useEffect, useRef } from "react";

import WatchList from "./components/watchList";

import TrendingMovies from "./components/TrendingMovies";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const API_BASE_URL = "https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIPONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [moviesList, setMoviesList] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const movieCardRef = useRef([]);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 1000);
  const [watchlist, setWatchlist] = useState([]);


  const [trendingMoviesstate, setTrendingMoviesstate] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchMovies = async (query = "") => {
    const endpoint = query
      ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(
          query
        )}&page=${page}`
      : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&page=${page}`;

    try {
      const response = await fetch(endpoint, API_OPTIPONS);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      console.log("Response received:", data);
      setMoviesList(data.results || []);
      setTotalPages(data.total_pages || 1);
      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }

      const data2 = await trendingMovies();
      setTrendingMoviesstate(data2);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };
  

  useGSAP(() => {
    gsap.fromTo(
      ".heroImg",
      { scale: 2, y: -100 },
      { scale: 1, duration: 1, y: 0, opacity: 1 }
    );
    gsap.to(".heroText", { duration: 1, y: 0, opacity: 1, delay: 0.3 });
    gsap.fromTo(
      ".pages",
      {
        x: -200,
        rotate: -360,
        scale: 0.5,
        opacity: 0,
        borderRadius: "9999px", // fully rounded (circle)
      },
      {
        x: 0,
        rotate: 0,
        scale: 1,
        opacity: 1,
        borderRadius: "0.75rem", // like Tailwind's rounded-xl
        duration: 1.5,
        ease: "bounce.out",
        delay: 1,
        onComplete: () => {
          gsap.to(".pages", { height: "auto", width: "auto", duration: 0.5 });
          gsap.to(".pageText", { opacity: 1, duration: 0.5 });
        },
      }
    ),
      gsap.from(".card", {
        delay: 2,
        opacity: 0,
        rotateY: 90,
        transformOrigin: "center",
        duration: 0.8,
        stagger: 0.1,
        ease: "back.out(1.7)",
      });
  }, []);
  useEffect(() => {
    console.log("Selected movie:", selectedMovie);
  }, [selectedMovie]);

  useEffect(() => {
  async function fetchWatchlist() {
    const list = await getWatchList();
    setWatchlist(list);
  }

  fetchWatchlist();
}, []);

  useEffect(() => {
    if (movieCardRef.current.length === 0) return;
    console.log("MovieCard ref set for index:", movieCardRef.current.length);

    movieCardRef.current.forEach(
      (el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, x: -50, scale: 1.1 },
          {
            opacity: 1,
            scale: 1,
            x: 0,
            duration: 0.1,
            ease: "expo.inOut",
            delay: i * 0.059,
            scrollTrigger: {
              trigger: el,
              start: "top 95%",
              toggleActions: "play none none none",
            },
          }
        );
      },
      [moviesList]
    );

    // Optional: refresh ScrollTrigger
    ScrollTrigger.refresh();
  });

  useEffect(() => {
    movieCardRef.current = [];
  }, [moviesList.length]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      fetchMovies(debouncedSearchTerm);
    } else {
      fetchMovies();
    }
  }, [debouncedSearchTerm, page]);

  return (
    <>
      <main className=" relative min-h-screen w-screen z-0 overflow-x-hidden ">
        <img
          src={hero_bg}
          alt="hero background"
          className="fixed top-0 left-0 w-full h-full object-cover z-[-1]"
        />

     <WatchList />
        <div className=" hero flex flex-col items-center justify-center z-10  mt-7 w-full min-h-full gap-10 pointer-events-none">
          <img
            src={hero}
            className="z-10 mt-7 heroImg translate-y-[100px]
 opacity-0 pointer-events-none"
            alt=""
            width={600}
          />
          <p
            className="text-white text-5xl bold text-center heroText translate-y-[100px]
 opacity-0 hero_text"
          >
            {" "}
            Find The{" "}
            <span className="bg-linear-to-r from-[#D6C7FF] to-[#AB8BFF] bg-clip-text text-transparent">
              Movies
            </span>{" "}
            you will
            <br /> enjoy haasle free{" "}
          </p>

         
        </div>
        <div className="trnd_search w-full flex justify-center items-center flex-col mt-10">
 <TrendingMovies trendingMoviesstate={trendingMoviesstate} />
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </div>
        <h2 className=" all_movies trending-title h-[60px] text-5xl font-extrabold bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500 bg-clip-text text-transparent self-start">
          All Movies
        </h2>

        <div className=" moviec w-full flex items-center  justify-center  ">
          {moviesList.length > 0 ? (
            <div className="card grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
              {moviesList.map((movie, index) => (
                 
                <MovieCard
                
                  key={movie.id}
                  movie={movie}
                  ref={(el) => {
                    if (el) {
                      movieCardRef.current[index] = el;
                    }
                  }}
                  isInWatchlist={watchlist.some(item => item.movie_id === movie.id)}
                  onClick={() => setSelectedMovie(movie)}
                />
              ))}
            </div>
          ) : (
            <p className="text-white">Loading movies...</p>
          )}
        </div>

        <div className="w-full flex justify-center items-center px-4 mt-6 ">
          <button
            className="pages h-auto bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex justify-center items-center"
            onClick={() => {
              if (page > 1) {
                setPage(page - 1);
              }
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="white"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <div className="pages w-[80px] h-[80px]  translate-x-[-100px] bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full opacity-0 mx-auto mt-6 text-white i">
            <p className="opacity-0 pageText font-bold">
              Page {page} of {totalPages}
            </p>
          </div>
          <button
            className="pages h-auto bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex justify-center items-center"
            onClick={() => {
              setPage(page + 1);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="white"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </main>
    </>
  );
}

export default App;
