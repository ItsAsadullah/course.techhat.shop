import ReactPlayer from "react-player";

const urlWithSpace = "https://www.youtube.com/watch?v=WlJnsf8slEI&list=PLl4P5hjjGgVxYB3ZLZaYetITNAGQIyI0Z ";
console.log("Can play with space:", ReactPlayer.canPlay(urlWithSpace));

const cleanUrl = urlWithSpace.trim();
console.log("Can play clean:", ReactPlayer.canPlay(cleanUrl));
