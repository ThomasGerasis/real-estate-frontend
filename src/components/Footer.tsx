import Link from "next/link";
import Image from "next/image";
import React from "react";
import { Container } from "@/components/Container";
import { settingService, getStorageUrl, menuService, SiteSettings, MenuItem } from "@/lib/api";

export async function Footer() {
  let settings: SiteSettings = {};
  let footerMenu: MenuItem[] = [];

  try {
    [settings, footerMenu] = await Promise.all([
      settingService.getAllSettings(),
      menuService.getFooterMenu(),
    ]);
  } catch (error) {
    console.error('Failed to load footer data:', error);
  }

  const logoUrl = settings.site_logo ? getStorageUrl(settings.site_logo) : '/img/logo.svg';
  const siteName = settings.site_name || 'Real Estate';

  const socialLinks = [
    { url: settings.social_twitter, label: 'Twitter', Icon: Twitter },
    { url: settings.social_facebook, label: 'Facebook', Icon: Facebook },
    { url: settings.social_instagram, label: 'Instagram', Icon: Instagram },
    { url: settings.social_linkedin, label: 'LinkedIn', Icon: Linkedin },
  ].filter((s) => s.url);

  return (
    <div className="relative">
      <Container>
        <div className="grid max-w-screen-xl grid-cols-1 gap-10 pt-10 mx-auto mt-5 border-t border-gray-100 dark:border-trueGray-700 lg:grid-cols-5">
          {/* Brand + about */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 text-2xl font-medium text-indigo-500 dark:text-gray-100">
              <Image src={logoUrl} alt={siteName} width={150} height={40} className="h-10 w-auto" />
            </Link>
            {settings.footer_about ? (
              <div
                className="max-w-md mt-4 text-gray-500 dark:text-gray-400 prose prose-sm dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: settings.footer_about }}
              />
            ) : (
              <p className="max-w-md mt-4 text-gray-500 dark:text-gray-400">
                {settings.site_description || 'Η αξιόπιστη πλατφόρμα σας για την εύρεση του τέλειου ακινήτου.'}
              </p>
            )}
          </div>

          {/* Footer menu */}
          <div>
            {footerMenu.length > 0 && (
              <div className="flex flex-wrap w-full -mt-2 -ml-3 lg:ml-0">
                {footerMenu.map((item) => (
                  <Link
                    key={item.id}
                    href={item.url}
                    target={item.open_in_new_tab ? '_blank' : '_self'}
                    className="w-full px-4 py-2 text-gray-500 rounded-md dark:text-gray-300 hover:text-indigo-500 focus:text-indigo-500 focus:bg-indigo-100 focus:outline-none dark:focus:bg-trueGray-700"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Contact details */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Επικοινωνία</h3>
            {settings.contact_address && (
              <div className="flex items-start gap-2 text-gray-500 dark:text-gray-400 text-sm">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{settings.contact_address}</span>
              </div>
            )}
            {settings.contact_phone && (
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href={`tel:${settings.contact_phone}`}>{settings.contact_phone}</a>
              </div>
            )}
            {settings.contact_email && (
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href={`mailto:${settings.contact_email}`}>{settings.contact_email}</a>
              </div>
            )}
            {settings.contact_working_hours && (
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{settings.contact_working_hours}</span>
              </div>
            )}
          </div>

          {/* Social links */}
          {socialLinks.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-4">Ακολουθήστε μας</h3>
              <div className="flex mt-2 space-x-5 text-gray-400 dark:text-gray-500">
                {socialLinks.map(({ url, label, Icon }) => (
                  <a key={label} href={url} target="_blank" rel="noopener noreferrer">
                    <span className="sr-only">{label}</span>
                    <Icon />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="my-10 text-sm text-center text-gray-600 dark:text-gray-400">
          {settings.footer_text
            ? `${settings.footer_text} © ${new Date().getFullYear()} ${siteName}`
            : `Copyright © ${new Date().getFullYear()} ${siteName}`}
        </div>
      </Container>
    </div>
  );
}


const Twitter = ({ size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M24 4.37a9.6 9.6 0 0 1-2.83.8 5.04 5.04 0 0 0 2.17-2.8c-.95.58-2 1-3.13 1.22A4.86 4.86 0 0 0 16.61 2a4.99 4.99 0 0 0-4.79 6.2A13.87 13.87 0 0 1 1.67 2.92 5.12 5.12 0 0 0 3.2 9.67a4.82 4.82 0 0 1-2.23-.64v.07c0 2.44 1.7 4.48 3.95 4.95a4.84 4.84 0 0 1-2.22.08c.63 2.01 2.45 3.47 4.6 3.51A9.72 9.72 0 0 1 0 19.74 13.68 13.68 0 0 0 7.55 22c9.06 0 14-7.7 14-14.37v-.65c.96-.71 1.79-1.6 2.45-2.61z" />
  </svg>
);

const Facebook = ({ size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.5h-2.8V24C19.62 23.1 24 18.1 24 12.07" />
  </svg>
);
const Instagram = ({ size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M16.98 0a6.9 6.9 0 0 1 5.08 1.98A6.94 6.94 0 0 1 24 7.02v9.96c0 2.08-.68 3.87-1.98 5.13A7.14 7.14 0 0 1 16.94 24H7.06a7.06 7.06 0 0 1-5.03-1.89A6.96 6.96 0 0 1 0 16.94V7.02C0 2.8 2.8 0 7.02 0h9.96zm.05 2.23H7.06c-1.45 0-2.7.43-3.53 1.25a4.82 4.82 0 0 0-1.3 3.54v9.92c0 1.5.43 2.7 1.3 3.58a5 5 0 0 0 3.53 1.25h9.88a5 5 0 0 0 3.53-1.25 4.73 4.73 0 0 0 1.4-3.54V7.02a5 5 0 0 0-1.3-3.49 4.82 4.82 0 0 0-3.54-1.3zM12 5.76c3.39 0 6.2 2.8 6.2 6.2a6.2 6.2 0 0 1-12.4 0 6.2 6.2 0 0 1 6.2-6.2zm0 2.22a3.99 3.99 0 0 0-3.97 3.97A3.99 3.99 0 0 0 12 15.92a3.99 3.99 0 0 0 3.97-3.97A3.99 3.99 0 0 0 12 7.98zm6.44-3.77a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8z" />
  </svg>
);

const Linkedin = ({ size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M22.23 0H1.77C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.2 0 22.23 0zM7.27 20.1H3.65V9.24h3.62V20.1zM5.47 7.76h-.03c-1.22 0-2-.83-2-1.87 0-1.06.8-1.87 2.05-1.87 1.24 0 2 .8 2.02 1.87 0 1.04-.78 1.87-2.05 1.87zM20.34 20.1h-3.63v-5.8c0-1.45-.52-2.45-1.83-2.45-1 0-1.6.67-1.87 1.32-.1.23-.11.55-.11.88v6.05H9.28s.05-9.82 0-10.84h3.63v1.54a3.6 3.6 0 0 1 3.26-1.8c2.39 0 4.18 1.56 4.18 4.89v6.21z" />
  </svg>
);

