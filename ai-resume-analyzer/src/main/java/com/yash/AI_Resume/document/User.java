package com.yash.AI_Resume.document;

import com.yash.AI_Resume.document.type.AuthProviderType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "users")
public class User implements UserDetails {
    private String id;
    private String name;
    private String email;
    private String password;
    private String profileImageUrl;

    private String providerId;

    private AuthProviderType providerType;

    @Builder.Default
    private String subscriptionPlan = "basic";

    @Builder.Default
    private boolean emailVerified = false;

    private String verificationToken;
    private LocalDateTime verificationExpires;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @Override
    public String getUsername() {
        return getName();
    }
}