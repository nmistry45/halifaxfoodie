import React from "react";
import VerifyQueAnsComp from "../../components/VerifyQueAns";

function VerifyQueAns(props) {
  const userInfo = props.userInfo;
  console.log("userinfo.... in cont", userInfo);
  return (
    <>
      <VerifyQueAnsComp userInfo={userInfo} />
    </>
  );
}

export default VerifyQueAns;
