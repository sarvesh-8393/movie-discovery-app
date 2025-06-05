import React from "react";
import star from "../assets/star.svg";
import { useState, useEffect } from "react";
import { addToWatchList } from "../appwrite2";

const MovieCard = React.forwardRef(({ movie, isInWatchlist }, ref) => {
  const {
    backdrop_path,
    original_language,
    original_title,
    overview,
    poster_path,
    release_date,
    vote_average,
    genre_ids = [],
  } = movie;

  const genreMap = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Sci-Fi",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western",
  };
  const [clicked, setClicked] = useState(isInWatchlist);

  useEffect(() => {
    setClicked(isInWatchlist);
  }, [isInWatchlist]);

  const handleclick = () => {
    const newClicked = !clicked;
    setClicked(newClicked);
    addToWatchList(movie, newClicked ? "add" : "remove");
  };

  return (
    <div
      ref={ref}
      className="
    cursor-pointer flex flex-col bg-gray-800 rounded-2xl h-[400px]
    w-[250px] overflow-visible          /* allow the scaled card to overflow */
    group relative shadow-lg transition-transform duration-1000 ease-in-out
    transform origin-center hover:z-50 hover:shadow-2xl
  "
    >
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[90%] md:w-[500px] 
             bg-black/80 opacity-0 group-hover:opacity-100 
             transition-all duration-500 ease-in-out 
             flex flex-col justify-center items-center gap-2 
             text-white z-10 rounded-2xl p-6 backdrop-blur-md shadow-2xl pointer-events-none"
      >
        {/* Backdrop Image */}

        <div className="w-full flex  relative rounded-xl overflow-hidden">
          <img
            src={
              backdrop_path
                ? `https://image.tmdb.org/t/p/w500/${backdrop_path}`
                : "/no-movie.png"
            }
            alt=""
            className="object-cover w-full h-full"
          />
        </div>
        <div className="w-full flex justify-evenly items-center pointer-events-auto ">
          <div className="w-[200px] h-[40px]  justify-center bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 text-white rounded-full text-sm font-medium shadow-md hover:shadow-xl border border-gray-700 transition duration-300 ease-in-out cursor-pointer flex items-center">
            Know More
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="w-4 h-4 ml-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 12H6.75m10.5 0l-3.75-3.75m3.75 3.75l-3.75 3.75"
              />
            </svg>
          </div>
          <div
            className="mt-3 w-[130px] h-[36px] bg-gradient-to-r from-gray-800 to-zinc-700 hover:from-zinc-700 hover:to-gray-800 text-white rounded-xl border border-gray-600 shadow-md cursor-pointer flex items-center justify-center gap-2 transition-all duration-300"
            onClick={handleclick}
          >
            {!clicked ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}

            <span className="text-sm font-medium">Watchlist</span>
          </div>
        </div>

        {/* Button */}

        {/* Title */}
        <h3 className="text-2xl font-bold text-center">{original_title}</h3>

        {/* Overview */}
        <p className="text-sm text-gray-400 text-center line-clamp-6">
          {overview || "No overview available."}
        </p>
        <div className="flex flex-wrap items-center gap-1 mt-1 text-sm">
          <p className="text-gray-400 text-lg flex gap-1">
            {genre_ids.map((id, index) => (
              <span key={id}>
                {genreMap[id]}
                {index < genre_ids.length - 1 && <span className="">●</span>}
              </span>
            ))}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-1 mt-1 text-sm">
          <img src={star} width={15} alt="star" />
          <span className="text-gray-200 text-lg">{vote_average.toFixed(1)}</span>
          <span className="text-gray-400 text-lg">●</span>
          <span className="text-gray-200 text-lg">{original_language}</span>
          <span className="text-gray-400 text-lg">●</span>

          <span className="text-gray-200 text-lg">
            {release_date ? release_date.split("-")[0] : "N/A"}
          </span>
        </div>
      </div>

      {/* Movie Poster */}
      <div className="relative h-[350px] w-full object-cover rounded-t-2xl overflow-hidden">
        <img
          src={
            poster_path
              ? `https://image.tmdb.org/t/p/w500/${poster_path}`
              : "/no-movie.png"
          }
          className=""
          alt={original_title}
        />
      </div>

      {/* Movie Details */}
      <div className="movieTitle p-3 z-0">
        <p className="text-white text-lg font-bold">{original_title}</p>
        <div className="flex flex-wrap items-center gap-1 mt-1 text-sm">
          <img src={star} width={15} alt="star" />
          <span className="text-gray-400">{vote_average}</span>
          <span className="text-gray-600">●</span>
          <span className="text-gray-400">{original_language}</span>
          <span className="text-gray-600">●</span>
          <span className="text-gray-400">
            {release_date ? release_date.split("-")[0] : "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
});

export default MovieCard;
