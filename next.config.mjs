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
import withBundleAnalyzer from "@next/bundle-analyzer"
import withPlugins from "next-compose-plugins"
import createNextIntlPlugin from "next-intl/plugin"
import { env } from "./env.mjs"

const withNextIntl = createNextIntlPlugin()

/**
 * @type {import('next').NextConfig}
 */
const config = withPlugins([[withBundleAnalyzer({ enabled: env.ANALYZE })]], {
  // Add the `productionBrowserSourceMaps` flag
  productionBrowserSourceMaps: true,
  webpack: (config, { isServer }) => {
    // Add the following lines inside the function
    if (isServer) {
      config.devtool = "eval-source-map"
    }

    return config
  },
  serverExternalPackages: ["@appsignal/nodejs"],
  reactStrictMode: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  experimental: {
    instrumentationHook: true,
    // serverComponentsExternalPackages: ["@appsignal/nodejs"],
  },
  rewrites() {
    return [
      { source: "/healthz", destination: "/api/health" },
      { source: "/api/healthz", destination: "/api/health" },
      { source: "/health", destination: "/api/health" },
      { source: "/ping", destination: "/api/health" },
    ]
  },
})

export default withNextIntl(config)
