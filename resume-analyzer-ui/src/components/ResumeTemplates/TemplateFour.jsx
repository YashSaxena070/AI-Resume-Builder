import React, { useRef, useState, useEffect } from "react";
import {
  MapPin,
  Mail,
  Phone,
  Linkedin,
  Github,
  Rss,
  Globe,
  Award,
  Briefcase,
  GraduationCap,
  LayoutTemplate,
  User,
} from "lucide-react";

const DEFAULT_THEME = [
  "#f0f9ff", // Background/Lightest
  "#bae6fd", // Light Accent
  "#0ea5e9", // Primary Accent
  "#0284c7", // Darker Accent
  "#0c4a6e", // Darkest/Text
];

const formatYearMonth = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
};

const TemplateFour = ({ resumeData, colorPalette, containerWidth }) => {
  const themeColors = colorPalette?.length > 0 ? colorPalette : DEFAULT_THEME;
  const resumeRef = useRef(null);

  return (
    <div
      ref={resumeRef}
      className="bg-white min-h-[1000px] relative flex"
    >
        {/* Profile Image */}
        <div className="flex justify-center mb-2">
          <div className="w-40 h-40 rounded-full border-4 border-white/20 overflow-hidden bg-white/10 flex items-center justify-center">
            {resumeData.profileInfo.profileImg ||
            resumeData.profileInfo.profilePreviewUrl ? (
              <img
                src={
                  resumeData.profileInfo.profileImg ||
                  resumeData.profileInfo.profilePreviewUrl
                }
                className="w-full h-full object-cover"
                alt="Profile"
              />
            ) : (
              <User size={64} className="text-white/50" />
            )}
          </div>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-4 text-sm">
          <div className="flex items-center gap-3">
            <Mail size={16} className="shrink-0 opacity-70" />
            <span className="break-all">{resumeData.contactInfo.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone size={16} className="shrink-0 opacity-70" />
            <span>{resumeData.contactInfo.phone}</span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin size={16} className="shrink-0 opacity-70" />
            <span>{resumeData.contactInfo.location}</span>
          </div>
          {resumeData.contactInfo.linkedin && (
            <div className="flex items-center gap-3">
              <Linkedin size={16} className="shrink-0 opacity-70" />
              <a
                href={resumeData.contactInfo.linkedin}
                className="hover:underline truncate"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
            </div>
          )}
          {resumeData.contactInfo.github && (
            <div className="flex items-center gap-3">
              <Github size={16} className="shrink-0 opacity-70" />
              <a
                href={resumeData.contactInfo.github}
                className="hover:underline truncate"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            </div>
          )}
          {resumeData.contactInfo.website && (
            <div className="flex items-center gap-3">
              <Globe size={16} className="shrink-0 opacity-70" />
              <a
                href={resumeData.contactInfo.website}
                className="hover:underline truncate"
                target="_blank"
                rel="noreferrer"
              >
                Portfolio
              </a>
            </div>
          )}
        </div>

        {/* Education */}
        <div>
          <h3
            className="text-lg font-bold uppercase tracking-widest mb-4 border-b pb-2"
            style={{ borderColor: "rgba(255,255,255,0.2)" }}
          >
            Education
          </h3>
          <div className="flex flex-col gap-6">
            {resumeData.education.map((edu, index) => (
              <div key={index}>
                <h4 className="font-bold text-base">{edu.degree}</h4>
                <p className="text-sm opacity-80 mb-1">{edu.institution}</p>
                <p className="text-xs opacity-60">
                  {formatYearMonth(edu.startDate)} -{" "}
                  {formatYearMonth(edu.endDate)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div>
          <h3
            className="text-lg font-bold uppercase tracking-widest mb-4 border-b pb-2"
            style={{ borderColor: "rgba(255,255,255,0.2)" }}
          >
            Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {resumeData.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded bg-white/10 text-sm font-medium"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>

        {/* Interests */}
        {resumeData.interests.length > 0 && resumeData.interests[0] !== "" && (
          <div>
            <h3
              className="text-lg font-bold uppercase tracking-widest mb-4 border-b pb-2"
              style={{ borderColor: "rgba(255,255,255,0.2)" }}
            >
              Interests
            </h3>
            <div className="flex flex-wrap gap-2">
              {resumeData.interests.map((interest, index) => (
                <span key={index} className="text-sm opacity-80">
                  • {interest}
                </span>
              ))}
            </div>
          </div>
        
      )}
  
      {/* Main Content */}
      <div className="flex-1 p-10 flex flex-col gap-8">
        {/* Header */}
        <div className="border-b-2 pb-6" style={{ borderColor: themeColors[1] }}>
          <h1
            className="text-5xl font-serif font-bold mb-2"
            style={{ color: themeColors[4] }}
          >
            {resumeData.profileInfo.fullName}
          </h1>
          <h2
            className="text-xl font-medium tracking-wide uppercase"
            style={{ color: themeColors[3] }}
          >
            {resumeData.profileInfo.designation}
          </h2>
        </div>

        {/* Summary */}
        <div>
          <h3
            className="text-xl font-bold uppercase tracking-wider mb-4 flex items-center gap-2"
            style={{ color: themeColors[4] }}
          >
            <span
              className="w-8 h-1 rounded-full"
              style={{ backgroundColor: themeColors[2] }}
            ></span>
            Profile
          </h3>
          <p className="text-gray-700 leading-relaxed text-justify">
            {resumeData.profileInfo.summary}
          </p>
        </div>

        {/* Experience */}
        <div>
          <h3
            className="text-xl font-bold uppercase tracking-wider mb-6 flex items-center gap-2"
            style={{ color: themeColors[4] }}
          >
            <span
              className="w-8 h-1 rounded-full"
              style={{ backgroundColor: themeColors[2] }}
            ></span>
            Experience
          </h3>
          <div className="flex flex-col gap-8">
            {resumeData.workExperience.map((exp, index) => (
              <div key={index} className="flex gap-4">
                <div className="w-1 bg-gray-200 relative rounded-full">
                  <div
                    className="absolute top-2 -left-1.5 w-4 h-4 rounded-full border-2 bg-white"
                    style={{ borderColor: themeColors[3] }}
                  ></div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-baseline mb-1">
                    <h4
                      className="text-lg font-bold"
                      style={{ color: themeColors[4] }}
                    >
                      {exp.role}
                    </h4>
                    <span
                      className="text-sm font-medium"
                      style={{ color: themeColors[3] }}
                    >
                      {formatYearMonth(exp.startDate)} -{" "}
                      {formatYearMonth(exp.endDate)}
                    </span>
                  </div>
                  <p className="text-base font-semibold text-gray-700 mb-2">
                    {exp.company}
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed text-justify whitespace-pre-wrap">
                    {exp.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Projects */}
        <div>
          <h3
            className="text-xl font-bold uppercase tracking-wider mb-6 flex items-center gap-2"
            style={{ color: themeColors[4] }}
          >
            <span
              className="w-8 h-1 rounded-full"
              style={{ backgroundColor: themeColors[2] }}
            ></span>
            Projects
          </h3>
          <div className="grid grid-cols-1 gap-6">
            {resumeData.projects.map((project, index) => (
              <div
                key={index}
                className="bg-gray-50 p-5 rounded-lg border-l-4"
                style={{ borderColor: themeColors[3] }}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4
                    className="text-lg font-bold"
                    style={{ color: themeColors[4] }}
                  >
                    {project.title}
                  </h4>
                  <div className="flex gap-3">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noreferrer"
                        className="text-gray-500 hover:text-gray-800"
                      >
                        <Github size={16} />
                      </a>
                    )}
                    {project.liveDemo && (
                      <a
                        href={project.liveDemo}
                        target="_blank"
                        rel="noreferrer"
                        className="text-gray-500 hover:text-gray-800"
                      >
                        <Globe size={16} />
                      </a>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {project.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        {resumeData.certifications.length > 0 && (
          <div>
            <h3
              className="text-xl font-bold uppercase tracking-wider mb-4 flex items-center gap-2"
              style={{ color: themeColors[4] }}
            >
              <span
                className="w-8 h-1 rounded-full"
                style={{ backgroundColor: themeColors[2] }}
              ></span>
              Certifications
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {resumeData.certifications.map((cert, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Award
                    size={18}
                    className="mt-1 shrink-0"
                    style={{ color: themeColors[3] }}
                  />
                  <div>
                    <p
                      className="font-bold text-sm"
                      style={{ color: themeColors[4] }}
                    >
                      {cert.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {cert.issuer} | {cert.year}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateFour;
