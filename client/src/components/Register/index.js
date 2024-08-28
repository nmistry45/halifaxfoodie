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
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import UserPoolData from "../../aws";
import { Link, useHistory } from "react-router-dom";
import { CognitoUserAttribute } from "amazon-cognito-identity-js";

function RegisterComp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [registerAs, setRegisterAs] = useState("");
  const [error, setError] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    registerAs: "",
  });

  const history = useHistory();

  //name validation
  const handleNameChange = (value) => {
    setName(value);
    let pattern = new RegExp(/^[a-zA-Z ]+$/);
    let errorObj = Object.assign({}, error);
    if (!pattern.test(value)) {
      errorObj.name = "Enter only alphabets";
      setError(errorObj);
      return false;
    }
    errorObj.name = "";
    setError(errorObj);
    return true;
  };

  //email validation
  const handleEmailChange = (value) => {
    setEmail(value);
    let pattern = new RegExp(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/);
    let errorObj = Object.assign({}, error);
    if (!pattern.test(value)) {
      errorObj.email = "Enter valid email address";
      setError(errorObj);
      return false;
    }
    errorObj.email = "";
    setError(errorObj);
    return true;
  };

  //password validation
  const handlePasswordChange = (value) => {
    setPassword(value);
    let pattern = new RegExp(
      /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{7,}$/
    );
    let errorObj = Object.assign({}, error);
    let len = value.length;
    if (len < 7) {
      errorObj.password = "Password should be minimum 7 characters";
      setError(errorObj);
      return false;
    }
    if (!pattern.test(value)) {
      errorObj.password =
        "Enter 1 uppercase, 1 lowercase and 1 special character";
      setError(errorObj);
      return false;
    }
    errorObj.password = "";
    setError(errorObj);
    return true;
  };

  //confirm password validation
  const handleConfirmPasswordChange = (value, ogValue) => {
    setconfirmPassword(value);
    let errorObj = Object.assign({}, error);
    if (value !== ogValue) {
      errorObj.confirmPassword = "Password and confirm password don't match";
      setError(errorObj);
      return false;
    }
    errorObj.confirmPassword = "";
    setError(errorObj);
    return true;
  };

  //required field validation
  const requiredFieldCheck = () => {
    let errorObj = Object.assign({}, error);
    let isEmpty = false;

    if (name === "") {
      errorObj.name = "First Name is required";
      setError(errorObj);
      isEmpty = true;
    }
    if (email === "") {
      errorObj.email = "Email is required";
      setError(errorObj);
      isEmpty = true;
    }
    if (password === "") {
      errorObj.password = "Password is required";
      setError(errorObj);
      isEmpty = true;
    }
    if (confirmPassword === "") {
      errorObj.confirmPassword = "Confirm Password is required";
      setError(errorObj);
      isEmpty = true;
    }
    if (registerAs === "") {
      errorObj.registerAs = "User Type is required";
      setError(errorObj);
      isEmpty = true;
    }
    return isEmpty;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (requiredFieldCheck()) {
      return;
    }
    let errorObj = Object.assign({}, error);
    if (
      errorObj.name ||
      errorObj.email ||
      errorObj.password ||
      errorObj.confirmPassword ||
      errorObj.registerAs
    ) {
      return;
    }
    const cognitoAttr = [];
    cognitoAttr.push(new CognitoUserAttribute({ Name: "email", Value: email }));
    UserPoolData.signUp(
      email,
      password,
      cognitoAttr,
      null,
      async (err, data) => {
        if (err) {
          console.log("Error in Signing Up:", err);
        } else {
          await fetch(
            `https://joikz7dd52antvy5yr6plejtgy0xdbvf.lambda-url.us-east-1.on.aws/`,
            {
              method: "POST",
              body: JSON.stringify({
                email: email,
                registerAs: registerAs,
                name: name,
              }),
            }
          )
            .then((res) => {
              if (res.status == 200) {
                history.push({
                  pathname: "/queans",
                  state: { email: email },
                });
              } else {
                console.log("There was some error. Please try again!");
              }
            })
            .catch((err) => console.log("Error in saving user data:", err));
        }
      }
    );
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
            paddingBottom: 5,
          }}
        >
          <Avatar sx={{ m: 1 }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl>
                <FormLabel>Registering as:</FormLabel>
                <RadioGroup row>
                  <FormControlLabel
                    value="customer"
                    control={<Radio />}
                    label="Customer"
                    onChange={() => {
                      setRegisterAs("Customer");
                    }}
                    error={error.registerAs !== ""}
                    helperText={error.registerAs}
                  />
                  <FormControlLabel
                    value="restaurant"
                    control={<Radio />}
                    label="Restaurant"
                    onChange={() => {
                      setRegisterAs("Restaurant");
                    }}
                    error={error.registerAs !== ""}
                    helperText={error.registerAs}
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                id="name"
                label="Name"
                name="name"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                autoComplete="name"
                error={error.name !== ""}
                helperText={error.name}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                autoComplete="email"
                error={error.email !== ""}
                helperText={error.email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                autoComplete="password"
                error={error.password !== ""}
                helperText={error.password}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) =>
                  handleConfirmPasswordChange(e.target.value, password)
                }
                autoComplete="confirmPassword"
                error={error.confirmPassword !== ""}
                helperText={error.confirmPassword}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleSubmit}
          >
            Sign Up
          </Button>
          <Grid item xs={12}>
            <Link
              onClick={() => {
                history.push("/");
              }}
            >
              Already a user? Log in
            </Link>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}

export default RegisterComp;
