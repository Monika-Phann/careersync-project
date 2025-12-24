import { useState } from "react";
import * as Yup from "yup";
import AccountTabs from "../../../components/AccountTabs/AccountTabs";
import {
  PageWrapper,
  TopBar,
  Card,
  Title,
  Subtitle,
  Row,
  FieldGroup,
  Label,
  StyledInput,
  EditButton,
  ButtonRow,
  HelperText,
} from "./AccountSecurity.styles";

const initialData = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function SecurityPage() {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  const schema = Yup.object({
    currentPassword: Yup.string().required("Current password is required"),
    newPassword: Yup.string()
      .min(8, "Must be at least 8 characters")
      .required("New password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Passwords do not match")
      .required("Please confirm new password"),
  });

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await schema.validate(formData, { abortEarly: false });
      console.log(true); // ✅ valid
      setErrors({});
      // API call here
    } catch (err) {
      console.log(false); // ❌ invalid
      const formatted = {};
      err.inner.forEach((e) => {
        formatted[e.path] = e.message;
      });
      setErrors(formatted);
    }
  };

  const handleCancel = () => {
    setFormData(initialData);
    setErrors({});
  };

  return (
    <PageWrapper>
      <TopBar />
      <AccountTabs />

      <Card>
        <Title>Change Password</Title>
        <Subtitle>
          Ensure your account is using a strong password
        </Subtitle>

        {/* Current Password */}
        <Row>
          <FieldGroup>
            <Label>Current Password *</Label>
            <StyledInput
              type="password"
              placeholder="Enter current password"
              value={formData.currentPassword}
              onChange={handleChange("currentPassword")}
              error={!!errors.currentPassword}
              helperText={errors.currentPassword}
            />
          </FieldGroup>
        </Row>

        {/* New Password */}
        <Row>
          <FieldGroup>
            <Label>New Password *</Label>
            <StyledInput
              type="password"
              placeholder="Enter new password"
              value={formData.newPassword}
              onChange={handleChange("newPassword")}
              error={!!errors.newPassword}
              helperText={errors.newPassword}
            />
            <HelperText>
              Must be at least 8 characters long
            </HelperText>
          </FieldGroup>
        </Row>

        {/* Confirm Password */}
        <Row>
          <FieldGroup>
            <Label>Confirm New Password *</Label>
            <StyledInput
              type="password"
              placeholder="Re-enter new password"
              value={formData.confirmPassword}
              onChange={handleChange("confirmPassword")}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
            />
          </FieldGroup>
        </Row>

        {/* Buttons */}
        <ButtonRow>
          <EditButton onClick={handleSubmit}>
            Update Password
          </EditButton>

          <EditButton
            onClick={handleCancel}
            style={{ background: "#E0E0E0", color: "#333" }}
          >
            Cancel
          </EditButton>
        </ButtonRow>
      </Card>
    </PageWrapper>
  );
}
