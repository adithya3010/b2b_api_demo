import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const settings = await prisma.setting.findFirst();
        return NextResponse.json(settings || {});
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { b2bApiKey, b2bBaseUrl, defaultDoctorId } = body;

        let settings = await prisma.setting.findFirst();
        if (settings) {
            settings = await prisma.setting.update({
                where: { id: settings.id },
                data: { b2bApiKey, b2bBaseUrl, defaultDoctorId },
            });
        } else {
            settings = await prisma.setting.create({
                data: { b2bApiKey, b2bBaseUrl, defaultDoctorId },
            });
        }

        return NextResponse.json(settings);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
    }
}
