"use client"

import { Heart, Users, Target, Award, Clock, MapPin, Shield, Activity } from "lucide-react"
import { Link } from "react-router-dom"

export default function About() {
  const teamValues = [
    {
      icon: Target,
      title: "Our Mission",
      description: "To revolutionize emergency response coordination through technology that saves lives and improves outcomes for victims and responders alike."
    },
    {
      icon: Shield,
      title: "Our Vision",
      description: "A world where every emergency receives coordinated, efficient, and effective response through seamless communication between all stakeholders."
    },
    {
      icon: Users,
      title: "Our Values",
      description: "We believe in transparency, collaboration, and innovation. Every feature is designed with real emergency scenarios in mind."
    }
  ]

  const milestones = [
    { year: "2025", event: "Platform Initiation", description: "Haven platform development began with comprehensive research and planning" },
    { year: "2025", event: "Beta Testing", description: "Initial testing with partner emergency response organizations" },
    { year: "2026", event: "Full Launch", description: "Comprehensive platform launch with all core features" },
    { year: "2027", event: "Regional Expansion", description: "Expansion to multiple regions and healthcare networks" },
    { year: "2028", event: "Nationwide Deployment", description: "Planned nationwide deployment and integration" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff3ea] via-[#fff3ea] to-[#ffe6c5]">
      {/* Navigation */}
      <nav className="border-b border-[#ffe6c5] bg-[#fff3ea]/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#b90000] rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-[#fff3ea]" />
            </div>
            <span className="text-2xl font-bold text-[#b90000]">Haven</span>
          </div>
          <div className="hidden md:flex gap-8">
            <Link to="/" className="text-[#1a0000] hover:text-[#b90000] transition">
              Home
            </Link>
            <Link to="/features" className="text-[#1a0000] hover:text-[#b90000] transition">
              Features
            </Link>
            <Link to="/contact" className="text-[#1a0000] hover:text-[#b90000] transition">
              Contact
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="inline-block bg-[#ffe6c5] text-[#740000] px-4 py-2 rounded-full text-sm font-medium mb-6">
            Our Story
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-[#1a0000] mb-6">
            Revolutionizing <span className="text-[#b90000]">Emergency</span> Response
          </h1>
          <p className="text-xl text-[#740000] max-w-3xl mx-auto">
            Haven was born from a simple observation: emergency response coordination could be faster, 
            more efficient, and more effective through better technology and communication.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {teamValues.map((value, index) => {
            const Icon = value.icon
            return (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-[#b90000]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-[#b90000]" />
                </div>
                <h3 className="text-xl font-bold text-[#1a0000] mb-3">{value.title}</h3>
                <p className="text-[#740000]">{value.description}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Story Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-[#1a0000] mb-6">Our Journey</h2>
            <p className="text-[#740000] mb-4">
              Founded by emergency response professionals and technology experts, Haven addresses the critical 
              communication gaps that often occur during emergency situations. We've seen firsthand how seconds 
              matter and how better coordination can mean the difference between life and death.
            </p>
            <p className="text-[#740000] mb-4">
              Our platform was initiated in 2025 with a clear vision: to create a comprehensive emergency response 
              coordination system that connects first-aiders, hospital staff, and administrators in real-time.
            </p>
            <p className="text-[#740000]">
              Today, Haven is being developed as the next-generation platform trusted by organizations across 
              the emergency response ecosystem to coordinate care, communicate effectively, and ultimately save more lives.
            </p>
          </div>
          <div className="bg-[#fff3ea] border border-[#ffe6c5] rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-[#1a0000] mb-6">Our Impact Goals</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#b90000]/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-[#b90000]" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#1a0000]">Faster Response Times</h4>
                  <p className="text-[#740000] text-sm">Targeting 40% reduction in emergency response times</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#b90000]/10 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#b90000]" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#1a0000]">Better Coordination</h4>
                  <p className="text-[#740000] text-sm">Seamless communication between response teams</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#b90000]/10 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-[#b90000]" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#1a0000]">Improved Outcomes</h4>
                  <p className="text-[#740000] text-sm">Enhanced patient care through better information sharing</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-[#1a0000] text-center mb-12">Our Journey</h2>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-[#ffe6c5] h-full"></div>
          
          {/* Timeline items */}
          <div className="space-y-12">
            {milestones.map((milestone, index) => (
              <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                {/* Content */}
                <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                  <div className="bg-[#fff3ea] border border-[#ffe6c5] rounded-lg p-6 hover:border-[#b90000] transition-colors">
                    <div className="text-2xl font-bold text-[#b90000] mb-2">{milestone.year}</div>
                    <h3 className="text-xl font-bold text-[#1a0000] mb-2">{milestone.event}</h3>
                    <p className="text-[#740000]">{milestone.description}</p>
                  </div>
                </div>
                
                {/* Dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#b90000] rounded-full border-4 border-[#fff3ea]"></div>
                
                {/* Spacer */}
                <div className="w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Commitment */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-[#fff3ea] border border-[#ffe6c5] rounded-2xl p-12 text-center">
          <h2 className="text-4xl font-bold text-[#1a0000] mb-6">Committed to Excellence</h2>
          <p className="text-xl text-[#740000] max-w-3xl mx-auto mb-8">
            Our team is dedicated to continuous improvement and innovation in emergency response technology. 
            We work closely with emergency response professionals to ensure Haven meets the evolving needs of the community.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/features"
              className="px-8 py-3 bg-[#b90000] text-white rounded-lg font-semibold hover:bg-[#740000] transition-colors"
            >
              Explore Features
            </Link>
            <Link
              to="/contact"
              className="px-8 py-3 border border-[#b90000] text-[#b90000] rounded-lg font-semibold hover:bg-[#ffe6c5] transition-colors"
            >
              Join Our Mission
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#ffe6c5] bg-[#fff3ea]/50 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center gap-2 justify-center mb-4">
              <div className="w-8 h-8 bg-[#b90000] rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-[#fff3ea]" />
              </div>
              <span className="font-bold text-[#b90000] text-xl">Haven</span>
            </div>
            <p className="text-[#740000] mb-6">Emergency response coordination platform</p>
            <div className="flex gap-6 justify-center">
              <Link to="/" className="text-[#740000] hover:text-[#b90000] transition">Home</Link>
              <Link to="/features" className="text-[#740000] hover:text-[#b90000] transition">Features</Link>
              <Link to="/about" className="text-[#740000] hover:text-[#b90000] transition">About</Link>
              <Link to="/contact" className="text-[#740000] hover:text-[#b90000] transition">Contact</Link>
            </div>
          </div>
          <div className="border-t border-[#ffe6c5] pt-8 text-center">
            <p className="text-sm text-[#740000]">© 2025 Haven. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}