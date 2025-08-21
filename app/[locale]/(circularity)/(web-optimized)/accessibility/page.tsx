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

export default function Accessibility() {
  return (
    <div className="mx-auto max-w-[1200px] px-12 py-10 lg:px-20">
      <section id="neue-app">
        <Heading3>
          Erklärung zur Barrierefreiheit —{" "}
          <span aria-hidden="true">eLCA Zirkularitätsindex und Ressourcenpass für Gebäude</span>
        </Heading3>

        <Area>
          <Text>
            Informationen über die Zugänglichkeit dieser Web-Anwendung gemäß § 12a BGG sowie über diesbezügliche
            Kontaktmöglichkeiten.
          </Text>

          <Text>
            Verantwortlich: <strong>Bundesinstitut für Bau-, Stadt- und Raumforschung (BBSR)</strong> im Bundesamt für
            Bauwesen und Raumordnung (Referat WB 6 Instrumente des ressourcenschonenden und klimaangepassten Bauens).
          </Text>

          <Text>
            Diese Erklärung zur Barrierefreiheit gilt für die{" "}
            <strong>eLCA Zirkularitätsindex und Ressourcenpass für Gebäude</strong> (im Folgenden &ldquo;die
            Anwendung&rdquo;).
          </Text>
        </Area>

        <Area>
          <Heading4>Stand der Vereinbarkeit mit den Anforderungen</Heading4>
          <Text>
            Die Anwendung entspricht den Anforderungen der harmonisierten europäischen Norm{" "}
            <strong>EN 301 549 V2.1.2 (08-2018)</strong> / <strong>WCAG 2.1 Level AA</strong>.
          </Text>

          <Text>Nicht barrierefreie Inhalte:</Text>

          <div className="mb-4 space-y-4">
            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-gray-600">
                Interaktive Grafiken auf der Übersichtsseite können nicht über die Tastatur gesteuert werden. Diese
                Funktionalität liegt außerhalb der wesentlichen Benutzererfahrungen der Anwendung. Als gültige
                Alternative zum Auswerten der Ergebnisse steht der Download des Zirkularitätsinventars und des
                Komponentenkatalogs in Form von CSV- und PDF-Dateien zur Verfügung.
              </p>
            </div>
          </div>

          <Text>
            Erstellungs- und Aktualisierungsdatum dieser Erklärung: <strong>12.08.2025</strong>.
          </Text>
          <Text>
            Geplante Verbesserungen: <strong>Derzeit keine geplant</strong>.
          </Text>
        </Area>

        <Area>
          <Heading4>Evaluationsmethode</Heading4>
          <Text>Die Überprüfung der Anwendung erfolgte durch:</Text>
          <ul className="mb-4 space-y-2 text-gray-600">
            <li>Selbstprüfung (Self-check)</li>
            <li>Manuelle Überprüfung gemäß der W3C Easy Checks Methode</li>
            <li>Automatische Überprüfungen mit folgenden Tools:</li>
            <ul className="ml-6 mt-2 space-y-1 text-gray-600">
              <li>Lighthouse 12.6.0</li>
              <li>axe DevTools v4.113.4 Plugin für Chrome</li>
              <li>WCAG Contrast Checker Plugin für Chrome</li>
            </ul>
          </ul>
        </Area>

        <Area>
          <Heading4>Feedback und Kontaktangaben</Heading4>
          <Text>
            Wenn Sie Barrieren feststellen oder Fragen zur Barrierefreiheit der Anwendung haben, kontaktieren Sie uns
            bitte unter der folgenden Adresse:
          </Text>

          <address className="mb-4 not-italic text-gray-600">
            Bundesinstitut für Bau-, Stadt- und Raumforschung (BBSR)
            <br />
            im Bundesamt für Bauwesen und Raumordnung (BBR)
            <br />
            Referat WB 6 Instrumente des ressourcenschonenden und klimaangepassten Bauens
            <br />
            <strong>E-Mail:</strong>{" "}
            <a href="mailto:wb6@bbr.bund.de" className="text-bbsr-blue-600 hover:underline">
              wb6@bbr.bund.de
            </a>
          </address>

          <Text>
            Bitte beschreiben Sie die Barriere so genau wie möglich (betroffene Seite/Funktion, verwendetes
            Gerät/Browser/Assistive Technology, ggf. Screenshot oder Datei). Wir bemühen uns um eine Bestätigung Ihres
            Hinweises innerhalb von 5 Arbeitstagen.
          </Text>
        </Area>

        <Area>
          <Heading4>Durchsetzungsverfahren</Heading4>
          <Text>
            Falls Sie mit unserer Antwort nicht zufrieden sind, können Sie ein Schlichtungsverfahren nach dem
            Behindertengleichstellungsgesetz (BGG) beantragen. Weitere Informationen und das Antragsformular finden Sie
            unter{" "}
            <a href="https://www.schlichtungsstelle-bgg.de" className="text-bbsr-blue-600 hover:underline">
              www.schlichtungsstelle-bgg.de
            </a>
            .
          </Text>

          <address className="mb-4 not-italic text-gray-600">
            Schlichtungsstelle nach dem Behindertengleichstellungsgesetz bei dem Beauftragten der Bundesregierung für
            die Belange von Menschen mit Behinderungen
            <br />
            Mauerstraße 53
            <br />
            10117 Berlin
            <br />
            Telefon: +49 30 18 527-2805
            <br />
            E-Mail:{" "}
            <a href="mailto:info@schlichtungsstelle-bgg.de" className="text-bbsr-blue-600 hover:underline">
              info@schlichtungsstelle-bgg.de
            </a>
            <br />
            Internet:{" "}
            <a href="https://www.schlichtungsstelle-bgg.de" className="text-bbsr-blue-600 hover:underline">
              www.schlichtungsstelle-bgg.de
            </a>
          </address>
        </Area>

        <Area>
          <Heading4>Sonstige Hinweise</Heading4>
          <Text>
            Einige Teile der Anwendung können aus technischen Gründen oder aufgrund von Vereinbarungen mit Dritten
            zeitweise von den Barrierefreiheitsanforderungen ausgenommen sein. In solchen Fällen bieten wir, soweit
            möglich, Alternativen oder Hilfestellungen an. Wenn Sie eine bestimmte Information in einer anderen Form
            benötigen, wenden Sie sich bitte an{" "}
            <a href="mailto:wb6@bbr.bund.de" className="text-bbsr-blue-600 hover:underline">
              wb6@bbr.bund.de
            </a>
            .
          </Text>
        </Area>
      </section>
    </div>
  )
}
