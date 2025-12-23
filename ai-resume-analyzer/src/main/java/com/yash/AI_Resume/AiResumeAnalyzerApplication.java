package com.yash.AI_Resume;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AiResumeAnalyzerApplication {

	public static void main(String[] args) {
		// Try to load application-env.properties, fallback to .env
		// Check multiple locations: current dir, project root (if running from parent),
		// and src/main/resources
		String[] configFiles = {
				"./application-env.properties",
				"./.env",
				"ai-resume-analyzer/application-env.properties",
				"src/main/resources/application-env.properties"
		};
		boolean loaded = false;

		try {
			System.out.println("Current Working Directory: " + System.getProperty("user.dir"));

			for (String filePath : configFiles) {
				java.io.File envFile = new java.io.File(filePath);
				System.out.println("Checking: " + envFile.getAbsolutePath());
				if (envFile.exists()) {
					System.out.println("Loading configuration from: " + envFile.getAbsolutePath());
					java.util.List<String> lines = java.nio.file.Files.readAllLines(envFile.toPath());
					for (String line : lines) {
						line = line.trim();
						if (line.isEmpty() || line.startsWith("#")) {
							continue;
						}
						String[] parts = line.split("=", 2);
						if (parts.length == 2) {
							String key = parts[0].trim();
							String value = parts[1].trim();
							System.setProperty(key, value);
						}
					}
					loaded = true;
					System.out.println("Successfully loaded configuration.");
					break;
				}
			}

			if (!loaded) {
				System.err.println("CRITICAL ERROR: No configuration file found!");
				System.err.println("Checked locations:");
				for (String filePath : configFiles) {
					System.err.println(" - " + new java.io.File(filePath).getAbsolutePath());
				}
				System.err.println("Please ensure 'application-env.properties' exists in one of these locations.");
				System.exit(1);
			}

		} catch (Exception e) {
			System.err.println("Error loading configuration: " + e.getMessage());
			e.printStackTrace();
			System.exit(1);
		}

		SpringApplication.run(AiResumeAnalyzerApplication.class, args);
	}

}
