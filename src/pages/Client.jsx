import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EditIcon, Eye, Plus, Trash2Icon } from "lucide-react";
import Pagination from "../components/ui/Pagination";
import AddCustomerModal from "../components/modals/AddCustomerModal";
import { getClients, deleteClient } from "../services/clientService";

export default function Client() {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await getClients();
        setClients(data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      try {
        await deleteClient(id);
        setClients(clients.filter((c) => c.id !== id));
      } catch (error) {
        console.error("Error deleting client:", error);
      }
    }
  };

  const handleAddSuccess = async () => {
    // Refresh clients list
    try {
      const data = await getClients();
      setClients(data);
    } catch (error) {
      console.error("Error refreshing clients:", error);
    }
  };

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
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <div className="page-title">Client Enrollment Log</div>
            <div className="page-subtitle">
              Manage vocational courses, category classifications, and track
              client payment logs, communication logs, and issue certificates.
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn-primary" onClick={() => setShowModal(true)}>
              <Plus size={13} /> Add Customer
            </button>
            <button className="btn-outline">
              <Plus size={13} /> New Booking
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: "16px 28px 0" }}>
        <div
          style={{
            background: "white",
            border: "1px solid var(--sand)",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "14px 16px",
              borderBottom: "1px solid #F2EDE8",
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "var(--dark)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Client List
            </div>
            <div className="search-bar" style={{ minWidth: 220 }}>
              <input placeholder="Search Client with Name / Id" />
            </div>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  {[
                    "Customer",
                    "Phone",
                    "Email",
                    "Skin Type",
                    "Registered Date",
                    "Action",
                  ].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.id}>
                    <td>
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: 12,
                          color: "var(--dark)",
                        }}
                      >
                        {client.firstName} {client.lastName}
                      </div>
                      <div style={{ fontSize: 10, color: "var(--muted)" }}>
                        {client.nationalId}
                      </div>
                    </td>
                    <td style={{ fontSize: 12 }}>{client.phone}</td>
                    <td style={{ fontSize: 11, color: "var(--muted)" }}>
                      {client.email}
                    </td>
                    <td style={{ fontSize: 12 }}>{client.skin}</td>
                    <td style={{ fontSize: 12 }}>{client.registeredDate}</td>
                    <td>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={() => navigate(`/clients/${client.id}`)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "#4CAF50",
                            fontSize: 14,
                          }}
                          title="View"
                        >
                          <Eye size={13} />
                        </button>
                        <button
                          onClick={() => navigate(`/clients/${client.id}/edit`)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "var(--warm)",
                            fontSize: 14,
                          }}
                          title="Edit"
                        >
                          <EditIcon size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(client.id)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "#E05C5C",
                            fontSize: 14,
                          }}
                          title="Delete"
                        >
                          <Trash2Icon size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination />
        </div>
      </div>

      {showModal && (
        <AddCustomerModal
          onClose={() => setShowModal(false)}
          onSuccess={handleAddSuccess}
        />
      )}
    </div>
  );
}
