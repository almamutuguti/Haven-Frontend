// src/components/dashboards/firstaider-pages/FirstAiderGuidance.jsx
import { useState } from "react"
import { Link } from "react-router-dom"
import { Sidebar } from "../../SideBar"
import { Heart, AlertTriangle, BookOpen, Video, Download, Search, Construction } from "lucide-react"

export default function FirstAiderGuidance() {
  const [searchTerm, setSearchTerm] = useState("")

  const guidanceCategories = [
    {
      title: "CPR & Basic Life Support",
      icon: Heart,
      items: [
        "Adult CPR Guidelines",
        "Child & Infant CPR",
        "AED Usage",
        "Rescue Breathing",
        "Choking Response"
      ],
      summary: "Step-by-step procedures for cardiopulmonary resuscitation and basic life support techniques for different age groups and scenarios."
    },
    {
      title: "Trauma & Injuries",
      icon: AlertTriangle,
      items: [
        "Bleeding Control",
        "Fracture Management",
        "Burn Treatment",
        "Head & Spinal Injuries",
        "Shock Management"
      ],
      summary: "Comprehensive protocols for managing physical trauma, controlling bleeding, and stabilizing injuries before professional help arrives."
    },
    {
      title: "Medical Emergencies",
      icon: BookOpen,
      items: [
        "Heart Attack Response",
        "Stroke Assessment",
        "Allergic Reactions",
        "Seizure Management",
        "Diabetic Emergencies"
      ],
      summary: "Recognition and immediate response procedures for common medical emergencies and life-threatening conditions."
    }
  ]

  const quickLinks = [
    { name: "Emergency Drug Dosages", type: "PDF", size: "2.3 MB" },
    { name: "Triage Protocol Guide", type: "PDF", size: "1.8 MB" },
    { name: "Emergency Contact List", type: "DOC", size: "0.5 MB" },
    { name: "Equipment Checklist", type: "PDF", size: "1.2 MB" }
  ]

  const filteredCategories = guidanceCategories.filter(category =>
    category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.items.some(item => item.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff3ea] via-[#fff3ea] to-[#ffe6c5]">
      <Sidebar />
      <main className="lg:ml-64 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#1a0000] mb-2">First Aid Guidance</h1>
            <p className="text-[#740000]">Quick reference materials and emergency protocols</p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-2xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#740000] w-5 h-5" />
              <input
                type="text"
                placeholder="Search protocols, treatments, or guidelines..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-[#ffe6c5] rounded-lg text-[#1a0000] placeholder-[#740000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
              />
            </div>
          </div>

          {/* Emergency Contacts - Kenyan Based */}
          <div className="bg-white border border-[#ffe6c5] rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-[#1a0000] mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#b90000]" />
              Emergency Contacts - Kenya
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-[#fff3ea] rounded-lg">
                <div className="text-lg font-semibold text-[#b90000]">999 / 112</div>
                <div className="text-sm text-[#740000]">Emergency Services</div>
              </div>
              <div className="text-center p-4 bg-[#fff3ea] rounded-lg">
                <div className="text-lg font-semibold text-[#b90000]">119</div>
                <div className="text-sm text-[#740000]">Police Emergency</div>
              </div>
              <div className="text-center p-4 bg-[#fff3ea] rounded-lg">
                <div className="text-lg font-semibold text-[#b90000]">020-222-222</div>
                <div className="text-sm text-[#740000]">Nairobi Women's Hospital</div>
              </div>
              <div className="text-center p-4 bg-[#fff3ea] rounded-lg">
                <div className="text-lg font-semibold text-[#b90000]">0703-083-000</div>
                <div className="text-sm text-[#740000]">Kenya Red Cross</div>
              </div>
            </div>
          </div>

          {/* Guidance Categories */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredCategories.map((category, index) => {
              const Icon = category.icon
              return (
                <div key={index} className="bg-white border border-[#ffe6c5] rounded-lg p-6 hover:shadow-md transition-shadow relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-[#fff3ea] rounded-lg">
                      <Icon className="w-6 h-6 text-[#b90000]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#1a0000]">{category.title}</h3>
                  </div>
                  <ul className="space-y-2 mb-4">
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center gap-2 text-[#740000] text-sm">
                        <div className="w-1.5 h-1.5 bg-[#b90000] rounded-full"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                  
                  {/* Summary Section */}
                  <div className="mt-4 p-3 bg-[#fff3ea] rounded-lg border border-[#ffe6c5]">
                    <p className="text-sm text-[#740000] font-medium">Summary:</p>
                    <p className="text-xs text-[#1a0000] mt-1">{category.summary}</p>
                  </div>

                  {/* View Protocols Button with Development Indicator */}
                  <div className="relative group mt-4">
                    <button className="w-full px-4 py-2 bg-[#b90000] hover:bg-[#740000] text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 opacity-50 cursor-not-allowed">
                      <BookOpen className="w-4 h-4" />
                      View Protocols
                    </button>
                    
                    {/* Development Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                      <div className="bg-white border border-[#8B0000] rounded-lg p-3 shadow-lg w-64">
                        <div className="flex items-center gap-2 mb-2">
                          <Construction className="w-4 h-4 text-[#8B0000]" />
                          <span className="text-sm font-semibold text-[#8B0000]">Under Development</span>
                        </div>
                        <p className="text-xs text-[#1a0000]">
                          This feature is currently being developed. You'll soon be able to access detailed protocols and step-by-step guides.
                        </p>
                      </div>
                      {/* Tooltip arrow */}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-8 border-transparent border-t-white"></div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Quick Downloads */}
          <div className="bg-white border border-[#ffe6c5] rounded-lg p-6">
            <h2 className="text-xl font-semibold text-[#1a0000] mb-4 flex items-center gap-2">
              <Download className="w-5 h-5 text-[#b90000]" />
              Quick Reference Downloads
            </h2>
            <div className="grid gap-3">
              {quickLinks.map((link, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-[#fff3ea] rounded-lg relative group">
                  <div>
                    <div className="font-medium text-[#1a0000]">{link.name}</div>
                    <div className="text-sm text-[#740000]">{link.type} • {link.size}</div>
                  </div>
                  
                  {/* Download Button with Development Indicator */}
                  <div className="relative">
                    <button className="px-3 py-1 bg-[#b90000] hover:bg-[#740000] text-white rounded text-sm font-medium transition-colors flex items-center gap-2 opacity-50 cursor-not-allowed">
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                    
                    {/* Development Tooltip */}
                    <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block z-10">
                      <div className="bg-white border border-[#8B0000] rounded-lg p-3 shadow-lg w-64">
                        <div className="flex items-center gap-2 mb-2">
                          <Construction className="w-4 h-4 text-[#8B0000]" />
                          <span className="text-sm font-semibold text-[#8B0000]">Under Development</span>
                        </div>
                        <p className="text-xs text-[#1a0000]">
                          Download functionality is coming soon. You'll be able to access these reference materials offline.
                        </p>
                      </div>
                      {/* Tooltip arrow */}
                      <div className="absolute top-full right-4 transform -translate-x-1/2 border-8 border-transparent border-t-white"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Training Videos - Under Development */}
          <div className="bg-white border border-[#ffe6c5] rounded-lg p-6 mt-6 relative">
            <div className="absolute top-4 right-4">
              <div className="flex items-center gap-1 bg-[#8B0000] text-white px-2 py-1 rounded-full text-xs font-medium">
                <Construction className="w-3 h-3" />
                Coming Soon
              </div>
            </div>
            
            <h2 className="text-xl font-semibold text-[#1a0000] mb-4 flex items-center gap-2">
              <Video className="w-5 h-5 text-[#b90000]" />
              Training Videos
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center relative opacity-75">
                <div className="text-center">
                  <Video className="w-12 h-12 text-[#740000] mx-auto mb-2" />
                  <p className="text-[#740000]">CPR Demonstration Video</p>
                  <p className="text-xs text-[#8B0000] mt-2 font-medium">Video content coming soon</p>
                </div>
              </div>
              <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center relative opacity-75">
                <div className="text-center">
                  <Video className="w-12 h-12 text-[#740000] mx-auto mb-2" />
                  <p className="text-[#740000]">Trauma Assessment Guide</p>
                  <p className="text-xs text-[#8B0000] mt-2 font-medium">Video content coming soon</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-[#fff3ea] border border-[#ffe6c5] rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Construction className="w-4 h-4 text-[#8B0000]" />
                <span className="text-sm font-semibold text-[#8B0000]">Training Videos Section Under Development</span>
              </div>
              <p className="text-xs text-[#1a0000]">
                We're working on comprehensive video tutorials covering essential first aid procedures. 
                This will include step-by-step demonstrations, expert commentary, and practical scenarios.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}