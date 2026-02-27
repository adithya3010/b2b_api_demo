import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { patientName, phone, symptoms } = body;

        const settings = await prisma.setting.findFirst();
        if (!settings?.b2bApiKey || !settings?.b2bBaseUrl || !settings?.defaultDoctorId) {
            return NextResponse.json({ error: "B2B Settings not configured" }, { status: 400 });
        }

        const { b2bApiKey, b2bBaseUrl, defaultDoctorId } = settings;

        // 1. Send to B2B API
        const b2bRes = await fetch(`${b2bBaseUrl}/api/v1/queue`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": b2bApiKey,
                // Using a unique correlation ID for idempotency could happen here
            },
            body: JSON.stringify({
                doctorId: defaultDoctorId,
                externalPatientId: `walkin_${Date.now()}`,
                description: symptoms || "Walk-in consultation"
            })
        });

        if (!b2bRes.ok) {
            const errorData = await b2bRes.json().catch(() => ({}));
            throw new Error(errorData.error || "B2B API Queue creation failed");
        }

        const b2bData = await b2bRes.json();
        const { trackingUrl, tokenNumber, id: b2bQueueEntryId } = b2bData.data || {};

        const uniqueLinkId = trackingUrl ? trackingUrl.split('/status/')[1] : null;

        // 2. Log in Local SQLite
        const walkinLog = await prisma.walkinLog.create({
            data: {
                patientName,
                phone,
                symptoms,
                trackingUrl,
                uniqueLinkId,
                tokenNumber,
                b2bQueueEntryId,
                status: "WAITING"
            }
        });

        return NextResponse.json({ success: true, walkinLog });

    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message || "Failed to process walk-in" }, { status: 500 });
    }
}
