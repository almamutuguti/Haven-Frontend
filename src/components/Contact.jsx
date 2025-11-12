"use client"

import { useState } from "react"
import { Heart, Mail, Phone, Clock, Send, CheckCircle } from "lucide-react"
import { Link } from "react-router-dom"

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)
  const [error, setError] = useState("")

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const notificationData = {
        user_ids: [1], // Admin user ID
        title: `New Contact Form Message from ${formData.name}`,
        message: `
Name: ${formData.name}
Email: ${formData.email}
Message: ${formData.message}

Submitted: ${new Date().toLocaleString()}
      `.trim(),
        notification_type: "system_alert",
        channel: "email",
        priority: "medium",
        metadata: {
          contact_form: true,
          sender_email: formData.email,
          sender_name: formData.name,
          timestamp: new Date().toISOString()
        }
      };

      console.log('Sending contact form to notifications API:', notificationData);

      // Use the environment variable
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${baseUrl}/notifications/api/send-email/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Email sent successfully:', result);

      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        message: ""
      });

      setTimeout(() => setSubmitStatus(null), 5000);

    } catch (error) {
      console.error('Failed to send message:', error);
      setError("Failed to send message. Please try emailing us directly at mutuguialma@outlook.com");
    } finally {
      setIsSubmitting(false);
    }
  }

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Us",
      details: "mutuguialma@outlook.com",
      description: "Send us an email anytime"
    },
    {
      icon: Phone,
      title: "Call Us",
      details: "+254 797 168 312",
      description: "Mon-Fri from 8am to 6pm"
    }
  ]

  const faqs = [
    {
      question: "How quickly can we get started with Haven?",
      answer: "Most organizations can be up and running within 24-48 hours after initial setup and training."
    },
    {
      question: "Do you offer training for our team?",
      answer: "Yes, we provide comprehensive training for all user roles including first-aiders, hospital staff, and administrators."
    },
    {
      question: "Can Haven integrate with our existing systems?",
      answer: "Haven offers API integration capabilities for most common hospital and emergency management systems."
    },
    {
      question: "What kind of support do you provide?",
      answer: "We offer 24/7 technical support, regular platform updates, and dedicated account management for enterprise clients."
    }
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
            <Link to="/about" className="text-[#1a0000] hover:text-[#b90000] transition">
              About
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="inline-block bg-[#ffe6c5] text-[#740000] px-4 py-2 rounded-full text-sm font-medium mb-6">
            Get In Touch
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-[#1a0000] mb-6">
            Let's <span className="text-[#b90000]">Connect</span>
          </h1>
          <p className="text-xl text-[#740000] max-w-3xl mx-auto">
            Ready to transform your emergency response capabilities? We're here to help you get started
            and answer any questions you might have about Haven.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {contactMethods.map((method, index) => {
            const Icon = method.icon
            return (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-[#b90000]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-[#b90000]" />
                </div>
                <h3 className="text-xl font-bold text-[#1a0000] mb-2">{method.title}</h3>
                <p className="text-[#b90000] font-semibold mb-1">{method.details}</p>
                <p className="text-[#740000] text-sm">{method.description}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-[#fff3ea] border border-[#ffe6c5] rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-[#1a0000] mb-6">Send us a message</h2>

            {submitStatus === "success" && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-green-700">Thank you for your message! We'll get back to you soon.</p>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-[#1a0000]">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-[#fff3ea] border border-[#ffe6c5] rounded-lg text-[#1a0000] placeholder:text-[#740000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                  placeholder="Your full name"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-[#1a0000]">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-[#fff3ea] border border-[#ffe6c5] rounded-lg text-[#1a0000] placeholder:text-[#740000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-medium text-[#1a0000]">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-[#fff3ea] border border-[#ffe6c5] rounded-lg text-[#1a0000] placeholder:text-[#740000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent resize-vertical"
                  placeholder="Tell us about your emergency response needs or any questions you have..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-8 py-4 bg-[#b90000] hover:bg-[#740000] text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Additional Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-[#1a0000] mb-4">Why Choose Haven?</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-[#b90000] mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-[#1a0000]">Proven Results</h4>
                    <p className="text-[#740000]">Trusted by emergency response teams nationwide</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-[#b90000] mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-[#1a0000]">24/7 Support</h4>
                    <p className="text-[#740000]">Round-the-clock technical support and training</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-[#b90000] mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-[#1a0000]">Custom Solutions</h4>
                    <p className="text-[#740000]">Tailored to your organization's specific needs</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#fff3ea] border border-[#ffe6c5] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-6 h-6 text-[#b90000]" />
                <h4 className="font-semibold text-[#1a0000]">Response Time</h4>
              </div>
              <p className="text-[#740000] mb-2">We typically respond to inquiries within:</p>
              <div className="text-2xl font-bold text-[#b90000]">2-4 hours</div>
              <p className="text-[#740000] text-sm mt-2">During business hours (Mon-Fri, 8AM-6PM EAT)</p>
            </div>

            <div className="bg-[#fff3ea] border border-[#ffe6c5] rounded-2xl p-6">
              <h4 className="font-semibold text-[#1a0000] mb-4">Emergency Support</h4>
              <p className="text-[#740000] mb-4">
                For urgent technical support or emergency platform issues, call our dedicated support line:
              </p>
              <div className="text-xl font-bold text-[#b90000]">+254 797 168 312</div>
              <p className="text-[#740000] text-sm mt-2">Available 24/7 for critical issues</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-[#1a0000] text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-[#fff3ea] border border-[#ffe6c5] rounded-lg p-6">
              <h3 className="text-xl font-semibold text-[#1a0000] mb-3">{faq.question}</h3>
              <p className="text-[#740000]">{faq.answer}</p>
            </div>
          ))}
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