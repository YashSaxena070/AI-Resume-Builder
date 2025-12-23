import React, { useRef, useState, useEffect } from "react";
import {
  MapPin,
  Mail,
  Phone,
  Linkedin,
  Github,
  Globe,
  ExternalLink,
} from "lucide-react";

const DEFAULT_THEME = [
  "#f8f9fa", // Background
  "#e9ecef", // Light Border
  "#adb5bd", // Dark Border
  "#495057", // Subtext
  "#212529", // Text
];

const formatYearMonth = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
};

const TemplateFive = ({ resumeData, colorPalette, containerWidth }) => {
  const themeColors = colorPalette?.length > 0 ? colorPalette : DEFAULT_THEME;
  const resumeRef = useRef(null);

  return (
    <div
      ref={resumeRef}
      className="bg-white min-h-[1000px] relative p-16"
      style={{
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Header - Centered */}
      <div className="flex flex-col items-center mb-12 text-center">
        <h1
          className="text-4xl font-light tracking-[0.2em] uppercase mb-3"
          style={{ color: themeColors[4] }}
        >
          {resumeData.profileInfo.fullName}
        </h1>
        <h2
          className="text-sm font-medium tracking-[0.3em] uppercase mb-6"
          style={{ color: themeColors[3] }}
        >
          {resumeData.profileInfo.designation}
        </h2>

        {/* Contact Info - Minimal Line */}
        <div className="flex flex-wrap justify-center gap-6 text-xs tracking-wider text-gray-500">
          <span className="flex items-center gap-1">
            {resumeData.contactInfo.email}
          </span>
          <span className="w-px h-3 bg-gray-300"></span>
          <span className="flex items-center gap-1">
            {resumeData.contactInfo.phone}
          </span>
          <span className="w-px h-3 bg-gray-300"></span>
          <span className="flex items-center gap-1">
            {resumeData.contactInfo.location}
          </span>
          {resumeData.contactInfo.linkedin && (
            <>
              <span className="w-px h-3 bg-gray-300"></span>
              <a
                href={resumeData.contactInfo.linkedin}
                target="_blank"
                rel="noreferrer"
                className="hover:text-black transition-colors"
              >
                LinkedIn
              </a>
            </>
          )}
          {resumeData.contactInfo.github && (
            <>
              <span className="w-px h-3 bg-gray-300"></span>
              <a
                href={resumeData.contactInfo.github}
                target="_blank"
                rel="noreferrer"
                className="hover:text-black transition-colors"
              >
                GitHub
              </a>
            </>
          )}
          {resumeData.contactInfo.website && (
            <>
              <span className="w-px h-3 bg-gray-300"></span>
              <a
                href={resumeData.contactInfo.website}
                target="_blank"
                rel="noreferrer"
                className="hover:text-black transition-colors"
              >
                Portfolio
              </a>
            </>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="mb-10">
        <p className="text-sm text-gray-600 leading-7 text-center max-w-2xl mx-auto">
          {resumeData.profileInfo.summary}
        </p>
      </div>

      {/* Skills - Centered Tags */}
      <div className="mb-12 text-center">
        <div className="flex flex-wrap justify-center gap-3">
          {resumeData.skills.map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1 border text-xs tracking-wide uppercase"
              style={{
                borderColor: themeColors[2],
                color: themeColors[4],
              }}
            >
              {skill.name}
            </span>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div className="mb-12">
        <h3
          className="text-xs font-bold uppercase tracking-[0.2em] mb-8 border-b pb-2"
          style={{ color: themeColors[4], borderColor: themeColors[1] }}
        >
          Experience
        </h3>
        <div className="flex flex-col gap-10">
          {resumeData.workExperience.map((exp, index) => (
            <div key={index} className="grid grid-cols-12 gap-6">
              <div className="col-span-3 text-right">
                <p className="text-xs font-medium text-gray-500 mt-1">
                  {formatYearMonth(exp.startDate)} — {formatYearMonth(exp.endDate)}
                </p>
              </div>
              <div className="col-span-9">
                <h4
                  className="text-lg font-normal mb-1"
                  style={{ color: themeColors[4] }}
                >
                  {exp.role}
                </h4>
                <p
                  className="text-sm font-medium mb-3 uppercase tracking-wide"
                  style={{ color: themeColors[3] }}
                >
                  {exp.company}
                </p>
                <p className="text-sm text-gray-600 leading-relaxed text-justify">
                  {exp.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Projects */}
      <div className="mb-12">
        <h3
          className="text-xs font-bold uppercase tracking-[0.2em] mb-8 border-b pb-2"
          style={{ color: themeColors[4], borderColor: themeColors[1] }}
        >
          Selected Projects
        </h3>
        <div className="grid grid-cols-2 gap-8">
          {resumeData.projects.map((project, index) => (
            <div key={index}>
              <div className="flex justify-between items-baseline mb-2">
                <h4
                  className="font-medium text-base"
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
                      className="text-gray-400 hover:text-black"
                    >
                      <Github size={14} />
                    </a>
                  )}
                  {project.liveDemo && (
                    <a
                      href={project.liveDemo}
                      target="_blank"
                      rel="noreferrer"
                      className="text-gray-400 hover:text-black"
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                {project.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Education & Certifications Grid */}
      <div className="grid grid-cols-2 gap-12">
        {/* Education */}
        <div>
          <h3
            className="text-xs font-bold uppercase tracking-[0.2em] mb-6 border-b pb-2"
            style={{ color: themeColors[4], borderColor: themeColors[1] }}
          >
            Education
          </h3>
          <div className="flex flex-col gap-4">
            {resumeData.education.map((edu, index) => (
              <div key={index}>
                <h4 className="text-sm font-bold" style={{ color: themeColors[4] }}>
                  {edu.degree}
                </h4>
                <p className="text-xs text-gray-600 mb-1">{edu.institution}</p>
                <p className="text-xs text-gray-400">
                  {formatYearMonth(edu.startDate)} - {formatYearMonth(edu.endDate)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        {resumeData.certifications.length > 0 && (
          <div>
            <h3
              className="text-xs font-bold uppercase tracking-[0.2em] mb-6 border-b pb-2"
              style={{ color: themeColors[4], borderColor: themeColors[1] }}
            >
              Certifications
            </h3>
            <div className="flex flex-col gap-3">
              {resumeData.certifications.map((cert, index) => (
                <div key={index} className="flex justify-between items-baseline">
                  <span
                    className="text-sm font-medium"
                    style={{ color: themeColors[4] }}
                  >
                    {cert.title}
                  </span>
                  <span className="text-xs text-gray-400">
                    {cert.year}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateFive;
