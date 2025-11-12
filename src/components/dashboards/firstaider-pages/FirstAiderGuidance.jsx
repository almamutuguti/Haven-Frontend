// src/components/dashboards/firstaider-pages/FirstAiderGuidance.jsx
import { useState } from "react"
import { Link } from "react-router-dom"
import { Sidebar } from "../../SideBar"
import { Heart, AlertTriangle, BookOpen, Video, Download, Search } from "lucide-react"

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
      ]
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
      ]
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
      ]
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

          {/* Emergency Contacts */}
          <div className="bg-white border border-[#ffe6c5] rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-[#1a0000] mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#b90000]" />
              Emergency Contacts
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-[#fff3ea] rounded-lg">
                <div className="text-lg font-semibold text-[#b90000]">911</div>
                <div className="text-sm text-[#740000]">Emergency Services</div>
              </div>
              <div className="text-center p-4 bg-[#fff3ea] rounded-lg">
                <div className="text-lg font-semibold text-[#b90000]">+1-555-HELP</div>
                <div className="text-sm text-[#740000]">Medical Control</div>
              </div>
              <div className="text-center p-4 bg-[#fff3ea] rounded-lg">
                <div className="text-lg font-semibold text-[#b90000]">+1-555-POISON</div>
                <div className="text-sm text-[#740000]">Poison Control</div>
              </div>
              <div className="text-center p-4 bg-[#fff3ea] rounded-lg">
                <div className="text-lg font-semibold text-[#b90000]">+1-555-TRAUMA</div>
                <div className="text-sm text-[#740000]">Trauma Center</div>
              </div>
            </div>
          </div>

          {/* Guidance Categories */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredCategories.map((category, index) => {
              const Icon = category.icon
              return (
                <div key={index} className="bg-white border border-[#ffe6c5] rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-[#fff3ea] rounded-lg">
                      <Icon className="w-6 h-6 text-[#b90000]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#1a0000]">{category.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center gap-2 text-[#740000] text-sm">
                        <div className="w-1.5 h-1.5 bg-[#b90000] rounded-full"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <button className="w-full mt-4 px-4 py-2 bg-[#b90000] hover:bg-[#740000] text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    View Protocols
                  </button>
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
                <div key={index} className="flex items-center justify-between p-3 bg-[#fff3ea] rounded-lg">
                  <div>
                    <div className="font-medium text-[#1a0000]">{link.name}</div>
                    <div className="text-sm text-[#740000]">{link.type} • {link.size}</div>
                  </div>
                  <button className="px-3 py-1 bg-[#b90000] hover:bg-[#740000] text-white rounded text-sm font-medium transition-colors flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Training Videos */}
          <div className="bg-white border border-[#ffe6c5] rounded-lg p-6 mt-6">
            <h2 className="text-xl font-semibold text-[#1a0000] mb-4 flex items-center gap-2">
              <Video className="w-5 h-5 text-[#b90000]" />
              Training Videos
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Video className="w-12 h-12 text-[#740000] mx-auto mb-2" />
                  <p className="text-[#740000]">CPR Demonstration Video</p>
                </div>
              </div>
              <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Video className="w-12 h-12 text-[#740000] mx-auto mb-2" />
                  <p className="text-[#740000]">Trauma Assessment Guide</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}