import React from "react";
import search from "../assets/search.svg";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Search = ({ searchTerm, setSearchTerm }) => {
  useGSAP(() => {
    gsap.fromTo(
      ".searchBar",
      {
        y: 100,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1.5,
        ease: "bounce.out",
        scrollTrigger: {
          trigger: ".searchBar",
          start: "top 85%", // Triggers when .searchBar hits 80% from top
          toggleActions: "play none none none",
        },
      }
    );
  }, []);

  return (
    <div className="relative w-[500px] h-[44px] gap-9 bg-indigo-200 rounded-3xl searchBar opacity-0 flex items-center justify-start">
      {/* Icon */}
      <div>
        <img
          src={search}
          alt="search"
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5"
        />
      </div>

      <div className=" absolute left-10 top-2 flex items-center justify-start w-full">
        <input
          type="text"
          className="outline-none bg-transparent w-full h-full text-black text-lg placeholder:text-black placeholder:opacity-50"
          placeholder="Search for movie here"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
        />
      </div>
    </div>
  );
};

export default Search;
