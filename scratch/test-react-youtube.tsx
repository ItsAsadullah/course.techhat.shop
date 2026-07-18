import React from "react";
import { renderToString } from "react-dom/server";
import YouTube from "react-youtube";

const html = renderToString(React.createElement(YouTube, { 
  videoId: "WlJnsf8slEI",
  opts: {
    width: "100%",
    height: "100%",
    playerVars: {
      controls: 0,
      disablekb: 1,
      modestbranding: 1,
      rel: 0,
      iv_load_policy: 3
    }
  }
}));

console.log("IFRAME HTML:", html);
