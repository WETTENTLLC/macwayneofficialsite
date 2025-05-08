# Push Leafylivation to GitHub

Follow these steps to push your project to the already created repository:

## 1. Initialize Git (if not already done)
```bash
git init
```

## 2. Add all files to the repository
```bash
git add .
```

## 3. Make your first commit
```bash
git commit -m "Initial commit"
```

## 4. Connect your local repository to GitHub
```bash
git remote add origin https://github.com/WETTENTLLC/leafylivation.git
```

## 5. Push your code to GitHub
```bash
git push -u origin main
```

If your default branch is named "master" instead of "main", use:
```bash
git push -u origin master
```

## Optional: If you have authentication issues
You might need to use a personal access token or configure GitHub CLI for authentication.

## 6. Verify the GitHub Actions workflow
After pushing, visit your repository on GitHub and go to the "Actions" tab to see if the workflow is running properly.
