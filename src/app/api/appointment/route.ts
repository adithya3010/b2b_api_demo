import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { patientName, phone, scheduledAt, notes } = body;

        const settings = await prisma.setting.findFirst();
        if (!settings?.b2bApiKey || !settings?.b2bBaseUrl || !settings?.defaultDoctorId) {
            return NextResponse.json({ error: "B2B Settings not configured" }, { status: 400 });
        }

        const { b2bApiKey, b2bBaseUrl, defaultDoctorId } = settings;

        // 1. Send to B2B API
        const b2bRes = await fetch(`${b2bBaseUrl}/api/v1/appointments/book`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": b2bApiKey
            },
            body: JSON.stringify({
                doctorId: defaultDoctorId,
                patientName,
                phone,
                scheduledAt,
                notes
            })
        });

        if (!b2bRes.ok) {
            const errorData = await b2bRes.json().catch(() => ({}));
            throw new Error(errorData.error || "B2B API Appointment booking failed");
        }

        const b2bData = await b2bRes.json();
        const { id: b2bAppointmentId } = b2bData.data || {};

        // 2. Log in Local SQLite
        const appointmentLog = await prisma.appointmentLog.create({
            data: {
                patientName,
                phone,
                scheduledAt: new Date(scheduledAt),
                notes,
                b2bAppointmentId,
                status: "SCHEDULED"
            }
        });

        return NextResponse.json({ success: true, appointmentLog });

    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message || "Failed to book appointment" }, { status: 500 });
    }
}
