"use client";
import { useState, useMemo } from "react";

export function Tabs({ tabs }) {
  const [activeTab, setActiveTab] = useState(tabs[0].label);

  // Memorizar el contenido para evitar la re-renderización y llamadas innecesarias
  const renderContent = useMemo(() => {
    const activeTabContent = tabs.find((tab) => tab.label === activeTab);
    return activeTabContent ? activeTabContent.content : null;
  }, [activeTab, tabs]);

  return (
    <div>
      <div className="tabs-list p-4 gap-4 flex">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            className={`tab-trigger ${activeTab === tab.label ? "bg-primary text-white" : ""} font-bold text-lg`}
            onClick={() => setActiveTab(tab.label)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tab-content">{renderContent}</div>
    </div>
  );
}
