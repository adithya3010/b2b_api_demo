"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { CalendarPlus, CalendarDays, Send } from "lucide-react";

export default function AppointmentsPage() {
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        patientName: "",
        phone: "",
        scheduledAt: "",
        notes: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            // Ensure time includes correct ISO format. Simple UI trick using local string.
            const dateObj = new Date(formData.scheduledAt);

            const res = await fetch("/api/appointment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    scheduledAt: dateObj.toISOString()
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Appointment booking failed");

            setSuccess(true);
            toast.success("Appointment booked successfully!");
            setFormData({ patientName: "", phone: "", scheduledAt: "", notes: "" });

            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            toast.error(err.message || "An error occurred");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-8">
            <Card className="bg-neutral-900 border-neutral-800 backdrop-blur">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-2xl text-white flex items-center gap-2">
                                <CalendarPlus className="w-6 h-6 text-pink-500" /> Book Appointment
                            </CardTitle>
                            <CardDescription className="text-neutral-400 mt-2">
                                Schedule a future appointment hitting the /api/v1/appointments/book B2B API.
                            </CardDescription>
                        </div>
                        <div className="bg-pink-500/10 p-3 rounded-xl border border-pink-500/20">
                            <CalendarDays className="w-6 h-6 text-pink-400" />
                        </div>
                    </div>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 col-span-2 sm:col-span-1">
                                <Label htmlFor="name" className="text-white">Patient Name</Label>
                                <Input
                                    id="name"
                                    value={formData.patientName}
                                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                                    className="bg-neutral-950 border-neutral-800 text-white"
                                    placeholder="Jane Doe"
                                    required
                                />
                            </div>

                            <div className="space-y-2 col-span-2 sm:col-span-1">
                                <Label htmlFor="phone" className="text-white">Phone</Label>
                                <Input
                                    id="phone"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="bg-neutral-950 border-neutral-800 text-white"
                                    placeholder="555-0199"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="scheduledAt" className="text-white">Date and Time</Label>
                            <Input
                                id="scheduledAt"
                                type="datetime-local"
                                value={formData.scheduledAt}
                                onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                                className="bg-neutral-950 border-neutral-800 text-white color-scheme-dark"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes" className="text-white">Notes</Label>
                            <Input
                                id="notes"
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                className="bg-neutral-950 border-neutral-800 text-white"
                                placeholder="Initial consultation..."
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="pt-4 border-t border-neutral-800 bg-neutral-900/50">
                        <Button
                            type="submit"
                            disabled={submitting || success}
                            className={`w-full gap-2 font-semibold ${success ? 'bg-green-600 hover:bg-green-600' : 'bg-pink-600 hover:bg-pink-700'} text-white`}
                        >
                            {success ? "Success!" : submitting ? "Booking..." : <><Send className="w-4 h-4" /> Schedule Visit</>}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
