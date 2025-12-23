package com.yash.AI_Resume.service;

import com.yash.AI_Resume.document.User;
import com.yash.AI_Resume.document.type.AuthProviderType;
import com.yash.AI_Resume.dto.AuthResponse;
import com.yash.AI_Resume.dto.LoginRequest;
import com.yash.AI_Resume.dto.RegisterRequest;
import com.yash.AI_Resume.exception.ResourceExistsException;
import com.yash.AI_Resume.repository.UserRespository;
import com.yash.AI_Resume.utils.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger; // Import 1
import org.slf4j.LoggerFactory; // Import 2
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    // FIX 1: Manually define the logger to bypass the Lombok @Slf4j error
    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRespository userRespository; // Better to use 'final' with @RequiredArgsConstructor

    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Value("${app.base.url:http://localhost:8080}")
    private String appBaseUrl;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    public AuthResponse register(RegisterRequest request) {
        log.info("Inside AuthService: register() {}", request);

        if (userRespository.existsByEmail(request.getEmail())) {
            throw new ResourceExistsException("Email already in use");
        }

        User newUser = toDocument(request);

        User savedUser = userRespository.save(newUser);

        // sendVerificationEmail(savedUser);
        savedUser.setEmailVerified(true);
        userRespository.save(savedUser);

        return toResponse(savedUser);
    }

    private void sendVerificationEmail(User user) {
        log.info("Inside AuthService - sendVerificationEmail(): {}", user);
        try {
            String link = frontendUrl + "/verify-email?token=" + user.getVerificationToken();
            String html = "<div style='font-family:sans-serif'>" +
                    "<h2>Verify your email</h2>" +
                    "<p>Hi " + user.getName() + ", please confirm your email to activate your account.</p>" +
                    "<p><a href='" + link
                    + "' style='display:inline-block;padding:10px 16px;background:#6366f1;color:#fff;border-radius:6px;text-decoration:none'>Verify Email</a></p>"
                    +
                    "<p>Or copy this link: " + link + "</p>" +
                    "<p>This link expires in 24 hours.</p>" +
                    "</div>";
            emailService.sendHtmlEmail(user.getEmail(), "Verify your email", html);
        } catch (Exception e) {
            log.error("Exception occurred at sendVerificationEmail(): {}", e.getMessage(), e);
            // Don't throw exception - allow user registration to succeed even if email
            // fails
            // You can uncomment the line below if you want registration to fail when email
            // fails
            throw new RuntimeException("Failed to send verification email: " + e.getMessage(), e);
        }
    }

    private AuthResponse toResponse(User newUser) {
        return AuthResponse.builder()
                .id(newUser.getId())
                .name(newUser.getName())
                .email(newUser.getEmail())
                .profileImageUrl(newUser.getProfileImageUrl())
                .subscriptionPlan(newUser.getSubscriptionPlan())
                .createdAt(newUser.getCreatedAt())
                .updatedAt(newUser.getUpdatedAt())
                .emailVerified(newUser.isEmailVerified())
                .build();
    }

    private User toDocument(RegisterRequest request) {
        return User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .profileImageUrl(request.getProfileImageUrl())
                .subscriptionPlan("Basic") // Removed: Let the User class default handle this
                .verificationToken(UUID.randomUUID().toString())
                .verificationExpires(LocalDateTime.now().plusHours(24))
                .build();
    }

    public AuthResponse verifyEmail(String Token) {
        log.info("Inside AuthService: verifyEmail(): {}", Token);
        User user = userRespository.findByVerificationToken(Token)
                .orElseThrow(() -> new RuntimeException("Invalid or Expired verification token"));
        if (user.getVerificationExpires() != null && user.getVerificationExpires().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Verification token has expired. Please request new one.");
        }

        user.setEmailVerified(true);
        user.setVerificationToken(null);
        user.setVerificationExpires(null);
        User savedUser = userRespository.save(user);

        // Generate token for auto-login
        String token = jwtUtil.generateToken(savedUser.getId());
        AuthResponse response = toResponse(savedUser);
        response.setToken(token);
        return response;
    }

    public AuthResponse login(LoginRequest request) {
        User existingUser = userRespository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("Invalid email or password"));
        if (!passwordEncoder.matches(request.getPassword(), existingUser.getPassword())) {
            throw new UsernameNotFoundException("Invalid email or password");
        }

        if (!existingUser.isEmailVerified()) {
            throw new RuntimeException("Please Verify your email before login");
        }

        String token = jwtUtil.generateToken(existingUser.getId());

        AuthResponse response = toResponse(existingUser);
        response.setToken(token);
        return response;
    }

    public void resendVerification(String email) {
        // 1. Fetch the user account by email
        User user = userRespository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Check the email is verified
        if (user.isEmailVerified()) {
            throw new RuntimeException("email is already verified");
        }
        // 3. Set the new Verification Token and expire time
        user.setVerificationToken(UUID.randomUUID().toString());
        user.setVerificationExpires(LocalDateTime.now().plusHours(24));

        // 4. Update the user
        userRespository.save(user);

        // 5. Resend the verification mail
        sendVerificationEmail(user);

    }

    public AuthResponse getProfile(Object principalObject) {
        User existingUser = (User) principalObject;
        return toResponse(existingUser);
    }

    public User signUpInternal(RegisterRequest signupRequestDto, AuthProviderType authProviderType, String providerId) {
        User user = userRespository.findByUsername(signupRequestDto.getName())
                .orElse(null);

        if (user != null) {
            throw new IllegalArgumentException("Username already in use");
        }

        user = User.builder()
                .name(signupRequestDto.getName())
                .email(signupRequestDto.getEmail())
                .providerId(providerId)
                .providerType(authProviderType)
                .emailVerified(true) // OAuth2 users are verified by default
                .build();

        if (authProviderType == AuthProviderType.EMAIL) {
            user.setPassword(passwordEncoder.encode(signupRequestDto.getPassword()));
        }

        return userRespository.save(user);

    }

    @Transactional
    public ResponseEntity<AuthResponse> handleOAuth2LoginRequest(OAuth2User oAuth2User, String registerationId) {
        // providerType and providerId
        AuthProviderType providerType = JwtUtil.getProviderTypeFromRegisterationId(registerationId);
        String providerId = JwtUtil.determineProviderIdFromOAuth2User(oAuth2User, registerationId);

        User user = userRespository.findByProviderIdAndProviderType(providerId, providerType).orElse(null);
        String email = oAuth2User.getAttribute("email");

        if (user == null) {
            // Try to find by email if provider ID lookup failed
            if (email != null) {
                user = userRespository.findByEmail(email).orElse(null);
                if (user != null) {
                    // Link existing account
                    user.setProviderId(providerId);
                    user.setProviderType(providerType);
                    userRespository.save(user);
                }
            }
        }

        if (user == null) {
            // signup
            String username = JwtUtil.determineUsernameFromOauth2User(oAuth2User, registerationId, providerId);
            user = signUpInternal(new RegisterRequest(username, email, null, null), providerType, providerId);
        }

        AuthResponse loginResponseDto = new AuthResponse(user.getId(), user.getName(), user.getEmail(),
                user.getProfileImageUrl(), user.getSubscriptionPlan(), user.isEmailVerified(),
                jwtUtil.generateToken(user.getId()), user.getCreatedAt(), user.getUpdatedAt());

        return ResponseEntity.ok(loginResponseDto);
    }
}