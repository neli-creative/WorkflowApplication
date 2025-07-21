# WorkflowApplication Backend

Une API REST construite avec NestJS pour la gestion et l'exécution de workflows d'amélioration de texte utilisant l'intelligence artificielle OpenAI.

## 🚀 Fonctionnalités

- **Authentification JWT** avec refresh tokens et gestion des rôles
- **Gestion des workflows** (création, récupération, exécution)
- **Intégration OpenAI GPT-4** pour le traitement intelligent du texte
- **Architecture modulaire** avec NestJS et MongoDB
- **Validation automatique** des données avec class-validator
- **Gestion des CORS** configurée pour les applications frontend
- **Tests unitaires** avec Jest
- **Système de rôles** avec guards d'autorisation
- **Déploiement Docker** prêt pour la production

## 🛠 Technologies

- **Framework** : NestJS 11.x
- **Base de données** : MongoDB avec Mongoose 8.x
- **Authentification** : JWT (@nestjs/jwt)
- **IA** : OpenAI GPT API via Axios
- **Validation** : class-validator & class-transformer
- **Hashing** : bcrypt pour les mots de passe
- **Tests** : Jest avec Supertest
- **Config** : @nestjs/config
- **UUID** : Génération d'identifiants uniques
- **Containerisation** : Docker & Docker Compose

## 📋 Prérequis

- **Docker** (v20 ou supérieur)
- **Docker Compose** (v2 ou supérieur)
- **Clé API OpenAI**


## 🔧 Installation avec Docker (Recommandé)

### Démarrage rapide (2 minutes)

1. **Cloner le repository**
```bash
git clone <repository-url>
cd WorkflowApplication/backend
```

2. **Configuration de l'environnement**

Créez un fichier `.env` à la racine du projet backend 


3. **Démarrage complet avec Docker Compose**
```bash
# Démarrage de tous les services (API + MongoDB)
docker-compose up -d

# Vérification que tout fonctionne
docker-compose ps

```

## 🚀 Commandes Docker disponibles

### Gestion des services
```bash
# Démarrage complet (détaché)
docker-compose up -d

# Démarrage avec logs visibles
docker-compose up

# Arrêt des services
docker-compose down

# Redémarrage d'un service spécifique
docker-compose restart api

# Reconstruction et redémarrage
docker-compose up --build -d
```

## 📚 Architecture du projet

```
src/
├── auth/                     # 🔐 Module d'authentification
│   ├── decorators/          # Décorateurs personnalisés (@User, @Roles)
│   ├── dtos/                # DTOs pour login/signup
│   ├── enums/               # Énumérations des rôles
│   ├── guards/              # Guards d'auth et de rôles
│   ├── schemas/             # Schémas User et RefreshToken
│   ├── types/               # Types TypeScript
│   ├── auth.controller.ts   # Routes /auth/*
│   ├── auth.service.ts      # Logique métier d'authentification
│   ├── auth.module.ts       # Configuration du module
│   └── *.spec.ts           # Tests unitaires
├── workflow/                # 🔄 Module de gestion des workflows
│   ├── dtos/                # DTOs pour workflows
│   │   └── create-workflow.dto.ts
│   ├── schemas/             # Schéma Workflow MongoDB
│   ├── workflow.controller.ts # Routes /workflow/*
│   ├── workflow.service.ts    # Logique métier + intégration OpenAI
│   ├── workflow.module.ts     # Configuration du module
│   └── *.spec.ts             # Tests unitaires
├── config/                  # ⚙️ Configuration
│   └── config.ts           # Configuration centralisée
├── app.module.ts            # 🏗️ Module principal
├── app.controller.ts        # Contrôleur principal avec guards
├── app.service.ts           # Service principal
└── main.ts                 # 🚀 Point d'entrée
```

## 🔐 Authentification & Autorisation

### Système JWT
- **Access Token** : Durée de vie de 5 minutes
- **Refresh Token** : Stocké en base pour renouvellement
- **Guards** : Protection automatique des routes
- **Roles** : Système de rôles avec décorateurs

### Endpoints d'authentification
```typescript
POST /auth/signup    # Inscription d un nouvel utilisateur
POST /auth/login     # Connexion avec email/password
POST /auth/refresh   # Renouvellement du token
```


## 🔄 API Workflows

### Endpoints disponibles
```typescript
POST /workflow/create    # Créer un nouveau workflow
GET  /workflow          # Récupérer le workflow de l utilisateur
POST /workflow/run      # Exécuter un workflow avec input utilisateur
```

## 🤖 Intégration OpenAI

### Configuration
- **Modèle** : gpt-4.1
- **Timeout** : 30 secondes pour les requêtes IA


## 📖 Documentation API

### Endpoints disponibles

| Méthode | Route | Description | Auth requis |
|---------|-------|-------------|-------------|
| POST | `/auth/signup` | Inscription | ❌ |
| POST | `/auth/login` | Connexion | ❌ |
| POST | `/auth/refresh` | Refresh token | ❌ |
| POST | `/workflow/create` | Créer workflow | ✅ |
| GET | `/workflow` | Récupérer workflow | ✅ |
| POST | `/workflow/run` | Exécuter workflow | ✅ |