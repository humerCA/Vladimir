import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

dotenv.config();

// https://vitejs.dev/config/

export default defineConfig({
  plugins: [react()],
  server: {
    // port: 3030,
    host: true,
  },
  define: {
    "process.env.PORT": `${process.env.PORT}`,
    "process.env.SEDAR_KEY": `"${process.env.SEDAR_KEY}"`,
    // "process.env.BASEURL": `"${process.env.BASEURL}"`,
  },
});