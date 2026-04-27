export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, message } = req.body;

    // =========================
    // 1. EMAIL TO YOU (ADMIN)
    // =========================
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "Choupette <onboarding@resend.dev>",
        to: ["ryzenoutsourcing@gmail.com"],
        subject: `🚗 Nieuwe aanvraag / Nouvelle demande - ${name}`,
        html: `
          <div style="font-family:Arial;padding:20px;">
            <h2 style="color:#C5A059;">Nieuwe aanvraag (NL)</h2>
            <p><strong>Naam:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Bericht:</strong><br>${message}</p>

            <hr>

            <h2 style="color:#C5A059;">Nouvelle demande (FR)</h2>
            <p><strong>Nom:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong><br>${message}</p>

            <hr>
            <p style="font-size:12px;color:#777;">
              Choupette Website Lead
            </p>
          </div>
        `
      })
    });

    // =========================
    // 2. EMAIL TO CLIENT
    // =========================
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "Choupette <onboarding@resend.dev>",
        to: [email],
        subject: "✅ Wij hebben uw aanvraag ontvangen / Nous avons reçu votre demande",
        html: `
          <div style="font-family:Arial;padding:20px;">
            <h2 style="color:#C5A059;">Choupette</h2>

            <!-- NL -->
            <h3>Nederlands</h3>
            <p>Beste ${name},</p>
            <p>Bedankt voor uw aanvraag. Wij hebben uw bericht goed ontvangen en nemen zo snel mogelijk contact met u op.</p>

            <hr>

            <!-- FR -->
            <h3>Français</h3>
            <p>Bonjour ${name},</p>
            <p>Merci pour votre demande. Nous avons bien reçu votre message et nous vous contacterons rapidement.</p>

            <hr>

            <p style="font-size:12px;color:#777;">
              Choupette – Master-level automotive excellence
            </p>
          </div>
        `
      })
    });

    return res.status(200).json({ success: true });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
