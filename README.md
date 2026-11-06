# 🇨🇬 Plateforme BonCop - Mise en relation Freelance au Congo

Bienvenue sur le dépôt du projet **BonCop**, l'application monolithique modulaire (Next.js 16 / Prisma v7) centralisant les talents locaux au Congo. 

Pour travailler efficacement en équipe sans conflit Git, merci de suivre rigoureusement cette procédure à chaque fois que vous récupérez le code (`git pull`).

---

## Guide de démarrage rapide

### 1. Cloner et installer les dépendances
Après avoir cloné le projet, installez l'intégralité des paquets requis (y compris le client Prisma v7 et l'adaptateur PostgreSQL) :
```bash
npm install
```

### 2. Configurer les variables d'environnement (`.env`)
Créez un fichier `.env` à la racine du projet (il est masqué par le `.gitignore`) :
```bash
cp .env.example .env
```
Ouvrez le fichier `.env` et assurez-vous que les ports et identifiants correspondent à votre instance PostgreSQL locale (Base de données : `boncop_db`).

### 3. Synchroniser la Base de Données & Générer les types
Puisque nous utilisons **Prisma v7 avec un dossier de sortie personnalisé**, vous devez impérativement exécuter la migration pour créer vos tables locales et initialiser vos fichiers de types dans `src/generated/prisma` :
```bash
npx prisma@7 migrate dev
```
*Note : Si votre éditeur (VS Code) souligne les imports Prisma en rouge après cela, ouvrez la palette de commandes (`Ctrl+Shift+P`) et exécutez `Developer: Reload Window`.*

### 4. Lancer l'environnement de développement
```bash
npm run dev
```
L'application est accessible sur [http://localhost:3000](http://localhost:3000).

---

## 🛠️ Workflow Git de l'Équipe (Règles strictes)

Pour éviter d'écraser le travail de vos camarades, respectez ce schéma quotidien :

1. **Interdiction absolue** de pousser (`push`) directement sur `main` ou `develop`.
2. Créez toujours une branche isolée pour votre tâche : `feature/votre-tâche` ou `fix/votre-bug`.
3. **Règle d'or avant de pousser sur GitHub :** 
   Intégrez toujours les nouveautés du groupe dans votre code local pour résoudre les conflits chez vous :
   ```bash
   git add .
   git commit -m "feat: sauvegarde locale"
   git checkout develop
   git pull origin develop
   git checkout feature/votre-tâche
   git merge develop
   # Résolvez les conflits dans VS Code si nécessaire, puis :
   git push origin feature/votre-tâche
   ```
4. Ouvrez une **Pull Request (PR)** sur GitHub de votre branche vers `develop` et demandez une revue de code à un collègue.

---

## 📂 Rappel des Attributions du Cadrage
* **Développeur 1 :** Administration BDD, Client Prisma & CRUD Métiers (`src/features/admin/actions.ts`)
* **Développeur 2 :** Authentification, Cryptage, Session & Proxy de sécurité (`src/proxy.ts`)
* **Développeur 3 :** Design Global, Home ISR & Agrégations statistiques (`src/app/page.tsx`)
* **Développeur 4 :** Recherche UI & Page Dynamique Profil SSR (`src/app/profile/[id]/page.tsx`)
* **Développeur 5 :** Moteur de filtres combinés & Server Actions de mise à jour des CV
* **Développeur 6 :** Dashboard Admin de modération, DevOps & Déploiement Vercel
