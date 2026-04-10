import React from "react";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

const ContactListButton = ({ markers }) => {
  const navigate = useNavigate();
  const handleContactClick = (name) => {
    console.log(`clicked for${name}`);
    navigate("/chatroom");
  };

  return (
    <div>
      <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
        Available pet-sitters in your area
      </Typography>
      <List dense disablePadding>
        {markers.map((marker, index) => (
          <ListItem
            key={index}
            secondaryAction={
              <Button
                onClick={() => handleContactClick(marker.name)}
                variant="contained"
                size="small"
              >
                Contact sitter
              </Button>
            }
            sx={{ border: 1, borderColor: "divider", borderRadius: 1, mb: 1, pr: 14 }}
          >
            <ListItemText primary={marker.name} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default ContactListButton;
