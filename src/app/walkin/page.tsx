"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Send, UserPlus, FileText, CheckCircle2 } from "lucide-react";

export default function WalkinPage() {
    const [submitting, setSubmitting] = useState(false);
    const [successData, setSuccessData] = useState<any>(null);

    const [formData, setFormData] = useState({
        patientName: "",
        phone: "",
        symptoms: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setSuccessData(null);
        try {
            const res = await fetch("/api/walkin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Walk-in request failed");

            setSuccessData(data.walkinLog);
            toast.success("Walk-in queued successfully!");
            setFormData({ patientName: "", phone: "", symptoms: "" });
        } catch (err: any) {
            toast.error(err.message || "An error occurred");
        } finally {
            setSubmitting(false);
        }
    };

    if (successData) {
        return (
            <div className="max-w-md mx-auto mt-12">
                <Card className="bg-neutral-900 border-indigo-500/50 text-center animate-in scale-in-95 duration-500">
                    <CardHeader>
                        <div className="mx-auto bg-green-500/20 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4">
                            <CheckCircle2 className="w-10 h-10 text-green-500" />
                        </div>
                        <CardTitle className="text-2xl text-white">Successfully Queued</CardTitle>
                        <CardDescription className="text-neutral-400">
                            Please take a seat. Your token number is below.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="py-8 bg-neutral-950 rounded-lg border border-neutral-800 my-4">
                            <div className="text-sm text-neutral-400 mb-2">TOKEN NUMBER</div>
                            <div className="text-6xl font-black text-indigo-400">{successData.tokenNumber}</div>
                        </div>
                        <a href={successData.trackingUrl} target="_blank" rel="noreferrer" className="text-sm text-indigo-400 hover:text-indigo-300 underline">
                            View Live Tracking Link
                        </a>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={() => setSuccessData(null)} variant="outline" className="w-full bg-neutral-950 text-white hover:bg-neutral-800 border-neutral-700">
                            Help Next Patient
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    return (
        <div className="max-w-md mx-auto mt-8">
            <Card className="bg-neutral-900 border-neutral-800 backdrop-blur">
                <CardHeader>
                    <CardTitle className="text-2xl text-white flex items-center gap-2">
                        <UserPlus className="w-6 h-6 text-indigo-500" /> Self-Service Kiosk
                    </CardTitle>
                    <CardDescription className="text-neutral-400">
                        Enter your details to generate a queue token securely via the B2B Gateway.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-white">Full Name</Label>
                            <Input
                                id="name"
                                value={formData.patientName}
                                onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                                className="bg-neutral-950 border-neutral-800 text-white"
                                placeholder="John Doe"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-white">Phone Number (Optional)</Label>
                            <Input
                                id="phone"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="bg-neutral-950 border-neutral-800 text-white"
                                placeholder="555-0199"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="symptoms" className="text-white">Reason for visit</Label>
                            <Input
                                id="symptoms"
                                value={formData.symptoms}
                                onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                                className="bg-neutral-950 border-neutral-800 text-white"
                                placeholder="Routine checkup, fever, etc."
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="pt-4 border-t border-neutral-800 bg-neutral-900/50">
                        <Button type="submit" disabled={submitting} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white gap-2 font-semibold">
                            <Send className="w-4 h-4" />
                            {submitting ? "Processing..." : "Generate Token"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
