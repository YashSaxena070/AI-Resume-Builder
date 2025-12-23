package com.yash.AI_Resume.service;

import org.springframework.http.HttpHeaders;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.yash.AI_Resume.dto.AtsResult;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
@Slf4j
public class AIService {

    @Value("${spring.ai.groq.api-key}")
    private String API_KEY;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper;

    public AtsResult analyze(String resumeText) {
        String url = "https://api.groq.com/openai/v1/chat/completions";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + API_KEY);

        Map<String, Object> body = Map.of(
                "model", "llama-3.1-8b-instant",
                "messages", List.of(
                        Map.of("role", "system",
                                "content", "You are an ATS resume analyzer. Respond ONLY with valid JSON."),
                        Map.of("role", "user", "content", buildPrompt(resumeText))),
                "temperature", 0.2);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

            String json = (String) ((Map<String, Object>) ((Map<String, Object>) ((List<?>) response.getBody()
                    .get("choices"))
                    .get(0))
                    .get("message"))
                    .get("content");

            // 🔥 Convert JSON → DTO
            return objectMapper.readValue(json, AtsResult.class);

        } catch (Exception e) {
            log.error("Groq API error", e);
            throw new RuntimeException("Error analyzing resume");
        }
    }

    private String buildPrompt(String resumeText) {
        return """
                You are an expert ATS (Applicant Tracking System) resume analyzer.

                Analyze the following text to determine if it is a valid resume.

                If the text DOES NOT look like a resume (e.g., random text, code, too short, irrelevant content), return this EXACT JSON:
                {
                  "atsScore": 0,
                  "strengths": [],
                  "gaps": ["The uploaded file does not appear to be a valid resume."],
                  "fixes": ["Please upload a valid professional resume."]
                }

                If it IS a resume, analyze it critically against modern industry standards.
                - Calculate a DYNAMIC `atsScore` (0-100) based strictly on the content quality, keywords, formatting (implied), and completeness. DO NOT default to 82 or any other static number.
                - `strengths`: List 3-5 strong points.
                - `gaps`: List 3-5 missing critical elements or weaknesses.
                - `fixes`: List 3-5 actionable improvements.

                Return ONLY valid JSON in this format:
                {
                  "atsScore": number,
                  "strengths": [string],
                  "gaps": [string],
                  "fixes": [string]
                }

                Resume Text:
                """
                + resumeText;
    }
}
