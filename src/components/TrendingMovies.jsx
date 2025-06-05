import React, { useRef, useState, useLayoutEffect } from "react";
import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function TrendingMovies({ trendingMoviesstate }) {
  const tcardRef = useRef(null);
  const [isFirstSlide, setIsFirstSlide] = useState(true);
  const movieRefs = useRef([]);
  const [clicked, setClicked] = useState(false);

  const handleNext = () => {
    if (tcardRef.current) {
      tcardRef.current.style.transform = "translateX(-50%)";
      tcardRef.current.style.transition = "transform 0.5s ease-in-out";
      setIsFirstSlide(false);
      setClicked(!clicked);
    }
  };

  const handlePrev = () => {
    if (tcardRef.current) {
      tcardRef.current.style.transform = "translateX(0%)";
      tcardRef.current.style.transition = "transform 0.5s ease-in-out";
      setIsFirstSlide(true);
      setClicked(!clicked); // Toggle clicked state to trigger animation
    }
  };

  const addToRefs = (el) => {
    if (el && !movieRefs.current.includes(el)) {
      movieRefs.current.push(el);
    }
  };

  // Clear refs when movie list changes

  // Animate on scroll
  useLayoutEffect(() => {
    if (!movieRefs.current.length) return;

    // Title animation
    gsap.fromTo(
      ".trending-title",
      { opacity: 0, x: 100 },
      {
        opacity: 1,
        x: 0,
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".trending-title",
          start: "top 70%",
          toggleActions: "play none none none",
        },
      }
    );

    // Each movie item
    movieRefs.current.forEach((el, i) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          delay: i * 0.1,
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    // Optional: refresh triggers
    ScrollTrigger.refresh();
  }, [clicked, trendingMoviesstate]);
  movieRefs.current = [];
  return (
    <div className="w-[80%] overflow-hidden flex flex-col items-center gap-10 pointer-events-auto">
      <p className="trending-title h-[60px] text-5xl font-extrabold bg-gradient-to-r opacity-0 from-pink-400 via-purple-500 to-indigo-500 bg-clip-text text-transparent self-start">
        Trending Movies
      </p>

      <div className="relative w-full overflow-hidden px-4">
        <ul ref={tcardRef} className="flex w-[200%] gap-20 ml-20">
          {trendingMoviesstate.map((movie, index) => (
            <li
              ref={addToRefs}
              key={movie.$id}
              className="individual_movie w-[150px] flex items-center gap-2 p-2"
            >
              <p className="text-[127px] font-bold text-yellow-400">
                {index + 1}
              </p>
              <img
                src={movie.poster_url}
                alt="Poster"
                className="w-[187px] h-[203px] rounded-lg object-cover translate-x-[-20px]"
              />
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-4 mt-2 self-end">
        <button
          onClick={handlePrev}
          disabled={isFirstSlide}
          className="h-10 w-10 rounded-full flex justify-center items-center bg-purple-700 text-white hover:bg-purple-600 disabled:opacity-40 border-white border-2"
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

        <button
          onClick={handleNext}
          disabled={!isFirstSlide}
          className="h-10 w-10 rounded-full flex justify-center items-center bg-purple-700 text-white hover:bg-purple-600 disabled:opacity-40 border-pink border-2"
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
    </div>
  );
}
