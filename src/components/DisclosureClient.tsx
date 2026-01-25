"use client";

import {
  Disclosure,
  DisclosurePanel,
  DisclosureButton,
} from "@headlessui/react";

import Link from "next/link";
import { MenuItem } from "@/lib/api/types";

interface DisclosureClientProps {
  navigation: MenuItem[];
}

export default function DisclosureClient({ navigation }: DisclosureClientProps) {
  return (
    <Disclosure>
      {({ open }) => (
        <>
          <DisclosureButton
            aria-label="Toggle Menu"
            className="px-2 py-1 text-gray-500 rounded-md lg:hidden hover:text-indigo-500 focus:text-indigo-500 focus:bg-indigo-100 focus:outline-none dark:text-gray-300 dark:focus:bg-trueGray-700"
          >
            <svg
              className="w-6 h-6 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              {open && (
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
                />
              )}
              {!open && (
                <path
                  fillRule="evenodd"
                  d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                />
              )}
            </svg>
          </DisclosureButton>

          <DisclosurePanel className="flex flex-wrap w-full my-5 lg:hidden">
            <>
              {navigation.map((item) => (
                <Link
                  key={item.id}
                  href={item.url}
                  target={item.open_in_new_tab ? "_blank" : "_self"}
                  className="w-full px-4 py-2 -ml-4 text-gray-500 rounded-md dark:text-gray-300 hover:text-indigo-500 focus:text-indigo-500 focus:bg-indigo-100 dark:focus:bg-gray-800 focus:outline-none"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/"
                className="w-full px-6 py-2 mt-3 text-center text-white bg-indigo-600 rounded-md lg:ml-5"
              >
                Get Started
              </Link>
            </>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}
