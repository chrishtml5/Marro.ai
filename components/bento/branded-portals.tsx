"use client"

import type React from "react"

import Image from "next/image"
import { useState } from "react"

export default function BrandedPortals() {
  const [activeTab, setActiveTab] = useState("Updates")
  const [files, setFiles] = useState([
    { name: "Project Brief.pdf", size: "2.4 MB", uploaded: "2 hours ago" },
    { name: "Brand Guidelines.zip", size: "15.8 MB", uploaded: "1 day ago" },
  ])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const newFile = {
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        uploaded: "Just now",
      }
      setFiles([newFile, ...files])
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "Updates":
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-[#FC4503] rounded-full"></div>
              <div className="text-sm text-gray-700">Milestone completed</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              <div className="text-sm text-gray-500">2 new files uploaded</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              <div className="text-sm text-gray-500">Feedback requested</div>
            </div>
          </div>
        )
      case "Files":
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-600">Recent Files</span>
              <label className="text-xs text-[#FC4503] cursor-pointer hover:underline">
                <input type="file" className="hidden" onChange={handleFileUpload} />
                Upload
              </label>
            </div>
            {files.slice(0, 2).map((file, index) => (
              <div key={index} className="flex items-center justify-between py-1">
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-700 truncate">{file.name}</div>
                  <div className="text-xs text-gray-500">
                    {file.size} • {file.uploaded}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      case "Progress":
        return (
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Project Completion</span>
                <span className="text-gray-700">75%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-[#FC4503] h-2 rounded-full" style={{ width: "75%" }}></div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-gray-600">Current Phase: Development</div>
              <div className="text-xs text-gray-500">Next: Testing & Review</div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="w-full h-full p-6 flex flex-col justify-between">
      {/* Browser mockup */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Browser address bar */}
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center gap-3">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          <div className="flex-1 bg-white rounded-md px-3 py-1.5 text-sm text-gray-600 flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center overflow-hidden">
              <Image
                src="/images/marro-logo-black.png"
                alt="Marro logo"
                width={20}
                height={20}
                className="w-full h-full object-contain select-none pointer-events-none"
                draggable={false}
                style={{ userSelect: "none", WebkitUserDrag: "none" }}
              />
            </div>
            client.trymarro.com
          </div>
        </div>

        {/* Tab navigation */}
        <div className="bg-white border-b border-gray-200 flex">
          {["Updates", "Files", "Progress"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium flex items-center gap-2 relative transition-colors ${
                activeTab === tab ? "bg-[#FC4503] text-white" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {tab}
              {activeTab === tab && <div className="w-2 h-2 bg-white rounded-full"></div>}
            </button>
          ))}
        </div>

        {/* Content area */}
        <div className="p-4 bg-white h-32">{renderTabContent()}</div>
      </div>

      {/* CTA Button */}
      <div className="flex justify-center mt-4">
        <button className="bg-[#FC4503] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-[#e63d02] transition-colors">
          View Portal
        </button>
      </div>
    </div>
  )
}
