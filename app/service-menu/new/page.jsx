import React from "react";
import ServiceForm from "../../../src/components/forms/ServiceForm";
import BreadCrumb from "../../../src/components/common/BreadCrumb";

export default function NewServicePage() {
  return (
    <div>
      <BreadCrumb
        pageTitle="Treatment & Product Menu"
        title="Add New Service"
        breadcrumbItems={[{ title: "Back To Menu", link: "/service-menu" }]}
      />
      <ServiceForm />
    </div>
  );
}
