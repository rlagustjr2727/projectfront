import React, { useState } from "react";
import WhiskeyType from "./whiskey_type/whiskey_type";
import WhiskeyAlcohol from "./whiskey_alcohol/whiskey_alcohol";
import WhiskeyOrigin from "./whiskey_origin/whiskey_origin";
import WhiskeyAge from "./whiskey_age/whiskey_age";
import "./Sidebar.css";

const Sidebar = ({ handleChange }) => {
  const [focusedButton, setFocusedButton] = useState(null);

  const handleButtonClick = (button) => {
    setFocusedButton(button);
  };

  return (
    <section className="sidebar">
      <div className="sidebar-section">
        <WhiskeyType handleChange={handleChange} onButtonClick={() => handleButtonClick('type')} focused={focusedButton === 'type'} />
      </div>
      <div className="sidebar-section">
        <WhiskeyAlcohol handleChange={handleChange} onButtonClick={() => handleButtonClick('alcohol')} focused={focusedButton === 'alcohol'} />
      </div>
      <div className="sidebar-section">
        <WhiskeyOrigin handleChange={handleChange} onButtonClick={() => handleButtonClick('origin')} focused={focusedButton === 'origin'} />
      </div>
      <div className="sidebar-section">
        <WhiskeyAge handleChange={handleChange} onButtonClick={() => handleButtonClick('age')} focused={focusedButton === 'age'} />
      </div>
    </section>
  );
};

export default Sidebar;
