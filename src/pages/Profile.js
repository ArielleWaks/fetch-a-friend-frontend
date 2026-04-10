import React, { useState } from "react";
import {
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import AuthService from "../services/auth.service";
import BadgeCard from "../components/BadgeCard";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const currentUser = AuthService.getCurrentUser();
  const [imageList] = useState([]);
  const navigate = useNavigate();

  const handleMessageClick = () => {
    navigate("/chatroom");
  };

  const displayName = currentUser?.username ?? "User";
  const displayEmail = currentUser?.email ?? "—";

  return (
    <Box sx={{ bgcolor: "grey.100", py: 5, mx: -3, px: 2 }}>
      <Container maxWidth="lg">
        <Breadcrumbs sx={{ mb: 3, bgcolor: "background.paper", p: 2, borderRadius: 1 }}>
          <Typography color="text.primary">User Profile</Typography>
        </Breadcrumbs>

        <Grid container spacing={3}>
          <Grid item xs={12} lg={4}>
            <Card sx={{ mb: 3 }}>
              <CardContent sx={{ textAlign: "center" }}>
                <Avatar
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&h=300&fit=crop"
                  alt="avatar"
                  sx={{ width: 150, height: 150, mx: "auto", mb: 2 }}
                />
                <Typography color="text.secondary" gutterBottom>
                  Pet Sitter Extraordinaire
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  St. Louis, MO
                </Typography>
                <Stack direction="row" spacing={1} justifyContent="center">
                  <Button variant="contained">Follow</Button>
                  <Button variant="outlined" onClick={handleMessageClick}>
                    Message
                  </Button>
                </Stack>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  My Pets
                </Typography>
                <Grid container spacing={2}>
                  {imageList.map((image) => (
                    <Grid item xs={12} key={image.id}>
                      <Card variant="outlined">
                        <Box
                          component="img"
                          src={image.fileUri}
                          alt={image.uploaderName}
                          sx={{ width: "100%", height: 200, objectFit: "cover" }}
                        />
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            {image.uploaderName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {image.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} lg={8}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <ProfileRow label="Name" value={displayName} />
                <ProfileRow label="Email" value={displayEmail} />
                <ProfileRow label="Phone" value="(097) 234-5678" />
                <ProfileRow label="Address" value="St. Louis, MO" />
                <ProfileRow label="Pet Type" value="Spider Monkey" last />
              </CardContent>
            </Card>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography sx={{ mb: 2 }}>Customer Reviews</Typography>
                    <ReviewBar label="Promptness" value={80} />
                    <ReviewBar label="Communication" value={72} />
                    <ReviewBar label="Reliability" value={89} />
                    <ReviewBar label="Pet Handling Skills" value={55} />
                    <ReviewBar label="Flexibility" value={66} />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <BadgeCard />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

function ProfileRow({ label, value, last }) {
  return (
    <>
      <Grid container spacing={2} sx={{ py: 1.5 }}>
        <Grid item xs={12} sm={3}>
          <Typography fontWeight={500}>{label}</Typography>
        </Grid>
        <Grid item xs={12} sm={9}>
          <Typography color="text.secondary">{value}</Typography>
        </Grid>
      </Grid>
      {!last ? <Box component="hr" sx={{ border: 0, borderTop: 1, borderColor: "divider", m: 0 }} /> : null}
    </>
  );
}

function ReviewBar({ label, value }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
        {label}
      </Typography>
      <LinearProgress variant="determinate" value={value} sx={{ height: 8, borderRadius: 1 }} />
    </Box>
  );
}

export default Profile;
