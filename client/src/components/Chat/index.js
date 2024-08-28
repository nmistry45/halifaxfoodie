import React, { useRef, useState } from "react";
import { useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import "../../../src/Chat.css";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { AppBar, Toolbar } from "@material-ui/core";
import { useLocation } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useHistory } from "react-router-dom";

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
const messageHistory = [];
/**
 * Reference for chatroom: [1]fireship-io, “react-firebase-chat/App.js at master · fireship-io/react-firebase-chat,” GitHub, Sep. 23, 2020.  [Online]. 
 * Available: https://github.com/fireship-io/react-firebase-chat. [Accessed: Dec. 04, 2022]
 */
function ChatComponent() {
  const history = useHistory();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = window.localStorage.getItem("chatroomID");
        console.log("id is", id);
        const chatRef = firestore.collection("Chat_rooms").doc(id);
        const result = await chatRef.get().then((snapshot) => {
          console.log("from firebase", snapshot);
          console.log(snapshot.data());
          if (localStorage.getItem("userType") == "Restaurant") {
            localStorage.setItem(
              "opposite_user_id",
              snapshot.data().user_email
            );
            localStorage.setItem("email", localStorage.getItem("name"));
          } else {
            window.localStorage.setItem("email", snapshot.data().user_email);
            window.localStorage.setItem(
              "opposite_user_id",
              snapshot.data().rest_name
            );
          }
        });
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  const chatroomID = window.localStorage.getItem("chatroomID");
  var currentUser = window.localStorage.getItem("email");
  var oppositeUser = window.localStorage.getItem("opposite_user_id");
  console.log(currentUser, oppositeUser);
  if (oppositeUser == "") {
    oppositeUser = "support@halifaxfoodie.com";
  }
  const dummy = useRef();
  const messagesRef = firestore.collection("messages");
  const users = [
    currentUser + " is talking with " + oppositeUser,
    oppositeUser + " is talking with " + currentUser,
  ];
  console.log(users);
  const queryCurrentUser = messagesRef
    .where("chatroomID", "==", chatroomID)
    .orderBy("createdAt");
  const [messages, loading, error] = useCollectionData(queryCurrentUser, {
    idField: "id",
  });
  console.log("messages are", messages);
  console.log("message history", messageHistory);
  console.log(loading);
  console.log(error);

  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();
    const userKey = "email";
    const oppositeUserKey = "opposite_user_id";
    var currentUser = window.localStorage.getItem(userKey);
    var oppositeUser = window.localStorage.getItem(oppositeUserKey);
    var chatroomID = window.localStorage.getItem("chatroomID");

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      email: currentUser,
      oppositeEmail: currentUser + " is talking with " + oppositeUser,
      chatroomID: chatroomID,
    });

    setFormValue("");
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  async function handleChatClose(chatID) {
    if (localStorage.getItem("userType") == "Customer") {
      const messagetext = messages.map(function (message) {
        return message.text;
      });
      console.log("message text", messagetext);
      const res = await firestore
        .collection("Chat_rooms")
        .doc(chatID)
        .collection("history")
        .add({
          messages: messagetext,
        })
        .then((res) => {
          console.log(res);
        });
      history.push("/home");
    } else {
      history.push("/restaurant");
    }
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexGrow: "1",
        }}
      >
        <Toolbar style={{ color: "white", background: "#6649b8" }}>
          Chatroom id : {chatroomID}
          <IconButton style={{ color: "white" }}>
            <CloseIcon onClick={() => handleChatClose(chatroomID)} />
          </IconButton>
        </Toolbar>
      </div>

      <main>
        {messages &&
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
        <span ref={dummy}></span>
      </main>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <form onSubmit={sendMessage}>
          <input
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
            placeholder="say something nice"
          />

          <button type="submit" disabled={!formValue}>
            Send Message
          </button>
        </form>
      </div>
    </>
  );
}

function ChatMessage(props) {
  console.log(props.message);
  const { text, email } = props.message;
  var currentUser = window.localStorage.getItem("email");
  console.log("email: " + email + ",text: " + text);
  const messageClass = email == currentUser ? "sent" : "received";
  return (
    <>
      <div className={`message ${messageClass}`}>
        <p>{text}</p>
      </div>
    </>
  );
}

export default ChatComponent;
