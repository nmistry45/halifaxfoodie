import { React, useState } from "react";
import { Grid } from "@mui/material";
import { useHistory } from "react-router-dom";
import FloatingChatButton from "../components/FloatingChatButton";
import LexBot from "../components/LexBot";
import NavBar from "../containers/NavBar";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";

const HomePage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [link, setLink] = useState("");
  const history = useHistory();

  const showChatBot = () => {
    setIsVisible(!isVisible);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    setLink(event.target.value);
  };

  const handleSubmit = () => {
    console.log("link is: ", link);
    localStorage.setItem("chatroomID", link);

    history.push({
      pathname: "/chatroom",
      state: { chatroomId: link },
    });
  };

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <NavBar />
        </Grid>
        <Grid item xs={12}>
          <Button variant="outlined" color="primary" onClick={handleClickOpen}>
            Enter ChatroomID
          </Button>
        </Grid>
        <Grid item xs={8}>
          <img
            src="https://img.rawpixel.com/private/static/images/website/2022-05/is9643-image-kwvyg1bx.jpg?w=800&dpr=1&fit=default&crop=default&q=65&vib=3&con=3&usm=15&bg=F4F4F3&ixlib=js-2.2.1&s=26ea1f6c4a82d0793c4532268f505f41"
            height="90%"
            width="90%"
          />
        </Grid>

        <Grid item xs={4}>
          {isVisible && <LexBot />}
        </Grid>
        <Grid item xs={1}>
          <FloatingChatButton showChatBot={showChatBot} />
        </Grid>
      </Grid>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Connect to Live ChatRoom</DialogTitle>
        <DialogContent>
          <Input
            type="text"
            onChange={handleChange}
            value={link}
            placeholder="Enter Your Chatroom ID here"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
          <Button onClick={handleSubmit} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default HomePage;
