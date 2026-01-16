const { Resend } = require('resend')

// Hardcoding the key found in .env to verify it directly without env loader issues
// Key from .env: RESEND_API_KEY="re_aMsQUKWG_7qvrqqvVP9zsi5qpZ9Baxz4o"
const key = 're_aMsQUKWG_7qvrqqvVP9zsi5qpZ9Baxz4o'

const resend = new Resend(key)

async function main() {
    console.log('Sending test email to eduardoalbo7@gmail.com...')
    try {
        const data = await resend.emails.send({
            from: 'IglesiaApp <onboarding@resend.dev>',
            to: 'eduardoalbo7@gmail.com',
            subject: 'Prueba de Sistema - IglesiaApp',
            html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h1 style="color: #4f46e5;">¡El sistema de correos funciona!</h1>
          <p>Este es un mensaje de prueba enviado desde tu aplicación de Finanzas de Iglesia.</p>
          <p>Si estás leyendo esto, la integración con <strong>Resend</strong> está operativa.</p>
          <br>
          <p style="color: #666; font-size: 12px;">Enviado el: ${new Date().toLocaleString()}</p>
        </div>
      `
        })

        if (data.error) {
            console.error('Error response from Resend:', data.error)
        } else {
            console.log('Success! Email sent. ID:', data.data?.id)
        }

    } catch (error) {
        console.error('Exception sending email:', error)
    }
}

main()
