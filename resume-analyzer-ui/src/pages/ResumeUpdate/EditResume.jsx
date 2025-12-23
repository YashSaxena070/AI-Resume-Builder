import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchResumeById, updateResume, updateResumeLocal } from "../../redux/resumeSlice";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { generatePDFBlob } from "../../utils/pdfGenerator";
import { ArrowLeft, LayoutTemplate, Palette, Eye, Save, Download, Share2 } from "lucide-react";
import toast from "react-hot-toast";
import EmailPopup from "../../components/Extra/EmailPopup";

// Components
import RenderResume from "../../components/ResumeTemplates/RenderResume";
import ThemeSelector from "./ThemeSelector";
import ProfileInfoForm from "./Forms/ProfileInfoForm";
import EducationDetailsForm from "./Forms/EducationDetailsForm";
import WorkExperienceForm from "./Forms/WorkExperienceForm";
import ProjectsDetailFrom from "./Forms/ProjectsDetailsForm";
import SkillsInfoForm from "./Forms/SkillsInfoForm";
import CertificationInfoFrom from "./Forms/CertificationInfoFrom";
import AdditionalInfoFrom from "./Forms/AdditionalInfoFrom";
import ContactInfoForm from "./Forms/ContactInfoForm";
import StepProgress from "../../components/Extra/StepProgress";

const STEPS = [
  { label: "Profile", component: ProfileInfoForm },
  { label: "Contact", component: ContactInfoForm },
  { label: "Education", component: EducationDetailsForm },
  { label: "Experience", component: WorkExperienceForm },
  { label: "Projects", component: ProjectsDetailFrom },
  { label: "Skills", component: SkillsInfoForm },
  { label: "Certifications", component: CertificationInfoFrom },
  { label: "Additional", component: AdditionalInfoFrom },
];

