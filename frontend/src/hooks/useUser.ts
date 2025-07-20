import { useEffect, useState } from "react";

import { getUser } from "@/services/userService";

// TODO: delete
type User = {
  email: string;
  firstName: string;
  lastName: string;
  role: "admin" | "user";
};

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchUser = async () => {
      try {
        const data = await getUser();

        if (!data || Object.keys(data).length === 0) {
          setIsEmpty(true);
        } else {
          setUser(data);
        }
      } catch (err: any) {
        if (err.message === "Request timed out") {
          setTimedOut(true);
          setError("La requête a expiré.");
        } else {
          setError(err.message || "Erreur inconnue");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    return () => controller.abort();
  }, []);

  return {
    user,
    loading,
    error,
    isEmpty,
    timedOut,
  };
};
