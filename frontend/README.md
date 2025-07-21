# WorkflowApplication Frontend

Une application React moderne pour la création, visualisation et exécution de workflows d'amélioration de texte avec intelligence artificielle.

## 🚀 Fonctionnalités

- **Interface utilisateur moderne** avec Hero UI et Tailwind CSS
- **Authentification complète** avec gestion des rôles et sessions persistantes
- **Workflows visuels** avec zoom interactif
- **Exécution de workflows IA** avec intégration OpenAI en temps réel
- **Système de permissions** basé sur les rôles utilisateurs
- **Import JSON** pour la sauvegarde et le partage de workflows
- **Responsive design** optimisé pour desktop et mobile
- **Gestion d'état avancée** avec hooks personnalisés

## 🛠 Technologies

- **Framework** : React 18.x avec TypeScript
- **Routage** : React Router DOM v6
- **UI Library** : Hero UI (NextUI-based)
- **Styling** : Tailwind CSS 3.x
- **Icons** : Lucide React
- **Build Tool** : Vite
- **Visualisation** : D3.js pour les workflows
- **HTTP Client** : Fetch API native
- **State Management** : React Hooks + Context
- **Type Safety** : TypeScript strict mode

## 📋 Prérequis

- **Node.js** (v18 ou supérieur)
- **npm**
- **Backend API** en fonctionnement sur `http://localhost:3000`

## 🔧 Installation

L'application sera accessible sur `http://localhost:5173`

## 📚 Architecture du projet

```
src/
├── components/                # 🧩 Composants réutilisables
│   ├── Advice.tsx            # Composant de conseils
│   ├── LoginForm.tsx         # Formulaire de connexion
│   ├── NavItem.tsx           # Élément de navigation
│   ├── SignUpForm.tsx        # Formulaire d'inscription
│   ├── Sidebar/              # Barre latérale de navigation
│   ├── ProtectedRoute/       # Protection des routes par rôles
│   │   ├── ProtectedRoute.tsx
│   │   └── roles.constants.ts
│   └── workflow/             # Composants de workflow
│       ├── create/           # Création et édition
│       └── run/              # Exécution des workflows
├── hooks/                    # 🎣 Hooks personnalisés
│   ├── useActiveItem.ts      # Gestion item actif sidebar
│   ├── useAuth.ts            # Authentification et autorisation
│   ├── useCreateWorkflow.ts  # Création de workflows
│   ├── useGetWorkflow.ts     # Récupération des workflows
│   ├── usePermissions.ts     # Gestion des permissions
│   ├── useRunWorkflow.ts     # Exécution des workflows
│   ├── useWorkflowData.ts    # Traitement des données workflow
│   └── useWorkflowZoom.ts    # Zoom et navigation visuelle
├── pages/                    # 📄 Pages de l'application
│   ├── index.tsx             # Page d'accueil (dashboard)
│   ├── login.tsx             # Page de connexion
│   ├── signup.tsx            # Page d'inscription
│   └── workflow.tsx          # Page de gestion des workflows
├── services/                 # 🌐 Services API
│   ├── authServices/         # Service d'authentification
│   │   ├── authServices.ts
│   │   └── authServices.types.ts
│   └── workflowService.ts    # Service de gestion des workflows
├── types/                    # 📝 Types TypeScript
│   └── user.type.ts          # Types utilisateur
├── ui/                       # 🎨 Composants UI génériques
│   ├── CustomAlert.tsx       # Alertes personnalisées
│   ├── CustomCard.tsx        # Cartes personnalisées
│   ├── CustomModal.tsx       # Modales personnalisées
│   ├── LogoutButton.tsx      # Bouton de déconnexion
│   └── ImportJsonButton.tsx  # Import de fichiers JSON
├── utils/                    # 🔧 Utilitaires
│   ├── dataTransformer.ts    # Transformation des données
│   └── layoutCalculator.ts   # Calcul des layouts
├── styles/                   # 💄 Styles globaux
│   └── globals.css           # CSS global avec Tailwind
├── App.tsx                   # 🏗️ Composant racine
└── main.tsx                  # 🚀 Point d'entrée
```

## 🔐 Authentification & Autorisation

### Système d'authentification
L'application utilise un système d'authentification JWT complet avec :

- **Tokens persistants** : Access et refresh tokens stockés en localStorage
- **Refresh automatique** : Renouvellement transparent des tokens expirés
- **Gestion des rôles** : Système de permissions basé sur les rôles
- **Routes protégées** : Protection automatique selon les autorisations

## 🎨 Interface Utilisateur

### Design System
L'application utilise Hero UI avec une configuration Tailwind.


## 📖 Documentation API Frontend

### Endpoints utilisés

| Service | Endpoint | Méthode | Description |
|---------|----------|---------|-------------|
| Auth | `/auth/signup` | POST | Inscription utilisateur |
| Auth | `/auth/login` | POST | Connexion utilisateur |
| Auth | `/auth/refresh` | POST | Refresh token |
| Workflow | `/workflow/create` | POST | Créer workflow |
| Workflow | `/workflow` | GET | Récupérer workflow |
| Workflow | `/workflow/run` | POST | Exécuter workflow |
