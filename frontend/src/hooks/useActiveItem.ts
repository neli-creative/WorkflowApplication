import { useState, useEffect } from "react";

const ACTIVE_ITEM_KEY = "sidebar-active-item";

interface UseActiveItemReturn {
  activeItem: string;
  setActiveItem: (href: string) => void;
  resetActiveItem: () => void;
}

/**
 * Custom hook for managing the active item in the sidebar navigation.
 *
 * This hook provides functionality to:
 * - Get the currently active navigation item
 * - Set a new active item
 * - Reset the active item to default
 *
 * The active item state persists across page reloads using localStorage.
 * On initial load, it tries to restore the previously active item or
 * defaults to the current URL path.
 *
 * @returns {Object} An object containing:
 *   - activeItem: The current active item path
 *   - setActiveItem: Function to set a new active item
 *   - resetActiveItem: Function to reset the active item to "/"
 * */
export const useActiveItem = (): UseActiveItemReturn => {
  const [activeItem, setActiveItemState] = useState("/");

  useEffect(() => {
    const savedActiveItem = localStorage.getItem(ACTIVE_ITEM_KEY);

    if (savedActiveItem) {
      setActiveItemState(savedActiveItem);
    } else {
      const currentPath = window.location.pathname;

      setActiveItemState(currentPath);
      localStorage.setItem(ACTIVE_ITEM_KEY, currentPath);
    }
  }, []);

  const setActiveItem = (href: string) => {
    setActiveItemState(href);
    localStorage.setItem(ACTIVE_ITEM_KEY, href);
  };

  const resetActiveItem = () => {
    setActiveItemState("/");
    localStorage.removeItem(ACTIVE_ITEM_KEY);
  };

  return {
    activeItem,
    setActiveItem,
    resetActiveItem,
  };
};
