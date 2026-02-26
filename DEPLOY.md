# 🚀 Deploy do Sistema

## GitHub Pages (Frontend Only)

Para fazer deploy do frontend no GitHub Pages:

1. **Ativar GitHub Pages:**
   - Vá para Settings → Pages
   - Source: Deploy from a branch
   - Branch: main
   - Folder: /root (ou /frontend/build)

2. **Ajustar package.json:**
   ```json
   "homepage": "https://vitinpicademel.github.io/fluxo"
   ```

3. **Rebuild com homepage:**
   ```bash
   cd frontend
   npm run build
   ```

## Render.com (Full Stack)

1. **Fork do repositório** no GitHub
2. **Conectar no Render.com**
3. **Criar Web Service** para backend
4. **Criar Static Site** para frontend

## Railway (Full Stack)

1. **Conectar GitHub** no Railway
2. **Importar repositório**
3. **Configurar variáveis de ambiente**
4. **Deploy automático**

## Vercel (Frontend)

1. **Instalar Vercel CLI**
2. **Fazer deploy:**
   ```bash
   cd frontend
   vercel --prod
   ```

## Heroku (Full Stack)

1. **Instalar Heroku CLI**
2. **Criar app:**
   ```bash
   heroku create seu-app
   ```
3. **Configurar variáveis:**
   ```bash
   heroku config:set DATABASE_URL=...
   heroku config:set JWT_SECRET=...
   ```
4. **Deploy:**
   ```bash
   git push heroku main
   ```

## 🌐 URLs de Deploy

- **GitHub Pages**: https://vitinpicademel.github.io/fluxo
- **Render**: https://seu-app.onrender.com
- **Vercel**: https://seu-app.vercel.app
- **Heroku**: https://seu-app.herokuapp.com
