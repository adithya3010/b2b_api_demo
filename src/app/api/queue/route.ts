import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const settings = await prisma.setting.findFirst();
        if (!settings?.b2bApiKey || !settings?.b2bBaseUrl || !settings?.defaultDoctorId) {
            return NextResponse.json({ error: "B2B Settings not configured" }, { status: 400 });
        }

        const { b2bApiKey, b2bBaseUrl, defaultDoctorId } = settings;

        // Fetch Live Queue Status
        const listRes = await fetch(`${b2bBaseUrl}/api/v1/queue?doctorId=${defaultDoctorId}&status=waiting`, {
            headers: { "x-api-key": b2bApiKey },
            cache: "no-store"
        });

        // Fetch Queue Analytics
        const statsRes = await fetch(`${b2bBaseUrl}/api/v1/queue/stats?doctorId=${defaultDoctorId}`, {
            headers: { "x-api-key": b2bApiKey },
            cache: "no-store"
        });

        if (!listRes.ok || !statsRes.ok) {
            throw new Error("Failed to fetch from B2B API");
        }

        const listData = await listRes.json();
        const statsData = await statsRes.json();

        return NextResponse.json({
            queue: listData.data || [],
            stats: statsData.data || {}
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Failed to fetch queue" }, { status: 500 });
    }
}
