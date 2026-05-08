<div align="center">

# 🚀 Frontend — Technologies & Bibliothèques
### Projet CapTalent · Talent Intelligence Platform

</div>

---

## 🗣️ Langages

| Langage | Rôle |
|:---|:---|
| **JavaScript (JSX)** | Logique applicative et composants React |
| **CSS** | Styles par composant |
| **HTML** | Point d'entrée de l'application (`index.html`) |

---

## ⚙️ Framework & Build

| Bibliothèque | Version | Rôle |
|:---|:---:|:---|
| **React** | `19.2` | Framework principal — composants, hooks, contexte |
| **React DOM** | `19.2` | Rendu React dans le navigateur |
| **Vite** | `7.2` | Serveur de développement ultra-rapide + bundler |

---

## 🔀 Routage

| Bibliothèque | Version | Rôle |
|:---|:---:|:---|
| **React Router DOM** | `7.13` | Navigation SPA, routes protégées par rôle |

---

## 🎨 Interface Utilisateur (UI)

| Bibliothèque | Version | Rôle |
|:---|:---:|:---|
| **MUI Material** | `7.3` | Composants UI : boutons, tables, modals, chips… |
| **MUI Icons Material** | `7.3` | Bibliothèque d'icônes Material Design |
| **MUI X Data Grid** | `8.27` | Tableau avancé : tri, filtrage, pagination |
| **Emotion React** | `11.14` | Moteur CSS-in-JS (requis par MUI) |
| **Emotion Styled** | `11.14` | Composants stylisés (requis par MUI) |

---

## 📊 Graphiques & Visualisation

| Bibliothèque | Version | Rôle |
|:---|:---:|:---|
| **ApexCharts** | `5.6` | Graphiques : barres, donuts, courbes de croissance |
| **React-ApexCharts** | `2.0` | Wrapper React pour ApexCharts |

---

## 🌐 Animation 3D

| Bibliothèque | Version | Rôle |
|:---|:---:|:---|
| **Three.js** | `0.163` | Moteur WebGL 3D (requis par Vanta) |
| **Vanta** | `0.5` | Fond animé interactif — effet réseau (page d'accueil) |

---

## 🛠️ Utilitaires

| Bibliothèque | Version | Rôle |
|:---|:---:|:---|
| **date-fns** | `4.1` | Manipulation et formatage des dates |
| **Fetch API** | `natif` | Appels HTTP vers le backend (auth, projets, skills, matching) |

---

## 🔍 Qualité du code

| Outil | Version | Rôle |
|:---|:---:|:---|
| **ESLint** | `9.39` | Analyse statique du code |
| **eslint-plugin-react-hooks** | `7.0` | Vérification des règles des hooks React |
| **eslint-plugin-react-refresh** | `0.4` | Hot Module Replacement avec Vite |

---

## 🏗️ Architecture & Patterns

| Pattern | Description |
|:---|:---|
| **SPA** | Application monopage — navigation sans rechargement |
| **Context API** | État global partagé via `AuthContext` et `SidebarContext` |
| **Composants fonctionnels** | Hooks `useState`, `useEffect`, `useContext` partout |
| **API Client centralisé** | `apiClient.js` — couche d'abstraction pour tous les appels HTTP |
| **Routes protégées** | Accès conditionnel selon le rôle : Admin / Manager / Employé |

---

<div align="center">
  <sub>CapTalent · 2026</sub>
</div>
