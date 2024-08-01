import * as React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { getCurrentUserInfo } from "@/apis/users";
import { DownOutlined } from "@ant-design/icons";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const pages = ["Create", "Validate", "Send", "Manage"];
const settings = ["Profile", "Draft", "Company Details", "Logout"];
const admin_settings = [
  "Profile",
  "Draft",
  "Company Details",
  "Employee Management",
  "Logout",
];

const is_admin = localStorage.getItem("is_admin") === "true";

const getGreeting = () => {
  const currentHour = new Date().getHours();

  if (currentHour >= 5 && currentHour < 12) {
    return "Good Morning 👋";
  } else if (currentHour >= 12 && currentHour < 17) {
    return "Good Afternoon 👋";
  } else if (currentHour >= 17 && currentHour < 20) {
    return "Good Evening 👋";
  } else {
    return "Good Night 👋";
  }
};

export const ResponsiveAppBar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleNavigate = (page) => {
    navigate(`/${page.toLowerCase().replace(" ", "-")}`);
    handleCloseNavMenu();
  };

  const handleNavigateProfile = (setting) => {
    const path = setting.toLowerCase().replace(" ", "-");
    if (path === "logout") {
      localStorage.removeItem("token");
      localStorage.removeItem("userid");
      localStorage.removeItem("is_admin");
      navigate("/login");
    } else {
      navigate(`/${path}`);
    }
    handleCloseUserMenu();
  };

  const handleHomeNavigate = () => {
    navigate("/home");
  };

  const [avatarPath, setAvatarPath] = useState("");
  const [userName, setUserName] = useState("");
  const [greeting, setGreeting] = useState("");
  const getUserAvatarPath = async () => {
    const response = await getCurrentUserInfo();
    setAvatarPath(`${import.meta.env.VITE_API_URL}${response.data.avatar}`);
    setUserName(response.data.username);
    setGreeting(getGreeting());
  };
  useEffect(() => {
    getUserAvatarPath();
  }, []);

  return (
    <AppBar position="static" sx={{ backgroundColor: "white" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            onClick={handleHomeNavigate}
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "black",
              textDecoration: "none",
            }}
          >
            E-Invoice
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="black"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={() => handleNavigate(page)}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            E-Invoice
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => handleNavigate(page)}
                sx={{ my: 2, color: "black", display: "block" }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton
                onClick={handleOpenUserMenu}
                sx={{
                  p: "5px",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  // border: "1px solid #333",
                  borderRadius: "30px",
                }}
              >
                <Avatar alt="User Avatat" src={avatarPath} />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "start",
                    alignItems: "start",
                    paddingTop: "2px",
                  }}
                >
                  <div
                    style={{
                      color: "#C7C7C7",
                      fontSize: "12px",
                      marginBottom: "-4px",
                      fontWeight: 300,
                    }}
                  >
                    {greeting}
                  </div>
                  <div
                    style={{
                      fontFamily: "Lexend Deca",
                      color: "#333",
                      fontSize: "16px",
                    }}
                  >
                    {userName}
                  </div>
                </div>
                <KeyboardArrowDownIcon
                  style={{
                    size: "small",
                    paddingRight: "8px",
                    color: "#333",
                  }}
                />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{
                mt: "45px",
                borderRadius: "20px !important",
                "& .MuiPaper-root": {
                  borderRadius: "20px",
                },
                "& .MuiMenuItem-root": {
                  marginBottom: "8px",
                  "&:last-child": {
                    marginBottom: 0,
                  },
                },
              }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {!is_admin &&
                settings.map((setting) => (
                  <MenuItem
                    key={setting}
                    onClick={() => handleNavigateProfile(setting)}
                  >
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              {is_admin &&
                admin_settings.map((setting) => (
                  <MenuItem
                    key={setting}
                    onClick={() => handleNavigateProfile(setting)}
                  >
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
