import Link from "next/link";
import ThemeChanger from "./DarkSwitch";
import Image from "next/image"
import { menuService } from "@/lib/api";
import DisclosureClient from "./DisclosureClient";

export const Navbar = async () => {
  let navigation = [];
  
  try {
    navigation = await menuService.getHeaderMenu();
  } catch (error) {
    console.error('Failed to load menu:', error);
  }

  return (
    <div className="w-full">
      <nav className="container relative flex flex-wrap items-center justify-between p-8 mx-auto lg:justify-between xl:px-1">
        {/* Logo  */}
        <Link href="/">
          <span className="flex items-center space-x-2 text-2xl font-medium text-indigo-500 dark:text-gray-100">
              <span>
                <Image
                  src="/img/logo.svg"
                  width="32"
                  alt="N"
                  height="32"
                  className="w-8"
                />
              </span>
            <span>Nextly</span>
          </span>
        </Link>

        {/* get started  */}
        <div className="gap-3 nav__item mr-2 lg:flex ml-auto lg:ml-0 lg:order-2">
            <ThemeChanger />
        </div>
                
        <DisclosureClient navigation={navigation} />
        
        {/* menu  */}
        <div className="hidden text-center lg:flex lg:items-center">
          <ul className="items-center justify-end flex-1 pt-6 list-none lg:pt-0 lg:flex">
            {navigation.map((item) => (
              <li className="mr-3 nav__item" key={item.id}>
                <Link href={item.url} target={item.open_in_new_tab ? "_blank" : "_self"} className="inline-block px-4 py-2 text-lg font-normal text-gray-800 no-underline rounded-md dark:text-gray-200 hover:text-indigo-500 focus:text-indigo-500 focus:bg-indigo-100 focus:outline-none dark:focus:bg-gray-800">
                    {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

      </nav>
    </div>
  );
}

