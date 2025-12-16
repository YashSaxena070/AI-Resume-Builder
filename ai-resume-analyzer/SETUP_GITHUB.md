# GitHub Setup Guide - Security Checklist

## ✅ Completed Security Measures

1. **Updated `.gitignore`** - Added `application.yaml` and other sensitive files
2. **Created `application.yaml.example`** - Template file with placeholder values
3. **Updated `application.yaml`** - Now uses environment variables for all sensitive data
4. **Created `README.md`** - Documentation with setup instructions

## ⚠️ Important: Remove Sensitive Data from Git History

Since `application.yaml` was previously tracked in git (it shows as modified), you need to remove it from git tracking to ensure old commits don't contain your secrets.

### Steps to Remove application.yaml from Git Tracking:

1. **Remove the file from git tracking (but keep local file):**
   ```bash
   git rm --cached src/main/resources/application.yaml
   ```

2. **Verify it's now ignored:**
   ```bash
   git status
   ```
   The file should no longer appear in the modified files list.

3. **Stage your changes:**
   ```bash
   git add .gitignore
   git add src/main/resources/application.yaml.example
   git add README.md
   git add src/main/resources/application.yaml
   ```

4. **Commit your changes:**
   ```bash
   git commit -m "Security: Move sensitive data to environment variables"
   ```

5. **Push to GitHub:**
   ```bash
   git push origin main
   ```

## 🔒 Environment Variables Required

Before running the application, set these environment variables:

- `APP_BASE_URL` - Application base URL
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `JWT_SECRET` - JWT signing secret (minimum 256 bits)
- `JWT_EXPIRATION` - JWT expiration time in milliseconds
- `SPRING_MAIL_HOST` - SMTP server host
- `SPRING_MAIL_PORT` - SMTP server port
- `SPRING_MAIL_USERNAME` - Email service username
- `SPRING_MAIL_PASSWORD` - Email service password
- `SPRING_MAIL_FROM` - Sender email address
- `MONGODB_URI` - MongoDB connection string
- `OPENAI_API_KEY` - OpenAI API key

## 📝 Next Steps

1. Set up your environment variables (see README.md for details)
2. Test the application locally to ensure everything works
3. If you need to share the repository, make sure to:
   - Never commit `application.yaml` with real values
   - Use the `application.yaml.example` as a template
   - Document required environment variables in README.md

## 🚨 Security Reminder

- **Never commit** files containing real API keys, passwords, or secrets
- Use environment variables or secure secret management services
- Rotate any credentials that may have been exposed in previous commits
- Consider using GitHub Secrets for CI/CD pipelines

