# Contributing Guide

Thank you for considering contributing to this project. This guide covers how to set up your work, how to submit changes, and what information to include in pull requests.

---

## 1. Project setup guidelines

- Do not include `node_modules/` in your pull requests. Ensure `node_modules` is listed in `.gitignore`.
- Create a new branch for each pull request.

Example:

```bash
git checkout -b feature/your-feature-name
```

---

## 2. Contribution best practices

- Keep code clean and readable.
- Follow the project’s existing coding style and conventions.
- Use descriptive commit messages.
- Keep pull requests focused on one change or one feature.

---

## 3. Feature documentation requirements

Whenever you add a new feature, include:

- At least one image (screenshot or UI snippet)
- A short demo (GIF or screen recording)

You can upload directly to GitHub or link to Loom (https://www.loom.com/) / Gyazo (https://gyazo.com/).

---

## 4. Testing and validation

- Test your changes locally before submitting.
- Ensure you do not break existing functionality.

---

## 5. Submitting a pull request

1. Fork the repository.
2. Create a branch from `main` or `dev`:

```bash
git checkout -b feature/your-feature-name
```

3. Make your changes.
4. Commit and push:

```bash
git commit -m "Add: your feature name"
git push origin feature/your-feature-name
```

5. Open a PR to the main repository with:

- A clear title
- A description of the change
- Screenshots/demo artifacts (if applicable)

---

## 6. Things to avoid

- Do not commit large/irrelevant files.
- Do not commit `.env` files or other secrets.
- Do not open PRs directly from `main`.
