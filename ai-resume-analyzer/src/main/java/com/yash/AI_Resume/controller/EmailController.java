package com.yash.AI_Resume.controller;


import com.yash.AI_Resume.service.EmailService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

import static com.yash.AI_Resume.utils.AppConstants.*;

@RequiredArgsConstructor
@RequestMapping(EMAIL)
@RestController
@Slf4j
public class EmailController {

    private final EmailService emailService;

    @PostMapping(value = SEND_RESUME, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String,Object>> sendResumeByEmail(
            @RequestPart("recipientEmail") String recipientEmail,
            @RequestPart("subject") String subject,
            @RequestPart("message") String message,
            @RequestPart("pdfFile") MultipartFile pdfFile,
            Authentication authentication
    ) throws IOException, MessagingException {
        log.info("🔥 sendResumeByEmail API HIT");

        //1.Validate the input
        Map<String, Object> response = new HashMap<>();
        if(Objects.isNull(recipientEmail) || Objects.isNull(pdfFile)){
            response.put("success", false);
            response.put("message", "Missing required fields");
            return ResponseEntity.badRequest().body(response);
        }

        //2. Get the file data
        byte[] pdfBytes = pdfFile.getBytes();
        String originalFilename = pdfFile.getOriginalFilename();
        String filename = Objects.nonNull(originalFilename) ? originalFilename : "resume.pdf";

        //3. Prepare the email content
        String emailSubject = Objects.nonNull(subject) ? subject: "Resume Application";
        String emailBody = Objects.nonNull(message) ? message : "Please find my resume attached. \n \n Best Regards";

        //4. Call the Service method
        emailService.sendEmailWithAttachment(recipientEmail, emailSubject, emailBody, pdfBytes, filename);


        //5. return response
        response.put("success", true);
        response.put("message", "Resume send successfully to "+recipientEmail);
        return ResponseEntity.ok(response);

    }
}
