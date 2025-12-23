import React, { useRef, useState, useEffect } from "react";
import {
  MapPin,
  Mail,
  Phone,
  Linkedin,
  Github,
  Globe,
  Code,
  Terminal,
  Cpu,
  Database,
} from "lucide-react";

const DEFAULT_THEME = [
  "#f1f5f9", // Background
  "#e2e8f0", // Borders
  "#94a3b8", // Muted
  "#475569", // Subtext
  "#0f172a", // Text/Dark
];

const formatYearMonth = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
};

const TemplateSix = ({ resumeData, colorPalette, containerWidth }) => {
  const themeColors = colorPalette?.length > 0 ? colorPalette : DEFAULT_THEME;
  const resumeRef = useRef(null);

  return (
    <div
      ref={resumeRef}
      className="bg-white min-h-[1000px] relative"
    >
      {/* Dark Header */}
      <div
        className="p-10 text-white"
        style={{ backgroundColor: themeColors[4] }}
      >
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-5xl font-bold tracking-tight mb-2">
              {resumeData.profileInfo.fullName}
            </h1>
            <h2
              className="text-xl font-mono"
              style={{ color: themeColors[2] }}
            >
              &lt;{resumeData.profileInfo.designation} /&gt;
            </h2>
          </div>
          <div className="flex flex-col gap-2 text-sm text-right">
            <div className="flex items-center justify-end gap-2">
              <span>{resumeData.contactInfo.email}</span>
              <Mail size={14} style={{ color: themeColors[2] }} />
            </div>
            <div className="flex items-center justify-end gap-2">
              <span>{resumeData.contactInfo.phone}</span>
              <Phone size={14} style={{ color: themeColors[2] }} />
            </div>
            <div className="flex items-center justify-end gap-2">
              <span>{resumeData.contactInfo.location}</span>
              <MapPin size={14} style={{ color: themeColors[2] }} />
            </div>
            <div className="flex gap-4 mt-2 justify-end">
              {resumeData.contactInfo.github && (
                <a
                  href={resumeData.contactInfo.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Github size={18} className="hover:text-blue-400 transition" />
                </a>
              )}
              {resumeData.contactInfo.linkedin && (
                <a
                  href={resumeData.contactInfo.linkedin}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Linkedin size={18} className="hover:text-blue-400 transition" />
                </a>
              )}
              {resumeData.contactInfo.website && (
                <a
                  href={resumeData.contactInfo.website}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Globe size={18} className="hover:text-blue-400 transition" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-10 grid grid-cols-12 gap-8">
        {/* Left Column - Skills & Tech */}
        <div className="col-span-4 flex flex-col gap-8">
          {/* Skills Panel */}
          <div
            className="p-6 rounded-lg border-2"
            style={{
              borderColor: themeColors[1],
              backgroundColor: themeColors[0],
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Terminal size={20} style={{ color: themeColors[4] }} />
              <h3 className="font-bold text-lg" style={{ color: themeColors[4] }}>
                Technical Skills
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {resumeData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 rounded text-xs font-mono font-semibold"
                  style={{
                    backgroundColor: themeColors[4],
                    color: "white",
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
              className="font-bold text-lg mb-4 border-b-2 pb-2 inline-block"
              style={{ borderColor: themeColors[3], color: themeColors[4] }}
            >
              Education
            </h3>
            <div className="flex flex-col gap-4">
              {resumeData.education.map((edu, index) => (
                <div key={index}>
                  <h4 className="font-bold text-sm">{edu.degree}</h4>
                  <p className="text-xs text-gray-600">{edu.institution}</p>
                  <p className="text-xs text-gray-500 font-mono mt-1">
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
                className="font-bold text-lg mb-4 border-b-2 pb-2 inline-block"
                style={{ borderColor: themeColors[3], color: themeColors[4] }}
              >
                Certifications
              </h3>
              <div className="flex flex-col gap-3">
                {resumeData.certifications.map((cert, index) => (
                  <div key={index} className="text-sm">
                    <p className="font-semibold">{cert.title}</p>
                    <p className="text-xs text-gray-500">
                      {cert.issuer} • {cert.year}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Experience & Projects */}
        <div className="col-span-8 flex flex-col gap-8">
          {/* Summary */}
          <div className="bg-gray-50 p-4 border-l-4" style={{ borderColor: themeColors[3] }}>
            <p className="text-sm text-gray-700 leading-relaxed font-medium">
              {resumeData.profileInfo.summary}
            </p>
          </div>

          {/* Experience */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Cpu size={24} style={{ color: themeColors[4] }} />
              <h3 className="text-2xl font-bold" style={{ color: themeColors[4] }}>
                Experience
              </h3>
            </div>
            
            <div className="flex flex-col gap-8">
              {resumeData.workExperience.map((exp, index) => (
                <div key={index} className="relative">
                  <div className="flex justify-between items-baseline mb-2">
                    <h4 className="text-xl font-bold" style={{ color: themeColors[4] }}>
                      {exp.role}
                    </h4>
                    <span className="font-mono text-xs font-semibold px-2 py-1 rounded bg-gray-100">
                      {formatYearMonth(exp.startDate)} - {formatYearMonth(exp.endDate)}
                    </span>
                  </div>
                  <h5 className="text-base font-semibold mb-3" style={{ color: themeColors[3] }}>
                    {exp.company}
                  </h5>
                  <p className="text-sm text-gray-600 leading-relaxed text-justify whitespace-pre-wrap">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Database size={24} style={{ color: themeColors[4] }} />
              <h3 className="text-2xl font-bold" style={{ color: themeColors[4] }}>
                Projects
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {resumeData.projects.map((project, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  style={{ borderColor: themeColors[1] }}
                >
                  <div className="flex justify-between items-start mb-2">
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
      </div>
    </div>
  );
};

export default TemplateSix;
