import { useEffect, useState } from "react";
import { menuApi } from "@/api/menuApi";
import type { MenuItem, Category } from "@/types/menu";

export const useMenu = () => {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    Promise.all([menuApi.getMenu(), menuApi.getCategories()])
      .then(([menuData, catData]) => {
        if (!mounted) return;
        setMenu(menuData);
        setCategories(catData);
      })
      .catch((err: Error) => {
        if (mounted) setError(err.message);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { menu, categories, loading, error };
};