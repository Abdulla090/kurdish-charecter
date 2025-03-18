# Soran & Shirin - Kurdish AI Chatbot

A mobile and web application featuring two AI characters with distinct Kurdish personalities that users can chat with.

## Live Demo

- Web Version: [https://soran-shirin-ai.vercel.app](https://soran-shirin-ai.vercel.app)
- Android APK: [Download APK](https://expo.dev/artifacts/eas/inoqdjeq3BydVwfhjLAU26.apk)

## Features

- Two distinct AI characters with unique personalities
- Kurdish language support
- Cross-platform (mobile and web)
- Error handling and graceful degradation

## Setting up GitHub Repository

1. Create a new repository on GitHub
   - Go to GitHub.com and log in
   - Click the "+" icon in the top right corner and select "New repository"
   - Name your repository (e.g., "kurdish-charecter")
   - Leave it as a public repository (or make it private if preferred)
   - Don't initialize with README, .gitignore, or license
   - Click "Create repository"

2. Generate a Personal Access Token
   - Go to GitHub.com and click your profile icon in the top-right
   - Select "Settings" from the dropdown
   - Scroll down and select "Developer settings" from the sidebar
   - Click on "Personal access tokens" then "Tokens (classic)"
   - Click "Generate new token"
   - Give it a name (e.g., "Kurdish Character App")
   - Set expiration as needed (90 days recommended)
   - Select "repo" scope for full repository access
   - Click "Generate token" and copy the token immediately

3. Push your code to GitHub
   ```
   # Add your GitHub repository as remote
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   
   # Update with your username and token
   git remote set-url origin https://YOUR_USERNAME:YOUR_TOKEN@github.com/YOUR_USERNAME/YOUR_REPO.git
   
   # Push your code
   git push -u origin main
   ```

## Development

### Branch Strategy

This repository follows a gitflow-inspired branch strategy:

- `main`: Production branch. Contains stable code that is deployed to production.
- `development`: Development branch. All changes are first merged here.
- `feature/[feature-name]`: Feature branches. Create from `development` for new features.
- `bugfix/[bug-name]`: Bug fix branches. Create from `development` for bug fixes.

### Workflow

1. Create a new branch from `development` for your feature or bugfix
   ```
   git checkout development
   git pull
   git checkout -b feature/your-feature-name
   ```

2. Make changes and commit
   ```
   git add .
   git commit -m "Description of your changes"
   ```

3. Push changes to GitHub
   ```
   git push -u origin feature/your-feature-name
   ```

4. Create a Pull Request to merge into `development`

5. After testing, merge `development` into `main` for production deployment

### Local Setup

1. Clone the repository
   ```
   git clone https://github.com/Abdulla090/kurdish-charecter.git
   cd kurdish-charecter
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Run the app
   ```
   npm start
   ```

## Building

### Web Build
```
npm run build
```

### Android APK Build
```
eas build -p android --profile apk
```

## Testing

Before merging into `development`, make sure:
1. The app starts without errors
2. All features work as expected
3. There are no console errors or warnings

## Deployment

- Web: Automatic deployment via Vercel on push to `main`
- Android: Build new APK when ready for release
