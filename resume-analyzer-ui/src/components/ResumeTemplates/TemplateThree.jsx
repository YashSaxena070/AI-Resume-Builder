import React, { useEffect, useRef, useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Rss,
  Github,
  User,
  Linkedin,
  Briefcase,
  GraduationCap,
  Code,
  Award,
  Heart,
  LayoutTemplate,
} from "lucide-react";
import ContactInfo from "../ResumeSections/ContactInfo";
import EducationInfo from "../ResumeSections/EducationInfo";
import { formatYearMonth } from "../../utils/helper";
import LanguageSection from "../ResumeSections/LanguageSection";
import WorkExperience from "../ResumeSections/WorkExperience";
import ProjectInfo from "../ResumeSections/ProjectInfo";
import SkillSection from "../ResumeSections/SkillSection";
import CertificationInfo from "../ResumeSections/CertificationInfo";

const DEFAULT_THEME = ["#EBFDFF", "#A1F4FD", "#CEFAFE", "#00B8DB", "#4A5565"];

const Title = ({ text, color }) => {
  return (
    <div className="relative w-fit mb-2.5">
      <span
        className="absolute bottom-0 left-0 w-full h-2"
        style={{ backgroundColor: color }}
      ></span>
      <h2 className={`relative text-sm font-bold`}>{text}</h2>
    </div>
  );
};

