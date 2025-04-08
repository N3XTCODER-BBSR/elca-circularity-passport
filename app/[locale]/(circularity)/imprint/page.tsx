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
import { Area, Heading3, Heading4, Text } from "app/(components)/generic/layout-elements"

export default function Imprint() {
  return (
    <div className="mx-auto max-w-[1200px] px-12 py-10 lg:px-20">
      <Heading3>Imprint</Heading3>

      <Area>
        <Heading4>Operator</Heading4>
        <ul className="mb-4 space-y-2 text-gray-600">
          <li>
            Bundesinstitut für Bau-, Stadt- und Raumforschung (BBSR) im Bundesamt für Bauwesen und Raumordnung (BBR)
          </li>
          <li>Referat WB 6 Instrumente des ressourcenschonenden und klimaangepassten Bauens</li>
          <li>Mailing Address: Straße des 17. Juni 112, 10623 Berlin</li>
          <li>Visitors: Reichpietschufer 86-90, 10785 Berlin</li>
        </ul>
      </Area>

      <Area>
        <Heading4>Responsible</Heading4>
        <ul className="mb-4 space-y-2 text-gray-600">
          <li>Alberto Espina</li>
          <li>
            <a href="mailto:wb6@bbr.bund.de" className="text-bbsr-blue-600 hover:underline">
              wb6@bbr.bund.de
            </a>
          </li>
          <li>Telefon: +49 30 / 18401-2747</li>
          <li>Telefax: +49 30 / 18401-2769</li>
        </ul>
      </Area>

      <Area>
        <Heading4>Responsibility for the content</Heading4>
        <Text>Bundesinstitut für Bau-, Stadt- und Raumforschung Referat WB 6 Bauen und Umwelt</Text>
        <Text className="mt-2">
          Despite careful control we assume no liability for the content of external links. are solely responsible for
          the content of linked sites responsible.
        </Text>
      </Area>

      <Area>
        <Heading4>Technical support / Development</Heading4>
        <ul className="mb-4 space-y-2 text-gray-600">
          <li>Nextcoder Softwareentwicklungs GmbH</li>
          <li>Linienstr. 71</li>
          <li>10119 Berlin</li>
          <li>
            <a
              href="https://www.n3xtcoder.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-bbsr-blue-600 hover:underline"
            >
              https://www.n3xtcoder.org
            </a>
          </li>
        </ul>
      </Area>

      <Area>
        <Heading4>Problems / Requests</Heading4>
        <Text>
          If you have technical problems or questions about the application, please contact us first by E-Mail to the
          Referat WB 6 Bauen und Umwelt.
        </Text>
      </Area>

      <Area>
        <Heading4>Open Source / Licensing</Heading4>
        <Text>
          The application eLCA Circularity Index and Building Resource Passport is licensed under the GNU Affero General
          Public License version 3 (AGPLv3). This guarantees every user the freedom to use, spread and modify the
          software. The project makes use of a boilerplate originally licensed under the MIT License. A complete version
          of the license is available in the source code. Source code is available here:{" "}
          <a
            href="https://github.com/n3xtcoder/elca-app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-bbsr-blue-600 hover:underline"
          >
            https://github.com/n3xtcoder/elca-app
          </a>
        </Text>
      </Area>
    </div>
  )
}
