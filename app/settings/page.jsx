"use client";

export default function Page() {
  return (
    <div style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>
      <div style={{ fontSize: 32, marginBottom: 8 }}>⚙️</div>
      <div
        style={{
          fontFamily: "Playfair Display, serif",
          fontSize: 20,
          color: "var(--dark)",
        }}
      >
        Tenant Settings
      </div>
      <div style={{ fontSize: 13, marginTop: 6 }}>
        System configuration and preferences
      </div>
    </div>
  );
}
