---
description: Deploy the Stacks Sonic game to a web hosting service
---

# Deploy Stacks Sonic Game

This workflow helps you deploy the Stacks Sonic game to various web hosting platforms.

## Prerequisites
- Node.js installed on your system
- Git repository initialized
- Account with a hosting service (Vercel, Netlify, or GitHub Pages)

## Deployment Options

### Option 1: Vercel (Recommended)
1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy from project directory:
   ```bash
   vercel --prod
   ```

### Option 2: Netlify
1. Install Netlify CLI:
   ```bash
   npm i -g netlify-cli
   ```

2. Login to Netlify:
   ```bash
   netlify login
   ```

3. Deploy from project directory:
   ```bash
   netlify deploy --prod --dir .
   ```

### Option 3: GitHub Pages
1. Initialize Git repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. Create GitHub repository and push:
   ```bash
   git branch -M main
   git remote add origin https://github.com/yourusername/stacks-sonic.git
   git push -u origin main
   ```

3. Enable GitHub Pages in repository settings

## Quick Deploy Commands

// turbo
### Deploy to Vercel (one-click)
```bash
cd c:\Users\james\CascadeProjects\stacks-game && npx vercel --prod
```

// turbo
### Deploy to Netlify (one-click)
```bash
cd c:\Users\james\CascadeProjects\stacks-game && npx netlify deploy --prod --dir .
```

## Post-Deployment
- Test the deployed game at the provided URL
- Check that all assets load correctly
- Verify mobile responsiveness
- Test game functionality on different browsers

## Troubleshooting
- If assets don't load, check file paths in index.html
- For CORS issues, ensure all files are in the same directory
- If game doesn't start, check browser console for errors
