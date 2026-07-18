"use client";

import { useEffect } from "react";

export function DisableRightClick() {
  useEffect(() => {
    // Only enable protection in production, so developers can use DevTools
    if (process.env.NODE_ENV === "development") {
      return;
    }

    // Disable right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // Disable keyboard shortcuts for copy, print, save, and inspect element
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent F12 (Inspect Element)
      if (e.key === "F12") {
        e.preventDefault();
      }

      // Prevent Ctrl+Shift+I (Inspect Element), Ctrl+Shift+J (Console), Ctrl+U (View Source)
      if (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "i" || e.key === "J" || e.key === "j" || e.key === "C" || e.key === "c")) {
        e.preventDefault();
      }

      // Prevent Ctrl+U (View Source)
      if (e.ctrlKey && (e.key === "U" || e.key === "u")) {
        e.preventDefault();
      }

      // Prevent Ctrl+C (Copy), Ctrl+P (Print), Ctrl+S (Save), Ctrl+A (Select All)
      if (e.ctrlKey && (e.key === "C" || e.key === "c" || e.key === "P" || e.key === "p" || e.key === "S" || e.key === "s" || e.key === "A" || e.key === "a")) {
        e.preventDefault();
      }

      // Prevent Command key equivalents on Mac
      if (e.metaKey && (e.key === "C" || e.key === "c" || e.key === "P" || e.key === "p" || e.key === "S" || e.key === "s" || e.key === "A" || e.key === "a")) {
        e.preventDefault();
      }
      
      // Prevent Command+Option+I/J/U on Mac
      if (e.metaKey && e.altKey && (e.key === "I" || e.key === "i" || e.key === "J" || e.key === "j" || e.key === "U" || e.key === "u")) {
        e.preventDefault();
      }
    };

    // Prevent drag and drop of images and text
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("dragstart", handleDragStart);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("dragstart", handleDragStart);
    };
  }, []);

  return null;
}
