"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Save } from "lucide-react";

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        b2bApiKey: "",
        b2bBaseUrl: "http://localhost:5000",
        defaultDoctorId: "",
    });

    useEffect(() => {
        fetch("/api/settings")
            .then((res) => res.json())
            .then((data) => {
                if (!data.error) {
                    setFormData({
                        b2bApiKey: data.b2bApiKey || "",
                        b2bBaseUrl: data.b2bBaseUrl || "http://localhost:5000",
                        defaultDoctorId: data.defaultDoctorId || "",
                    });
                }
            })
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch("/api/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Failed to save settings");

            toast.success("Settings saved successfully.");
        } catch (err: any) {
            toast.error(err.message || "An error occurred");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-neutral-400">Loading settings...</div>;

    return (
        <div className="max-w-2xl mx-auto mt-8">
            <Card className="bg-neutral-900 border-neutral-800 backdrop-blur">
                <CardHeader>
                    <CardTitle className="text-2xl text-white">B2B Integration Settings</CardTitle>
                    <CardDescription className="text-neutral-400">
                        Configure this demo Next.js application to connect to the main Smart Queue Backend.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSave}>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="b2bBaseUrl" className="text-white">Smart Queue Backend URL</Label>
                            <Input
                                id="b2bBaseUrl"
                                value={formData.b2bBaseUrl}
                                onChange={(e) => setFormData({ ...formData, b2bBaseUrl: e.target.value })}
                                className="bg-neutral-950 border-neutral-800 text-white"
                                placeholder="http://localhost:5000"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="b2bApiKey" className="text-white">B2B API Key</Label>
                            <Input
                                id="b2bApiKey"
                                type="password"
                                value={formData.b2bApiKey}
                                onChange={(e) => setFormData({ ...formData, b2bApiKey: e.target.value })}
                                className="bg-neutral-950 border-neutral-800 text-white"
                                placeholder="sq_test_..."
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="defaultDoctorId" className="text-white">Target Doctor ID</Label>
                            <Input
                                id="defaultDoctorId"
                                value={formData.defaultDoctorId}
                                onChange={(e) => setFormData({ ...formData, defaultDoctorId: e.target.value })}
                                className="bg-neutral-950 border-neutral-800 text-white"
                                placeholder="65cbd..."
                                required
                            />
                            <p className="text-xs text-neutral-500">
                                The MongoDB ObjectId of the doctor in the main backend whose queue will be managed.
                            </p>
                        </div>
                    </CardContent>
                    <CardFooter className="bg-neutral-900/50 border-t border-neutral-800 pt-6">
                        <Button type="submit" disabled={saving} className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
                            <Save className="w-4 h-4" />
                            {saving ? "Saving..." : "Save Configuration"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
