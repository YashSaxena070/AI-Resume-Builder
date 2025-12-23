package com.yash.AI_Resume.config;

import com.yash.AI_Resume.dto.AuthResponse;
import com.yash.AI_Resume.service.OAuth2LoginService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final OAuth2LoginService loginService;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {

        if (!(authentication instanceof OAuth2AuthenticationToken oauthToken)) {
            response.sendRedirect(frontendUrl + "/login?error=oauth");
            return;
        }

        OAuth2User oAuth2User = oauthToken.getPrincipal();

        String registerationId = oauthToken.getAuthorizedClientRegistrationId();

        ResponseEntity<AuthResponse> loginResponse = loginService.login(oAuth2User, registerationId);

        String jwtToken = loginResponse.getBody().getToken();

        // encoded token
        String encodedToken = URLEncoder.encode(jwtToken, StandardCharsets.UTF_8);

        response.sendRedirect(frontendUrl + "/oauth/callback?token=" + encodedToken);

    }
}
