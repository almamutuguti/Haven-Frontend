"use client"

import { ArrowLeft, Shield, AlertTriangle, CheckCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Sidebar } from "../../SideBar"

export default function WoundCare() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#fff3ea] via-[#fff3ea] to-[#ffe6c5]">
            <Sidebar />
            <main className="ml-64 px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 border border-[#ffe6c5] text-[#1a0000] hover:bg-[#ffe6c5] rounded-lg transition-colors"
                        title="Back to Dashboard"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-4xl font-bold text-[#1a0000] mb-2">Wound Care & Management</h1>
                        <p className="text-[#740000]">Proper techniques for treating various types of wounds</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Universal Precautions */}
                        <div className="bg-[#b90000] text-[#fff3ea] p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <Shield className="w-5 h-5" />
                                <h3 className="font-bold text-lg">Universal Precautions</h3>
                            </div>
                            <p>Always wear gloves and use protective equipment when dealing with wounds to prevent infection transmission.</p>
                        </div>

                        {/* General Steps */}
                        <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg p-6">
                            <h2 className="text-2xl font-bold text-[#1a0000] mb-4">General Wound Care Steps</h2>
                            
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <CheckCircle className="w-6 h-6 text-[#1a0000] flex-shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-semibold text-[#1a0000]">1. Ensure Safety</h3>
                                        <p className="text-[#740000]">Protect yourself first. Wear gloves and ensure the area is safe.</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <CheckCircle className="w-6 h-6 text-[#1a0000] flex-shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-semibold text-[#1a0000]">2. Control Bleeding</h3>
                                        <p className="text-[#740000]">Apply direct pressure with sterile dressing. Elevate injured area if possible.</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <CheckCircle className="w-6 h-6 text-[#1a0000] flex-shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-semibold text-[#1a0000]">3. Clean the Wound</h3>
                                        <p className="text-[#740000]">Use clean water and mild soap. Irrigate with sterile saline if available.</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <CheckCircle className="w-6 h-6 text-[#1a0000] flex-shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-semibold text-[#1a0000]">4. Apply Dressing</h3>
                                        <p className="text-[#740000]">Cover with sterile non-stick dressing and secure with bandage.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* When to Seek Medical Care */}
                        <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg p-6">
                            <h3 className="text-lg font-bold text-[#1a0000] mb-4 flex items-center gap-2">
                                <AlertTriangle className="text-[#b90000]" />
                                Seek Medical Care If:
                            </h3>
                            <ul className="text-[#740000] space-y-2">
                                <li>• Bleeding doesn't stop after 10-15 minutes</li>
                                <li>• Wound is deep or gaping</li>
                                <li>• Signs of infection appear</li>
                                <li>• Embedded foreign object</li>
                                <li>• Animal or human bite</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}