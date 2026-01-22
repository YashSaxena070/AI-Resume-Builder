package com.yash.AI_Resume.config;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.yash.AI_Resume.security.JwtAuthenticationEntryPoint;
import com.yash.AI_Resume.security.JwtAuthenticationFilter;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

        private final JwtAuthenticationFilter jwtAuthenticationFilter;
        private final OAuth2SuccessHandler oAuth2SuccessHandler;

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
                http.cors(cors -> cors.configurationSource(corsConfigurationSource()))
                                .csrf(csrf -> csrf.disable())
                                .authorizeHttpRequests(auth -> auth
                                                .requestMatchers("/api/auth/register", "/oauth2/**",
                                                                "/api/auth/login","/api/auth/health", "/api/auth/verify-email",
                                                                "/api/auth/upload-image", "/actuator/**",
                                                                "/api/auth/resend-verification")
                                                .permitAll()
                                                .requestMatchers(
                                                      "/favicon.ico",
                                                        "/error"
                                                ).permitAll()
                                                .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()
                                                .anyRequest().authenticated())
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                                .oauth2Login(oAuth2 -> oAuth2
                                                .failureHandler((request, response, exception) -> {
                                                        log.error("OAuth2 error", exception.getMessage());
                                                })
                                                .successHandler(oAuth2SuccessHandler))
                                .exceptionHandling(
                                                ex -> ex.authenticationEntryPoint((new JwtAuthenticationEntryPoint())));

                return http.build();
        }

        public CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration configuration = new CorsConfiguration();
                configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173",
                                "https://currix-delta.vercel.app"));
                configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
                configuration.setAllowedHeaders(Arrays.asList("*"));
                configuration.setAllowCredentials(true);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);
                return source;
        }

}
