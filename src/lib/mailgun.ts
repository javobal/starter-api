import mailgun from 'mailgun-js'

const mg = mailgun({
    apiKey: process.env.MAILGUN_API_KEY || '',
    domain: process.env.MAILGUN_DOMAIN || '',
})

export async function sendEmail(
    to: string,
    subject: string,
    text: string
): Promise<mailgun.messages.SendResponse | undefined> {
    const data = {
        from: 'Javobal <noreply@javobal.xyz>',
        to: to,
        subject: subject,
        text: text,
    }

    console.log(`sending email to ${to}`)

    if (process.env.NODE_ENV === 'production') {
        const response = await mg.messages().send(data)

        return response
    }

    return undefined
}
