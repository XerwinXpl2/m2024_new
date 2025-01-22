import fs from "fs";
import { sync as globSync } from "glob";
import path from "path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    server: {
        headers: {
            "Cross-Origin-Opener-Policy": "same-origin",
            "Cross-Origin-Embedder-Policy": "require-corp",
        },
    },
    plugins: [
        tsconfigPaths(),
        {
            name: "assetsInliner",
            configureServer() {
                console.info("generating tiles file");
                const tiles: Map<string, string> = new Map();

                globSync(
                    `${path.resolve(__dirname, "src/assets/tiles")}/*.webp`,
                ).forEach((f) => {
                    tiles[path.basename(f).slice(0, -5)] = fs
                        .readFileSync(f)
                        .toString("base64");
                });

                fs.writeFileSync(
                    path.resolve(__dirname, "src/generated/tiles.ts"),
                    `export const tilesBase64: { [key: string]: string } = ${JSON.stringify(tiles, null, 2)};`,
                    "utf8",
                );
                console.info("tiles file generated");
            },
        },
    ],
});
