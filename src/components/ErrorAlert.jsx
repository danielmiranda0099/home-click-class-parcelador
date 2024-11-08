"use client";
import React, { useEffect, useState } from "react";
import { XIcon } from "@/components/icons";

export function ErrorAlert({ message, duration = 7000 }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Iniciamos el temporizador para comenzar el fade out
    const fadeTimeout = setTimeout(() => {
      setIsLeaving(true);
    }, duration - 500); // Comenzamos la animación 500ms antes

    // Iniciamos el temporizador para remover el componente
    const removeTimeout = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    // Limpiamos los temporizadores si el componente se desmonta
    return () => {
      clearTimeout(fadeTimeout);
      clearTimeout(removeTimeout);
    };
  }, [duration]);

  if (!isVisible) return null;

  return (
    <div
      className={`
        mt-3 
        bg-red-500 
        p-3 
        rounded-sm 
        flex 
        transform
        transition-all
        duration-500
        ${isLeaving ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"}
        animate-fadeIn
      `}
    >
      <XIcon color="white" />
      <p className="text-white font-semibold ml-1">{message}</p>
    </div>
  );
}
