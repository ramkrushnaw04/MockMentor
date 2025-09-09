import { useEffect, useState } from "react";

export default function useDarkMode() {
  const [isDark, setIsDark] = useState(() =>
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    // if (isDark) {
    //   document.documentElement.classList.add("dark");
    //   localStorage.setItem("theme", "dark");
    // } else {
    //   document.documentElement.classList.remove("dark");
    //   localStorage.setItem("theme", "light");
    // }

    document.documentElement.classList.toggle("dark")
    localStorage.setItem("theme", isDark ? "dark" : "light")  

  }, [isDark]);

  const toggleDarkMode = () => setIsDark(prev => !prev);

  return { isDark, toggleDarkMode };
}