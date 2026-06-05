"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit, Trash2Icon } from "lucide-react";
import { getClientById, deleteClient } from "../services/clientService";

export default function ClientDetail({ id }) {
  const router = useRouter();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const data = await getClientById(id);
        setClient(data);
      } catch (error) {
        console.error("Error fetching client:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClient();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      try {
        await deleteClient(id);
        router.push("/clients");
      } catch (error) {
        console.error("Error deleting client:", error);
      }
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "40px 28px", textAlign: "center" }}>
        <div style={{ fontSize: 14, color: "var(--muted)" }}>Loading...</div>
      </div>
    );
  }

  if (!client) {
    return (
      <div style={{ padding: "40px 28px" }}>
        <button
          className="btn-outline"
          onClick={() => router.push("/clients")}
          style={{ marginBottom: 20 }}
        >
          <ArrowLeft size={13} /> Back to Clients
        </button>
        <div style={{ textAlign: "center", color: "var(--muted)" }}>
          Client not found
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "0 0 32px" }}>
      <div className="page-header">
        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <button
            className="btn-outline"
            onClick={() => router.push("/clients")}
          >
            <ArrowLeft size={13} /> Back
          </button>
          <div>
            <div className="page-title">
              {client.firstName} {client.lastName}
            </div>
            <div className="page-subtitle">Client ID: {client.id}</div>
          </div>
        </div>
      </div>

      <div style={{ padding: "16px 28px" }}>
        <div
          style={{
            background: "white",
            border: "1px solid var(--sand)",
            borderRadius: 12,
            padding: "24px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 32,
              marginBottom: 32,
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "var(--muted)",
                  textTransform: "uppercase",
                  marginBottom: 12,
                }}
              >
                Personal Information
              </h3>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "var(--muted)",
                      textTransform: "uppercase",
                    }}
                  >
                    Full Name
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--dark)",
                      marginTop: 4,
                    }}
                  >
                    {client.firstName} {client.lastName}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "var(--muted)",
                      textTransform: "uppercase",
                    }}
                  >
                    National ID
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--dark)",
                      marginTop: 4,
                    }}
                  >
                    {client.nationalId}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "var(--muted)",
                      textTransform: "uppercase",
                    }}
                  >
                    Phone
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--dark)",
                      marginTop: 4,
                    }}
                  >
                    {client.phone}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "var(--muted)",
                      textTransform: "uppercase",
                    }}
                  >
                    Email
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--dark)",
                      marginTop: 4,
                    }}
                  >
                    {client.email}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "var(--muted)",
                  textTransform: "uppercase",
                  marginBottom: 12,
                }}
              >
                Dermatological Information
              </h3>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "var(--muted)",
                      textTransform: "uppercase",
                    }}
                  >
                    Skin Type
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--dark)",
                      marginTop: 4,
                    }}
                  >
                    {client.skin}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "var(--muted)",
                      textTransform: "uppercase",
                    }}
                  >
                    Registered Date
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--dark)",
                      marginTop: 4,
                    }}
                  >
                    {client.registeredDate}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button
              className="btn-outline"
              onClick={() => navigate(`/clients/${id}/edit`)}
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <Edit size={13} /> Edit
            </button>
            <button
              className="btn-outline"
              onClick={handleDelete}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: "#E05C5C",
                borderColor: "#E05C5C",
              }}
            >
              <Trash2Icon size={13} /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
