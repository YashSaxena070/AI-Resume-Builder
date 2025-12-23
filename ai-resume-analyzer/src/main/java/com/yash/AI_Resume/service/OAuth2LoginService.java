package com.yash.AI_Resume.service;

import com.yash.AI_Resume.dto.AuthResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OAuth2LoginService {

    private final AuthService authService;

    public ResponseEntity<AuthResponse> login(OAuth2User user, String registrationId) {
        return authService.handleOAuth2LoginRequest(user, registrationId);
    }
}
