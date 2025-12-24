import { useState, useRef } from "react";
import * as Yup from "yup";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { CloudUploadOutlined } from '@mui/icons-material';
import AccountTabs from "../../components/AccountTabs/AccountTabs";
import {
  PageWrapper,
  TopBar,
  Card,
  Title,
  Subtitle,
  Row,
  FieldGroup,
  OneColumnFieldGroup,
  Label,
  StyledInput,
  Avatar,
  EditButton,
  HelperText,
  ButtonRow,
} from "./ProfilePage.styles";
import {
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton,
} from "@mui/material";

export default function ProfilePage() {
  const fileRef = useRef(null);

  const initialData = {
    firstName: "Sarah",
    lastName: "Johnson",
    phone: "+1 (555) 234-5678",
    dob: "1998-04-15",
    gender: "Female",
    status: "Student",
    institution: "Stanford University",
    workplace: "TechCorp Solutions",
    avatar: "https://i.pravatar.cc/100",
  };

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initialData);
  const [backupData, setBackupData] = useState(initialData);
  const [errors, setErrors] = useState({});

  const schema = Yup.object({
    profilePicture: Yup.mixed().nullable().notRequired(),
    firstName: Yup.string().trim().required("First name is required"),
    lastName: Yup.string().trim().required("Last name is required"),
    phone: Yup
    .string()
    .matches(
      /^(?:0\d{8,9}|\+855\d{8,9})$/,
      'Phone must start with 0 or +855'
    )
    .required("Phone number is required"),
    dob: Yup.string().required("Date of birth is required"),
    gender: Yup.string().required("Please select gender"),
    status: Yup.string().required("Please select status"),
    institution: Yup.string().trim().required("Institution is required"),
    workplace: Yup.string().notRequired(),
  });

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleEditSave = async () => {
    if (!isEditing) {
      setBackupData(formData); // snapshot
      setIsEditing(true);
      return;
    }

    try {
      await schema.validate(formData, { abortEarly: false });
      console.log(true);
      setErrors({});        // clear errors
      setIsEditing(false);
    } catch (err) {
      console.log(false);

      const formattedErrors = {};
      err.inner.forEach(e => {
        formattedErrors[e.path] = e.message;
      });

      setErrors(formattedErrors);
    }
  };

  const handleCancel = () => {
    setFormData(backupData); // restore previous values
    setErrors({});           // clear validation messages
    setIsEditing(false);     // exit edit mode
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        avatar: URL.createObjectURL(file),
      });
    }
  };

  return (
    <PageWrapper>
      <TopBar />
      <AccountTabs />

      <Card>
        {/* TITLE (same in both modes) */}
        <Title>Profile Information</Title>
        <Subtitle>Update your personal details and profile picture</Subtitle>

        {/* PROFILE IMAGE */}
        <Row>
          {/* Avatar wrapper */}
          <div style={{ position: "relative" }}>
            <Avatar src={formData.avatar} />

            {isEditing && (
              <>
                <IconButton
                        size="small"
                        color="primary"
                        onClick={() => fileRef.current.click()}
                        sx={{
                          position: 'absolute',
                          bottom: -6,
                          right: -6,
                          bgcolor: '#b3daf7',
                          border: '3px solid #fff',
                          '&:hover': { bgcolor: '#9bcaed' },
                        }}
                        aria-label="Upload avatar"
                      >
                        <CloudUploadOutlined fontSize="small" />
                      </IconButton>

                <input
                  ref={fileRef}
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </>
            )}
          </div>

          {/* Text section */}
          <div>
            {isEditing ? (
              <>
                <Label>Upload Profile Picture</Label>
                <HelperText>
                  Click the cloud upload icon to upload a new photo <br />
                  JPG, PNG or GIF. Max size 5MB
                </HelperText>
              </>
            ) : (
              <>
                <Label>Profile Picture</Label>
                <HelperText>Your profile picture</HelperText>
              </>
            )}
          </div>
        </Row>

        {/* NAME */}
        <Row>
          <FieldGroup>
            <Label>First Name *</Label>
            <StyledInput
              value={formData.firstName}
              onChange={handleChange("firstName")}
              disabled={!isEditing}
              error={!!errors.firstName}
              helperText={errors.firstName}
            />
          </FieldGroup>

          <FieldGroup>
            <Label>Last Name *</Label>
            <StyledInput
              value={formData.lastName}
              onChange={handleChange("lastName")}
              disabled={!isEditing}
              error={!!errors.lastName}
              helperText={errors.lastName}
            />
          </FieldGroup>
        </Row>

        {/* PHONE + DOB */}
        <Row>
          <FieldGroup>
            <Label>Phone *</Label>
            <StyledInput
              value={formData.phone}
              onChange={handleChange("phone")}
              disabled={!isEditing}
              error={!!errors.phone}
              helperText={errors.phone}
            />
          </FieldGroup>

          <FieldGroup>
            <Label>Date of Birth *</Label>
            <StyledInput
              type="date"
              value={formData.dob}
              onChange={handleChange("dob")}
              disabled={!isEditing}
              error={!!errors.dob}
              helperText={errors.dob}
            />
          </FieldGroup>
        </Row>

        {/* GENDER */}
        <Row>
          <OneColumnFieldGroup>
            <Label>Gender *</Label>
            <RadioGroup
              row
              value={formData.gender}
              onChange={handleChange("gender")}
            >
              <FormControlLabel
                value="Male"
                control={<Radio disabled={!isEditing} />}
                label="Male"
              />
              <FormControlLabel
                value="Female"
                control={<Radio disabled={!isEditing} />}
                label="Female"
              />
            </RadioGroup>

            {errors.gender && (
              <HelperText style={{ color: "#d32f2f" }}>
                {errors.gender}
              </HelperText>
            )}
          </OneColumnFieldGroup>
        </Row>

        {/* EDUCATION */}
        <Subtitle>Education & Employment</Subtitle>
        <HelperText>Your current status and institution information</HelperText>

        <Row>
          <OneColumnFieldGroup>
            <Label>Status *</Label>
            <RadioGroup
              row
              value={formData.status}
              onChange={handleChange("status")}
            >
              <FormControlLabel
                value="Student"
                control={<Radio disabled={!isEditing} />}
                label="Student"
              />
              <FormControlLabel
                value="Working"
                control={<Radio disabled={!isEditing} />}
                label="Working"
              />
            </RadioGroup>

            {errors.status && (
              <HelperText style={{ color: "#d32f2f" }}>
                {errors.status}
              </HelperText>
            )}
          </OneColumnFieldGroup>

          <FieldGroup>
            <Label>Institution *</Label>
            <StyledInput
              value={formData.institution}
              onChange={handleChange("institution")}
              disabled={!isEditing}
              error={!!errors.institution}
              helperText={errors.institution}
            />
          </FieldGroup>
        </Row>

        {/* WORKPLACE */}
        <Row>
          <OneColumnFieldGroup>
            <Label>Workplace Name</Label>
            <StyledInput
              value={formData.workplace}
              onChange={handleChange("workplace")}
              disabled={!isEditing}
            />
          </OneColumnFieldGroup>
        </Row>

        {/* BUTTONS */}
        <ButtonRow>
          <EditButton
            startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
            onClick={handleEditSave}
          >
            {isEditing ? "Save Changes" : "Edit Profile"}
          </EditButton>

          {isEditing && (
            <EditButton
              onClick={handleCancel}
              style={{ background: "#E0E0E0", color: "#333" }}
            >
              Cancel
            </EditButton>
          )}
        </ButtonRow>
      </Card>
    </PageWrapper>
  );
}

