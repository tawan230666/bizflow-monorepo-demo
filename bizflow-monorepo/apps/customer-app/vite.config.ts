import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react";

function adminLinkPlugin(): Plugin {
  return {
    name: "admin-link",
    configureServer(server) {
      server.httpServer?.once("listening", () => {
        const { port } = server.config.server;
        const base = `http://localhost:${port}`;
        setTimeout(() => {
          console.log(
            `  \x1b[36m➜\x1b[0m  \x1b[1mAdmin:\x1b[0m   \x1b[36m${base}/?admin=true\x1b[0m`,
          );
        }, 0);
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), adminLinkPlugin()],
  server: { port: 3000, host: "0.0.0.0" },
});
