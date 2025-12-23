package com.yash.AI_Resume.repository;

import com.yash.AI_Resume.document.User;
import com.yash.AI_Resume.document.type.AuthProviderType;
import org.springframework.data.mongodb.repository.MongoRepository;


import java.util.Optional;

public interface UserRespository extends MongoRepository<User, String> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    Optional<User> findByVerificationToken(String verificationToken);

    Optional<User> findByProviderIdAndProviderType(String providerId, AuthProviderType providerType);

    Optional<User> findByUsername(String username);
}
