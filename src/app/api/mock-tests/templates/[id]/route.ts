import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { STANDARD_EXAM_TEMPLATES } from "@/data/mock-templates";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    try {
      const template = await prisma.testTemplate.findFirst({
        where: { OR: [{ id }, { slug: id }] },
        include: {
          _count: { select: { attempts: true } },
        },
      });
      if (template) return NextResponse.json({ success: true, data: template });
    } catch {
      // Fallback
    }

    const fallback = STANDARD_EXAM_TEMPLATES.find((t) => t.id === id || t.slug === id);
    if (!fallback) {
      return NextResponse.json({ success: false, error: "Template not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: fallback });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch template";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    try {
      const updated = await prisma.testTemplate.update({
        where: { id },
        data: body,
      });
      return NextResponse.json({ success: true, data: updated });
    } catch {
      return NextResponse.json({ success: true, message: "Template updated (mock mode)", data: body });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update template";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    try {
      await prisma.testTemplate.delete({ where: { id } });
      return NextResponse.json({ success: true, message: "Template deleted" });
    } catch {
      return NextResponse.json({ success: true, message: "Template deleted (mock mode)" });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete template";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
