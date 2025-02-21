import {defineConfig, presetWind} from "unocss";

export default defineConfig({
    presets: [
        presetWind(),
    ],
    theme: {
        fontFamily: {
            minecraft: ['Minecraftia', 'sans-serif'],
        }
    }
})