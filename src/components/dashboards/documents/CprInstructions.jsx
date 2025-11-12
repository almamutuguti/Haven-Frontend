"use client"

import { ArrowLeft, Heart, Clock, AlertCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Sidebar } from "../../SideBar"

export default function CPRInstructions() {
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
                        <h1 className="text-4xl font-bold text-[#1a0000] mb-2">CPR Instructions</h1>
                        <p className="text-[#740000]">Cardiopulmonary Resuscitation - Life-saving procedure</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Emergency Alert */}
                        <div className="bg-[#b90000] text-[#fff3ea] p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <AlertCircle className="w-5 h-5" />
                                <h3 className="font-bold text-lg">Emergency Situation</h3>
                            </div>
                            <p>Perform CPR only when a person is unresponsive and not breathing normally.</p>
                        </div>

                        {/* Steps */}
                        <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg p-6">
                            <h2 className="text-2xl font-bold text-[#1a0000] mb-4">CPR Steps for Adults</h2>
                            
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 bg-[#b90000] text-[#fff3ea] rounded-full flex items-center justify-center font-bold">
                                        1
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-[#1a0000]">Check Responsiveness</h3>
                                        <p className="text-[#740000]">Tap shoulder and shout "Are you OK?" Check for normal breathing.</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 bg-[#b90000] text-[#fff3ea] rounded-full flex items-center justify-center font-bold">
                                        2
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-[#1a0000]">Call for Help</h3>
                                        <p className="text-[#740000]">Shout for help and call emergency services. Send someone for an AED.</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 bg-[#b90000] text-[#fff3ea] rounded-full flex items-center justify-center font-bold">
                                        3
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-[#1a0000]">Open Airway</h3>
                                        <p className="text-[#740000]">Tilt head back and lift chin to open airway.</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 bg-[#b90000] text-[#fff3ea] rounded-full flex items-center justify-center font-bold">
                                        4
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-[#1a0000]">Check Breathing</h3>
                                        <p className="text-[#740000]">Look, listen, and feel for normal breathing for no more than 10 seconds.</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 bg-[#b90000] text-[#fff3ea] rounded-full flex items-center justify-center font-bold">
                                        5
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-[#1a0000]">Begin Compressions</h3>
                                        <p className="text-[#740000]">
                                            • Place heel of one hand on center of chest<br/>
                                            • Place other hand on top, interlock fingers<br/>
                                            • Position shoulders directly over hands<br/>
                                            • Push hard and fast: 2-2.4 inches deep<br/>
                                            • Rate: 100-120 compressions per minute
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 bg-[#b90000] text-[#fff3ea] rounded-full flex items-center justify-center font-bold">
                                        6
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-[#1a0000]">Give Rescue Breaths</h3>
                                        <p className="text-[#740000]">
                                            • After 30 compressions, give 2 breaths<br/>
                                            • Tilt head, lift chin, pinch nose<br/>
                                            • Seal your mouth over theirs<br/>
                                            • Blow for 1 second, chest should rise<br/>
                                            • Repeat cycle of 30:2
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg p-6">
                            <h3 className="text-lg font-bold text-[#1a0000] mb-4 flex items-center gap-2">
                                <Clock className="text-[#b90000]" />
                                Timing Reference
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-[#740000]">Compression Rate</span>
                                    <span className="font-semibold text-[#1a0000]">100-120/min</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#740000]">Compression Depth</span>
                                    <span className="font-semibold text-[#1a0000]">2-2.4 inches</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#740000]">Compression:Ventilation</span>
                                    <span className="font-semibold text-[#1a0000]">30:2</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}