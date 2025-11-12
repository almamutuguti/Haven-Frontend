"use client"

import { Heart, Users, Shield, AlertCircle, MessageCircle, Activity, Stethoscope, MapPin, Clock, CheckCircle } from "lucide-react"
import { Link } from "react-router-dom"

export default function Features() {
  const features = [
    {
      icon: AlertCircle,
      title: "Real-time Emergency Alerts",
      description: "Instant notifications for emergency situations with detailed victim information and location data.",
      benefits: ["Instant notifications", "GPS location tracking", "Priority-based alerts"]
    },
    {
      icon: Users,
      title: "Multi-role Coordination",
      description: "Seamless collaboration between first-aiders, hospital staff, and administrators.",
      benefits: ["Role-based access", "Team communication", "Coordinated response"]
    },
    {
      icon: Stethoscope,
      title: "Victim Assessment Tools",
      description: "Comprehensive medical assessment forms with vital signs tracking and triage capabilities.",
      benefits: ["Medical assessments", "Vital signs monitoring", "Triage categorization"]
    },
    {
      icon: MessageCircle,
      title: "Hospital Communications",
      description: "Direct communication between first-aiders and hospitals with real-time status updates.",
      benefits: ["Direct messaging", "Status updates", "ETA tracking"]
    },
    {
      icon: Activity,
      title: "Live Tracking & Analytics",
      description: "Real-time tracking of emergency responses with performance analytics and reporting.",
      benefits: ["Live location tracking", "Performance metrics", "Response time analytics"]
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Secure platform with role-based permissions and data protection compliance.",
      benefits: ["Data encryption", "Role-based access", "Audit logging"]
    }
  ]

  const stats = [
    { number: "99.9%", label: "Uptime Reliability" },
    { number: "<2min", label: "Average Response Time" },
    { number: "24/7", label: "Support Available" }
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
            <Link to="/about" className="text-[#1a0000] hover:text-[#b90000] transition">
              About
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
            Powerful Features for Emergency Response
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-[#1a0000] mb-6">
            Designed for <span className="text-[#b90000]">Emergency</span> Excellence
          </h1>
          <p className="text-xl text-[#740000] max-w-3xl mx-auto mb-8">
            Haven provides comprehensive tools and features specifically designed for coordinated emergency response, 
            connecting first-aiders, hospitals, and administrators in real-time.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-[#b90000] mb-2">{stat.number}</div>
              <div className="text-[#740000] text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="bg-[#fff3ea] border border-[#ffe6c5] rounded-lg p-6 hover:border-[#b90000] transition-all duration-300 hover:shadow-lg">
                <div className="w-12 h-12 bg-[#b90000]/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-[#b90000]" />
                </div>
                <h3 className="text-xl font-bold text-[#1a0000] mb-3">{feature.title}</h3>
                <p className="text-[#740000] mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-center gap-2 text-sm text-[#1a0000]">
                      <CheckCircle className="w-4 h-4 text-[#b90000]" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </section>

      {/* Role-specific Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#1a0000] mb-4">Tailored for Every Role</h2>
          <p className="text-[#740000] text-lg">Specialized features designed for each member of the emergency response team</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* First Aider Features */}
          <div className="bg-[#fff3ea] border border-[#ffe6c5] rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#b90000] rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-[#fff3ea]" />
              </div>
              <h3 className="text-xl font-bold text-[#1a0000]">First Aiders</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-[#740000]">
                <CheckCircle className="w-4 h-4 text-[#b90000]" />
                Emergency alert management
              </li>
              <li className="flex items-center gap-2 text-[#740000]">
                <CheckCircle className="w-4 h-4 text-[#b90000]" />
                Victim assessment tools
              </li>
              <li className="flex items-center gap-2 text-[#740000]">
                <CheckCircle className="w-4 h-4 text-[#b90000]" />
                Hospital communication
              </li>
              <li className="flex items-center gap-2 text-[#740000]">
                <CheckCircle className="w-4 h-4 text-[#b90000]" />
                GPS location tracking
              </li>
            </ul>
          </div>

          {/* Hospital Staff Features */}
          <div className="bg-[#fff3ea] border border-[#ffe6c5] rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#b90000] rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-[#fff3ea]" />
              </div>
              <h3 className="text-xl font-bold text-[#1a0000]">Hospital Staff</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-[#740000]">
                <CheckCircle className="w-4 h-4 text-[#b90000]" />
                Patient intake coordination
              </li>
              <li className="flex items-center gap-2 text-[#740000]">
                <CheckCircle className="w-4 h-4 text-[#b90000]" />
                Real-time communication
              </li>
              <li className="flex items-center gap-2 text-[#740000]">
                <CheckCircle className="w-4 h-4 text-[#b90000]" />
                Resource preparation tracking
              </li>
              <li className="flex items-center gap-2 text-[#740000]">
                <CheckCircle className="w-4 h-4 text-[#b90000]" />
                Medical assessment review
              </li>
            </ul>
          </div>

          {/* Admin Features */}
          <div className="bg-[#fff3ea] border border-[#ffe6c5] rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#b90000] rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-[#fff3ea]" />
              </div>
              <h3 className="text-xl font-bold text-[#1a0000]">Administrators</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-[#740000]">
                <CheckCircle className="w-4 h-4 text-[#b90000]" />
                System-wide monitoring
              </li>
              <li className="flex items-center gap-2 text-[#740000]">
                <CheckCircle className="w-4 h-4 text-[#b90000]" />
                Analytics and reporting
              </li>
              <li className="flex items-center gap-2 text-[#740000]">
                <CheckCircle className="w-4 h-4 text-[#b90000]" />
                User management
              </li>
              <li className="flex items-center gap-2 text-[#740000]">
                <CheckCircle className="w-4 h-4 text-[#b90000]" />
                System configuration
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-[#b90000] rounded-2xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join Haven today and transform your emergency response capabilities
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/"
              className="px-8 py-3 bg-white text-[#b90000] rounded-lg font-semibold hover:bg-[#ffe6c5] transition-colors"
            >
              Get Started
            </Link>
            <Link
              to="/contact"
              className="px-8 py-3 border border-white text-white rounded-lg font-semibold hover:bg-white hover:text-[#b90000] transition-colors"
            >
              Contact Sales
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