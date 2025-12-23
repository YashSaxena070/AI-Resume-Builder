import React, { useRef, useState, useEffect } from "react";
import {
  MapPin,
  Mail,
  Phone,
  Linkedin,
  Github,
  Globe,
  Rocket,
  Zap,
  Target,
} from "lucide-react";

const DEFAULT_THEME = [
  "#fff7ed", // Background
  "#ffedd5", // Light Accent
  "#f97316", // Primary Accent
  "#c2410c", // Dark Accent
  "#7c2d12", // Text
];

const formatYearMonth = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
};

const TemplateEight = ({ resumeData, colorPalette, containerWidth }) => {
  const themeColors = colorPalette?.length > 0 ? colorPalette : DEFAULT_THEME;
  const resumeRef = useRef(null);

  return (
    <div
      ref={resumeRef}
      className="bg-white min-h-[1000px] relative p-12"
    >
      {/* Header */}
      <div className="flex justify-between items-end border-b-4 pb-6 mb-10" style={{ borderColor: themeColors[2] }}>
        <div>
          <h1
            className="text-6xl font-black tracking-tighter mb-2"
            style={{ color: themeColors[4] }}
          >
            {resumeData.profileInfo.fullName}
          </h1>
          <div className="flex items-center gap-3">
            <span 
                className="px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider text-white"
                style={{ backgroundColor: themeColors[2] }}
            >
                {resumeData.profileInfo.designation}
            </span>
            <div className="h-px flex-1 bg-gray-200"></div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 text-sm font-medium text-gray-600">
            <div className="flex items-center gap-2">
                {resumeData.contactInfo.email} <Mail size={14} />
            </div>
            <div className="flex items-center gap-2">
                {resumeData.contactInfo.phone} <Phone size={14} />
            </div>
            <div className="flex items-center gap-2">
                {resumeData.contactInfo.location} <MapPin size={14} />
            </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-10">
        {/* Main Column */}
        <div className="col-span-8 flex flex-col gap-10">
            {/* Summary */}
            <div>
                <h3 className="text-xl font-black uppercase mb-4 flex items-center gap-2" style={{ color: themeColors[4] }}>
                    <Zap size={20} style={{ color: themeColors[2] }} /> About
                </h3>
                <p className="text-base text-gray-700 leading-relaxed font-medium">
                    {resumeData.profileInfo.summary}
                </p>
            </div>

            {/* Experience */}
            <div>
                <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-2" style={{ color: themeColors[4] }}>
                    <Rocket size={20} style={{ color: themeColors[2] }} /> Experience
                </h3>
                <div className="flex flex-col gap-8">
                    {resumeData.workExperience.map((exp, index) => (
                        <div key={index} className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="text-xl font-bold" style={{ color: themeColors[4] }}>{exp.role}</h4>
                                <span className="text-xs font-bold px-2 py-1 rounded bg-white border shadow-sm">
                                    {formatYearMonth(exp.startDate)} - {formatYearMonth(exp.endDate)}
                                </span>
                            </div>
                            <h5 className="text-base font-bold mb-3" style={{ color: themeColors[2] }}>{exp.company}</h5>
                            <p className="text-sm text-gray-600 leading-relaxed text-justify">
                                {exp.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Projects */}
            <div>
                <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-2" style={{ color: themeColors[4] }}>
                    <Target size={20} style={{ color: themeColors[2] }} /> Projects
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    {resumeData.projects.map((project, index) => (
                        <div key={index} className="border-2 rounded-xl p-4 hover:shadow-md transition-all" style={{ borderColor: themeColors[1] }}>
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-lg" style={{ color: themeColors[4] }}>{project.title}</h4>
                                <div className="flex gap-2">
                                    {project.github && <a href={project.github} target="_blank" rel="noreferrer"><Github size={16} className="text-gray-400 hover:text-black"/></a>}
                                    {project.liveDemo && <a href={project.liveDemo} target="_blank" rel="noreferrer"><Globe size={16} className="text-gray-400 hover:text-blue-600"/></a>}
                                </div>
                            </div>
                            <p className="text-xs text-gray-600 leading-relaxed">
                                {project.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Sidebar */}
        <div className="col-span-4 flex flex-col gap-10">
            {/* Links */}
            <div className="flex gap-4 justify-center">
                {resumeData.contactInfo.linkedin && (
                    <a href={resumeData.contactInfo.linkedin} target="_blank" rel="noreferrer" className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors">
                        <Linkedin size={20} style={{ color: themeColors[4] }} />
                    </a>
                )}
                {resumeData.contactInfo.github && (
                    <a href={resumeData.contactInfo.github} target="_blank" rel="noreferrer" className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors">
                        <Github size={20} style={{ color: themeColors[4] }} />
                    </a>
                )}
                {resumeData.contactInfo.website && (
                    <a href={resumeData.contactInfo.website} target="_blank" rel="noreferrer" className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors">
                        <Globe size={20} style={{ color: themeColors[4] }} />
                    </a>
                )}
            </div>

            {/* Skills */}
            <div>
                <h3 className="text-lg font-black uppercase mb-4 border-b-2 pb-2" style={{ color: themeColors[4], borderColor: themeColors[1] }}>
                    Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                    {resumeData.skills.map((skill, index) => (
                        <span 
                            key={index} 
                            className="px-3 py-1.5 rounded-lg text-sm font-bold"
                            style={{ 
                                backgroundColor: themeColors[0], 
                                color: themeColors[3],
                                border: `1px solid ${themeColors[1]}`
                            }}
                        >
                            {skill.name}
                        </span>
                    ))}
                </div>
            </div>

            {/* Education */}
            <div>
                <h3 className="text-lg font-black uppercase mb-4 border-b-2 pb-2" style={{ color: themeColors[4], borderColor: themeColors[1] }}>
                    Education
                </h3>
                <div className="flex flex-col gap-6">
                    {resumeData.education.map((edu, index) => (
                        <div key={index}>
                            <h4 className="font-bold text-base" style={{ color: themeColors[4] }}>{edu.degree}</h4>
                            <p className="text-sm font-medium text-gray-600">{edu.institution}</p>
                            <span className="text-xs font-bold text-gray-400 mt-1 block">
                                {formatYearMonth(edu.startDate)} - {formatYearMonth(edu.endDate)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Certifications */}
            {resumeData.certifications.length > 0 && (
                <div>
                    <h3 className="text-lg font-black uppercase mb-4 border-b-2 pb-2" style={{ color: themeColors[4], borderColor: themeColors[1] }}>
                        Certifications
                    </h3>
                    <div className="flex flex-col gap-3">
                        {resumeData.certifications.map((cert, index) => (
                            <div key={index} className="flex items-start gap-2">
                                <div className="mt-1.5 w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: themeColors[2] }} />
                                <div>
                                    <p className="text-sm font-bold leading-tight" style={{ color: themeColors[4] }}>{cert.title}</p>
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

export default TemplateEight;
