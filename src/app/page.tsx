
"use client";

import { useState, type FormEvent } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setResult("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const enquiry = {
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      organization: formData.get("organization"),
      role: formData.get("role"),
      message: formData.get("message"),
    };

    try {
      const response = await fetch("/api/sendmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(enquiry),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Email sending failed.");
      }

      setResult("Thank you! Your enquiry has been sent successfully.");
      form.reset();

    } catch (error) {
      setResult(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{
      minHeight: "100vh",
      background: "#f3f6fa",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "30px",
      fontFamily: "Arial, sans-serif"
    }}>

      <div style={{
        background: "white",
        padding: "35px",
        borderRadius: "15px",
        width: "100%",
        maxWidth: "550px",
        boxShadow: "0 5px 25px rgba(0,0,0,0.08)"
      }}>

        <h1 style={{ color: "#17365d", textAlign: "center" }}>
          BeaverTek
        </h1>

        <h2 style={{ textAlign: "center", color: "#333" }}>
          Enquiry Form
        </h2>

        <p style={{ textAlign: "center", color: "#777" }}>
          Please fill in your details. We will contact you soon.
        </p>

        <form onSubmit={handleSubmit}>

          <label>Full Name</label>
          <input name="fullName" required placeholder="Enter your name"
            style={inputStyle} />

          <label>Email Address</label>
          <input name="email" type="email" required
            placeholder="Enter your email" style={inputStyle} />

          <label>Phone Number</label>
          <input name="phone" type="tel" required
            placeholder="Enter your phone number" style={inputStyle} />

          <label>Organization</label>
          <input name="organization" required
            placeholder="Enter organization name" style={inputStyle} />

          <label>Role</label>
          <input name="role" required
            placeholder="Enter your role" style={inputStyle} />

          <label>Message</label>
          <textarea name="message" required rows={4}
            placeholder="Write your enquiry here"
            style={inputStyle} />

          <button type="submit" disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              background: "#17365d",
              color: "white",
              border: "none",
              borderRadius: "7px",
              fontSize: "16px",
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: "15px"
            }}>
            {loading ? "Sending..." : "Submit Enquiry"}
          </button>

          <p style={{ textAlign: "center", marginTop: "15px" }}>
            {result}
          </p>

        </form>
      </div>
    </main>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "7px",
  marginBottom: "18px",
  border: "1px solid #ccc",
  borderRadius: "6px",
  boxSizing: "border-box" as const,
  fontSize: "15px"
};
