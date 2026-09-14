# Runbook Technique – Plateforme LogiChain

Ce document constitue le guide officiel d'exploitation, de maintenance et de reprise d'activité pour l'infrastructure de production de la plateforme LogiChain. Il est destiné à la nouvelle équipe d'ingénierie et d'exploitation.

---

## 1. Vue d'ensemble de l'architecture

### Topologie de la Stack
- Serveur Cible (VPS) : Système d'exploitation Linux (Ubuntu Server).
- Serveur Web & Reverse Proxy : Nginx (gère les flux HTTP/HTTPS et redirige vers l'application Node.js).
- Runtime Application : Node.js avec architecture n-tiers, supervisé en production par PM2.
- Base de Données : MongoDB (configurée en local avec authentification et sécurité renforcée).
- Sécurité & Pare-feu : UFW (Uncomplicated Firewall) et Fail2Ban.

### Cartographie des Ports et Flux Réseaux
- Ports ouverts sur le pare-feu :
  * 22 : SSH (accès administration sécurisé)
  * 80 : HTTP (redirection ou trafic web public)
  * 443 : HTTPS (trafic sécurisé SSL/TLS)
- Flux de données :
  Client (Mobile/Web) ---> [ Ports 80 / 443 ] ---> Nginx (Reverse Proxy) ---> [ Port 3000 ] ---> API Node.js (N-Tiers) ---> [ Port 27017 ] ---> MongoDB (Local)

---

## 2. Procédure de déploiement unique (Reproductibilité)

L'infrastructure repose sur un principe d'automatisation intégrale. Le serveur de production et l'application peuvent être entièrement provisionnés et mis à jour depuis une machine vierge ou via le pipeline CI/CD.

### Prérequis d'administration locale
- Disposer d'une machine avec Ansible installé et configuré.
- Posséder la clé privée SSH d'accès au VPS (id_logichain).

### Lancement du déploiement
Le déploiement s'effectue en une seule commande depuis la racine du projet, en ciblant l'inventaire Ansible :

ansible-playbook -i ansible/inventory/hosts.yml ansible/site.yml

### Rôle du pipeline CI/CD (GitHub Actions)
À chaque fusion sur la branche main, le workflow automatisé :

1. Exécute les tests et le linter.
2. Injecte de manière sécurisée la clé SSH privée depuis les Secrets GitHub.
3. Exécute à distance le playbook Ansible pour synchroniser le code source, mettre à jour les dépendances et redémarrer l'application.

---

## 3. Commandes d'exploitation, supervision et Rollback

### Supervision des processus (PM2)
L'API Node.js tourne en arrière-plan sous la supervision de PM2 avec l'utilisateur technique laine_william01.

- Vérifier l'état de l'application :

  pm2 status

- Consulter les logs en temps réel (erreurs et flux) :

  pm2 logs logichain-back

- Redémarrer l'application manuellement :

  pm2 restart logichain-back

### Procédure de Rollback en cas d'incident
Si une version déployée présente un dysfonctionnement critique :

1. Via Git : Revenir au commit stable précédent sur la branche main :
   git checkout main
   git reset --hard <HASH_DU_COMMIT_STABLE>
   git push origin main --force

2. Relance du déploiement : Forcer l'exécution du playbook Ansible pour réappliquer l'état stable sur le VPS :

   ansible-playbook -i ansible/inventory/hosts.yml ansible/site.yml

---

## 4. Stratégie de sauvegarde (Backup) et Sécurité

### Gestion des sauvegardes MongoDB
Les données de production stockées dans MongoDB doivent faire l'objet de sauvegardes régulières.

- Effectuer une sauvegarde complète (Dump) :

  mongodump --uri="mongodb://utilisateur:motdepasse@localhost:27017/logichain?authSource=admin" --out="/var/backups/mongodb/backup-$(date +%F)"

- Restaurer une sauvegarde :

  mongorestore --uri="mongodb://utilisateur:motdepasse@localhost:27017/logichain?authSource=admin" /var/backups/mongodb/backup-YYYY-MM-DD/logichain

### Sécurité et pare-feu
- Vérification du pare-feu (UFW) : Seuls les flux autorisés (SSH, HTTP, HTTPS) doivent traverser la frontière réseau. Pour vérifier l'état des règles :

  sudo ufw status verbose

- Protection anti-brute force : Le service Fail2Ban est actif sur le serveur pour bloquer automatiquement toute tentative d'intrusion répétée (notamment sur le port SSH). Vous pouvez consulter son état avec :

  sudo fail2ban-client status sshd