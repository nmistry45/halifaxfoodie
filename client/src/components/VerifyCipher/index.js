import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Container,
  Paper,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useHistory } from "react-router-dom";

function VerifyCipherComp({ userInfo }) {
  const history = useHistory();
  const [cipherText, setCipherText] = useState("");
  const [error, setError] = useState("");

  let email = userInfo?.email;
  let name = userInfo?.name;
  let userType = userInfo?.userType;

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(
      `https://mwnyqgqipkknrh75ylfs37ttj40uywtq.lambda-url.us-east-1.on.aws/`,
      {
        method: "POST",
        body: JSON.stringify({ email: email, cipherText: cipherText }),
      }
    )
      .then((res) => res.json())
      .then((body) => {
        if (body.cipher == null) {
          setError("Invalid Cipher Key");
          return;
        } else {
          localStorage.setItem("userLoggedIn", "true");
          localStorage.setItem("userType", userType);
          localStorage.setItem("email", email);
          localStorage.setItem("name", name);
          if (userType == "Customer") {
            history.push("/home");
          } else {
            history.push("/restaurant");
          }
        }
      });
  };

  return (
    <Container maxWidth="sm">
      <Paper>
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: 5,
            paddingLeft: 8,
            paddingRight: 8,
            paddingBottom: 12,
          }}
        >
          <Avatar sx={{ m: 1 }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Enter the Cipher Key that you received during Registration:
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="cipherText"
                label="Enter your Cipher Key"
                name="cipherText"
                onChange={(e) => setCipherText(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </Grid>
            <Grid item xs={12}>
              {error && <Typography color="red"> {error}</Typography>}
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}

export default VerifyCipherComp;
