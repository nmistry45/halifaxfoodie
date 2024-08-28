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
import { Link, useHistory } from "react-router-dom";
import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import UserPoolData from "../../aws";
import VerifyQueAns from "../../containers/VerifyQueAns";

function LoginComp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginAs, setLoginAs] = useState("");
  const [registeredUser, setRegisteredUser] = useState(false);
  const [userInfo, setUserInfo] = useState({
    email: "",
    name: "",
    userType: "",
    loginAs: "",
  });

  const history = useHistory();

  //error handling
  const [error, setError] = useState({
    email: "",
    password: "",
  });

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

  const requiredFieldCheck = () => {
    let errorObj = Object.assign({}, error);
    let isEmpty = false;

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
    if (loginAs === "") {
      errorObj.loginAs = "User Type is required";
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
    if (errorObj.email || errorObj.password) {
      return;
    }

    const userData = new CognitoUser({
      Username: email,
      Pool: UserPoolData,
    });

    const authData = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    if (loginAs === "Customer") {
      userData.authenticateUser(authData, {
        onSuccess: async (data) => {
          await fetch(
            `https://plzj2etah5learwlp63we4hbei0dgopd.lambda-url.us-east-1.on.aws/`,
            {
              method: "POST",
              body: JSON.stringify({ email: email }),
            }
          )
            .then((res) => res.json())
            .then((body) => {
              if (body.statusCode == 200) {
                console.log("userinfo....body", body);
                setUserInfo({
                  email: body.body.email,
                  name: body.body.name,
                  userType: body.body.userType,
                });
                setRegisteredUser(true);
              } else {
                console.log("Error Occurred. Try again later!");
              }
            })
            .catch((err) => {
              console.log("Err:", err);
            });
        },
        onFailure: () => {
          console.log("Wrong Credentials!");
          return;
        },
      });
    } else if (loginAs === "Restaurant") {
      userData.authenticateUser(authData, {
        onSuccess: async (data) => {
          await fetch(
            `https://m5l7l3zmsnciyqbzd6zeduuut40iurch.lambda-url.us-east-1.on.aws/`,
            {
              method: "POST",
              body: JSON.stringify({ email: email }),
            }
          )
            .then((res) => res.json())
            .then((body) => {
              if (body.statusCode == 200) {
                console.log("userinfo....body", body);
                setUserInfo({
                  email: body.body.email,
                  name: body.body.name,
                  userType: body.body.userType,
                });
                setRegisteredUser(true);
              } else {
                console.log("Error Occurred. Try again later!");
              }
            })
            .catch((err) => {
              console.log("Err:", err);
            });
        },
        onFailure: () => {
          console.log("Wrong Credentials!");
          return;
        },
      });
    }
  };

  return (
    <Container maxWidth="sm">
      {registeredUser === false ? (
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
              Log In
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl>
                  <FormLabel>Logging in as:</FormLabel>
                  <RadioGroup row>
                    <FormControlLabel
                      value="customer"
                      control={<Radio />}
                      label="Customer"
                      onChange={() => {
                        setLoginAs("Customer");
                      }}
                      error={error.loginAs !== ""}
                      helperText={error.loginAs}
                    />
                    <FormControlLabel
                      value="restaurant"
                      control={<Radio />}
                      label="Restaurant"
                      onChange={() => {
                        setLoginAs("Restaurant");
                      }}
                      error={error.loginAs !== ""}
                      helperText={error.loginAs}
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email"
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
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSubmit}
            >
              Log In
            </Button>
            <Grid item xs={12}>
              <Link
                onClick={() => {
                  history.push("/register");
                }}
              >
                New user? Sign up
              </Link>
            </Grid>
          </Box>
        </Paper>
      ) : null}
      {registeredUser ? <VerifyQueAns userInfo={userInfo} /> : null}
    </Container>
  );
}

export default LoginComp;
