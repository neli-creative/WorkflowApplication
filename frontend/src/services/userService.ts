// src/services/userService.ts
export const getUser = async (): Promise<any> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 7000); // 7s

  try {
    const res = await fetch(`http://localhost:3000/user`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return await res.json();
  } catch (error: any) {
    if (error.name === "AbortError") {
      throw new Error("Request timed out");
    }
    throw error;
  }
};
