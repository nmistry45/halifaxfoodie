import { React, useState } from "react";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import ChatIcon from "@mui/icons-material/Chat";

const FloatingChatButton = (props) => {
  const showChatBot = () => {
    props.showChatBot();
  };

  return (
    <Box>
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: "fixed", bottom: "50px", right: "20px" }}
        onClick={showChatBot}
      >
        <ChatIcon />
      </Fab>
    </Box>
  );
};

export default FloatingChatButton;
