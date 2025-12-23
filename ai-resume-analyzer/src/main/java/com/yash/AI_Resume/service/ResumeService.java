package com.yash.AI_Resume.service;

import com.yash.AI_Resume.document.Resume;
import com.yash.AI_Resume.dto.AuthResponse;
import com.yash.AI_Resume.dto.CreateResumeRequest;
import com.yash.AI_Resume.repository.ResumeRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.apache.tika.Tika;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final Tika tika = new Tika();
    private final AuthService authService;

    public String extractText(MultipartFile file) {
        try {
            String text = tika.parseToString(file.getInputStream());
            return text.trim();
        } catch (Exception e) {
            return "Error extracting text" + e.getMessage();
        }
    }

    public Resume createResume(CreateResumeRequest request, Object principal) {
        // 1. Create Resume Object
        Resume newResume = new Resume();

        // 2. Get the current profile
        AuthResponse response = authService.getProfile(principal);

        // 3. update the resume object
        newResume.setUserId(response.getId());
        newResume.setTitle(request.getTitle());

        // 4. Set default data for resume
        setDefaultResumeData(newResume);

        // 5. save the resume data
        return resumeRepository.save(newResume);

    }

    private void setDefaultResumeData(Resume newResume) {
        newResume.setProfileInfo(new Resume.ProfileInfo());
        newResume.setContactInfo(new Resume.ContactInfo());
        newResume.setWorkExperience(new ArrayList<>());
        newResume.setEducation(new ArrayList<>());
        newResume.setSkills(new ArrayList<>());
        newResume.setProjects(new ArrayList<>());
        newResume.setCertifications(new ArrayList<>());
        newResume.setLanguages(new ArrayList<>());
        newResume.setInterests(new ArrayList<>());
    }

    public List<Resume> getUserResumes(Object principal) {
        // Step 1: Get the current profile
        AuthResponse response = authService.getProfile(principal);

        // Step 2: Call the repository finder method
        List<Resume> resumes = resumeRepository.findByUserIdOrderByUpdatedAtDesc(response.getId());

        // Step 3: return result
        return resumes;
    }

    public Resume getResumeById(String resumeId, Object principal) {
        // Step 1: Get the current profile
        AuthResponse response = authService.getProfile(principal);

        // Step 2: Call the repo finder method
        Resume existingResume = resumeRepository.findByUserIdAndId(response.getId(), resumeId)
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        // Step 3: return result
        return existingResume;
    }

    public Resume updateResume(String resumeId, Resume updatedData, Object principal) {
        // 1.Get the current profile
        AuthResponse response = authService.getProfile(principal);

        // 2. Call the repo finder method
        Resume existingResume = resumeRepository.findByUserIdAndId(response.getId(), resumeId)
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        // 3. update the new data

        existingResume.setTitle(updatedData.getTitle());
        existingResume.setThumbnailLink(updatedData.getThumbnailLink());
        existingResume.setTemplate(updatedData.getTemplate());
        existingResume.setProfileInfo(updatedData.getProfileInfo());
        existingResume.setContactInfo(updatedData.getContactInfo());
        existingResume.setWorkExperience(updatedData.getWorkExperience());
        existingResume.setEducation(updatedData.getEducation());
        existingResume.setSkills(updatedData.getSkills());
        existingResume.setProjects(updatedData.getProjects());
        existingResume.setCertifications(updatedData.getCertifications());
        existingResume.setLanguages(updatedData.getLanguages());
        existingResume.setInterests(updatedData.getInterests());

        // Step 4: update the details into database
        resumeRepository.save(existingResume);

        // Step 5: return result
        return existingResume;

    }

    public void deleteResume(String resumeId, Object principal) {
        // Step 1: get the current profile
        AuthResponse response = authService.getProfile(principal);

        // Step 2: call the repo finder method
        Resume existingResume = resumeRepository.findByUserIdAndId(response.getId(), resumeId)
                .orElseThrow(() -> new RuntimeException("Resume not found"));
        resumeRepository.delete(existingResume);
    }
}
