import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';
import {GoogleGenAI} from '@google/genai';

function geminiServerPlugin(): Plugin {
  return {
    name: 'gemini-server-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/gemini' && req.method === 'POST') {
          let bodyStr = '';
          req.on('data', (chunk) => {
            bodyStr += chunk;
          });
          req.on('end', async () => {
            try {
              const {prompt} = JSON.parse(bodyStr || '{}');
              const apiKey = process.env.GEMINI_API_KEY;

              if (!apiKey) {
                res.writeHead(500, {'Content-Type': 'application/json'});
                res.end(
                  JSON.stringify({
                    error: 'GEMINI_API_KEY environment variable is not configured',
                  })
                );
                return;
              }

              const ai = new GoogleGenAI({apiKey});
              const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
              });

              res.writeHead(200, {'Content-Type': 'application/json'});
              res.end(JSON.stringify({reply: response.text}));
            } catch (err: any) {
              res.writeHead(500, {'Content-Type': 'application/json'});
              res.end(
                JSON.stringify({
                  error: err.message || 'Internal error in Gemini generation',
                })
              );
            }
          });
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), geminiServerPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
