import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

type EmailPayload = {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailPayload) {
  if (!resend) {
    console.log('⚠️ RESEND_API_KEY no encontrada. Simulando envío de correo:')
    console.log(`To: ${to}`)
    console.log(`Subject: ${subject}`)
    // console.log(`HTML: ${html}`)
    return { success: true, simulated: true }
  }

  try {
    const data = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'IglesiaApp <onboarding@resend.dev>',
      to,
      subject,
      html,
    })
    return { success: true, data }
  } catch (error) {
    console.error('Error enviando email:', error)
    return { success: false, error }
  }
}

export function generateReceiptEmailHtml(memberName: string, amount: number, type: string, date: Date, receiptNumber: number) {
  const formattedAmount = amount.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })
  const formattedDate = date.toLocaleDateString('es-CL')

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #4f46e5; text-align: center;">Comprobante de Recepción</h2>
      <p>Estimado/a <strong>${memberName}</strong>,</p>
      <p>Agradecemos profundamente su fidelidad y compromiso con la obra del Señor.</p>
      <p>Hemos recibido su aporte con los siguientes detalles:</p>
      
      <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>Tipo:</strong> ${type}</p>
        <p style="margin: 5px 0;"><strong>Monto:</strong> ${formattedAmount}</p>
        <p style="margin: 5px 0;"><strong>Fecha:</strong> ${formattedDate}</p>
        <p style="margin: 5px 0;"><strong>N° Recibo:</strong> #${receiptNumber}</p>
      </div>

      <p style="font-size: 14px; color: #6b7280; text-align: center; margin-top: 30px;">
        "Cada uno dé como propuso en su corazón: no con tristeza, ni por necesidad, porque Dios ama al dador alegre." <br>
        <em>2 Corintios 9:7</em>
      </p>
      
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="font-size: 12px; color: #9ca3af; text-align: center;">
        Este es un correo automático generado por el sistema de Finanzas de la Iglesia.
      </p>
    </div>
  `
}

export function generatePasswordResetEmailHtml(token: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const resetLink = `${baseUrl}/reset-password?token=${token}`

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #4f46e5; text-align: center;">Recuperación de Contraseña</h2>
      <p>Hola,</p>
      <p>Hemos recibido una solicitud para restablecer tu contraseña en <strong>IglesiaApp</strong>.</p>
      <p>Haz clic en el siguiente botón para crear una nueva contraseña:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Restablecer Contraseña</a>
      </div>

      <p style="font-size: 14px; color: #6b7280;">Si no solicitaste este cambio, puedes ignorar este correo.</p>
      <p style="font-size: 14px; color: #6b7280;">El enlace expirará en 1 hora.</p>
    </div>
  `
}
