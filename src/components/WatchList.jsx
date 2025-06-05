import React from "react";
import { useState, useEffect, useRef } from "react";
import { getWatchList } from "../appwrite2";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const WatchList = () => {
  const [clicked, setClicked] = useState(false);
  const [watchlist, setWatchlist] = useState([]);
  const scrollRef = useRef([]);
  useEffect(() => {
    const fetchWatchList = async () => {
      const list = await getWatchList();
      setWatchlist(list || []);
    };

    fetchWatchList();
  }, []);

  useGSAP(() => {
    if (clicked) {
      gsap.fromTo(
        ".hover_watchList",
        {
          x: -300,
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
        }
      ),
        gsap.from(scrollRef.current, {
          scale: 0.9,
          opacity: 0,
          stagger: 0.1,
          duration: 0.5,
          ease: "back.out(1.7)",
        });
    }
  }, [clicked]);
  const addToRefs = (el) => {
    if (el && !scrollRef.current.includes(el)) {
      scrollRef.current.push(el);
    }
  };

  return (
    <div
      className="watchlist relative flex gap-3 justify-center items-center self-end h-[50px] w-[200px] rounded-lg bg-transparent border-gray-500 border-2 cursor-pointer hover:bg-gray-800 hover:border-white transition-all duration-300 "
      onClick={() => setClicked(!clicked)}
    >
      {" "}
      <p className="text-xl font-light text-transparent bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500 bg-clip-text ">
        Your WatchList
      </p>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="#6a7282"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 5v14l7-5 7 5V5a2 2 0 00-2-2H7a2 2 0 00-2 2z"
        />
      </svg>
      {clicked && (
        <div className="hover_watchList absolute top-0 left-0 w-[400px] h-[600px] flex flex-col  bg-black bg-opacity-10 rounded-lg shadow-lg z-50 overflow-y-scroll">
          <div className="sticky top-0 z-20 bg-black/80 watchList-head flex justify-between px-4 py-2">
            <h2 className="text-3xl font-bold text-transparent bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500 bg-clip-text  mb-4">
              Your WatchList
            </h2>
            <div
              className="w-[20px] h-[20px] "
              onClick={() => setClicked(!clicked)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="white"
                stroke-width="2"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>

          <ul className="flex flex-col gap-4 ">
            {watchlist.map((item, index) => (
              <li
                ref={addToRefs}
                key={item.id}
                className="  flex justify-center h-[80px] align-center"
              >
                <p className="text-yellow-500 text-lg ">{index + 1}.</p>
                <p className="text-gray-200 w-[60%] text-lg">
                  {item.movieName}
                </p>

                <img
                  src={item.image_url}
                  className="rounded-lg h-[60px] w-[95px]"
                  alt="soon"
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default WatchList;
