import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
// import { browserslistToTargets } from 'lightningcss';
// import browserslist from "browserslist";

// https://vite.dev/config/
export default defineConfig({
    server: {
        cors: false,
    },
    publicDir: "public",
    plugins: [
        react()
    ],
    css: {
        transformer: "lightningcss",
        // lightningcss: {
        //     targets: browserslistToTargets(browserslist('>= 0.25%'))
        // }
    },
    build: {
        cssMinify: "lightningcss",
    }
});
