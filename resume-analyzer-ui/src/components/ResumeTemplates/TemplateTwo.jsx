import React, { useEffect, useRef, useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Rss,
  Github,
  User,
  Linkedin,
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

const TemplateTwo = ({ resumeData, colorPalette, containerWidth }) => {
  const themeColors = colorPalette?.length > 0 ? colorPalette : DEFAULT_THEME;
  const resumeRef = useRef(null);

  return (
     <div
      ref={resumeRef}
      className="bg-white min-h-[1000px]"
     >

      <div className="grid grid-cols-12 min-h-full">
        {/* Left Sidebar */}
        <div className="col-span-4 p-8 flex flex-col gap-6" style={{ backgroundColor: themeColors[0] }}>
            {/* Profile Image */}
            <div className="flex justify-center mb-4">
                <div
                    className="w-40 h-40 rounded-full border-4 border-white shadow-lg overflow-hidden flex items-center justify-center bg-white"
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

            {/* Contact Info */}
            <div className="flex flex-col gap-4">
                <Title text="Contact" color={themeColors[3]} />
                <div className="flex flex-col gap-3">
                    <ContactInfo icon={<Mail size={16} />} iconBG="transparent" value={resumeData.contactInfo.email} textStyle="text-xs break-all" />
                    <ContactInfo icon={<Phone size={16} />} iconBG="transparent" value={resumeData.contactInfo.phone} textStyle="text-xs" />
                    <ContactInfo icon={<MapPin size={16} />} iconBG="transparent" value={resumeData.contactInfo.location} textStyle="text-xs" />
                    {resumeData.contactInfo.linkedin && (
                        <ContactInfo icon={<Linkedin size={16} />} iconBG="transparent" value={resumeData.contactInfo.linkedin} textStyle="text-xs break-all" />
                    )}
                    {resumeData.contactInfo.website && (
                        <ContactInfo icon={<Rss size={16} />} iconBG="transparent" value={resumeData.contactInfo.website} textStyle="text-xs break-all" />
                    )}
                </div>
            </div>

            {/* Skills */}
            <div>
                <Title text="Skills" color={themeColors[3]} />
                <div className="flex flex-wrap gap-2 mt-2">
                    {resumeData.skills.map((skill, index) => (
                        <div key={index} className="w-full">
                            <div className="flex justify-between text-xs font-medium mb-1">
                                <span>{skill.name}</span>
                                {/* <span>{skill.rating}%</span> */}
                            </div>
                            <div className="w-full h-1.5 bg-white rounded-full overflow-hidden">
                                <div 
                                    className="h-full rounded-full" 
                                    style={{ width: `${skill.rating || 0}%`, backgroundColor: themeColors[3] }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Languages */}
            <div>
                <Title text="Languages" color={themeColors[3]} />
                <div className="flex flex-col gap-2 mt-2">
                    {resumeData.languages.map((lang, index) => (
                        <div key={index} className="flex justify-between text-xs">
                            <span font-medium>{lang.name}</span>
                            <span className="text-gray-500">{lang.rating ? "Fluent" : ""}</span>
                        </div>
                    ))}
                </div>
            </div>

             {/* Certifications - Moved to sidebar for better balance if space permits, else keep in main */}
             <div>
                <Title text="Certifications" color={themeColors[3]} />
                <div className="flex flex-col gap-3 mt-2">
                    {resumeData.certifications.map((cert, index) => (
                        <div key={index} className="text-xs">
                            <p className="font-bold">{cert.title}</p>
                            <p className="text-gray-600">{cert.issuer} | {cert.year}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Right Main Content */}
        <div className="col-span-8 p-8">
            {/* Header Info */}
            <div className="mb-8 border-b-2 pb-5" style={{ borderColor: themeColors[1] }}>
                <h1 className="text-4xl font-bold uppercase tracking-wide mb-2" style={{ color: themeColors[4] }}>
                    {resumeData.profileInfo.fullName}
                </h1>
                <h2 className="text-xl font-medium tracking-wider" style={{ color: themeColors[3] }}>
                    {resumeData.profileInfo.designation}
                </h2>
            </div>

            {/* Summary */}
            <div className="mb-8">
                <Title text="About Me" color={themeColors[3]} />
                <p className="text-sm text-gray-700 leading-relaxed text-justify break-words whitespace-pre-wrap mt-3">
                    {resumeData.profileInfo.summary}
                </p>
            </div>

            {/* Experience */}
            <div className="mb-8">
                <Title text="Work Experience" color={themeColors[3]} />
                <div className="flex flex-col gap-6 mt-4">
                    {resumeData.workExperience.map((data, index) => (
                        <div key={index} className="relative pl-4 border-l-2" style={{ borderColor: themeColors[1] }}>
                            <h3 className="text-lg font-bold" style={{ color: themeColors[4] }}>{data.role}</h3>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-semibold text-gray-600">{data.company}</span>
                                <span className="text-xs font-medium px-2 py-1 rounded bg-gray-100">
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
            <div className="mb-8">
                <Title text="Projects" color={themeColors[3]} />
                <div className="grid grid-cols-1 gap-4 mt-4">
                    {resumeData.projects.map((project, index) => (
                        <div key={index} className="p-4 rounded-lg border border-gray-100 bg-gray-50">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold" style={{ color: themeColors[4] }}>{project.title}</h3>
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

            {/* Education */}
            <div>
                <Title text="Education" color={themeColors[3]} />
                <div className="flex flex-col gap-4 mt-4">
                    {resumeData.education.map((edu, index) => (
                        <div key={index} className="flex justify-between items-start">
                            <div>
                                <h4 className="font-bold text-sm" style={{ color: themeColors[4] }}>{edu.degree}</h4>
                                <p className="text-xs text-gray-600">{edu.institution}</p>
                            </div>
                            <span className="text-xs font-medium text-gray-500">
                                {formatYearMonth(edu.startDate)} - {formatYearMonth(edu.endDate)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateTwo;
