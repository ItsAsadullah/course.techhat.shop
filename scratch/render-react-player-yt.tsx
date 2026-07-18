import React from "react";
import { renderToString } from "react-dom/server";
import ReactPlayer from "react-player/youtube";

const url = "https://www.youtube.com/watch?v=WlJnsf8slEI&list=PLl4P5hjjGgVxYB3ZLZaYetITNAGQIyI0Z";
const html = renderToString(React.createElement(ReactPlayer, { url }));

console.log("RENDERED YOUTUBE HTML:", html);
