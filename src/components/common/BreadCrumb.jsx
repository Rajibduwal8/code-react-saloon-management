import React from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function BreadCrumb({ pageTitle, title, breadcrumbItems = [] }) {
  return (
    <div style={{ marginBottom: "24px", padding: "0 28px" }}>
      <div className="page-header" style={{ borderBottom: "none", padding: "20px 0 10px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div className="page-title">{title}</div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--muted)", marginTop: "4px" }}>
              <span>{pageTitle}</span>
              {breadcrumbItems.map((item, idx) => (
                <React.Fragment key={idx}>
                  <ChevronRight size={14} />
                  <Link href={item.link} style={{ color: "var(--brown)", textDecoration: "none", fontWeight: 500 }}>
                    {item.title}
                  </Link>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
