"use client"

import { ArrowLeft, AlertTriangle, Heart, Thermometer } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ShockManagement() {
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

                        {/* What is Shock */}
                        <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg p-6">
                            <h2 className="text-2xl font-bold text-[#1a0000] mb-4">What is Shock?</h2>
                            <p className="text-[#740000] mb-4">
                                Shock occurs when the body isn't getting enough blood flow, which can damage multiple organs. 
                                It requires immediate medical treatment and can get worse very rapidly.
                            </p>
                        </div>

                        {/* Recognition */}
                        <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg p-6">
                            <h3 className="text-xl font-bold text-[#1a0000] mb-4">Recognizing Shock</h3>
                            
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <h4 className="font-semibold text-[#b90000]">Early Signs</h4>
                                    <ul className="text-[#740000] space-y-2">
                                        <li>• Pale, cool, clammy skin</li>
                                        <li>• Rapid, weak pulse</li>
                                        <li>• Rapid, shallow breathing</li>
                                        <li>• Anxiety or restlessness</li>
                                        <li>• Nausea or vomiting</li>
                                    </ul>
                                </div>
                                <div className="space-y-3">
                                    <h4 className="font-semibold text-[#b90000]">Late Signs</h4>
                                    <ul className="text-[#740000] space-y-2">
                                        <li>• Blue lips and fingernails</li>
                                        <li>• Confusion or disorientation</li>
                                        <li>• Weakness and dizziness</li>
                                        <li>• Loss of consciousness</li>
                                        <li>• Little or no urine output</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Treatment Steps */}
                        <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg p-6">
                            <h3 className="text-xl font-bold text-[#1a0000] mb-4">Emergency Treatment Steps</h3>
                            
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 bg-[#b90000] text-[#fff3ea] rounded-full flex items-center justify-center font-bold">
                                        1
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-[#1a0000]">Call Emergency Services</h4>
                                        <p className="text-[#740000]">Immediately call for professional medical help. Shock is a medical emergency.</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 bg-[#b90000] text-[#fff3ea] rounded-full flex items-center justify-center font-bold">
                                        2
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-[#1a0000]">Lie Patient Down</h4>
                                        <p className="text-[#740000]">Have the person lie on their back. Do not give them anything to eat or drink.</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 bg-[#b90000] text-[#fff3ea] rounded-full flex items-center justify-center font-bold">
                                        3
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-[#1a0000]">Elevate Legs</h4>
                                        <p className="text-[#740000]">Raise the person's legs about 12 inches (unless you suspect spinal injury).</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 bg-[#b90000] text-[#fff3ea] rounded-full flex items-center justify-center font-bold">
                                        4
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-[#1a0000]">Keep Warm</h4>
                                        <p className="text-[#740000]">Cover with a blanket or coat to maintain body temperature.</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 bg-[#b90000] text-[#fff3ea] rounded-full flex items-center justify-center font-bold">
                                        5
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-[#1a0000]">Monitor Vital Signs</h4>
                                        <p className="text-[#740000]">Check breathing, pulse, and level of consciousness regularly.</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 bg-[#b90000] text-[#fff3ea] rounded-full flex items-center justify-center font-bold">
                                        6
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-[#1a0000]">Treat Underlying Causes</h4>
                                        <p className="text-[#740000]">Control bleeding, maintain airway, treat for anaphylaxis if needed.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Types of Shock */}
                        <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg p-6">
                            <h3 className="text-lg font-bold text-[#1a0000] mb-4">Types of Shock</h3>
                            <div className="space-y-3">
                                <div>
                                    <h4 className="font-semibold text-[#b90000]">Hypovolemic</h4>
                                    <p className="text-sm text-[#740000]">Severe blood or fluid loss</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-[#b90000]">Cardiogenic</h4>
                                    <p className="text-sm text-[#740000]">Heart failure to pump effectively</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-[#b90000]">Anaphylactic</h4>
                                    <p className="text-sm text-[#740000]">Severe allergic reaction</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-[#b90000]">Septic</h4>
                                    <p className="text-sm text-[#740000]">Severe infection</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-[#b90000]">Neurogenic</h4>
                                    <p className="text-sm text-[#740000]">Spinal cord injury</p>
                                </div>
                            </div>
                        </div>

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
                                <div className="flex justify-between">
                                    <span className="text-[#740000]">Mental Status</span>
                                    <span className="font-semibold text-[#1a0000]">Anxious → confused</span>
                                </div>
                            </div>
                        </div>

                        {/* Critical Do's and Don'ts */}
                        <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg p-6">
                            <h3 className="text-lg font-bold text-[#1a0000] mb-4">Critical Guidelines</h3>
                            <div className="space-y-3">
                                <div>
                                    <h4 className="font-semibold text-[#1a0000]">DO</h4>
                                    <ul className="text-sm text-[#740000] space-y-1">
                                        <li>• Call emergency services first</li>
                                        <li>• Keep person lying down</li>
                                        <li>• Maintain body temperature</li>
                                        <li>• Monitor vital signs</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-[#1a0000]">DON'T</h4>
                                    <ul className="text-sm text-[#740000] space-y-1">
                                        <li>• Give anything by mouth</li>
                                        <li>• Move unnecessarily</li>
                                        <li>• Use heating pads</li>
                                        <li>• Leave person alone</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}