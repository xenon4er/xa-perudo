import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            "@xa-perudo/shared": path.resolve(__dirname, "../shared"),
        },
    },
    plugins: [react()],
});
