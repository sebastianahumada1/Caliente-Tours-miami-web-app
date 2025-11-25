import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const resendApiKey = process.env.RESEND_API_KEY;
const resendFrom = process.env.RESEND_FROM_EMAIL;

const contactSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio").max(120),
  email: z.string().trim().email("Correo inválido").max(160),
  phone: z.string().trim().max(40).optional().default(""),
  date: z.string().trim().max(60).optional().default(""),
  guests: z
    .union([z.coerce.number().int().min(1).max(200), z.literal("").optional()])
    .optional()
    .default(""),
  message: z.string().trim().min(1, "El mensaje es obligatorio").max(2000),
});

type ContactPayload = z.infer<typeof contactSchema>;

const HTML_ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => HTML_ENTITIES[char] ?? char);
}

function buildHtml(payload: ContactPayload & { guestsFormatted: string }) {
  const rows = [
    ["Nombre", payload.name],
    ["Correo", payload.email],
    ["Teléfono", payload.phone || "—"],
    ["Fecha deseada", payload.date || "—"],
    ["Número de invitados", payload.guestsFormatted || "—"],
  ]
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:4px 8px;font-weight:600;">${escapeHtml(label)}</td>
          <td style="padding:4px 8px;">${escapeHtml(value)}</td>
        </tr>
      `,
    )
    .join("");

  return `
    <table style="border-collapse:collapse;width:100%;max-width:520px;font-family:Arial,sans-serif;">
      <tbody>
        ${rows}
        <tr>
          <td style="padding:4px 8px;font-weight:600;vertical-align:top;">Mensaje</td>
          <td style="padding:4px 8px;white-space:pre-wrap;">${escapeHtml(payload.message)}</td>
        </tr>
      </tbody>
    </table>
  `;
}

function buildText(payload: ContactPayload & { guestsFormatted: string }) {
  return [
    `Nombre: ${payload.name}`,
    `Correo: ${payload.email}`,
    `Teléfono: ${payload.phone || "—"}`,
    `Fecha: ${payload.date || "—"}`,
    `Invitados: ${payload.guestsFormatted || "—"}`,
    "",
    "Mensaje:",
    payload.message,
  ].join("\n");
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = contactSchema.parse(json);

    const guestsFormatted =
      typeof parsed.guests === "number" && !Number.isNaN(parsed.guests)
        ? `${parsed.guests} ${parsed.guests === 1 ? "persona" : "personas"}`
        : "";

    const sanitizedPayload = { ...parsed, guestsFormatted };

    if (!resendApiKey || !resendFrom) {
      console.warn(
        "[contact] RESEND_API_KEY o RESEND_FROM_EMAIL no configurados. Se omite el envío.",
      );
      return NextResponse.json(
        {
          success: true,
          delivered: false,
          message:
            "El mensaje fue recibido localmente pero no se envió porque Resend no está configurado.",
        },
        { status: 202 },
      );
    }

    const resend = new Resend(resendApiKey);
    await resend.emails.send({
      from: resendFrom,
      to: resendFrom,
      reply_to: parsed.email,
      subject: `Nueva solicitud de contacto: ${parsed.name}`,
      html: buildHtml(sanitizedPayload),
      text: buildText(sanitizedPayload),
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.flatten().fieldErrors },
        { status: 422 },
      );
    }

    console.error("[contact] Error inesperado:", error);
    return NextResponse.json(
      {
        success: false,
        error: "No se pudo enviar el mensaje en este momento.",
      },
      { status: 500 },
    );
  }
}

