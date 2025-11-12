"use client"

import { ArrowLeft, Heart, Clock, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export default function CPRInstructions() {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#fff3ea] via-[#fff3ea] to-[#ffe6c5]">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 px-4 py-2 border border-[#ffe6c5] text-[#1a0000] hover:bg-[#ffe6c5] rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </button>
                    <div>
                        <h1 className="text-4xl font-bold text-[#1a0000] mb-2">CPR Instructions</h1>
                        <p className="text-[#740000]">Cardiopulmonary Resuscitation - Life-saving procedure</p>
                    </div>
                </div>

                {/* Main Content */}
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
                        <div className="space-y-6">
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

                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 w-8 h-8 bg-[#b90000] text-[#fff3ea] rounded-full flex items-center justify-center font-bold">
                                            7
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-[#1a0000]">Continue Until</h3>
                                            <p className="text-[#740000]">
                                                • AED arrives<br/>
                                                • EMS takes over<br/>
                                                • Person starts breathing normally<br/>
                                                • You are too exhausted to continue
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Compression Technique */}
                            <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg p-6">
                                <h3 className="text-xl font-bold text-[#1a0000] mb-4">Proper Compression Technique</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-[#b90000]">DO</h4>
                                        <ul className="text-[#740000] space-y-1">
                                            <li>• Push straight down</li>
                                            <li>• Allow full chest recoil</li>
                                            <li>• Minimize interruptions</li>
                                            <li>• Switch rescuers every 2 minutes</li>
                                        </ul>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-[#b90000]">DON'T</h4>
                                        <ul className="text-[#740000] space-y-1">
                                            <li>• Bend elbows</li>
                                            <li>• Lean on chest between compressions</li>
                                            <li>• Compress too slowly or too fast</li>
                                            <li>• Stop unless absolutely necessary</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Timing Reference */}
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
                                <div className="flex justify-between">
                                    <span className="text-[#740000]">Rescue Breath Duration</span>
                                    <span className="font-semibold text-[#1a0000]">1 second each</span>
                                </div>
                            </div>
                        </div>

                        {/* Special Considerations */}
                        <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg p-6">
                            <h3 className="text-lg font-bold text-[#1a0000] mb-4">Special Considerations</h3>
                            <div className="space-y-3">
                                <div>
                                    <h4 className="font-semibold text-[#b90000]">Children (1-8 years)</h4>
                                    <p className="text-sm text-[#740000]">Use one or two hands, compress about 2 inches deep</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-[#b90000]">Infants (under 1 year)</h4>
                                    <p className="text-sm text-[#740000]">Use two fingers, compress 1.5 inches deep</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-[#b90000]">Pregnant Women</h4>
                                    <p className="text-sm text-[#740000]">Place wedge under right hip to displace uterus</p>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg p-6">
                            <h3 className="text-lg font-bold text-[#1a0000] mb-4">Quick Actions</h3>
                            <div className="space-y-2">
                                <button className="w-full text-left px-3 py-2 border border-[#ffe6c5] text-[#1a0000] hover:bg-[#ffe6c5] rounded transition-colors">
                                    Download CPR Guide PDF
                                </button>
                                <button className="w-full text-left px-3 py-2 border border-[#ffe6c5] text-[#1a0000] hover:bg-[#ffe6c5] rounded transition-colors">
                                    Watch Training Video
                                </button>
                                <button className="w-full text-left px-3 py-2 border border-[#ffe6c5] text-[#1a0000] hover:bg-[#ffe6c5] rounded transition-colors">
                                    Find CPR Classes Nearby
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}