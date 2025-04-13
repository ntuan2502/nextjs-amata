"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { useTheme } from "next-themes";

const themes = [
  {
    label: "System",
    value: "system",
    icon: "line-md:computer",
  },
  {
    label: "Light",
    value: "light",
    icon: "line-md:moon-filled-to-sunny-filled-loop-transition",
  },
  {
    label: "Dark",
    value: "dark",
    icon: "line-md:sunny-filled-loop-to-moon-filled-loop-transition",
  },
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [iconKey, setIconKey] = useState(Date.now());
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!mounted) return null;

  const current = themes.find((t) => t.value === theme) ?? themes[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        aria-label="Toggle theme dropdown"
      >
        <Icon key={iconKey} icon={current.icon} className="text-xl" />
      </button>

      {open && (
        <div className="absolute right-0 z-10 mt-2 w-44 rounded-md shadow-lg bg-white dark:bg-gray-900 ring-1 ring-black/5">
          <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
            {themes.map((t) => (
              <li key={t.value}>
                <button
                  onClick={() => {
                    setTheme(t.value);
                    setOpen(false);
                    setIconKey(Date.now());
                  }}
                  className="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition text-left"
                >
                  <span className="flex items-center gap-2">
                    <Icon icon={t.icon} className="text-lg" />
                    {t.label}
                  </span>
                  {t.value === current.value && (
                    <Icon
                      icon="line-md:check-all"
                      className="text-xl text-blue-500"
                    />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
