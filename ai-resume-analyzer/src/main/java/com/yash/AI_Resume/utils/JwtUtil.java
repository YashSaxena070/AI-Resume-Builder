package com.yash.AI_Resume.utils;

import com.yash.AI_Resume.document.type.AuthProviderType;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
@Slf4j
public class JwtUtil {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    public String generateToken(String userId) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);

        return Jwts.builder()
                .setSubject(userId)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey())
                .compact();

    }

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    public String getUserIdFromToken(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(getSigningKey())
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .setSigningKey(getSigningKey())
                    .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public boolean isTokenExpired(String token) {
        try {
            Claims claims = Jwts.parser()
                    .setSigningKey(getSigningKey())
                    .parseClaimsJws(token)
                    .getBody();
            return claims.getExpiration().before(new Date());
        } catch (JwtException | IllegalArgumentException e) {
            return true;
        }
    }

    public static AuthProviderType getProviderTypeFromRegisterationId(String registerationId) {
        return switch (registerationId.toLowerCase()) {
            case "google" -> AuthProviderType.GOOGLE;
            case "github" -> AuthProviderType.GITHUB;
            case "facebook" -> AuthProviderType.FACEBOOK;
            default -> throw new IllegalStateException("Unsupported OAuth2 Provider " + registerationId);
        };
    }

    public static String determineProviderIdFromOAuth2User(OAuth2User oAuth2User, String registerationId) {
        String providerId = switch (registerationId.toLowerCase()) {
            case "google" -> oAuth2User.getAttribute("sub");
            case "github" -> oAuth2User.getAttribute("id").toString();
            case "facebook" -> oAuth2User.getAttribute("id").toString();
            default -> {
                log.error("Unsupported OAuth2 provider: {}", registerationId);
                throw new IllegalStateException("Unsupported OAuth2 Provider " + registerationId);
            }
        };
        if (providerId == null || providerId.isBlank()) {
            log.error("Unable to determine providerId for provider: {}", registerationId);
            throw new IllegalStateException("Unable to determine providerId for OAuth2 login");
        }
        return providerId;
    }

    public static String determineUsernameFromOauth2User(
            OAuth2User oauth2User,
            String registrationId,
            String providerId) {
        String email = oauth2User.getAttribute("email");
        if (email != null && !email.isBlank()) {
            return email;
        }

        return switch (registrationId) {
            case "google" -> oauth2User.getAttribute("sub");
            case "github" -> oauth2User.getAttribute("login");
            default -> providerId;
        };
    }
}
