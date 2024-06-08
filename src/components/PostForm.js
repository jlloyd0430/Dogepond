import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../services/apiClient";
import "./PostForm.css"; // Import the CSS file

const PostForm = () => {
  const [formData, setFormData] = useState({
    projectName: "",
    dropType: "new mint", // Default to 'new mint'
    price: 0,
    wlPrice: 0,
    startingPrice: 0,
    marketplaceLink: "",
    projectLink: "",
    date: "",
    time: "",
    supply: "",
    description: "",
    website: "",
    xCom: "",
    telegram: "",
    discord: "",
    image: null,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({
        ...formData,
        image: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "x-auth-token": token,
          "Content-Type": "multipart/form-data",
        },
      };

      const response = await apiClient.post(
        "/nftdrops",
        formDataToSend,
        config
      );
      console.log("Submitted post response:", response.data);
      alert("Submission successful! Await approval.");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="post-form-container">
      <h1>Post your Mint</h1>
      <form className="post-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="projectName"
          placeholder="Project Name"
          onChange={handleChange}
          required
        />
        <select
          className="droptypes"
          name="dropType"
          value={formData.dropType}
          onChange={handleChange}
          required
        >
          <option value="new mint">New Mint</option>
          <option value="airdrop">Airdrop</option>
          <option value="auction">Auction</option>
        </select>

        {formData.dropType === "new mint" && (
          <>
            <input
              type="number"
              name="price"
              placeholder="Price"
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="wlPrice"
              placeholder="Whitelist Price"
              onChange={handleChange}
              required
            />
          </>
        )}

        {formData.dropType === "auction" && (
          <>
            <input
              type="number"
              name="startingPrice"
              placeholder="Starting Price"
              onChange={handleChange}
              required
            />
            <input
              type="url"
              name="marketplaceLink"
              placeholder="Marketplace Link"
              onChange={handleChange}
            />
          </>
        )}

        {formData.dropType === "airdrop" && (
          <input
            type="url"
            name="projectLink"
            placeholder="Project Link"
            onChange={handleChange}
          />
        )}

        <input
          type="text"
          name="date"
          placeholder="Date"
          onChange={handleChange}
          value={formData.date === "TBA" ? "" : formData.date}
        />
        <input
          type="time"
          name="time"
          placeholder="Time"
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="supply"
          placeholder="Supply"
          onChange={handleChange}
          required
        />
        <textarea
          className="postDetails"
          name="description"
          placeholder="Description"
          onChange={handleChange}
          required
        />
        <input
          type="url"
          name="website"
          placeholder="Website URL"
          onChange={handleChange}
        />
        <input
          type="url"
          name="xCom"
          placeholder="X.com URL"
          onChange={handleChange}
        />
        <input
          type="url"
          name="telegram"
          placeholder="Telegram URL"
          onChange={handleChange}
        />
        <input
          type="url"
          name="discord"
          placeholder="Discord URL"
          onChange={handleChange}
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default PostForm;
