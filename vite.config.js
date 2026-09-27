import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
const apiProxy={'/api':'http://127.0.0.1:3001'};
export default defineConfig({
 plugins:[react()],
 server:{host:'0.0.0.0',allowedHosts:true,proxy:apiProxy},
 // Production preview uses the same relative API paths when the local Node server runs.
 preview:{host:'0.0.0.0',allowedHosts:true,proxy:apiProxy}
});
