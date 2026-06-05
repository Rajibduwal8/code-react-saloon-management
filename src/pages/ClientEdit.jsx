import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AddCustomerModal from "../components/modals/AddCustomerModal";
import { getClientById } from "../services/clientService";

export default function ClientEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
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

  if (loading) {
    return (
      <div style={{ padding: "40px 28px", textAlign: "center" }}>
        <div style={{ fontSize: 14, color: "var(--muted)" }}>Loading...</div>
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
            onClick={() => navigate(`/clients/${id}`)}
          >
            <ArrowLeft size={13} /> Back
          </button>
          <div>
            <div className="page-title">Edit Client</div>
            <div className="page-subtitle">Update client information</div>
          </div>
        </div>
      </div>

      {client && (
        <AddCustomerModal
          clientData={client}
          onClose={() => navigate(`/clients/${id}`)}
          onSuccess={() => navigate(`/clients/${id}`)}
        />
      )}
    </div>
  );
}
