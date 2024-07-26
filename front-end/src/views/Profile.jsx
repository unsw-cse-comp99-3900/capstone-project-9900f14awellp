import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import OutlinedAlerts from '../components/Alert';
import { ResponsiveAppBar } from "../components/Navbar";
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Avatar,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Grid
  } from '@mui/material';

export default function Profile() {
    const token = localStorage.getItem('token');
    const [alert, setAlert] = useState(null); // 初始状态设置为null
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        username: '',
        email: '',
        company: '',
        bio: '',
        role: '',
        avatar: ''
      });

    const handleEditClick = () => {
        setIsEditing(true);
    };
    const handleSaveClick = () =>{
        handleSaveData();
        setIsEditing(false);
    }

    const handleFormSubmit = (event) => {
        // 阻止自动刷新
        event.preventDefault();
        // 处理表单提交逻辑
        // setIsEditing(false);
      };
    const fetchProfileData = useCallback(() => {
        axios.get('http://127.0.0.1:8000/invoice/user-info/', {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            console.log(response.data);
            setProfileData(response.data);
            console.log(profileData);
        })
        .catch(error => {
            console.log(error.message);
            setAlert({ severity: 'error', message: error.message });
        });
    }, [token]);

    useEffect(() => {
        fetchProfileData();
    }, [token, fetchProfileData]);

    const handleSaveData = () => {
        axios.post(`http://127.0.0.1:8000/invoice/user-info/`,
            {
                'username': 'username',
                'email': 'user@example.com',
                'name':'string',
                'avatar': '',
                'bio': 'welcome!',
            }, { 
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
        .then(response => {
                console.log(response.data);
                
        })
        .catch(error => {
        if (error.response) {
            setAlert({ severity: 'error', message: error.response.data.error});
            // alert(error.response.data.detail || 'validate failed');
        } else {
            setAlert({ severity: 'error', message: error.message });
            console.log(error.message);
        }
        });
    };

    return (
        <div>
            <ResponsiveAppBar />
        {alert && (
          <div style={{
            position: 'fixed',
            top: '11vh',
            right: 10,
            width: '30%',
            zIndex: 9999
          }}>
            <OutlinedAlerts severity={alert.severity} onClose={() => setAlert(null)}>
              {alert.message}
            </OutlinedAlerts>
          </div>
        )}
        <Container maxWidth="sm">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mt: 5,
              p: 3,
              borderRadius: 1,
              boxShadow: 3,
            }}
          >
            <Typography variant="h4" gutterBottom>
              Profile
            </Typography>
            <Avatar
              src={profileData.avatar || "https://via.placeholder.com/150"}
              sx={{ width: 80, height: 80, mb: 2 }}
            />
            <Button variant="contained" component="label">
              Change profile photo
              <input hidden accept="image/*" type="file" />
            </Button>
            <Box component="form" noValidate sx={{ mt: 3 }} onSubmit={handleFormSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="role-label">Role</InputLabel>
                    {isEditing ? (
                      <Select
                        labelId="role-label"
                        id="role"
                        value={profileData.is_staff}
                        onChange={(e) => setProfileData({ ...profileData, is_staff: e.target.value })}
                      >
                        <MenuItem value="user">User</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                      </Select>
                    ) : (
                      <Typography variant="body1">{profileData.is_staff}</Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      id="username"
                      label="Username"
                      name="username"
                      value={profileData.username}
                      onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                    />
                  ) : (
                    <Typography variant="body1">{profileData.username}</Typography>
                  )}
                </Grid>
                <Grid item xs={12}>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      id="email"
                      label="Email"
                      name="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    />
                  ) : (
                    <Typography variant="body1">{profileData.email}</Typography>
                  )}
                </Grid>
                <Grid item xs={12}>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      name="company"
                      label="Company"
                      id="company"
                      value={profileData.company}
                      onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                    />
                  ) : (
                    <Typography variant="body1">{profileData.company}</Typography>
                  )}
                </Grid>
                <Grid item xs={12}>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      id="bio"
                      label="Bio"
                      name="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      multiline
                      rows={4}
                    />
                  ) : (
                    <Typography variant="body1">
                      {profileData.bio}
                    </Typography>
                  )}
                </Grid>
              </Grid>
              {isEditing ? (
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={handleSaveClick}
                >
                  Save changes
                </Button>
              ) : (
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={handleEditClick}
                >
                  Edit Profile
                </Button>
              )}
            </Box>
          </Box>
        </Container>
      </div>
    );
}