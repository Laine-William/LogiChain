#!/bin/bash

# Création de l'arborescence complète
mkdir -p ansible/inventory
mkdir -p ansible/roles/system_security/tasks
mkdir -p ansible/roles/database/tasks
mkdir -p ansible/roles/web_proxy/tasks
mkdir -p ansible/roles/app_runtime/tasks
mkdir -p ansible/roles/monitoring/tasks

# 1. Fichier inventory/hosts.yml
cat << 'EOF' > ansible/inventory/hosts.yml
all:
  hosts:
    vps_production:
      ansible_host: <VOTRE_IP_VPS>
      ansible_user: ubuntu
      ansible_ssh_private_key_file: ~/.ssh/id_rsa
  children:
    production:
      hosts:
        vps_production:
EOF

# 2. Fichier site.yml
cat << 'EOF' > ansible/site.yml
- hosts: production
  become: true
  roles:
    - system_security
    - database
    - web_proxy
    - app_runtime
    - monitoring
EOF

# 3. Rôle system_security
cat << 'EOF' > ansible/roles/system_security/tasks/main.yml
- name: Update apt cache
  apt:
    update_cache: yes
    cache_valid_time: 3600

- name: Install Fail2Ban and UFW
  apt:
    name: ["fail2ban", "ufw"]
    state: present

- name: Configure UFW default policies
  ufw:
    state: enabled
    policy: deny
    direction: incoming

- name: Allow essential ports via UFW
  ufw:
    rule: allow
    port: "{{ item }}"
    proto: tcp
  loop:
    - '22'
    - '80'
    - '443'
EOF

# 4. Rôle database
cat << 'EOF' > ansible/roles/database/tasks/main.yml
- name: Add MongoDB GPG key and repository
  shell: |
    curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg
    echo "deb [ arch=amd64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list

- name: Install MongoDB
  apt:
    name: mongodb-org
    state: present
    update_cache: yes

- name: Start and enable MongoDB
  systemd:
    name: mongod
    state: started
    enabled: yes
EOF

# 5. Rôle web_proxy
cat << 'EOF' > ansible/roles/web_proxy/tasks/main.yml
- name: Install Nginx
  apt:
    name: nginx
    state: present

- name: Configure Nginx reverse proxy for Node.js API
  copy:
    dest: "/etc/nginx/sites-available/logichain"
    content: |
      server {
          listen 80;
          server_name _;
          location / {
              proxy_pass http://127.0.0.1:5000;
              proxy_http_version 1.1;
              proxy_set_header Upgrade $http_upgrade;
              proxy_set_header Connection 'upgrade';
              proxy_set_header Host $host;
              proxy_cache_bypass $http_upgrade;
          }
      }

- name: Enable Nginx site configuration
  file:
    src: /etc/nginx/sites-available/logichain
    dest: /etc/nginx/sites-enabled/logichain
    state: link
  notify: reload nginx
EOF

# 6. Rôle app_runtime
cat << 'EOF' > ansible/roles/app_runtime/tasks/main.yml
- name: Download Node.js setup script
  shell: curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

- name: Install Node.js
  apt:
    name: nodejs
    state: present

- name: Install PM2 globally
  npm:
    name: pm2
    global: yes
EOF

# 7. Rôle monitoring
cat << 'EOF' > ansible/roles/monitoring/tasks/main.yml
- name: Create prometheus system user
  user:
    name: prometheus
    system: true
    shell: /bin/false

- name: Download and extract Prometheus
  unarchive:
    src: "https://github.com/prometheus/prometheus/releases/download/v2.51.0/prometheus-2.51.0.linux-amd64.tar.gz"
    dest: "/tmp"
    remote_src: yes

- name: Move Prometheus binaries
  copy:
    src: "/tmp/prometheus-2.51.0.linux-amd64/{{ item }}"
    dest: "/usr/local/bin/"
    remote_src: yes
    mode: '0755'
  loop:
    - prometheus
    - promtool

- name: Install Grafana repository and package
  apt:
    deb: "https://dl.grafana.com/oss/release/grafana_10.4.0_amd64.deb"
    state: present
EOF

echo "Arborescence Ansible et fichiers de configuration générés avec succès !"