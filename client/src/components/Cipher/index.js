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
import { useHistory, useLocation } from "react-router-dom";

function CipherComp() {
  const history = useHistory();
  const location = useLocation();
  const [key, setKey] = useState("");
  const [plainText, setPlainText] = useState("");
  const [cipherText, setCipherText] = useState("");
  const [result, setResult] = useState(false);
  const [error, setError] = useState({
    key: "",
    plainText: "",
  });

  const requiredFieldCheck = () => {
    let errorObj = Object.assign({}, error);
    let isEmpty = false;

    if (key === "") {
      errorObj.key = "Key is required";
      setError(errorObj);
      isEmpty = true;
    }
    if (plainText === "") {
      errorObj.plainText = "Plain Text is required";
      setError(errorObj);
      isEmpty = true;
    }
    if (key.length != 4) {
      errorObj.key = "Length of Key should be 4";
      setError(errorObj);
      isEmpty = true;
    }
    return isEmpty;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (requiredFieldCheck()) {
      return;
    }
    let errorObj = Object.assign({}, error);
    if (errorObj.key || errorObj.plainText) {
      return;
    }
    let email = location.state.email;
    setResult(false);
    await fetch(
      `https://mc4o3rrvj2fdcfsnzfy7wikywa0ocnqs.lambda-url.us-east-1.on.aws/`,
      {
        method: "POST",
        body: JSON.stringify({ email: email, key: key, plainText: plainText }),
      }
    )
      .then((res) => res.json())
      .then((res) => {
        setCipherText(res.cipher);
        setResult(true);
      });
  };

  const cipherResult = () => {
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
            <Typography component="h1" variant="h5">
              Copy the cipher key. It will be used during Login.
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="cipherText"
                  label="This is your cipher text"
                  name="cipherText"
                  value={cipherText}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={() => {
                history.push("/");
              }}
            >
              Log In
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  };

  return (
    <Container maxWidth="sm">
      {!result ? (
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
              Creation of Cipher Key. Copy the plain key and the cipher key for
              further login!
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="key"
                  label="Enter your Key of length - 4"
                  name="key"
                  value={key}
                  onChange={(e) => {
                    setKey(e.target.value);
                    setError((prevState) => ({
                      ...prevState,
                      key: "",
                    }));
                  }}
                  error={error.key !== ""}
                />
              </Grid>
              <Grid item xs={12}>
                {error.key && (
                  <Typography variant="caption" color="red">
                    {error.key}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="plainText"
                  label="Enter your plain text"
                  name="plainText"
                  value={plainText}
                  onChange={(e) => {
                    setPlainText(e.target.value);
                    setError((prevState) => ({
                      ...prevState,
                      plainText: "",
                    }));
                  }}
                  error={error.plainText !== ""}
                />
              </Grid>
              <Grid item xs={12}>
                {error.plainText && (
                  <Typography variant="caption" color="red">
                    {error.plainText}
                  </Typography>
                )}
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Box>
        </Paper>
      ) : null}
      {result ? cipherResult() : null}
    </Container>
  );
}

export default CipherComp;
