"use client";

import React, { useState, useEffect, useRef } from "react";
import YouTube, { YouTubeEvent, YouTubePlayer } from "react-youtube";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";
import { createBrowserClient } from "@/lib/supabase-browser";

interface CustomYouTubePlayerProps {
  youtubeId: string;
  onEnd?: () => void;
}

export function CustomYouTubePlayer({ youtubeId, onEnd = () => {} }: CustomYouTubePlayerProps) {
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(100);
  const [showControls, setShowControls] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Dynamic Watermark State
  const [watermarkText, setWatermarkText] = useState("");
  const [watermarkPos, setWatermarkPos] = useState({ top: "10%", left: "10%" });

  useEffect(() => {
    // Fetch logged in user for watermark
    const fetchUser = async () => {
      try {
        const supabase = createBrowserClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const identifier = user.email || user.phone || "Student";
          setWatermarkText(identifier);
        } else {
          setWatermarkText("Guest User");
        }
      } catch (e) {}
    };
    fetchUser();
  }, []);

  useEffect(() => {
    // Move watermark randomly every 4 seconds
    const moveInterval = setInterval(() => {
      const randomTop = Math.floor(Math.random() * 80) + 10; // 10% to 90%
      const randomLeft = Math.floor(Math.random() * 80) + 10; // 10% to 90%
      setWatermarkPos({ top: `${randomTop}%`, left: `${randomLeft}%` });
    }, 4000);
    return () => clearInterval(moveInterval);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && player) {
      interval = setInterval(async () => {
        try {
          const time = await player.getCurrentTime();
          setCurrentTime(time);
        } catch (e) {}
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, player]);

  const handleReady = (event: YouTubeEvent) => {
    setPlayer(event.target);
    setDuration(event.target.getDuration());
    setVolume(event.target.getVolume());
    setIsMuted(event.target.isMuted());
  };

  const handleStateChange = (event: YouTubeEvent) => {
    // 1: PLAYING, 2: PAUSED, 0: ENDED, 3: BUFFERING
    if (event.data === 1) setIsPlaying(true);
    else if (event.data === 2) setIsPlaying(false);
    else if (event.data === 0) {
      setIsPlaying(false);
      onEnd();
    }
  };

  const togglePlay = () => {
    if (!player) return;
    if (isPlaying) player.pauseVideo();
    else player.playVideo();
  };

  const toggleMute = () => {
    if (!player) return;
    if (isMuted) {
      player.unMute();
      setIsMuted(false);
    } else {
      player.mute();
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!player) return;
    const val = parseInt(e.target.value);
    setVolume(val);
    player.setVolume(val);
    if (val === 0) {
      player.mute();
      setIsMuted(true);
    } else if (isMuted) {
      player.unMute();
      setIsMuted(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!player) return;
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    player.seekTo(val, true);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => console.log(err));
    } else {
      document.exitFullscreen();
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 2500);
  };

  const handleMouseLeave = () => {
    if (isPlaying) setShowControls(false);
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video bg-black overflow-hidden group"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* YouTube IFrame - Only visible when actively playing */}
      <div className={`absolute inset-0 transition-all duration-200 ${isPlaying ? 'opacity-100 z-10' : 'opacity-0 -z-10 pointer-events-none'}`}>
        <YouTube
          videoId={youtubeId}
          opts={{
            width: "100%",
            height: "100%",
            playerVars: {
              controls: 0,
              disablekb: 1,
              modestbranding: 1,
              rel: 0,
              iv_load_policy: 3,
              origin: typeof window !== "undefined" ? window.location.origin : "",
            },
          }}
          onReady={handleReady}
          onStateChange={handleStateChange}
          iframeClassName="w-full h-full absolute inset-0 pointer-events-none"
          className="w-full h-full"
        />
      </div>

      {/* Custom Thumbnail Background - Visible when paused/stopped */}
      {!isPlaying && (
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: `url(https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg)` }}
        />
      )}

      {/* Dynamic Watermark to deter screen recording */}
      {watermarkText && isPlaying && (
        <div
          className="absolute z-[15] pointer-events-none text-white/30 text-sm md:text-base font-semibold drop-shadow-md select-none transition-all duration-[4000ms] ease-in-out whitespace-nowrap"
          style={{ top: watermarkPos.top, left: watermarkPos.left }}
        >
          {watermarkText}
        </div>
      )}

      {/* Center Play/Pause Overlay for easy clicking */}
      <div
        className="absolute inset-0 z-10 cursor-pointer"
        onClick={togglePlay}
      >
        {!isPlaying && player && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="bg-indigo-600/90 text-white rounded-full p-4 backdrop-blur-sm transition-transform hover:scale-110">
              <Play className="w-8 h-8 ml-1" />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Controls Bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/90 pt-10 pb-4 px-4 to-transparent transition-opacity duration-300 ${
          showControls || !isPlaying ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Progress Bar */}
        <div className="flex items-center gap-3 mb-2 relative">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            style={{
              background: `linear-gradient(to right, #6366f1 ${(duration > 0 ? (currentTime / duration) * 100 : 0)}%, rgba(255, 255, 255, 0.3) ${(duration > 0 ? (currentTime / duration) * 100 : 0)}%)`
            }}
            className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:h-2 transition-all [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-500"
          />
        </div>

        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <button onClick={togglePlay} className="hover:text-indigo-400 transition-colors">
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-2 group/vol">
              <button onClick={toggleMute} className="hover:text-indigo-400 transition-colors">
                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input
                type="range"
                min={0}
                max={100}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-20 h-1.5 bg-white/30 rounded-lg appearance-none cursor-pointer accent-indigo-500 opacity-0 group-hover/vol:opacity-100 transition-opacity"
              />
            </div>

            <div className="text-xs font-medium font-mono">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          <div>
            <button onClick={toggleFullscreen} className="hover:text-indigo-400 transition-colors">
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
