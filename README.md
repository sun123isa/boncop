# BonCop

Plateforme de mise en relation entre recruteurs, entreprises, particuliers et **freelances congolais**.  
Stack : **Next.js 16**, **Auth.js v5**, **Prisma 7**, **PostgreSQL** (Supabase), déploiement **Vercel**.

---

## Fonctionnalités

- Inscription / connexion (credentials + sessions JWT)
- Profils freelances (CV, métiers, ville, contact téléphone / WhatsApp)
- Recherche et filtres (ville, métiers)
- Accueil ISR avec stats et top profils
- Espace admin (modération des comptes, métiers)
- Middleware de protection des routes (`/admin`, `/profile/edit`, etc.)

---

## Prérequis

- Node.js 20+
- Compte GitHub + fork du dépôt principal
- Base PostgreSQL (locale ou Supabase)

---

## Démarrage local

### 1. Cloner ton fork

```bash
git clone https://github.com/<ton-user>/boncop.git
cd boncop
git remote add upstream git@github.com:sun123isa/boncop.git
npm install
```

`npm install` lance aussi `prisma generate` (`postinstall`) pour créer le client dans `src/generated/prisma` (dossier gitignored).

### 2. Variables d'environnement

Le projet lit **`.env.local`** (pas `.env`) :

```bash
cp .env.example .env.local
```

Renseigne au minimum :

| Variable | Rôle |
|----------|------|
| `DATABASE_URL` | Connexion Postgres (app runtime, souvent pooler Supabase) |
| `DIRECT_URL` | Connexion directe Postgres (Prisma migrate / generate) |
| `AUTH_SECRET` | Secret Auth.js (`npx auth secret`) |
| `AUTH_URL` | URL de l’app en local : `http://localhost:3000` |
| `NEXT_PUBLIC_SITE_URL` | URL publique (SEO / Open Graph), idem en local |

### 3. Base de données

```bash
npx prisma migrate dev
npm run db:seed   # optionnel : données de démo
```

Si l’éditeur souligne encore les imports Prisma : `Developer: Reload Window`.

### 4. Lancer l’app

```bash
npm run dev
```

→ [http://localhost:3000](http://localhost:3000)

### 5. Comptes de démo (seed)

Créés uniquement après `npm run db:seed` — **usage local / test**, pas pour la prod :

| Rôle | Email | Mot de passe |
|------|--------|--------------|
| Admin | `admin@mail.com` | `Admin1234` |
| Freelance | `test@mail.com` | `Test1234` |

Source : `prisma/seed.ts`.

---

## Scripts npm

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de développement |
| `npm run build` | `prisma generate` + build Next.js |
| `npm start` | Serveur de production |
| `npm run lint` | ESLint |
| `npm test` | Tests Vitest |
| `npm run db:seed` | Seed Prisma |

---

## Structure du dépôt

```
src/
  app/           # Routes App Router (pages, API Auth.js)
  components/    # UI + layout (Header, Footer)
  features/      # Domaines métier (auth, search, profile, admin…)
  db/            # Client Prisma
  lib/           # Utilitaires (guards, helpers)
  middleware.ts  # Protection des routes
  auth.ts        # Config Auth.js
prisma/          # schema + migrations + seed
prisma7.config.ts
```

---

## Workflow Git (équipe)

Remotes attendus :

| Remote | Repo | Usage |
|--------|------|--------|
| `origin` | ton fork | `git push origin …` |
| `upstream` | `sun123isa/boncop` | sync + PR vers le projet principal |

Règles :

1. **Ne jamais** pousser directement sur `main` ou `develop` d’upstream.
2. Branche par tâche : `feature/…`, `fix/…`, `deploy`, etc.
3. Avant de pousser, intégrer `develop` :

```bash
git fetch upstream
git checkout develop
git merge upstream/develop
git checkout feature/ta-tache
git merge develop
git push origin feature/ta-tache
```

4. Ouvrir une **Pull Request** vers `sun123isa/boncop` (`develop` en général).

Après un `rebase`, sur ton fork uniquement :

```bash
git push --force-with-lease origin <ta-branche>
```

---

## Déploiement Vercel

1. Importer le repo **`sun123isa/boncop`** (ou la branche configurée, ex. `main` / `deploy`).
2. Framework : Next.js (détecté automatiquement).
3. Build : `npm run build` (inclut déjà `prisma generate`).
4. Variables d’environnement **Production** (et Preview si besoin) :

| Variable | Exemple / valeur |
|----------|------------------|
| `DATABASE_URL` | URL Postgres / pooler Supabase |
| `DIRECT_URL` | URL directe Supabase `:5432` |
| `AUTH_SECRET` | secret fort (différent du local) |
| `AUTH_URL` | `https://ton-domaine.vercel.app` |
| `AUTH_TRUST_HOST` | `true` |
| `NEXT_PUBLIC_SITE_URL` | **même URL** que `AUTH_URL` |

Sans slash final. Toujours `https://` en prod.

5. Redéployer après chaque changement d’env.

Ne lance **pas** le seed de démo (`admin@mail.com` / `Admin1234`) sur la base de production telle quelle : crée un admin dédié avec un mot de passe fort.

### Erreurs fréquentes

| Symptôme | Cause | Action |
|----------|--------|--------|
| `Can't resolve '../generated/prisma/client'` | Client Prisma absent sur CI | Vérifier que `build` contient `prisma generate` |
| `TS7006: Parameter 'ville' implicitly has an 'any'` | Typage manquant après generate | Typer le callback / merger le fix |
| Auth / redirects cassés | `AUTH_URL` encore en localhost | Mettre l’URL Vercel + `AUTH_TRUST_HOST=true` |
| Warning `middleware` → `proxy` | Dépréciation Next.js 16 | Non bloquant pour l’instant |

---

## Attributions (cadrage)

| Rôle | Périmètre |
|------|-----------|
| Dev 1 | BDD, Prisma, CRUD métiers |
| Dev 2 | Auth.js, sessions, middleware de sécurité |
| Dev 3 | Design global, home ISR, stats |
| Dev 4 | Recherche UI, page profil SSR |
| Dev 5 | Filtres combinés, server actions profil / CV |
| Dev 6 | Dashboard admin, DevOps, déploiement Vercel |

---

## Licence / contribution

Projet d’équipe scolaire / interne. Contributions via PR vers `develop` uniquement.
