"use client";
import { useEffect, useState } from "react";
import { XIcon } from "@/components/icons";

export function ErrorAlert({ message, duration = 5000, className = "" }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      setIsLeaving(false);

      const fadeTimeout = setTimeout(() => {
        setIsLeaving(true);
      }, duration - 500);

      const removeTimeout = setTimeout(() => {
        setIsVisible(false);
      }, duration);

      return () => {
        clearTimeout(fadeTimeout);
        clearTimeout(removeTimeout);
      };
    }
  }, [duration, message]);

  if (!isVisible || !message) return null;

  return (
    <div
      className={
        `
        my-3 
        bg-red-500 
        p-3 
        rounded-sm 
        flex 
        transform
        transition-all
        duration-500
        ${isLeaving ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"}
        animate-fadeIn
      ` +
        " " +
        className
      }
    >
      <XIcon color="white" />
      <p className="text-white font-semibold ml-1">{message}</p>
    </div>
  );
}
