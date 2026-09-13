# LogiChain – Plateforme de Logistique et Traçabilité

## Présentation du Projet
LogiChain est une plateforme moderne de gestion logistique et de suivi d'équipements architecturée en mode n-tiers. Elle intègre une API backend haute performance (Node.js / Express), une persistance de données robuste (MongoDB avec index géospatiaux/vectoriels), ainsi qu'une automatisation complète des déploiements (CI/CD GitHub Actions & Ansible).

---

## Architecture Technique
- Front-end : React Native 0.86, Expo, React Navigation, Zustand 
- Backend : Node.js 24.x, Express.js, supervisé en production par PM2.
- Base de Données : MongoDB (avec authentification locale et politiques de sécurité durcies).
- Reverse Proxy & Web Server : Nginx (terminaison SSL/TLS, routage des flux HTTP/HTTPS).
- Automatisation / DevOps : GitHub Actions (CI/CD) & Ansible (Provisionnement et déploiement VPS).
- Sécurité : Pare-feu UFW, Fail2Ban et authentification par clés SSH strictes.

---

## Configuration et Variables d'Environnement

Avant de lancer l'application en local ou de provisionner le serveur, assure-toi de configurer les variables d'environnement suivantes dans un fichier .env à la racine du dossier logichain :

### 1. Configuration du Backend

PORT=3000
NODE_ENV=production
MONGODB_URI=mongodb://localhost:27017/logichain
JWT_SECRET=ton_secret_jwt_securise

### 2. Configuration du Frontend

Assure-toi que l'application mobile pointe vers l'adresse IP ou l'URL de ton API backend.

---

## Installation et Lancement Local

1. Cloner le dépôt :
   
   git clone https://github.com/ton-organisation/logichain.git
   cd logichain

2. Installer les dépendances du backend :

   cd front-end

   npm install

   node server.js

3. Installer les dépendances du frontend :
   cd front-end
   
   npm install

  3.1 Lance l'application via Expo avec Android Studio (emulateur) :

  npm run start:android

  taper a pour le mobile ou w pour le web
   
4. Lancer l'application en mode développement :

   npm run dev

---

## Déploiement et Industrialisation (CI/CD & Ansible)

Le déploiement en production est entièrement automatisé :

- GitHub Actions valide le code (linter, tests) à chaque push ou fusion sur la branche main.
  
- Ansible se connecte au serveur distant pour synchroniser le code, mettre à jour les dépendances Node.js 24 et redémarrer les processus PM2.

Pour déclencher un déploiement manuel depuis une machine d'administration configurée :

ansible-playbook -i ansible/inventory/hosts.yml ansible/site.yml

---

## Documentation Complète

Pour plus de détails sur la maintenance, les procédures de rollback et les stratégies de sauvegarde, consulte le fichier runbook.
