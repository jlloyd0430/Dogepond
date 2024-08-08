// src/components/UnderConstruction.js

import React, { useState } from "react";

const UnderConstruction = ({ setPasscodeEntered }) => {
  const [passcode, setPasscode] = useState("");
  const correctPasscode = "1234"; // Replace this with your actual passcode

  const handlePasscodeChange = (e) => {
    setPasscode(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passcode === correctPasscode) {
      setPasscodeEntered(true);
    } else {
      alert("Incorrect passcode. Please try again.");
    }
  };

  return (
    <div className="under-construction">
      <h1>Under Construction</h1>
      <p>We will be back shortly.</p>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={passcode}
          onChange={handlePasscodeChange}
          placeholder="Enter passcode"
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default UnderConstruction;
