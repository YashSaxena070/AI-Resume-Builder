import React, { useEffect, useRef, useState } from "react";
import {
  DUMMY_RESUME_DATA,
  resumeTemplates,
  themeColorPalette,
} from "../../utils/data";
import { CircleCheckBig } from "lucide-react";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/userSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import TemplateCard from "../../components/Cards/TemplateCard";
import RenderResume from "../../components/ResumeTemplates/RenderResume";
import Tabs from "../../components/Extra/Tabs";

const TAB_DATA = [{ label: "Templates" }, { label: "Color Palettes" }];

const ThemeSelector = ({
  selectedTheme,
  setSelectedTheme,
  resumeData,
  onClose,
}) => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const resumeRef = useRef(null);

  const [baseWidth, setBaseWidth] = useState(800);
  const [tabValue, setTabValue] = useState("Templates");

  const [templateRestrictions, setTemplateRestrictions] = useState({
    availableTemplates: [],
    allTemplates: [],
    subscriptionPlan: "basic",
    isPremium: false,
  });

  const [selectedColorPalette, setSelectedColorPalette] = useState({
    colors: selectedTheme?.colorPalette || [],
    index: -1,
  });

  const [selectedTemplate, setSelectedTemplate] = useState({
    theme: selectedTheme?.theme || "01",
    index: -1,
  });

  // Load template restrictions (mock for now)
  useEffect(() => {
    setTemplateRestrictions({
      availableTemplates: ["01"],
      allTemplates: ["01", "02", "03"],
      subscriptionPlan: user?.subscriptionPlan || "basic",
      isPremium: user?.subscriptionPlan === "premium",
    });
  }, [user]);

  const handleThemeSelection = () => {
    setSelectedTheme({
      theme: selectedTemplate.theme,
      colorPalette: selectedColorPalette.colors,
    });
    onClose();
  };

  const isTemplateLocked = (templateId) => {
    if (templateId === "01") return false;
    return !templateRestrictions.isPremium;
  };

  const handleLockedTemplateClick = () => {
    toast("Upgrade to Premium to access all templates!", {
      icon: "🔒",
      style: {
        background: "#f97316",
        color: "#fff",
      },
    });
  };

  const handleUpgradeToPremium = () => {
    navigate("/pricing");
  };

  useEffect(() => {
    if (resumeRef.current) {
      setBaseWidth(resumeRef.current.offsetWidth);
    }
  }, []);

  return (
    <div className="container mx-auto px-2 md:px-0 h-full flex flex-col">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-5 mt-2 px-4">
        <div className="flex items-center gap-3">
          <Tabs
            tabs={TAB_DATA}
            activeTab={tabValue}
            setActiveTab={setTabValue}
          />

          {!templateRestrictions.isPremium ? (
            <div className="hidden md:flex items-center gap-2">
              <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-semibold">
                Basic Plan
              </span>
              <button
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1 rounded-full text-sm"
                onClick={handleUpgradeToPremium}
              >
                Upgrade ₹499
              </button>
            </div>
          ) : (
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
              Premium Plan
            </span>
          )}
        </div>

        <button
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg"
          onClick={handleThemeSelection}
        >
          <CircleCheckBig size={16} />
          Done
        </button>
      </div>

      {/* BODY */}
      <div className="grid grid-cols-12 gap-5 flex-1 overflow-hidden px-4 pb-4">
        {/* LEFT */}
        <div className="col-span-12 md:col-span-5 bg-white overflow-y-auto rounded-xl">
          <div className="grid grid-cols-2 gap-5 p-2">
            {tabValue === "Templates" &&
              resumeTemplates.map((template, index) => {
                const locked = isTemplateLocked(template.id);
                return (
                  <TemplateCard
                    key={template.id}
                    thumbnailImg={template.thumbnailImg}
                    isSelected={selectedTemplate.theme === template.id}
                    isLocked={locked}
                    onSelect={() =>
                      setSelectedTemplate({
                        theme: template.id,
                        index,
                      })
                    }
                    onLockedClick={handleLockedTemplateClick}
                  >
                    <div className="relative bg-white overflow-hidden">
                      <div className="scale-[0.25] origin-top-left w-[400%] h-[400%] pointer-events-none">
                        <RenderResume
                          templateId={template.id}
                          resumeData={resumeData || DUMMY_RESUME_DATA}
                          colorPalette={selectedColorPalette.colors}
                          containerWidth={800}
                        />
                      </div>
                    </div>
                  </TemplateCard>
                );
              })}

            {tabValue === "Color Palettes" &&
              themeColorPalette.themeOne.map((colors, index) => (
                <ColorPalette
                  key={index}
                  colors={colors}
                  isSelected={selectedColorPalette.index === index}
                  onSelect={() =>
                    setSelectedColorPalette({ colors, index })
                  }
                />
              ))}
          </div>
        </div>

        {/* RIGHT */}
        <div
          ref={resumeRef}
          className="col-span-12 md:col-span-7 bg-slate-50 rounded-xl border flex items-center justify-center"
        >
          <div className="scale-[0.6] origin-top">
            <RenderResume
              templateId={selectedTemplate.theme}
              resumeData={resumeData || DUMMY_RESUME_DATA}
              colorPalette={selectedColorPalette.colors}
              containerWidth={baseWidth}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;

/* ================= COLOR PALETTE ================= */

const ColorPalette = ({ colors, isSelected, onSelect }) => {
  return (
    <div
      onClick={onSelect}
      className={`h-28 flex rounded-lg border-2 cursor-pointer ${
        isSelected
          ? "border-purple-500"
          : "border-transparent hover:border-purple-200"
      }`}
    >
      {colors.map((color, index) => (
        <div
          key={index}
          className="flex-1"
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
};
