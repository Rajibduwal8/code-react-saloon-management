"use client";

import React from "react";
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell } from "recharts";
import {
  DollarSign,
  Calendar,
  CheckSquare,
  GraduationCap,
  Circle,
} from "lucide-react";

const weeklyData = [
  { day: "Sun", vol: 15 },
  { day: "Mon", vol: 24 },
  { day: "Tue", vol: 28 },
  { day: "Wed", vol: 22 },
  { day: "Thu", vol: 29 },
  { day: "Fri", vol: 8 },
  { day: "Sat", vol: 20 },
];

const timeline = [
  {
    time: "11:30 AM",
    day: "SUNDAY",
    name: "Customer Name",
    service: "Aromatherapy Full Body Spa.",
    amount: "NPR 2000",
    status: "CONFIRMED",
  },
  {
    time: "11:30 AM",
    day: "SUNDAY",
    name: "Customer Name",
    service: "Aromatherapy Full Body Spa.",
    amount: "NPR 2000",
    status: "SCHEDULED",
  },
  {
    time: "11:30 AM",
    day: "SUNDAY",
    name: "Customer Name",
    service: "Aromatherapy Full Body Spa.",
    amount: "NPR 2000",
    status: "SCHEDULED",
  },
  {
    time: "11:30 AM",
    day: "SUNDAY",
    name: "Customer Name",
    service: "Aromatherapy Full Body Spa.",
    amount: "NPR 2000",
    status: "SCHEDULED",
  },
];

function StatCard({ label, value, sub, icon: Icon, iconColor }) {
  return (
    <div className="stat-card">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 12,
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--muted)",
          }}
        >
          {label}
        </span>
        <Icon size={14} color={iconColor || "var(--warm)"} />
      </div>
      <div
        style={{
          fontFamily: "Playfair Display, serif",
          fontSize: 26,
          fontWeight: 700,
          color: "var(--dark)",
          marginBottom: 6,
        }}
      >
        {value}
      </div>
      {sub && <div style={{ fontSize: 11, color: "var(--muted)" }}>{sub}</div>}
    </div>
  );
}

function DonutChart() {
  return (
    <svg viewBox="0 0 120 120" width={100} height={100}>
      <circle
        cx="60"
        cy="60"
        r="45"
        fill="none"
        stroke="#E8DDD4"
        strokeWidth="14"
      />
      <circle
        cx="60"
        cy="60"
        r="45"
        fill="none"
        stroke="#4CAF50"
        strokeWidth="14"
        strokeDasharray="170 113"
        strokeDashoffset="28"
        strokeLinecap="round"
      />
      <circle
        cx="60"
        cy="60"
        r="45"
        fill="none"
        stroke="#C9A882"
        strokeWidth="14"
        strokeDasharray="60 223"
        strokeDashoffset="-142"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Dashboard() {
  return (
    <div style={{ padding: "0 0 32px" }}>
      {/* Header */}
      <div className="page-header" style={{ paddingBottom: 20 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <div className="page-title">Cultivating Studio Wellness</div>
            <div className="page-subtitle">
              Hello Ankit, welcome back. Here is your boutique performance index
              today.
            </div>
          </div>
          <div
            style={{
              fontSize: 12,
              color: "var(--muted)",
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "white",
              border: "1px solid var(--sand)",
              borderRadius: 999,
              padding: "6px 14px",
            }}
          >
            <Circle size={8} fill="var(--green)" color="var(--green)" />
            12:58:38 PM
          </div>
        </div>
      </div>

      <div
        style={{
          padding: "0 28px",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {/* Top stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
          }}
        >
          <StatCard
            label="Today Sales"
            value="NPR 150,000"
            sub="↑ 14.5% more then month"
            icon={DollarSign}
            iconColor="var(--warm)"
          />
          <StatCard
            label="Appointments Today"
            value="5"
            sub="2 Clients, 1 Students"
            icon={Calendar}
            iconColor="var(--warm)"
          />
          <StatCard
            label="Completed Treatments"
            value="2"
            sub="33% rate on 3 total"
            icon={CheckSquare}
            iconColor="var(--warm)"
          />
          <StatCard
            label="Active Course Enrolments"
            value="3"
            sub="Pending academy fees: $750"
            icon={GraduationCap}
            iconColor="var(--warm)"
          />
        </div>

        {/* Chart + Timeline */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16 }}
        >
          {/* Weekly chart */}
          <div className="stat-card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 16,
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "Playfair Display, serif",
                    fontSize: 15,
                    fontWeight: 600,
                    color: "var(--dark)",
                  }}
                >
                  Weekly Performance
                </div>
                <div style={{ fontSize: 11, color: "var(--muted)" }}>
                  Weekly service appointment volume by date
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 11,
                  color: "var(--muted)",
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "var(--warm)",
                  }}
                />
                Bookings Volume
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyData} barSize={28}>
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "var(--muted)" }}
                />
                <Bar dataKey="vol" radius={[4, 4, 0, 0]}>
                  {weeklyData.map((_, i) => (
                    <Cell key={i} fill={i === 4 ? "#8B5E3C" : "#C9A882"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Timeline */}
          <div className="timeline-card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 14,
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "Playfair Display, serif",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--dark)",
                  }}
                >
                  Upcoming Timeline
                </div>
                <div style={{ fontSize: 11, color: "var(--muted)" }}>
                  Scheduled sequence
                </div>
              </div>
              <span
                style={{
                  background: "#3D2B1F",
                  color: "white",
                  fontSize: 10,
                  fontWeight: 600,
                  borderRadius: 4,
                  padding: "2px 8px",
                }}
              >
                4 ACTIVE
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {timeline.map((t, i) => (
                <div
                  key={i}
                  style={{
                    borderBottom:
                      i < timeline.length - 1 ? "1px solid #F2EDE8" : "none",
                    paddingBottom: 10,
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      color: "var(--muted)",
                      marginBottom: 2,
                    }}
                  >
                    {t.time} AM • {t.day}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "var(--dark)",
                        }}
                      >
                        {t.name}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--muted)" }}>
                        {t.service}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: "var(--dark)",
                        }}
                      >
                        {t.amount}
                      </div>
                      <div
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          letterSpacing: "0.06em",
                          color:
                            t.status === "CONFIRMED"
                              ? "#4CAF50"
                              : "var(--muted)",
                        }}
                      >
                        {t.status}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
          }}
        >
          <StatCard
            label="Total Revenue"
            value="NPR 150,000"
            sub="↑ 14.5% more then month"
            icon={DollarSign}
            iconColor="var(--warm)"
          />
          <StatCard
            label="Top Services"
            value="2"
            sub="66% completion rate"
            icon={CheckSquare}
            iconColor="var(--warm)"
          />
          <StatCard
            label="Total Services"
            value="5"
            sub="4 new bookings within last 2 hrs"
            icon={Calendar}
            iconColor="var(--orange)"
          />
        </div>

        {/* Status allocation */}
        <div className="stat-card" style={{ maxWidth: 320 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: 16,
            }}
          >
            Status Allocation
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <DonutChart />
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { label: "Booked", color: "#4CAF50" },
                { label: "Completed", color: "#C9A882" },
                { label: "Cancelled", color: "#E8DDD4" },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{ display: "flex", alignItems: "center", gap: 8 }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 2,
                      background: item.color,
                    }}
                  />
                  <span style={{ fontSize: 12, color: "var(--muted)" }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
