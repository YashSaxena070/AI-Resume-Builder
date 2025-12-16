package com.yash.AI_Resume.config;

import io.github.cdimascio.dotenv.Dotenv;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DotEnvConfig {

    private static final Logger log = LoggerFactory.getLogger(DotEnvConfig.class);

    @PostConstruct
    public void loadEnvFile() {
        try {
            Dotenv dotenv = Dotenv.configure()
                    .ignoreIfMissing()
                    .load();
            
            // Load all variables from .env file into system properties
            dotenv.entries().forEach(entry -> {
                String key = entry.getKey();
                String value = entry.getValue();
                if (System.getProperty(key) == null) {
                    System.setProperty(key, value);
                }
            });
            
            log.info("Loaded environment variables from .env file");
        } catch (Exception e) {
            log.warn("No .env file found or error loading it. Using system environment variables instead.");
        }
    }
}

