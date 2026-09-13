# Runbook Technique – Plateforme LogiChain

Ce document constitue le guide officiel d'exploitation, de maintenance et de reprise d'activité pour l'infrastructure de production de la plateforme **LogiChain**. Il est destiné à la nouvelle équipe d'ingénierie et d'exploitation.

---

## 1. Vue d'ensemble de l'architecture

### Topologie de la Stack
* **Serveur Cible (VPS) :** Système d'exploitation Linux (Ubuntu Server).
* **Serveur Web & Reverse Proxy :** Nginx (gère les flux HTTP/HTTPS et redirige vers l'application Node.js).
* **Runtime Application :** Node.js avec architecture n-tiers, supervisé en production par **PM2**.
* **Base de Données :** MongoDB (configurée en local avec authentification et sécurité renforcée).
* **Sécurité & Pare-feu :** UFW (Uncomplicated Firewall) et Fail2Ban.

### Cartographie des Ports et Flux Réseaux
* **Ports ouverts sur le pare-feu :**
  * `22` : SSH (accès administration sécurisé)
  * `80` : HTTP (redirection ou trafic web public)
  * `443` : HTTPS (trafic sécurisé SSL/TLS)
* **Flux de données :**
  ```text
  Client (Mobile/Web) ---> [ Ports 80 / 443 ] ---> Nginx (Reverse Proxy) ---> [ Port 3000 ] ---> API Node.js (N-Tiers) ---> [ Port 27017 ] ---> MongoDB (Local)
