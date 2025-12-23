import React, { useRef, useState, useEffect } from "react";
import {
  MapPin,
  Mail,
  Phone,
  Linkedin,
  Github,
  Globe,
  Palette,
  Layers,
  PenTool,
  User,
  Award,
} from "lucide-react";

const DEFAULT_THEME = [
  "#fff1f2", // Background
  "#fecdd3", // Light Accent
  "#f43f5e", // Primary Accent
  "#be123c", // Dark Accent
  "#881337", // Text
];

const formatYearMonth = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
};

const TemplateSeven = ({ resumeData, colorPalette, containerWidth }) => {
  const themeColors = colorPalette?.length > 0 ? colorPalette : DEFAULT_THEME;
  const resumeRef = useRef(null);

  return (
    <div
      ref={resumeRef}
      className="bg-white min-h-[1000px] relative overflow-hidden"
    >
      {/* Artistic Background Element */}
      <div
        className="absolute top-0 right-0 w-[40%] h-full z-0"
        style={{ backgroundColor: themeColors[0] }}
      ></div>
      <div
        className="absolute top-0 right-[40%] w-2 h-full z-0 opacity-50"
        style={{ backgroundColor: themeColors[1] }}
      ></div>

      <div className="relative z-10 flex min-h-[1000px]">
        {/* Left Column (Main) */}
        <div className="w-[60%] p-10 pr-16 flex flex-col gap-10">
          {/* Header */}
          <div>
            <h1
              className="text-6xl font-black tracking-tighter leading-none mb-4"
              style={{ color: themeColors[4] }}
            >
              {(resumeData?.profileInfo?.fullName || "Your Name").split(" ")[0]}
              <br />
              <span style={{ color: themeColors[2] }}>
                {(resumeData?.profileInfo?.fullName || "Your Name").split(" ").slice(1).join(" ")}
              </span>
            </h1>
            <h2
              className="text-xl font-bold uppercase tracking-widest"
              style={{ color: themeColors[3] }}
            >
              {resumeData.profileInfo.designation}
            </h2>
          </div>

          {/* Summary */}
          <div>
            <p className="text-base text-gray-600 leading-relaxed font-medium">
              {resumeData.profileInfo.summary}
            </p>
          </div>

          {/* Experience */}
          <div>
            <h3
              className="text-2xl font-black uppercase mb-6 flex items-center gap-3"
              style={{ color: themeColors[4] }}
            >
              <PenTool size={24} /> Experience
            </h3>
            <div className="flex flex-col gap-8">
              {resumeData.workExperience.map((exp, index) => (
                <div key={index}>
                  <h4
                    className="text-xl font-bold"
                    style={{ color: themeColors[4] }}
                  >
                    {exp.role}
                  </h4>
                  <div className="flex justify-between items-center mb-2">
                    <span
                      className="text-sm font-bold"
                      style={{ color: themeColors[2] }}
                    >
                      {exp.company}
                    </span>
                    <span className="text-xs font-medium text-gray-400">
                      {formatYearMonth(exp.startDate)} -{" "}
                      {formatYearMonth(exp.endDate)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed text-justify">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div>
            <h3
              className="text-2xl font-black uppercase mb-6 flex items-center gap-3"
              style={{ color: themeColors[4] }}
            >
              <Layers size={24} /> Projects
            </h3>
            <div className="grid grid-cols-1 gap-6">
              {resumeData.projects.map((project, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-4 rounded-xl border-2 border-transparent hover:border-current transition-colors"
                  style={{ borderColor: themeColors[1] }}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-lg" style={{ color: themeColors[4] }}>
                      {project.title}
                    </h4>
                    <div className="flex gap-2">
                        {project.github && <a href={project.github} target="_blank" rel="noreferrer"><Github size={16} className="text-gray-400 hover:text-black"/></a>}
                        {project.liveDemo && <a href={project.liveDemo} target="_blank" rel="noreferrer"><Globe size={16} className="text-gray-400 hover:text-blue-600"/></a>}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{project.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (Sidebar) */}
        <div className="w-[40%] p-10 pl-12 flex flex-col gap-10">
          {/* Profile Image (Overlapping) */}
          <div className="mb-4">
            <div className="w-48 h-48 rounded-full border-8 border-white shadow-2xl overflow-hidden bg-white -ml-20">
              {resumeData.profileInfo.profileImg ||
              resumeData.profileInfo.profilePreviewUrl ? (
                <img
                  src={
                    resumeData.profileInfo.profileImg ||
                    resumeData.profileInfo.profilePreviewUrl
                  }
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ backgroundColor: themeColors[1] }}
                >
                  <User size={64} style={{ color: themeColors[4] }} />
                </div>
              )}
            </div>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Mail size={18} style={{ color: themeColors[3] }} />
              <span className="text-sm font-medium text-gray-700">
                {resumeData.contactInfo.email}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={18} style={{ color: themeColors[3] }} />
              <span className="text-sm font-medium text-gray-700">
                {resumeData.contactInfo.phone}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin size={18} style={{ color: themeColors[3] }} />
              <span className="text-sm font-medium text-gray-700">
                {resumeData.contactInfo.location}
              </span>
            </div>
            <div className="flex gap-4 mt-2">
              {resumeData.contactInfo.linkedin && (
                <a
                  href={resumeData.contactInfo.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full bg-white shadow-md hover:scale-110 transition-transform"
                >
                  <Linkedin size={20} style={{ color: themeColors[3] }} />
                </a>
              )}
              {resumeData.contactInfo.github && (
                <a
                  href={resumeData.contactInfo.github}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full bg-white shadow-md hover:scale-110 transition-transform"
                >
                  <Github size={20} style={{ color: themeColors[3] }} />
                </a>
              )}
              {resumeData.contactInfo.website && (
                <a
                  href={resumeData.contactInfo.website}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full bg-white shadow-md hover:scale-110 transition-transform"
                >
                  <Globe size={20} style={{ color: themeColors[3] }} />
                </a>
              )}
            </div>
          </div>

          {/* Skills */}
          <div>
            <h3
              className="text-xl font-black uppercase mb-4"
              style={{ color: themeColors[4] }}
            >
              Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {resumeData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm bg-white"
                  style={{
                    color: themeColors[3],
                    border: `2px solid ${themeColors[1]}`,
                  }}
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>

          {/* Education */}
          <div>
            <h3
              className="text-xl font-black uppercase mb-4"
              style={{ color: themeColors[4] }}
            >
              Education
            </h3>
            <div className="flex flex-col gap-6">
              {resumeData.education.map((edu, index) => (
                <div key={index} className="relative pl-4 border-l-4" style={{ borderColor: themeColors[2] }}>
                  <h4 className="font-bold text-base" style={{ color: themeColors[4] }}>
                    {edu.degree}
                  </h4>
                  <p className="text-sm font-medium text-gray-600">
                    {edu.institution}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatYearMonth(edu.startDate)} -{" "}
                    {formatYearMonth(edu.endDate)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          {resumeData.certifications.length > 0 && (
             <div>
                <h3
                  className="text-xl font-black uppercase mb-4"
                  style={{ color: themeColors[4] }}
                >
                  Awards
                </h3>
                <div className="flex flex-col gap-3">
                  {resumeData.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <Award size={16} style={{ color: themeColors[2] }} />
                        <div>
                            <p className="text-sm font-bold" style={{ color: themeColors[4] }}>{cert.title}</p>
                            <p className="text-xs text-gray-500">{cert.issuer} | {cert.year}</p>
                        </div>
                    </div>
                  ))}
                </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateSeven;
