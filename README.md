# Workflow Application - Oneprompt

Cette application fictive est réalisée dans le cadre d’un test technique pour la société **Wikit**.  
Afin d'ancrer ce projet dans le réel, j'ai imaginé un contexte précis : un générateur d’e-mails professionnels en anglais, exploitant des workflows pilotés par IA, avec une interface d’administration pour la création de workflows, et un espace utilisateur pour générer des e-mails professionnels selon un parcours défini, nommé OnePrompt.

---

## Fonctionnalités principales

- **Génération d’e-mails professionnels** en anglais, selon un workflow défini.
- **Administration des workflows** : l’administrateur peut créer un workflow personnalisé (un seul workflow actif à la fois) en important un fichier JSON.
- **Exécution de workflow** : utilisateurs et administrateurs peuvent lancer le workflow avec leur texte d’entrée.
- **Authentification par JWT** : gestion sécurisée de l’accès avec refresh token.
- **Pages d’inscription** et de connexion.
- **Séparation claire** : une interface “admin” pour la création de workflows, et une interface “run” pour l’exécution côté utilisateurs/admin.

---

## Contraintes et Spécifications attendues

### 1. Définition du Workflow

Un **workflow** est une chaîne d'étapes (nœuds) décrite en JSON.  
Chaque nœud peut contenir  :

- `id` : identifiant unique du nœud
- `prompt` : prompt utilisé pour l'appel à OpenAI (LLM)
- `next` : (optionnel) id du nœud suivant
- `condition` : (optionnel) objet de routage conditionnel

**Variables disponibles pour le prompt** :
- `{{input}}` : remplacé par l'entrée utilisateur lors de l'exécution du premier nœud.
- `{{lastOutput}}` : remplacé par la sortie du dernier nœud lors de l'exécution des suivants.

#### Exemple de nœud simple

```json
{
  "id": "translate_to_en",
  "prompt": "Translate this message from our customer to English:\n{{input}}",
  "next": "summarize_en"
}
```

#### Exemple de nœud avec condition

```json
{
  "id": "start",
  "prompt": "What is the language of this message, answer with 'french' if it is french or else 'english' ?\nMessage: {{input}}",
  "condition": {
    "english": "summarize_en",
    "french": "translate_to_en"
  }
}
```
> Si un nœud possède une propriété `condition`, la réponse du LLM doit correspondre à une des clés de l'objet `condition`, qui détermine le prochain nœud à exécuter.

---

### 2. Routes API attendues

#### POST `/workflow/create`
- **Rôle** : Admin uniquement
- **Description** : Permet de sauvegarder un workflow (écrase le précédent).
- **Corps attendu** :
    ```json
    {
      "nodes": [
        {
          "id": "start",
          "prompt": "...",
          "next": "...",
          "condition": { "french": "x", "english": "y" }
        }
      ]
    }
    ```
- **Réponse** : `204 No Content` si succès

#### POST `/workflow/run`
- **Rôle** : Utilisateur et Admin
- **Description** : Exécute le workflow courant avec l’entrée utilisateur.
- **Corps attendu** :
    ```json
    {
      "input": "Texte à traiter"
    }
    ```
- **Réponse** :
    - `200 OK` avec
      ```json
      {
        "result": "Réponse générée par le workflow"
      }
      ```
    - `400 Bad Request` si aucun workflow n’a été créé

---

## Stack technique

- **Backend** : [NestJS](https://nestjs.com/) (framework Node.js, utilisé chez Wikit)
- **Frontend** : [React](https://react.dev/)
- **Base de données** : [MongoDB](https://www.mongodb.com/)
- **API OpenAI** pour la génération de texte (clé API à configurer dans le backend, voir section dédiée)
- (Détails complémentaires dans les README des sous-dossiers)

---

## Lancement du projet

Le projet est entièrement dockerisé pour faciliter son lancement et son déploiement.  
Un fichier `docker-compose.yml` est fourni à la racine du projet pour démarrer l’ensemble de la stack : backend (NestJS), frontend (React) et base de données MongoDB.

### Lancer l’application avec Docker

```bash
docker-compose up --build
```

Consultez les README spécifiques dans les dossiers `/backend` et `/frontend` pour les détails sur l’utilisation hors Docker, ainsi que :

- les prérequis,
- les commandes d’installation et de lancement,
- les scripts disponibles,
- les exemples d’utilisation des API REST.

---

## Authentification et rôles

- **Inscription/connexion** : chaque utilisateur crée un compte puis se connecte, par défaut il s'agit d'un utilisateur.
- **JWT + refresh token** : sécurité et gestion des sessions.
- **Rôles** :
  - **Admin** : crée un workflow, exécute le workflow.
  - **Utilisateur** : exécute le workflow.
  - La création/modification du workflow, via import, est strictement réservée à l’admin.

---

## Tests

Des tests unitaires et d’intégration (spec NestJS pour services et controllers) sont présents côté backend.  
Voir le README du dossier `backend` pour les instructions d’exécution.

---

## Limites connues et axes d’amélioration

- Un seul workflow peut être sauvegardé à la fois (écrasement du précédent à chaque création).
- Pas de possibilité d'éditer nœud par nœud via le front end.
- Pas d’historique ni de gestion des réponses générés.
- Pas de gestion avancée des erreurs côté frontend.
- Pas de gestion fine des rôles ou permissions.
- Possibilités d’amélioration : gestion multi-workflows, historique utilisateur, interface plus poussée, gestion fine des droits, logs, monitoring, internationalisation…

---

## Structure du projet

- `backend/` : code source et documentation du backend (NestJS).
- `frontend/` : code source et documentation du frontend (React).

Consultez les README spécifiques pour plus de détails techniques.

---

Projet réalisé par [neli-creative](https://github.com/neli-creative) pour l’entretien technique Wikit.