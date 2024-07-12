import React, { useState } from 'react';
import Input from "../../components/Input";

const WhiskeyOrigin = ({ handleChange }) => {
  const [selectedOrigin, setSelectedOrigin] = useState("");

  const onCategoryChange = (value) => {
    setSelectedOrigin(value);
    handleChange("whiskey_origin", value);
  };

  return (
    <div className="section-container">
      <h3 className="whiskey-origin-title">원산지</h3>
      {["", "네덜란드", "독일", "멕시코", "미국", "스웨덴", "스코틀랜드", "스페인", "아일랜드", "영국 런던", "이탈리아", "일본", "프랑스"].map((origin) => (
        <Input 
          key={origin} 
          handleChange={() => onCategoryChange(origin)} 
          value={origin} 
          title={origin === "" ? "All" : origin} 
          name="whiskey_origin" 
          isSelected={selectedOrigin === origin} 
        />
      ))}
    </div>
  );
};

export default WhiskeyOrigin;
