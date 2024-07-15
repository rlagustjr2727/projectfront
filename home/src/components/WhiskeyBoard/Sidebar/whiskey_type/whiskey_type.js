import React, { useState } from 'react';
import Input from "../../components/Input";

const CATEGORY_MAPPING = {
  "버번 위스키": ["라이 위스키", "버번 위스키", "테네시 위스키"],
  "리큐르": ["꼬냑", "데낄라", "럼", "리큐르", "진", "보드카"],
  "그레인 위스키": ["싱글 그레인 위스키", "블랜디드 그레인 위스키"],
  "블랜디드 위스키": ["블랜디드 몰트 위스키", "블랜디드 스카치 위스키", "블랜디드 아이리쉬 위스키"],
  "싱글 몰트 위스키": ["싱글 몰트 위스키"]
};

const WhiskeyType = ({ handleChange }) => {
  const [selectedType, setSelectedType] = useState("");

  const onCategoryChange = (value) => {
    setSelectedType(value);
    handleChange("wboard_of_type", CATEGORY_MAPPING[value] || []);
  };

  return (
    <div className="section-container">
      <h3 className="sidebar-title">종류</h3>
      {["", "블랜디드 위스키", "싱글 몰트 위스키", "그레인 위스키", "버번 위스키", "리큐르"].map((type) => (
        <Input 
          key={type} 
          handleChange={() => onCategoryChange(type)} 
          value={type} 
          title={type === "" ? "All" : type} 
          name="wboard_of_type" 
          isSelected={selectedType === type} 
        />
      ))}
    </div>
  );
};

export default WhiskeyType;
