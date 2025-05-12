# Taskforce

## 📝 Description
Taskforce est une application web de gestion de tâches développée avec Laravel (backend) et Vue.js (frontend).

## 🛠 Prérequis
- PHP >= 8.0
- Composer
- Node.js >= 14
- NPM ou Yarn
- Base de données SQLite (ou MySQL)

## 🚀 Installation

### Backend (Laravel)

1. Naviguez vers le dossier backend :
```bash
cd Taskforce_vue_laravel/backend
```

2. Installez les dépendances PHP :
```bash
composer install
```

3. Copiez le fichier d'environnement :
```bash
cp .env.example .env
```

4. Générez la clé d'application :
```bash
php artisan key:generate
```

5. Configurez votre fichier .env avec vos informations de base de données et de mail

6. Exécutez les migrations et les seeders :
```bash
php artisan migrate --seed
```

7. Démarrez le serveur Laravel :
```bash
php artisan serve
```

### Frontend (Vue.js)

1. Naviguez vers le dossier frontend :
```bash
cd Taskforce_vue_laravel/frontend
```

2. Installez les dépendances :
```bash
npm install
```

3. Démarrez le serveur de développement :
```bash
npm run dev
```

## 🌟 Fonctionnalités

### Authentification
- Inscription avec vérification par email
- Connexion sécurisée
- Gestion de profil utilisateur

### Gestion des tâches
- Création, modification et suppression de tâches
- Tableau de bord des tâches
- Mise à jour du statut des tâches

### Administration
- Interface d'administration
- Gestion des utilisateurs
- Tableau de bord administrateur

### Autres fonctionnalités
- Système de contact
- Pages d'information (À propos, Mentions légales)

## 👥 Rôles utilisateurs
- **Utilisateur standard** : Peut gérer ses propres tâches
- **Administrateur** : Accès complet au système et gestion des utilisateurs

## 🔒 Sécurité
- Authentification sécurisée
- Vérification des emails
- Protection CSRF
- Middleware d'authentification

## 📧 Configuration email
Pour la fonctionnalité de vérification d'email, assurez-vous de configurer correctement les paramètres SMTP dans le fichier `.env` :

```env
MAIL_MAILER=smtp
MAIL_HOST=votre_serveur_smtp
MAIL_PORT=587
MAIL_USERNAME=votre_username
MAIL_PASSWORD=votre_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=adresse_expediteur
MAIL_FROM_NAME="${APP_NAME}"
```

## 🤝 Contribution
Pour contribuer au projet, veuillez suivre les étapes suivantes :
1. Forkez le projet
2. Créez une branche pour votre fonctionnalité
3. Committez vos changements
4. Poussez vers la branche
5. Ouvrez une Pull Request

## 📝 License
Ce projet est sous licence MIT.
