import { useState } from "react";
import {
  PageContainer,
  Title,
  Subtitle,
  CardsGrid,
} from "./CertificatesPage.styles";

import AccountTabs from "../../../components/AccountTabs/AccountTabs";
import CertificateCard from "../../../components/CertificateCard/CertificateCard";
import CertificatePreview from "../../../components/CertificatePreview/CertificatePreview";

const certificates = [
  {
    name: "David Brown",
    title: "Software Developer Shadowing Program",
    mentor: "Sarah Johnson",
    date: "16/11/2025",
    organization: "Korinnov",
    duration: "1 hour",
    verifyId: "00000001",
  },
  {
    name: "David Brown",
    title: "Financial Advisor Shadowing Program",
    mentor: "Emily Davis",
    date: "05/11/2024",
    organization: "Korinnov",
    duration: "1 hour",
    verifyId: "00000002",
  },
  {
    name: "David Brown",
    title: "Data Analyst",
    mentor: "Michael Chen",
    date: "15/10/2024",
    organization: "Korinnov",
    duration: "1 hour",
    verifyId: "00000003",
  },
];

export default function CertificatesPage() {
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  return (
    <PageContainer>
      <AccountTabs />

      <Title>Your Certificates</Title>
      <Subtitle>
        Download and share your shadowing completion certificates
      </Subtitle>

      <CardsGrid>
        {certificates.map((cert, index) => (
          <CertificateCard
            key={index}
            title={cert.title}
            mentor={cert.mentor}
            date={cert.date}
            onView={() => setSelectedCertificate(cert)}
            onDownload={() => console.log("Download", cert)}
          />
        ))}
      </CardsGrid>

      {/* CERTIFICATE MODAL */}
      <CertificatePreview
        open={Boolean(selectedCertificate)}
        certificate={selectedCertificate}
        onClose={() => setSelectedCertificate(null)}
      />
    </PageContainer>
  );
}
