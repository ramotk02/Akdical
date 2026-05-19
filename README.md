# AKDICAL 📊

AKDICAL est une application web moderne de suivi des KPI Achats développée avec :

- ⚡ Next.js
- ⚛️ React
- 🔐 Supabase
- 🎨 TailwindCSS
- 📈 XLSX (Import Excel)
- 🧩 TypeScript

Le projet permet de :

✅ suivre les KPI Achats  
✅ calculer automatiquement les délais  
✅ importer des fichiers Excel ERP/SAP  
✅ calculer les KPI automatiquement  
✅ afficher des tableaux de synthèse  
✅ sauvegarder les données dans Supabase  
✅ gérer l’authentification des utilisateurs

---

# 🚀 Fonctionnalités

# 🔐 Authentification

Le système intègre :

- Connexion utilisateur
- Création de compte
- Gestion de session
- Sécurisation via Supabase Auth

---

# 📊 KPI Disponibles

## 1️⃣ Délai de traitement Acheteur

### Calcul :

```txt
Date création BC - Dernière validation
```

### Dernière validation :

```txt
MAX(Date validation 1, Date validation 2, Date validation 3)
```

---

## 2️⃣ Taux de Saving

### Calcul :

```txt
(Valeur économisée / Montant Achat TTC) × 100
```

---

## 3️⃣ Délai de traitement Global

### Calcul :

```txt
Date validation BC - Date création
```

---

# 📂 Import Excel ERP / SAP

Le dashboard peut importer automatiquement des exports ERP/SAP.

Le système :

✅ lit automatiquement les colonnes  
✅ convertit les dates Excel  
✅ calcule les KPI  
✅ ignore les valeurs négatives  
✅ affiche les moyennes  
✅ sauvegarde les résultats dans Supabase

---

# 📁 Colonnes Excel Supportées

Le système détecte automatiquement :

```txt
Date de validation 1
Date de validation 2
Date de validation 3
Date de création BC
Date de validation BC
Date de création
Montant d'Achat TTC
Valeur économisée TTC
Désignation
Article
Bon de commande
```

---

# 📈 Tableau de Présentation

Le dashboard affiche automatiquement :

- Moyenne délai acheteur
- Moyenne saving
- Moyenne délai global
- Historique des KPI
- Données importées Excel

---

# 🎨 Interface

## UI moderne responsive

- Sidebar KPI
- Dashboard analytique
- Design moderne TailwindCSS
- Responsive Desktop / Mobile
- Cartes statistiques
- Tableaux dynamiques

---

# 🛠️ Stack Technique

| Technologie | Usage |
|---|---|
| Next.js | Framework React |
| React | Frontend |
| TypeScript | Typage |
| TailwindCSS | UI |
| Supabase | Backend / Auth / DB |
| XLSX | Lecture Excel |
| Lucide React | Icônes |

---

# 📦 Installation

# 1️⃣ Cloner le projet

```bash
git clone https://github.com/USERNAME/akdical.git
```

---

# 2️⃣ Entrer dans le projet

```bash
cd akdical
```

---

# 3️⃣ Installer les dépendances

```bash
npm install
```

---

# 4️⃣ Installer XLSX

```bash
npm install xlsx
```

---

# ⚙️ Configuration Supabase

Créer un fichier :

```txt
.env.local
```

Ajouter :

```env
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

---

# 🗄️ Base de données

Créer la table SQL suivante dans Supabase :

```sql
create table calculations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid,
  title text,
  type text,
  location text,
  input_data jsonb,
  result_data jsonb,
  created_at timestamp with time zone default now()
);
```

---

# ▶️ Lancer le projet

```bash
npm run dev
```

Puis ouvrir :

```txt
http://localhost:3000
```

---

# 🔐 Authentification Supabase

Activer dans Supabase :

- Email Authentication
- Email Confirmations (optionnel)

---

# 📂 Structure du Projet

```txt
/app
  /dashboard
    page.tsx

/lib
  supabase.ts

/public

/styles
```

---

# 📊 Exemple Excel

| Désignation | Date de création | Date de validation 1 | Date de validation 2 | Date de validation 3 | Date de création BC | Date de validation BC | Montant d'Achat TTC | Valeur économisée TTC |
|---|---|---|---|---|---|---|---|---|
| Achat PC | 01/05/2026 | 02/05/2026 | 03/05/2026 | 05/05/2026 | 10/05/2026 | 15/05/2026 | 12000 | 1500 |

---

# 📈 Fonctionnement Import Excel

## Étapes :

1. Cliquer sur **Importer Excel**
2. Sélectionner le fichier `.xlsx`
3. Le système :
   - lit les données
   - calcule les KPI
   - affiche les résultats
   - calcule les moyennes
4. Cliquer sur :
   - **Sauvegarder toutes les données Excel**

---

# 🧠 Gestion des Erreurs

Le système :

✅ ignore les lignes invalides  
✅ ignore les valeurs négatives  
✅ vérifie les dates  
✅ empêche les calculs incorrects

---

# 🔒 Sécurité

- Authentification sécurisée
- Sessions Supabase
- Données utilisateur protégées
- API sécurisée

---

# 📱 Responsive

Compatible :

- Desktop
- Laptop
- Tablette
- Mobile

---

# 🎯 Objectif du Projet

AKDICAL a été conçu pour :

- automatiser le suivi KPI achats
- simplifier les calculs métier
- centraliser les données ERP
- accélérer le reporting achats

---

# 👨‍💻 Auteur

AKDICAL — KPI Dashboard & Suivi Achats

Développé avec ❤️ en Next.js + Supabase + TailwindCSS.
