package com.yash.AI_Resume.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AtsResult {
    public int atsScore;
    public List<String> strengths;
    public List<String> gaps;
    public List<String> fixes;
}
