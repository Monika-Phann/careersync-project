import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Box,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
} from "@mui/icons-material";
import { NavbarStyles } from "./Navbar.styles";

function Navbar({ pageTitle, pageSubtitle, actionButtons, isMobile, onOpenMobileMenu }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" elevation={0} sx={NavbarStyles.appBar}>
      <Toolbar sx={NavbarStyles.toolbar}>
        <Box sx={NavbarStyles.leftSection}>
          {isMobile && (
            <IconButton
              onClick={onOpenMobileMenu}
              aria-label="Open menu"
              sx={NavbarStyles.menuButton}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Box sx={NavbarStyles.mobileLogoWrap}>
            <Box
              component="img"
              src="/logo/careersyncLogo.svg"
              alt="CareerSync"
              sx={NavbarStyles.mobileLogo}
            />
          </Box>

          <Box sx={NavbarStyles.titleContainer}>
            <Typography variant="h6" sx={NavbarStyles.title}>
              {pageTitle || "Dashboard"}
            </Typography>
            {pageSubtitle && (
              <Typography variant="body2" sx={NavbarStyles.subtitle}>
                {pageSubtitle}
              </Typography>
            )}
          </Box>
        </Box>
        <Box sx={NavbarStyles.rightSection}>
          <IconButton color="inherit" sx={NavbarStyles.iconButton}>
            <NotificationsIcon />
          </IconButton>
          {actionButtons && (
            <Box sx={NavbarStyles.actionButtonsContainer}>
              {actionButtons}
            </Box>
          )}
          <Box
            sx={NavbarStyles.profileSection}
            onClick={handleClick}
            aria-controls={open ? "profile-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar sx={NavbarStyles.avatar}>M</Avatar>
            <Box sx={NavbarStyles.profileInfo}>
              <Typography variant="body2" sx={NavbarStyles.profileName}>
                Marcus
              </Typography>
              <Typography variant="caption" sx={NavbarStyles.profileRole}>
                Mentor
              </Typography>
            </Box>
            {!isMobile && <KeyboardArrowDownIcon sx={NavbarStyles.dropdownIcon} />}
          </Box>
          <Menu
            id="profile-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "profile-button",
            }}
          >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>Settings</MenuItem>
            <MenuItem onClick={handleClose}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
