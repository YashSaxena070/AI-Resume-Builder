# AI Resume Analyzer

An AI-powered resume analyzer built with Spring Boot that provides ATS (Applicant Tracking System) analysis, plagiarism detection, and improvement suggestions.

## Features

- User authentication with JWT
- Email verification
- Resume upload and analysis
- ATS score calculation
- Plagiarism detection
- AI-powered improvement suggestions
- Cloudinary integration for image storage

## Prerequisites

- Java 21
- Maven 3.6+
- MongoDB (local or cloud instance)
- OpenAI API key
- Cloudinary account
- Email service account (e.g., Brevo/SendGrid)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ai-resume-analyzer
```

### 2. Configure Environment Variables

Copy the example configuration file:

```bash
cp src/main/resources/application.yaml.example src/main/resources/application.yaml
```

### 3. Set Environment Variables

You need to set the following environment variables. You can do this in several ways:

#### Option A: Using Environment Variables (Recommended for Production)

Set these environment variables in your system or deployment platform:

```bash
# Application Configuration
export APP_BASE_URL=http://localhost:8080

# Cloudinary Configuration
export CLOUDINARY_CLOUD_NAME=your-cloud-name
export CLOUDINARY_API_KEY=your-api-key
export CLOUDINARY_API_SECRET=your-api-secret

# JWT Configuration
export JWT_SECRET=your-secure-jwt-secret-key-minimum-256-bits
export JWT_EXPIRATION=604800000

# Email Configuration
export SPRING_MAIL_HOST=smtp.example.com
export SPRING_MAIL_PORT=587
export SPRING_MAIL_USERNAME=your-email@example.com
export SPRING_MAIL_PASSWORD=your-email-password
export SPRING_MAIL_FROM=your-email@example.com

# MongoDB Configuration
export MONGODB_URI=mongodb://localhost:27017/ai-resume-analyzer
# Or for MongoDB Atlas:
# export MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name

# OpenAI Configuration
export OPENAI_API_KEY=your-openai-api-key
```

#### Option B: Edit application.yaml Directly (For Local Development Only)

Edit `src/main/resources/application.yaml` and replace the placeholder values with your actual credentials.

**⚠️ WARNING:** Never commit `application.yaml` to version control. It's already in `.gitignore`.

### 4. Build the Project

```bash
mvn clean install
```

### 5. Run the Application

```bash
mvn spring-boot:run
```

Or if you have the JAR file:

```bash
java -jar target/ai-resume-analyzer-0.0.1-SNAPSHOT.jar
```

The application will start on `http://localhost:8080` by default.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login
- `GET /api/auth/verify-email?token={token}` - Verify email
- `POST /api/auth/resend-verification` - Resend verification email

### Resume
- `POST /api/resume/analyze` - Analyze a resume (requires authentication)

## Security Notes

- All sensitive credentials are stored as environment variables
- The `application.yaml` file is excluded from version control
- Use strong, unique secrets for JWT and database credentials
- Never commit API keys or passwords to the repository

## Development

### Project Structure

```
src/main/java/com/yash/AI_Resume/
├── config/          # Configuration classes
├── controller/      # REST controllers
├── document/        # MongoDB document models
├── dto/            # Data transfer objects
├── exception/      # Exception handlers
├── repository/     # MongoDB repositories
├── security/       # Security configuration
├── service/        # Business logic
└── utils/          # Utility classes
```

## License

[Add your license here]

## Contributing

[Add contribution guidelines here]

