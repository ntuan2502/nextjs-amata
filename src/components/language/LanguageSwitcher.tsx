"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";

const languages = [
  {
    label: "English",
    value: "en",
    icon: "twemoji:flag-united-kingdom",
  },
  {
    label: "Tiếng Việt",
    value: "vi",
    icon: "twemoji:flag-vietnam",
  },
];

export default function LanguageSwitcher() {
  const currentLocale = useLocale();
  const [open, setOpen] = useState(false);
  const [iconKey, setIconKey] = useState(Date.now());
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

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

  const current =
    languages.find((lang) => lang.value === currentLocale) ?? languages[0];

  const changeLanguage = (locale: string) => {
    const segments = pathname.split("/");
    segments[1] = locale;
    router.push(segments.join("/"));
    setOpen(false);
    setIconKey(Date.now());
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        aria-label="Toggle language dropdown"
      >
        <Icon key={iconKey} icon={current.icon} className="text-xl" />
      </button>

      {open && (
        <div className="absolute right-0 z-10 mt-2 w-44 rounded-md shadow-lg bg-white dark:bg-gray-900 ring-1 ring-black/5">
          <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
            {languages.map((lang) => (
              <li key={lang.value}>
                <button
                  onClick={() => changeLanguage(lang.value)}
                  className="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition text-left"
                >
                  <span className="flex items-center gap-2">
                    <Icon icon={lang.icon} className="text-lg" />
                    {lang.label}
                  </span>
                  {lang.value === current.value && (
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