const TemplateThree = ({ resumeData, colorPalette, containerWidth }) => {
  const themeColors = colorPalette?.length > 0 ? colorPalette : DEFAULT_THEME;
  const resumeRef = useRef(null);


  return (
    <div
      ref={resumeRef}
      className="bg-white min-h-[1000px] relative overflow-hidden"
    >
        {/* Geometric Header Background */}
        <div 
            className="absolute top-0 left-0 w-full h-64 z-0" 
            style={{ 
                backgroundColor: themeColors[0],
                clipPath: "polygon(0 0, 100% 0, 100% 80%, 0 100%)"
            }} 
        />
        
        <div className="relative z-10 px-10 pt-10">
            {/* Header Content */}
            <div className="flex justify-between items-center mb-10">
                <div className="flex flex-col gap-2">
                    <h1 className="text-5xl font-black tracking-tighter" style={{ color: themeColors[4] }}>
                        {resumeData.profileInfo.fullName}
                    </h1>
                    <h2 className="text-xl font-bold uppercase tracking-widest" style={{ color: themeColors[3] }}>
                        {resumeData.profileInfo.designation}
                    </h2>
                    <div className="flex gap-4 mt-2">
                        {resumeData.contactInfo.linkedin && (
                            <a href={resumeData.contactInfo.linkedin} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-white shadow-sm hover:shadow-md transition-shadow">
                                <Linkedin size={18} style={{ color: themeColors[3] }} />
                            </a>
                        )}
                        {resumeData.contactInfo.github && (
                            <a href={resumeData.contactInfo.github} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-white shadow-sm hover:shadow-md transition-shadow">
                                <Github size={18} style={{ color: themeColors[3] }} />
                            </a>
                        )}
                        {resumeData.contactInfo.website && (
                            <a href={resumeData.contactInfo.website} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-white shadow-sm hover:shadow-md transition-shadow">
                                <Rss size={18} style={{ color: themeColors[3] }} />
                            </a>
                        )}
                    </div>
                </div>

                <div 
                    className="w-40 h-40 rounded-full border-4 border-white shadow-xl overflow-hidden flex items-center justify-center bg-white"
                >
                    {resumeData.profileInfo.profileImg || resumeData.profileInfo.profilePreviewUrl ? (
                        <img
                        src={resumeData.profileInfo.profileImg || resumeData.profileInfo.profilePreviewUrl}
                        className="w-full h-full object-cover"
                        />
                    ) : (
                        <User size={60} style={{ color: themeColors[4] }} />
                    )}
                </div>
            </div>

            {/* Contact Bar */}
            <div className="flex justify-between py-4 border-y border-gray-200 mb-8">
                 <div className="flex items-center gap-2">
                    <Mail size={16} style={{ color: themeColors[3] }} />
                    <span className="text-sm font-medium text-gray-600">{resumeData.contactInfo.email}</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <Phone size={16} style={{ color: themeColors[3] }} />
                    <span className="text-sm font-medium text-gray-600">{resumeData.contactInfo.phone}</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <MapPin size={16} style={{ color: themeColors[3] }} />
                    <span className="text-sm font-medium text-gray-600">{resumeData.contactInfo.location}</span>
                 </div>
            </div>

            <div className="grid grid-cols-12 gap-10">
                {/* Left Column */}
                <div className="col-span-7 flex flex-col gap-8">
                    {/* Summary */}
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-lg" style={{ backgroundColor: themeColors[1] }}>
                                <User size={20} style={{ color: themeColors[4] }} />
                            </div>
                            <h3 className="text-xl font-bold" style={{ color: themeColors[4] }}>About Me</h3>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed text-justify break-words whitespace-pre-wrap">
                            {resumeData.profileInfo.summary}
                        </p>
                    </div>

                    {/* Experience */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg" style={{ backgroundColor: themeColors[1] }}>
                                <Briefcase size={20} style={{ color: themeColors[4] }} />
                            </div>
                            <h3 className="text-xl font-bold" style={{ color: themeColors[4] }}>Experience</h3>
                        </div>
                        
                        <div className="border-l-2 ml-3 space-y-8" style={{ borderColor: themeColors[1] }}>
                            {resumeData.workExperience.map((data, index) => (
                                <div key={index} className="relative pl-8">
                                    <div 
                                        className="absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 bg-white"
                                        style={{ borderColor: themeColors[3] }}
                                    />
                                    <h4 className="text-lg font-bold" style={{ color: themeColors[4] }}>{data.role}</h4>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-semibold" style={{ color: themeColors[3] }}>{data.company}</span>
                                        <span className="text-xs text-gray-500 font-medium">
                                            {formatYearMonth(data.startDate)} - {formatYearMonth(data.endDate)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 text-justify break-words whitespace-pre-wrap">
                                        {data.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Projects */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg" style={{ backgroundColor: themeColors[1] }}>
                                <LayoutTemplate size={20} style={{ color: themeColors[4] }} />
                            </div>
                            <h3 className="text-xl font-bold" style={{ color: themeColors[4] }}>Projects</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {resumeData.projects.map((project, index) => (
                                <div key={index} className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:shadow-sm transition-shadow">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold" style={{ color: themeColors[4] }}>{project.title}</h4>
                                        <div className="flex gap-2">
                                            {project.github && <a href={project.github} target="_blank" rel="noreferrer"><Github size={14} /></a>}
                                            {project.liveDemo && <a href={project.liveDemo} target="_blank" rel="noreferrer"><Rss size={14} /></a>}
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-600 break-words whitespace-pre-wrap">{project.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="col-span-5 flex flex-col gap-8">
                    {/* Education */}
                    <div className="bg-gray-50 p-6 rounded-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-white shadow-sm">
                                <GraduationCap size={20} style={{ color: themeColors[4] }} />
                            </div>
                            <h3 className="text-lg font-bold" style={{ color: themeColors[4] }}>Education</h3>
                        </div>
                        <div className="flex flex-col gap-4">
                            {resumeData.education.map((edu, index) => (
                                <div key={index} className="pb-4 border-b border-gray-200 last:border-0 last:pb-0">
                                    <h4 className="font-bold text-sm" style={{ color: themeColors[4] }}>{edu.degree}</h4>
                                    <p className="text-xs font-medium text-gray-600 mb-1">{edu.institution}</p>
                                    <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full inline-block shadow-sm">
                                        {formatYearMonth(edu.startDate)} - {formatYearMonth(edu.endDate)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Skills */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg" style={{ backgroundColor: themeColors[1] }}>
                                <Code size={20} style={{ color: themeColors[4] }} />
                            </div>
                            <h3 className="text-lg font-bold" style={{ color: themeColors[4] }}>Skills</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {resumeData.skills.map((skill, index) => (
                                <span 
                                    key={index} 
                                    className="px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm"
                                    style={{ 
                                        backgroundColor: themeColors[0], 
                                        color: themeColors[4],
                                        border: `1px solid ${themeColors[1]}`
                                    }}
                                >
                                    {skill.name}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Certifications */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg" style={{ backgroundColor: themeColors[1] }}>
                                <Award size={20} style={{ color: themeColors[4] }} />
                            </div>
                            <h3 className="text-lg font-bold" style={{ color: themeColors[4] }}>Certifications</h3>
                        </div>
                        <div className="flex flex-col gap-3">
                            {resumeData.certifications.map((cert, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <div className="mt-1 w-2 h-2 rounded-full" style={{ backgroundColor: themeColors[3] }} />
                                    <div>
                                        <p className="text-sm font-bold" style={{ color: themeColors[4] }}>{cert.title}</p>
                                        <p className="text-xs text-gray-500">{cert.issuer} | {cert.year}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Interests */}
                    {resumeData.interests.length > 0 && resumeData.interests[0] != "" && (
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg" style={{ backgroundColor: themeColors[1] }}>
                                    <Heart size={20} style={{ color: themeColors[4] }} />
                                </div>
                                <h3 className="text-lg font-bold" style={{ color: themeColors[4] }}>Interests</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {resumeData.interests.map((interest, index) => {
                                    if (!interest) return null;
                                    return (
                                        <span 
                                            key={index} 
                                            className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600"
                                        >
                                            {interest}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};

export default TemplateThree;
