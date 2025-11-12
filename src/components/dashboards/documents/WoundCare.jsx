"use client"

import { ArrowLeft, Shield, AlertTriangle, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export default function WoundCare() {
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

                                <div className="flex gap-4">
                                    <CheckCircle className="w-6 h-6 text-[#1a0000] flex-shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-semibold text-[#1a0000]">5. Monitor for Infection</h3>
                                        <p className="text-[#740000]">Watch for redness, swelling, pus, fever, or increasing pain.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Wound Types */}
                        <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg p-6">
                            <h3 className="text-xl font-bold text-[#1a0000] mb-4">Specific Wound Types</h3>
                            
                            <div className="space-y-4">
                                <div className="border-l-4 border-[#b90000] pl-4">
                                    <h4 className="font-semibold text-[#1a0000]">Abrasions (Scrapes)</h4>
                                    <p className="text-[#740000] text-sm">
                                        • Clean thoroughly to remove debris<br/>
                                        • Apply antibiotic ointment<br/>
                                        • Cover with non-stick dressing<br/>
                                        • Change dressing daily
                                    </p>
                                </div>

                                <div className="border-l-4 border-[#b90000] pl-4">
                                    <h4 className="font-semibold text-[#1a0000]">Lacerations (Cuts)</h4>
                                    <p className="text-[#740000] text-sm">
                                        • Control bleeding with direct pressure<br/>
                                        • Clean wound edges<br/>
                                        • Use butterfly closures for small cuts if edges gap<br/>
                                        • Seek medical care for deep wounds
                                    </p>
                                </div>

                                <div className="border-l-4 border-[#b90000] pl-4">
                                    <h4 className="font-semibold text-[#1a0000]">Puncture Wounds</h4>
                                    <p className="text-[#740000] text-sm">
                                        • Allow to bleed briefly to flush out bacteria<br/>
                                        • Clean thoroughly<br/>
                                        • Do not close puncture wounds<br/>
                                        • Watch for signs of infection
                                    </p>
                                </div>

                                <div className="border-l-4 border-[#b90000] pl-4">
                                    <h4 className="font-semibold text-[#1a0000]">Avulsions (Tissue Tears)</h4>
                                    <p className="text-[#740000] text-sm">
                                        • Control bleeding immediately<br/>
                                        • Place avulsed tissue in clean container<br/>
                                        • Keep tissue cool (not frozen)<br/>
                                        • Transport with patient to hospital
                                    </p>
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
                                <li>• Tetanus shot overdue</li>
                                <li>• Numbness or loss of function</li>
                            </ul>
                        </div>

                        {/* Infection Signs */}
                        <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg p-6">
                            <h3 className="text-lg font-bold text-[#1a0000] mb-4">Signs of Infection</h3>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-[#b90000] rounded-full"></div>
                                    <span className="text-[#740000]">Redness spreading from wound</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-[#b90000] rounded-full"></div>
                                    <span className="text-[#740000]">Swelling and warmth</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-[#b90000] rounded-full"></div>
                                    <span className="text-[#740000]">Pus or cloudy drainage</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-[#b90000] rounded-full"></div>
                                    <span className="text-[#740000]">Fever or chills</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-[#b90000] rounded-full"></div>
                                    <span className="text-[#740000]">Increasing pain</span>
                                </div>
                            </div>
                        </div>

                        {/* Supplies Checklist */}
                        <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg p-6">
                            <h3 className="text-lg font-bold text-[#1a0000] mb-4">Essential Supplies</h3>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-[#1a0000]" />
                                    <span className="text-[#740000]">Sterile gloves</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-[#1a0000]" />
                                    <span className="text-[#740000]">Sterile gauze pads</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-[#1a0000]" />
                                    <span className="text-[#740000]">Antiseptic wipes</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-[#1a0000]" />
                                    <span className="text-[#740000]">Bandages of various sizes</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-[#1a0000]" />
                                    <span className="text-[#740000]">Medical tape</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-[#1a0000]" />
                                    <span className="text-[#740000]">Antibiotic ointment</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}