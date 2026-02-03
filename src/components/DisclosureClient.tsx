"use client";

import {
  Disclosure,
  DisclosurePanel,
  DisclosureButton,
} from "@headlessui/react";

import Link from "next/link";
import { MenuItem } from "@/lib/api/types";
import { Fragment } from "react";

interface DisclosureClientProps {
  navigation: MenuItem[];
}

export default function DisclosureClient({ navigation }: DisclosureClientProps) {
  return (
    <Disclosure>
      {({ open, close }) => (
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

          {/* Overlay */}
          <DisclosurePanel
            as={Fragment}
          >
            <div className="fixed inset-0 z-40 lg:hidden">
              {/* Dark overlay */}
              <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => close()}
              />
              
              {/* Slide-in menu */}
              <div className="fixed right-0 top-0 bottom-0 w-80 max-w-[80vw] bg-white dark:bg-gray-900 shadow-2xl overflow-y-auto">
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Menu</h2>
                    <button
                      onClick={() => close()}
                      className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Navigation items */}
                  <nav className="flex-1 p-6">
                    <ul className="space-y-2">
                      {navigation.map((item) => (
                        <li key={item.id}>
                          <Link
                            href={item.url}
                            target={item.open_in_new_tab ? "_blank" : "_self"}
                            onClick={() => close()}
                            className="block px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </nav>

                  {/* Footer CTA */}
                  <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                    <Link
                      href="/contact"
                      onClick={() => close()}
                      className="block w-full px-6 py-3 text-center text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold transition-colors"
                    >
                      Get Started
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}
