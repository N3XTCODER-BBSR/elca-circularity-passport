/**
 * This file is part of the "eLCA Circularity Index and Building Resource Passport" project.
 *
 * Circularity Index
 * A web-based add-on to eLCA, to calculate the circularity index of a building according to "BNB-Steckbrief 07 Kreislauffähigkeit".
 *
 * Building Resource Passport
 * A website for exploring and downloading normed sustainability indicators of a building.
 *
 * Copyright (c) 2024 N3xtcoder <info@n3xtcoder.org>
 * Nextcoder Softwareentwicklungs GmbH - http://n3xtcoder.org/
 *
 * Primary License:
 * This project is licensed under the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * Additional Notice:
 * This file also contains code originally licensed under the MIT License.
 * Please see the LICENSE file in the root of the repository for details.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See <http://www.gnu.org/licenses/>.
 */
import Link from "next/link"
import { useTranslations } from "next-intl"

function Footer() {
  const tFooter = useTranslations("Footer")

  return (
    <footer className="bg-bbsr-blue-800 py-10 text-base font-medium">
      <div className="mx-auto flex max-w-[1200px] flex-row items-center justify-between px-12 text-center lg:px-20">
        <p className="text-gray-400">&copy; {tFooter("copyright")}</p>
        <ul className="ml-6 flex flex-row items-center space-x-6">
          <li>
            <a
              href="/20250407-elca-circularity-index-v0-3-user-documentation.pdf"
              className="rounded-md bg-teal-600 px-4 py-2 text-white transition-colors hover:bg-teal-500"
              target="_blank"
              rel="noopener noreferrer"
            >
              {tFooter("links.userTestingGuide")}
            </a>
          </li>
          <li>
            <a
              href="https://beta.bauteileditor.de/privacy/"
              className="text-gray-400 transition-colors hover:text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              {tFooter("links.privacyPolicy")}
            </a>
          </li>
          <li>
            <Link href="/imprint" className="text-gray-400 transition-colors hover:text-white">
              {tFooter("links.imprint")}
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  )
}

export default Footer
