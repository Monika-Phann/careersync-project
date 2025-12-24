import { useState } from "react";
import AccountTabs from "../../../components/AccountTabs/AccountTabs";
import {
  PageWrapper,
  TopBar,
  Title,
  Subtitle,
  SectionTitle,
  SessionCard,
  SessionHeader,
  Name,
  Role,
  MetaRow,
  Badge,
  ActionGroup,
  DangerButton,
  LightButton,
} from "./BookingHistory.styles";
import {
  EventOutlined,
  LocationOnOutlined,
} from "@mui/icons-material";
import InvoiceModal from "./InvoiceModal";
import CancelBookingModal from "./CancelBookingModal";

export default function BookingHistoryPage() {
  const [openInvoice, setOpenInvoice] = useState(false);
  const [openCancel, setOpenCancel] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  
  const handleOpenInvoice = (booking) => {
    setSelectedBooking(booking);
    setOpenInvoice(true);
  };

  const handleCloseInvoice = () => {
    setOpenInvoice(false);
    setSelectedBooking(null);
  };

  const handleOpenCancel = (booking) => {
    setSelectedBooking(booking);
    setOpenCancel(true);
  };

  const handleConfirmCancel = () => {
    console.log("Cancel booking:", selectedBooking);
    setOpenCancel(false);
  };

  return (
    <PageWrapper>
      <TopBar />
      <AccountTabs />

      {/* UPCOMING */}
      <Title>Upcoming Sessions</Title>
      <Subtitle>Your scheduled shadowing sessions</Subtitle>

      <SessionCard>
        <SessionHeader>
          <div>
            <Name>Sarah Johnson</Name>
            <Role>Software Engineer</Role>

            <Badge info>Information Technology</Badge>

            <MetaRow>
              <EventOutlined fontSize="small" />
              Dec 15, 2024 at 10:00 AM
            </MetaRow>

            <MetaRow>
              <LocationOnOutlined fontSize="small" />
              123 Business St, NY
            </MetaRow>
          </div>

          <ActionGroup>
            <LightButton
              onClick={() =>
                handleOpenInvoice({
                  invoiceId: "CB0003",
                  bookingId: "BK-2025-1003",
                  bookingDate: "Nov 09, 2025",
                  studentName: "David Brown",
                  mentorName: "Sarah Johnson",
                  program: "Software Engineering",
                  startDate: "Nov 16, 2025",
                  endDate: "Nov 16, 2025",
                  subTotal: 60,
                  total: 60,
                })
              }
            >
              View Invoice
            </LightButton>

            <DangerButton
              onClick={() =>
                handleOpenCancel({ name: "Sarah Johnson" })
              }
            >
              Cancel Booking
            </DangerButton>
          </ActionGroup>
        </SessionHeader>
      </SessionCard>

      <SessionCard>
        <SessionHeader>
          <div>
            <Name>Michael Chen</Name>
            <Role>Financial Analyst</Role>

            <Badge info>Banking & Finance</Badge>

            <MetaRow>
              <EventOutlined fontSize="small" />
              Dec 18, 2024 at 2:00 PM
            </MetaRow>

            <MetaRow>
              <LocationOnOutlined fontSize="small" />
              123 Business St, NY
            </MetaRow>
          </div>

          <ActionGroup>
            <LightButton
              onClick={() =>
                handleOpenInvoice({
                  invoiceId: "CB0004",
                  bookingId: "BK-2025-1004",
                  bookingDate: "Dec 09, 2025",
                  studentName: "David Brown",
                  mentorName: "Michael Chen",
                  program: "Financial Analyst",
                  startDate: "Dec 19, 2024",
                  endDate: "Dec 19, 2024",
                  subTotal: 60,
                  total: 60,
                })
              }
            >
              View Invoice
            </LightButton>

            <DangerButton
              onClick={() =>
                handleOpenCancel({ name: "Michael Chen" })
              }
            >
              Cancel Booking
            </DangerButton>
          </ActionGroup>
        </SessionHeader>
      </SessionCard>

      {/* PAST */}
      <SectionTitle>Past Sessions</SectionTitle>
      <Subtitle>Your completed and cancelled sessions</Subtitle>

      <SessionCard>
        <SessionHeader>
          <div>
            <Name>
              Emily Davis <Badge success>Completed</Badge>
            </Name>
            <Role>Investment Analyst</Role>

            <Badge info>Banking & Finance</Badge>

            <MetaRow>
              <EventOutlined fontSize="small" />
              Nov 20, 2024 at 11:00 AM
            </MetaRow>

            <MetaRow>
              <LocationOnOutlined fontSize="small" />
              123 Business St, NY
            </MetaRow>
          </div>

          <ActionGroup>
            <LightButton
              onClick={() =>
                handleOpenInvoice({
                  invoiceId: "CB0005",
                  bookingId: "BK-2025-1005",
                  bookingDate: "Nov 20, 2024",
                  studentName: "David Brown",
                  mentorName: "Emily Davis",
                  program: "Investment Analyst",
                  startDate: "Nov 21, 2024",
                  endDate: "Nov 21, 2024",
                  subTotal: 60,
                  total: 60,
                })
              }
            >
              View Details
            </LightButton>
          </ActionGroup>
        </SessionHeader>
      </SessionCard>

      <SessionCard>
        <SessionHeader>
          <div>
            <Name>
              James Wilson <Badge warning>Incomplete</Badge>
            </Name>
            <Role>Game Developer</Role>

            <Badge info>Information Technology</Badge>

            <MetaRow>
              <EventOutlined fontSize="small" />
              Nov 5, 2024 at 3:00 PM
            </MetaRow>

            <MetaRow>
              <LocationOnOutlined fontSize="small" />
              456 Marketing Ave, LA
            </MetaRow>
          </div>

          <ActionGroup>
            <LightButton>View Details</LightButton>
          </ActionGroup>
        </SessionHeader>
      </SessionCard>

      <SessionCard>
        <SessionHeader>
          <div>
            <Name>
              Lisa Anderson <Badge danger>Cancelled</Badge>
            </Name>
            <Role>Data Scientist</Role>

            <Badge info>Information Technology</Badge>

            <MetaRow>
              <EventOutlined fontSize="small" />
              Oct 28, 2024 at 1:00 PM
            </MetaRow>

            <MetaRow>
              <LocationOnOutlined fontSize="small" />
              123 Business St, NY
            </MetaRow>
          </div>

          <ActionGroup>
            <LightButton>View Details</LightButton>
          </ActionGroup>
        </SessionHeader>
      </SessionCard>

      {/* INVOICE MODAL */}
      <InvoiceModal
        open={openInvoice}
        onClose={handleCloseInvoice}
        booking={selectedBooking}
      />

      {/* Cancel MODAL */}
      <CancelBookingModal
        open={openCancel}
        onClose={() => setOpenCancel(false)}
        onConfirm={handleConfirmCancel}
        bookingName={selectedBooking?.name}
      />
    </PageWrapper>
  );
}
