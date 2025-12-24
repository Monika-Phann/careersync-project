import {
  Overlay,
  CertificateWrapper,
  LeftSection,
  RightRibbon,
  Header,
  DateText,
  Name,
  Description,
  ProgramTitle,
  SmallText,
  Footer,
  Signature,
  Verify,
  Seal,
  RibbonTitle,
} from "./CertificatePreview.styles";
import Logo from "../UI/Logo/Logo";

export default function CertificatePreview({ open, onClose, certificate }) {
  if (!open) return null;

  return (
    <Overlay onClick={onClose}>
      <CertificateWrapper onClick={(e) => e.stopPropagation()}>
        {/* LEFT */}
        <LeftSection>
          <Header>
            <Logo />
          </Header>

          <DateText>{certificate.date}</DateText>

          <Name>{certificate.name}</Name>

          <Description>has successfully completed</Description>

          <ProgramTitle>{certificate.title}</ProgramTitle>

          <SmallText>
            a job shadowing program from {certificate.organization} (
            {certificate.duration})
          </SmallText>

          <Footer>
            <Signature>
              Oudom Ngoun
              <span>Program Director, CareerSync</span>
            </Signature>
          </Footer>
          <Verify>
            Verify at:
            <a href="#">
              careersync.com/verify/{certificate.verifyId}
            </a>
            CareerSync has confirmed the identity of this individual and<br></br>their participation in the program.
          </Verify>
        </LeftSection>

        {/* RIGHT */}
        <RightRibbon>
          <RibbonTitle>
            JOB SHADOWING
            <strong>CERTIFICATE</strong>
          </RibbonTitle>

          <Seal>
            <span>EDUCATION FOR EVERYONE</span>
            <strong>CAREERSYNC</strong>
            <span>JOB SHADOWING CERTIFICATE</span>
          </Seal>
        </RightRibbon>
      </CertificateWrapper>
    </Overlay>
  );
}
