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
      <Heading3>Impressum</Heading3>

      <Area>
        <Heading4>Betreiber</Heading4>
        <ul className="mb-4 space-y-2 text-gray-600">
          <li>
            Bundesinstitut für Bau-, Stadt- und Raumforschung (BBSR) im Bundesamt für Bauwesen und Raumordnung (BBR)
          </li>
          <li>Referat WB 6 Instrumente des ressourcenschonenden und klimaangepassten Bauens</li>
          <li>Postanschrift: Straße des 17. Juni 112, 10623 Berlin</li>
          <li>Besucher: Reichpietschufer 86-90, 10785 Berlin</li>
        </ul>
      </Area>

      <Area>
        <Heading4>Verantwortlich</Heading4>
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
        <Heading4>Verantwortlich für den Inhalt</Heading4>
        <Text>Bundesinstitut für Bau-, Stadt- und Raumforschung Referat WB 6 Bauen und Umwelt</Text>
        <Text className="mt-2">
          Trotz sorgfältiger Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links. Für den Inhalt der
          verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.
        </Text>
      </Area>

      <Area>
        <Heading4>Technischer Support / Entwicklung</Heading4>
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
        <Heading4>Probleme / Anfragen</Heading4>
        <Text>
          Bei technischen Problemen oder Fragen zur Anwendung wenden Sie sich bitte zunächst per E-Mail an das Referat
          WB 6 Bauen und Umwelt.
        </Text>
      </Area>

      <Area>
        <Heading4>Open Source / Lizenzierung</Heading4>
        <Text>
          Die Anwendung eLCA Circularity Index und Building Resource Passport ist unter der GNU Affero General Public
          License Version 3 (AGPLv3) lizenziert. Dies garantiert jedem Nutzer die Freiheit, die Software zu nutzen, zu
          verbreiten und zu modifizieren. Das Projekt verwendet eine Code-Vorlage, die ursprünglich unter der MIT-Lizenz
          lizenziert wurde. Eine vollständige Version der Lizenz ist im Quellcode verfügbar. Der Quellcode ist hier
          verfügbar:{" "}
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
