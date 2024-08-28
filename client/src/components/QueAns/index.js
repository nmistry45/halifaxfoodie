import React, { useState, useContext } from "react";
import {
  Avatar,
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Container,
  Paper,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useHistory, useLocation } from "react-router-dom";

function QueAnsComp() {
  const history = useHistory();
  const location = useLocation();
  const [que, setQue] = useState("");
  const [ans, setAns] = useState("");
  const [error, setError] = useState({
    que: "",
    ans: "",
  });

  const queOps = [
    { value: "What is your favorite movie?" },
    { value: "What is your mother's maiden name?" },
    { value: "What is your school's name?" },
  ];

  const requiredFieldCheck = () => {
    let errorObj = Object.assign({}, error);
    let isEmpty = false;

    if (que === "") {
      errorObj.que = "Question is required";
      setError(errorObj);
      isEmpty = true;
    }
    if (ans === "") {
      errorObj.ans = "Answer is required";
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
    if (errorObj.que || errorObj.ans) {
      return;
    }
    let email = location.state.email;
    await fetch(
      `https://us-central1-serverless-370020.cloudfunctions.net/saveQA`,
      {
        method: "POST",
        headers: {
          "Content-Type": "Application/JSON",
        },
        body: JSON.stringify({
          email: email,
          question: que,
          answer: ans,
        }),
      }
    )
      .then((res) => {
        if (res.status == 200) {
          history.push({
            pathname: "/cipher",
            state: { email: email },
          });
        } else {
          console.log("There was some error. Please try again!");
        }
      })
      .catch((err) => console.log("Error in saving question and answer:", err));
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
            Select Question and Answer
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="QueSelect">Select your Question</InputLabel>
                <Select
                  labelId="QueSelect"
                  id="demo-simple-select"
                  value={que}
                  label="Question"
                  onChange={(e) => {
                    setQue(e.target.value);
                    setError((prevState) => ({
                      ...prevState,
                      que: "",
                    }));
                  }}
                  error={error.que !== ""}
                >
                  {queOps.map((question) => {
                    return (
                      <MenuItem key={question.value} value={question.value}>
                        {question.value}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              {error.que && (
                <Typography variant="caption" color="red">
                  {error.que}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="ans"
                label="Enter your answer"
                name="ans"
                value={ans}
                onChange={(e) => {
                  setAns(e.target.value);
                  setError((prevState) => ({
                    ...prevState,
                    ans: "",
                  }));
                }}
                error={error.ans !== ""}
              />
            </Grid>
            <Grid item xs={12}>
              {error.ans && (
                <Typography variant="caption" color="red">
                  {error.ans}
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
    </Container>
  );
}

export default QueAnsComp;
