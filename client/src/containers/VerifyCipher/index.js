import React from "react";
import VerifyCipherComp from "../../components/VerifyCipher";

function VerifyCipher(props) {
  const userInfo = props.userInfo;

  return (
    <>
      <VerifyCipherComp userInfo={userInfo} />
    </>
  );
}

export default VerifyCipher;
