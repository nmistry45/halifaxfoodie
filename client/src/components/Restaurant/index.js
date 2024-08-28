import React, { useRef, useState } from "react";
import { AppBar, Toolbar } from "@material-ui/core";
import { Grid } from "@mui/material";
import FloatingChatButton from "../../components/FloatingChatButton";
import LexBot from "../../components/LexBot";
import NavBar from "../../containers/NavBar";
import { cors } from "cors";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import List from "@mui/material/List";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CommentIcon from "@mui/icons-material/Comment";
import IconButton from "@mui/material/IconButton";
import firebase from "firebase/compat/app";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Button from "@material-ui/core/Button";
import AWS from "aws-sdk";
import Typography from "@mui/material/Typography";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import { useHistory } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

firebase.initializeApp({
  apiKey: "AIzaSyCOcZPzmupheJMK3_eHNKzVXH6f71kRnME",
  authDomain: "chat-ba51b.firebaseapp.com",
  projectId: "chat-ba51b",
  storageBucket: "chat-ba51b.appspot.com",
  messagingSenderId: "658875149570",
  appId: "1:658875149570:web:4f37c46ddc3cda577ca61b",
  measurementId: "G-66GRCP924K",
});

const firestore = firebase.firestore();

function Restaurant() {
  const history = useHistory();
  const [isVisible, setIsVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [chatrooms, setChatrooms] = useState([]);
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filelist, setFileList] = useState([]);

  const documentList = [];
  const usersList = [];
  const usernameList = [];
  const fileList = [];

  const bull = (
    <Box
      component="span"
      sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
    >
      •
    </Box>
  );

  const S3_BUCKET = "recipe-upload-halifaxfoodie";
  const REGION = "us-east-1";

  AWS.config.update({
    accessKeyId: "ASIAVV6QGH7CEWG3LTC6",
    secretAccessKey: "27udbIVr+UYHbiLGBsLCwjudbG/RYRbW8+MvV/Pt",
    sessionToken:
      "FwoGZXIvYXdzEND//////////wEaDMrCvk7/XK5x8lUCJiLAAVOeUmwXs5BtYwf6MPxdN8kowknNEviXp62hsawUCA6rNcwMHADLNdx1hOz5A8EshOztd188RUWIHZCEhBdOeIATtfcBQFSUI5AV1rj5NPgdj/T9shTBUbsyULf/UBWPFdilwIrZmQZQW7DUxmVqOPg/cZhU+G8WAqNPBmSmr39Vj/z2RyhZ+RQgelAFvkPcGG9mm47jEjS76eYPV45dh8YdSqktXv5eQZPnpWjjE2ldZ9pQMhd/842I78KfVTAq5yix67KcBjItXJjtix0ysCVezBQn9zJkWytjtQi9qaVaG+C47qjUxUm+FeiheUdKXKHSwD1+",
  });

  const myBucket = new AWS.S3({
    params: { Bucket: S3_BUCKET },
    region: REGION,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const restaurantName = window.localStorage.getItem("name");
        const chatRef = firestore.collection("Chat_rooms");
        const result = await chatRef
          .where("rest_name", "==", restaurantName)
          .get();
        if (result.empty) {
          console.log("empty");
        } else {
          result.forEach((element) => {
            if (element.data()["rest_name"] == restaurantName) {
              usernameList.push({
                email: element.data()["user_email"],
                id: element.data()["chatRoomID"],
              });
            }
          });
          console.log("result is", usernameList);
          setChatrooms(usernameList);

          //Now fetching s3 objects
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  const handleFileInput = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const showChatBot = () => {
    setIsVisible(!isVisible);
  };

  function handleClick(chatId) {
    console.log("chatroom id is: ", chatId);
    localStorage.setItem("chatroomID", chatId);
    history.push({
      pathname: "/chatroom",
    });
  }

  function handleAnalyze() {
    let email = localStorage.getItem("email");
    fetch(
      "https://4hamyc7dyk5qfxfg4jd4xdmmsu0uedsg.lambda-url.us-east-1.on.aws/",
      {
        mode: "no-cors",
        method: "POST",
        headers: {
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ records: email }),
      }
    );

    history.push("/visualization");
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  async function handleExtract() {
    //fetching files from s3
    var params = {
      Bucket: S3_BUCKET,
      Delimiter: "/",
      Prefix: localStorage.getItem("name") + "/",
    };

    const result = await getFiles(params);
    if (result) {
      setOpen(true);
    }
  }

  const getFiles = (params) => {
    return new Promise((resolve, reject) => {
      myBucket.listObjects(params, function (err, data) {
        if (err) {
          return "There was an error viewing your files: " + err.message;
        } else {
          console.log(data.Contents, "<<<all content");

          data.Contents.forEach(function (obj, index) {
            fileList.push(obj.Key.split("/")[1]);
            console.log(obj.Key.split("/")[1]);
          });

          setFileList(fileList);
          resolve(filelist);
        }
      });
    });
  };

  function handleUpload(file) {
    console.log("inside upload file function");
    const params = {
      ACL: "public-read",
      Body: file,
      Bucket: S3_BUCKET,
      Key: localStorage.getItem("name") + "/" + file.name,
    };

    myBucket
      .putObject(params)
      .on("httpUploadProgress", (evt) => {
        setProgress(Math.round((evt.loaded / evt.total) * 100));
      })
      .send((err) => {
        if (err) console.log(err);
      });
  }

  function triggerLambda(filename) {
    fetch(
      "https://z74e74zyglpt7l4schyshecpem0qgxiy.lambda-url.us-east-1.on.aws/",
      {
        mode: "no-cors",
        method: "POST",
        headers: {
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          records: filename,
          folder: localStorage.getItem("name"),
        }),
      }
    ).then(() => {
      setOpen(false);
      toast.success("Ingredients extracted see database !", {
        position: toast.POSITION.TOP_RIGHT,
      });
    });
  }

  const listItems = filelist.map((d) => (
    <Button
      onClick={() => triggerLambda(d)}
      style={{ border: "2px solid red", margin: "5px", padding: "5px" }}
      key={d}
    >
      {d}
    </Button>
  ));
  return (
    <>
      <Toolbar style={{ color: "white", background: "#0b93f6" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexGrow: "1",
          }}
        >
          <RestaurantIcon />
          {window.localStorage.getItem("name")}

          <Button
            style={{
              border: "2px solid white",
              background: "green",
              color: "white",
            }}
            onClick={handleAnalyze}
          >
            Analyze Data
          </Button>
        </div>

        <Button
          style={{
            border: "2px solid white",
            marginLeft: "5px",
            background: "green",
            color: "white",
          }}
          onClick={() => handleUpload(selectedFile)}
        >
          Upload Recipe
        </Button>

        <Button
          style={{
            border: "2px solid white",
            marginLeft: "5px",
            background: "green",
            color: "white",
          }}
          onClick={() => handleExtract()}
        >
          Extract Keys
        </Button>
      </Toolbar>

      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Box sx={{ maxWidth: 400 }} style={{ marginTop: "1rem" }}>
            <Card variant="outlined" style={{ borderRadius: "10px" }}>
              <List
                style={{ padding: "10px", background: "black" }}
                sx={{
                  width: "100%",
                  maxWidth: 400,
                  bgcolor: "background.paper",
                }}
              >
                <h2 style={{ color: "white" }}>Active Chatrooms</h2>
                {chatrooms.map((value) => (
                  <ListItem
                    key={value.id}
                    disableGutters
                    secondaryAction={
                      <IconButton aria-label="comment" style={{ color: "red" }}>
                        <CommentIcon onClick={() => handleClick(value.id)} />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      style={{ color: "#0b93f6" }}
                      primary={`  ${value.email}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Card>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box
            sx={{ maxWidth: 400 }}
            style={{ marginTop: "1rem", marginLeft: "3px" }}
          >
            <Card
              variant="outlined"
              style={{
                padding: "2%",
                minHeight: "195px",
                background: "black",
                borderRadius: "10px",
              }}
            >
              <div style={{ color: "white" }}> Progress is {progress}%</div>
              <input
                type="file"
                style={{ marginTop: "4rem", color: "white" }}
                onChange={handleFileInput}
              />
            </Card>
          </Box>
        </Grid>
        <Grid item xs={8} style={{ padding: "10px", marginTop: "1rem" }}>
          {isVisible && <LexBot />}
        </Grid>

        <Grid item xs={1}>
          <FloatingChatButton showChatBot={showChatBot} />
        </Grid>
      </Grid>
      <ToastContainer />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Click on list of recipe</DialogTitle>
        <DialogContent>{listItems}</DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Restaurant;
