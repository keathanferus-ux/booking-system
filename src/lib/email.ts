import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: import.meta.env.VITE_EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(import.meta.env.VITE_EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: import.meta.env.VITE_EMAIL_USER || 'placeholder@example.com',
    pass: import.meta.env.VITE_EMAIL_PASS || 'placeholder-password',
  },
})

export interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: import.meta.env.VITE_EMAIL_USER || 'placeholder@example.com',
      to,
      subject,
      html,
      text,
    })
    console.log('Email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Email sending failed:', error)
    return { success: false, error }
  }
}

export function generateBookingConfirmationEmail(
  booking: {
    title: string
    room_name: string
    start_time: string
    end_time: string
    user_name: string
  }
) {
  return {
    subject: `Meeting Room Booking Confirmed: ${booking.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Meeting Room Booking Confirmed</h2>
        <p>Hello ${booking.user_name},</p>
        <p>Your meeting room booking has been confirmed. Here are the details:</p>
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Booking Details</h3>
          <p><strong>Meeting:</strong> ${booking.title}</p>
          <p><strong>Room:</strong> ${booking.room_name}</p>
          <p><strong>Start Time:</strong> ${new Date(booking.start_time).toLocaleString()}</p>
          <p><strong>End Time:</strong> ${new Date(booking.end_time).toLocaleString()}</p>
        </div>
        <p>If you need to make any changes or cancel this booking, please contact your administrator.</p>
        <p>Best regards,<br>Meeting Room Booking System</p>
      </div>
    `,
    text: `
      Meeting Room Booking Confirmed: ${booking.title}
      
      Hello ${booking.user_name},
      
      Your meeting room booking has been confirmed. Here are the details:
      
      Meeting: ${booking.title}
      Room: ${booking.room_name}
      Start Time: ${new Date(booking.start_time).toLocaleString()}
      End Time: ${new Date(booking.end_time).toLocaleString()}
      
      If you need to make any changes or cancel this booking, please contact your administrator.
      
      Best regards,
      Meeting Room Booking System
    `
  }
}
