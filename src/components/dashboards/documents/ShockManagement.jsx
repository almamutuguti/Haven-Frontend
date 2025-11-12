"use client"

import { ArrowLeft, AlertTriangle, Heart, Thermometer } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Sidebar } from "../../SideBar"

export default function ShockManagement() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-linear-to-br from-[#fff3ea] via-[#fff3ea] to-[#ffe6c5]">
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
                        <h1 className="text-4xl font-bold text-[#1a0000] mb-2">Shock Management</h1>
                        <p className="text-[#740000]">Recognizing and treating circulatory shock</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Emergency Alert */}
                        <div className="bg-[#b90000] text-[#fff3ea] p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <AlertTriangle className="w-5 h-5" />
                                <h3 className="font-bold text-lg">Medical Emergency</h3>
                            </div>
                            <p>Shock is a life-threatening condition. Call emergency services immediately and begin treatment while waiting for help.</p>
                        </div>

                        {/* Treatment Steps */}
                        <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg p-6">
                            <h3 className="text-xl font-bold text-[#1a0000] mb-4">Emergency Treatment Steps</h3>
                            
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="shrink-0 w-8 h-8 bg-[#b90000] text-[#fff3ea] rounded-full flex items-center justify-center font-bold">
                                        1
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-[#1a0000]">Call Emergency Services</h4>
                                        <p className="text-[#740000]">Immediately call for professional medical help. Shock is a medical emergency.</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="shrink-0 w-8 h-8 bg-[#b90000] text-[#fff3ea] rounded-full flex items-center justify-center font-bold">
                                        2
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-[#1a0000]">Lie Patient Down</h4>
                                        <p className="text-[#740000]">Have the person lie on their back. Do not give them anything to eat or drink.</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="shrink-0 w-8 h-8 bg-[#b90000] text-[#fff3ea] rounded-full flex items-center justify-center font-bold">
                                        3
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-[#1a0000]">Elevate Legs</h4>
                                        <p className="text-[#740000]">Raise the person's legs about 12 inches (unless you suspect spinal injury).</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Vital Signs Monitoring */}
                        <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg p-6">
                            <h3 className="text-lg font-bold text-[#1a0000] mb-4 flex items-center gap-2">
                                <Heart className="text-[#b90000]" />
                                Vital Signs to Monitor
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-[#740000]">Pulse Rate</span>
                                    <span className="font-semibold text-[#1a0000]">Rapid & weak</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#740000]">Breathing</span>
                                    <span className="font-semibold text-[#1a0000]">Rapid & shallow</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#740000]">Skin</span>
                                    <span className="font-semibold text-[#1a0000]">Pale, cool, clammy</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}