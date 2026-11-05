
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      fullName,
      organization,
      role,
      email,
      phone,
      message,
    } = body ?? {};

    // Clean form values
    const cleanName =
      typeof fullName === "string" ? fullName.trim() : "";

    const cleanEmail =
      typeof email === "string" ? email.trim() : "";

    const cleanPhone =
      typeof phone === "string" ? phone.trim() : "";

    const cleanOrganization =
      typeof organization === "string" ? organization.trim() : "";

    const cleanRole =
      typeof role === "string" ? role.trim() : "";

    const cleanMessage =
      typeof message === "string" ? message.trim() : "";

    // Required field validation
    if (!cleanName || !cleanEmail || !cleanPhone || !cleanRole) {
      return NextResponse.json(
        {
          success: false,
          message: "Please fill in all required fields.",
        },
        { status: 400 }
      );
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(cleanEmail)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid email address.",
        },
        { status: 400 }
      );
    }

    // Length validation
    if (
      cleanName.length > 100 ||
      cleanEmail.length > 254 ||
      cleanPhone.length > 30 ||
      cleanOrganization.length > 150 ||
      cleanRole.length > 100 ||
      cleanMessage.length > 3000
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "One or more fields are too long.",
        },
        { status: 400 }
      );
    }

    // Gmail environment variables
    const emailUser = process.env.EMAIL_USER;
    const emailPassword = process.env.EMAIL_APP_PASSWORD;
    const ownerEmail = process.env.OWNER_EMAIL;

    console.log("EMAIL CONFIG CHECK:", {
      EMAIL_USER: !!emailUser,
      EMAIL_APP_PASSWORD: !!emailPassword,
      OWNER_EMAIL: !!ownerEmail,
    });

    if (!emailUser || !emailPassword || !ownerEmail) {
      return NextResponse.json(
        {
          success: false,
          message: "Email configuration is missing.",
        },
        { status: 500 }
      );
    }

    // Gmail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser,
        pass: emailPassword.replace(/\s/g, ""),
      },
    });

    // Send email
    await transporter.sendMail({
      from: `"BeaverTek Website" <${emailUser}>`,
      to: ownerEmail,
      replyTo: cleanEmail,
      subject: `New BeaverTek Inquiry - ${cleanName}`,
      text: `
New BeaverTek Website Inquiry

Name: ${cleanName}
Email: ${cleanEmail}
Phone: ${cleanPhone}
Organization: ${cleanOrganization || "Not provided"}
Role / Service: ${cleanRole}

Message:
${cleanMessage || "No message provided"}
      `,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Your inquiry has been sent successfully.",
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Nodemailer error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to send email. Please try again.",
      },
      { status: 500 }
    );
  }
}