const EditResume = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { resume, isLoading, error } = useSelector((state) => state.resume);
  
  const [activeStep, setActiveStep] = useState(0);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [autoSaveTimer, setAutoSaveTimer] = useState(null);
  const [isEmailPopupOpen, setIsEmailPopupOpen] = useState(false);
  const [showDownloadPopup, setShowDownloadPopup] = useState(false);
  const [pdfBlob, setPdfBlob] = useState(null);

  const resumePreviewRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(800);

  useEffect(() => {
    console.log("EditResume - ID from URL:", id);
    if (id) {
      dispatch(fetchResumeById(id));
    }
  }, [id, dispatch]);

  // Initialize missing sections if necessary
  useEffect(() => {
    if (resume) {
      const sections = ['education', 'workExperience', 'projects', 'skills', 'certifications', 'languages', 'interests'];
      let hasMissingSections = false;
      const updatedResume = { ...resume };

      if (!updatedResume.profileInfo) {
        updatedResume.profileInfo = {};
        hasMissingSections = true;
      }
      if (!updatedResume.contactInfo) {
        updatedResume.contactInfo = {};
        hasMissingSections = true;
      }

      sections.forEach(section => {
        if (!updatedResume[section]) {
          updatedResume[section] = [];
          hasMissingSections = true;
        }
      });

      if (hasMissingSections) {
        dispatch(updateResumeLocal(updatedResume));
      }
    }
  }, [resume, dispatch]);

  useEffect(() => {
    if (resumePreviewRef.current) {
      setContainerWidth(resumePreviewRef.current.offsetWidth || 800);
    }
    
    const handleResize = () => {
        if (resumePreviewRef.current) {
            setContainerWidth(resumePreviewRef.current.offsetWidth || 800);
        }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [previewMode, showThemeSelector]);

  // Auto-save logic
  const handleResumeUpdate = (updatedData) => {
    // Update local Redux state immediately for UI responsiveness
    dispatch(updateResumeLocal(updatedData));

    // Debounce API call
    if (autoSaveTimer) clearTimeout(autoSaveTimer);
    
    const timer = setTimeout(() => {
      dispatch(updateResume({ id, data: updatedData }));
    }, 1000); // Auto-save after 1 second of inactivity
    
    setAutoSaveTimer(timer);
  };

  // Generic update handlers
  const updateSection = (key, value) => {
    const updatedData = { ...resume };
    if (activeStep === 0) { // Profile
      updatedData.profileInfo = { ...updatedData.profileInfo, [key]: value };
    } else if (activeStep === 1) { // Contact
      updatedData.contactInfo = { ...updatedData.contactInfo, [key]: value };
    }
    handleResumeUpdate(updatedData);
  };

  const updateArrayItem = (index, key, value) => {
    const updatedData = { ...resume };
    let sectionKey = "";
    
    if (activeStep === 2) sectionKey = "education";
    else if (activeStep === 3) sectionKey = "workExperience";
    else if (activeStep === 4) sectionKey = "projects";
    else if (activeStep === 5) sectionKey = "skills";
    else if (activeStep === 6) sectionKey = "certifications";
    
    // Special handling for Additional Info (Languages/Interests)
    if (activeStep === 7) {
        // Here index is actually the section name (languages/interests)
        // and key is the array index
        // and value is the field key
        // Wait, the AdditionalInfoForm passes (section, index, field, value)
        // Let's adjust the signature or handle it differently
        return; 
    }

    if (!updatedData[sectionKey]) {
      updatedData[sectionKey] = [];
    }

    const newArray = [...updatedData[sectionKey]];
    newArray[index] = { ...newArray[index], [key]: value };
    updatedData[sectionKey] = newArray;
    handleResumeUpdate(updatedData);
  };

  // Specific handler for Additional Info
  const updateAdditionalInfo = (section, index, field, value) => {
    const updatedData = { ...resume };
    if (!updatedData[section]) {
      updatedData[section] = [];
    }

    const newArray = [...updatedData[section]];
    
    if (section === "interests") {
        newArray[index] = value;
    } else {
        newArray[index] = { ...newArray[index], [field]: value };
    }
    
    updatedData[section] = newArray;
    handleResumeUpdate(updatedData);
  };

  const addArrayItem = (item) => {
    const updatedData = { ...resume };
    let sectionKey = "";
    
    if (activeStep === 2) sectionKey = "education";
    else if (activeStep === 3) sectionKey = "workExperience";
    else if (activeStep === 4) sectionKey = "projects";
    else if (activeStep === 5) sectionKey = "skills";
    else if (activeStep === 6) sectionKey = "certifications";
    
    updatedData[sectionKey] = [...updatedData[sectionKey], item];
    handleResumeUpdate(updatedData);
  };

  const addAdditionalItem = (section, item) => {
    const updatedData = { ...resume };
    updatedData[section] = [...updatedData[section], item];
    handleResumeUpdate(updatedData);
  };

  const removeArrayItem = (index) => {
    const updatedData = { ...resume };
    let sectionKey = "";
    
    if (activeStep === 2) sectionKey = "education";
    else if (activeStep === 3) sectionKey = "workExperience";
    else if (activeStep === 4) sectionKey = "projects";
    else if (activeStep === 5) sectionKey = "skills";
    else if (activeStep === 6) sectionKey = "certifications";

    const newArray = [...updatedData[sectionKey]];
    newArray.splice(index, 1);
    updatedData[sectionKey] = newArray;
    handleResumeUpdate(updatedData);
  };

  const removeAdditionalItem = (section, index) => {
    const updatedData = { ...resume };
    const newArray = [...updatedData[section]];
    newArray.splice(index, 1);
    updatedData[section] = newArray;
    handleResumeUpdate(updatedData);
  };

  const executeDownload = async () => {
    try {
      if (!resumePreviewRef.current) {
        toast.error("Resume preview not found");
        return;
      }

      const blob = await generatePDFBlob(resumePreviewRef.current);

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${resume.title || "resume"}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      
      setShowDownloadPopup(false);
      toast.success("Download started!");

    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF");
    }
  };

  const handleDownload = () => {
      setShowDownloadPopup(true);
  };


  const handleShare = async () => {
    const toastId = toast.loading("Generating PDF for sharing...");

    try {
      const element = resumePreviewRef.current;
      if (!element) throw new Error("Resume preview not found");

      let elementToCapture = element;
      let wrapper = null;

      if (element.offsetWidth === 0 || element.offsetHeight === 0) {
          // Clone and show off-screen but within viewport to avoid clipping
          const clone = element.cloneNode(true);
          wrapper = document.createElement('div');
          wrapper.style.position = 'fixed';
          wrapper.style.left = '0';
          wrapper.style.top = '0';
          wrapper.style.width = '800px'; // Force width
          wrapper.style.zIndex = '-9999'; // Behind everything
          wrapper.style.visibility = 'visible';
          wrapper.style.backgroundColor = '#ffffff'; // Ensure background
          wrapper.appendChild(clone);
          document.body.appendChild(wrapper);
          
          clone.style.display = 'block';
          clone.style.width = '800px';
          clone.style.height = 'auto';
          clone.style.transform = 'none';
          
          const innerDiv = clone.firstChild;
          if (innerDiv && innerDiv.style) {
              innerDiv.style.transform = 'none';
              innerDiv.style.width = '800px';
          }
          
          await new Promise(resolve => setTimeout(resolve, 500));
          elementToCapture = clone;
      }

      const blob = await generatePDFBlob(elementToCapture);
      
      if (wrapper) {
          document.body.removeChild(wrapper);
      }

      setPdfBlob(blob);
      setIsEmailPopupOpen(true);
      toast.success("Ready to share!", { id: toastId });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF: " + (error.message || "Unknown error"), { id: toastId });
    }
  };

  if (isLoading && !resume) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }

  if (!resume) return null;

  const ActiveComponent = STEPS[activeStep].component;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/dashboard")}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-800">{resume.title}</h1>
            <p className="text-xs text-slate-500">Last updated: {new Date(resume.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowThemeSelector(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Palette size={16} />
            <span className="hidden sm:inline">Theme</span>
          </button>
          
          <button 
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors md:hidden"
          >
            <Eye size={16} />
            <span className="hidden sm:inline">{previewMode ? "Edit" : "Preview"}</span>
          </button>

          <button 
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Share2 size={16} />
            <span className="hidden sm:inline">Share</span>
          </button>

          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Download</span>
          </button>

          <button 
            onClick={() => dispatch(updateResume({ id, data: resume }))}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Save size={16} />
            <span className="hidden sm:inline">Save</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Steps */}
        <aside className="w-64 bg-white border-r border-gray-200 hidden lg:flex flex-col overflow-y-auto">
          <div className="p-4">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Sections</h2>
            <nav className="space-y-1">
              {STEPS.map((step, index) => (
                <button
                  key={index}
                  onClick={() => setActiveStep(index)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeStep === index 
                      ? "bg-blue-50 text-blue-700" 
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${activeStep === index ? "bg-blue-600" : "bg-slate-300"}`} />
                  {step.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Middle - Form Area */}
        <main className={`flex-1 overflow-y-auto bg-white ${previewMode ? 'hidden' : 'block'} md:block`}>
          <div className="max-w-3xl mx-auto pb-20">
            {/* Mobile Step Navigation */}
            <div className="lg:hidden overflow-x-auto flex items-center gap-4 p-4 border-b border-gray-100 no-scrollbar">
               {STEPS.map((step, index) => (
                <button
                  key={index}
                  onClick={() => setActiveStep(index)}
                  className={`whitespace-nowrap px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                    activeStep === index 
                      ? "bg-blue-600 text-white" 
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {step.label}
                </button>
              ))}
            </div>

            <div className="p-4">
                <StepProgress progress={((activeStep + 1) / STEPS.length) * 100} />
            </div>

            <ActiveComponent 
                // Props mapping based on active step
                profileData={resume.profileInfo || {}}
                contactInfo={resume.contactInfo || {}}
                educationInfo={resume.education || []}
                workExperience={resume.workExperience || []}
                projectInfo={resume.projects || []}
                skillsInfo={resume.skills || []}
                certifications={resume.certifications || []}
                languages={resume.languages || []}
                interests={resume.interests || []}

                // Update functions
                updateSection={updateSection}
                updateArrayItem={activeStep === 7 ? updateAdditionalInfo : updateArrayItem}
                addArrayItem={activeStep === 7 ? addAdditionalItem : addArrayItem}
                removeArrayItem={activeStep === 7 ? removeAdditionalItem : removeArrayItem}
            />

            <div className="flex justify-between px-5 mt-10">
                <button
                    disabled={activeStep === 0}
                    onClick={() => setActiveStep(prev => prev - 1)}
                    className="px-6 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Previous
                </button>
                <button
                    onClick={() => {
                        if (activeStep < STEPS.length - 1) {
                            setActiveStep(prev => prev + 1);
                        } else {
                            navigate('/dashboard');
                        }
                    }}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    {activeStep === STEPS.length - 1 ? "Finish" : "Next"}
                </button>
            </div>
          </div>
        </main>

        {/* Right - Preview Area */}
        <aside className={`w-full md:w-[50%] lg:w-[45%] bg-slate-100 border-l border-gray-200 overflow-y-auto ${previewMode ? 'block fixed inset-0 z-50 pt-20' : 'hidden md:block'}`}>
            {previewMode && (
                <button 
                    onClick={() => setPreviewMode(false)}
                    className="fixed top-4 right-4 p-2 bg-white rounded-full shadow-lg z-50 md:hidden"
                >
                    <ArrowLeft size={24} />
                </button>
            )}
            
            <div className="p-8 flex justify-center min-h-full">
                <div className="shadow-2xl origin-top" ref={resumePreviewRef} style={{ width: '100%', maxWidth: '800px' }}>
                    <RenderResume 
                        templateId={resume.theme}
                        resumeData={{
                            ...resume,
                            profileInfo: resume.profileInfo || {},
                            contactInfo: resume.contactInfo || {},
                            education: resume.education || [],
                            workExperience: resume.workExperience || [],
                            projects: resume.projects || [],
                            skills: resume.skills || [],
                            certifications: resume.certifications || [],
                            languages: resume.languages || [],
                            interests: resume.interests || []
                        }}
                        colorPalette={resume.colorPalette}
                        containerWidth={containerWidth}
                    />
                </div>
            </div>
        </aside>
      </div>

      {/* Theme Selector Modal */}
      {showThemeSelector && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] overflow-hidden flex flex-col">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-xl font-bold">Customize Theme</h2>
                    <button onClick={() => setShowThemeSelector(false)} className="text-slate-500 hover:text-slate-700">Close</button>
                </div>
                <div className="flex-1 overflow-hidden">
                    <ThemeSelector 
                        selectedTheme={{ theme: resume.theme, colorPalette: resume.colorPalette }}
                        setSelectedTheme={(theme) => {
                            handleResumeUpdate({ ...resume, ...theme });
                        }}
                        resumeData={resume}
                        onClose={() => setShowThemeSelector(false)}
                    />
                </div>
            </div>
        </div>
      )}

      {/* Email Popup */}
      <EmailPopup 
        isOpen={isEmailPopupOpen} 
        onClose={() => setIsEmailPopupOpen(false)} 
        pdfBlob={pdfBlob}
        resumeTitle={resume.title}
      />

      {/* Download Confirmation Popup */}
      {showDownloadPopup && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-slate-800 mb-2">Download Resume</h3>
            <p className="text-slate-600 mb-6">
              Are you sure you want to download your resume as a PDF?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDownloadPopup(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={executeDownload}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Download size={18} />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditResume;
