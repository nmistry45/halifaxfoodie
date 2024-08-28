import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Container,
  Paper,
  LinearProgress,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VerifyCipher from "../../containers/VerifyCipher";

function VerifyQueAnsComp({ userInfo }) {
  const [que, setQue] = useState("");
  const [ans, setAns] = useState("");
  const [expAns, setExpAns] = useState("");
  const [correctAns, setCorrectAns] = useState(false);
  const [fetchInfo, setFetchInfo] = useState(true);

  let email = userInfo?.email;
  console.log("email...", email);
  console.log("userInfo...", userInfo);

  const [error, setError] = useState({
    ans: "",
  });

  const requiredFieldCheck = () => {
    let errorObj = Object.assign({}, error);
    let isEmpty = false;
    if (ans === "") {
      errorObj.ans = "Answer is required";
      setError(errorObj);
      isEmpty = true;
    }
    return isEmpty;
  };

  useEffect(() => {
    getQuestionAnswer();
  }, []);

  const getQuestionAnswer = async () => {
    await fetch(
      `https://us-central1-serverless-370020.cloudfunctions.net/getQA`,
      {
        method: "POST",
        headers: {
          "Content-Type": "Application/JSON",
        },
        body: JSON.stringify({ email: email }),
      }
    )
      .then((res) => res.json())
      .then((body) => {
        setQue(body.body.question);
        setExpAns(body.body.answer);
        setFetchInfo(false);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (requiredFieldCheck()) {
      return;
    }
    let errorObj = Object.assign({}, error);
    if (errorObj.ans) {
      return;
    }
    setCorrectAns(false);
    if (ans.toLowerCase() === expAns.toLowerCase()) {
      setCorrectAns(true);
    } else {
      console.log("Incorrect Answer. Try again!");
    }
  };

  return (
    <Container maxWidth="sm">
      {fetchInfo ? <LinearProgress /> : null}
      {correctAns === false ? (
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
              Enter your answer for the following question:
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography component="h1" variant="h5">
                  {que}
                </Typography>
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
      ) : null}
      {correctAns ? <VerifyCipher userInfo={userInfo} /> : null}
    </Container>
  );
}

export default VerifyQueAnsComp;
