import { useState, useEffect } from "react";

const FAVORITES_KEY = "portfolio_favorites";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>(() => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (projectId: string) => {
    setFavorites((prev) =>
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId]
    );
  };

  const isFavorite = (projectId: string) => favorites.includes(projectId);

  return { favorites, toggleFavorite, isFavorite };
};
