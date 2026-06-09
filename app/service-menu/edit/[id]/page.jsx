import React from "react";
import ServiceForm from "../../../../src/components/forms/ServiceForm";
import BreadCrumb from "../../../../src/components/common/BreadCrumb";

export default function EditServicePage({ params }) {
  return (
    <div>
      <BreadCrumb
        pageTitle="Treatment & Product Menu"
        title="Edit Service"
        breadcrumbItems={[{ title: "Back To Menu", link: "/service-menu" }]}
      />
      <ServiceForm id={params.id} />
    </div>
  );
}
