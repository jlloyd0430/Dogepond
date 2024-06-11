import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../services/apiClient";
import { AuthContext } from "../context/AuthContext";
import "./PostForm.css";

const EditForm = () => {
  const { id } = useParams();
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    projectName: "",
    dropType: "new mint",
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

  useEffect(() => {
    const fetchDrop = async () => {
      try {
        const response = await apiClient.get(`/nftdrops/${id}`, {
          headers: { "x-auth-token": auth.token },
        });
        setFormData(response.data);
      } catch (error) {
        console.error("Error fetching drop:", error);
      }
    };

    fetchDrop();
  }, [id, auth.token]);

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
      const response = await apiClient.put(
        `/nftdrops/edit/${id}`,
        formDataToSend,
        {
          headers: {
            "x-auth-token": auth.token,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Edit response:", response.data);
      alert("Update successful! Await approval.");
      navigate("/profile");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="post-form-container">
      <h1>Edit your Mint</h1>
      <form className="post-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="projectName"
          placeholder="Project Name"
          value={formData.projectName}
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
              javascript
              Copy
              code
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="wlPrice"
              placeholder="Whitelist Price"
              value={formData.wlPrice}
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
              value={formData.startingPrice}
              onChange={handleChange}
              required
            />
            <input
              type="url"
              name="marketplaceLink"
              placeholder="Marketplace Link"
              value={formData.marketplaceLink}
              onChange={handleChange}
            />
          </>
        )}

        {formData.dropType === "airdrop" && (
          <input
            type="url"
            name="projectLink"
            placeholder="Project Link"
            value={formData.projectLink}
            onChange={handleChange}
          />
        )}

        <input
          type="text"
          name="date"
          placeholder="Date"
          value={formData.date}
          onChange={handleChange}
        />
        <input
          type="time"
          name="time"
          placeholder="Time"
          value={formData.time}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="supply"
          placeholder="Supply"
          value={formData.supply}
          onChange={handleChange}
          required
        />
        <textarea
          className="postDetails"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <input
          type="url"
          name="website"
          placeholder="Website URL"
          value={formData.website}
          onChange={handleChange}
        />
        <input
          type="url"
          name="xCom"
          placeholder="X.com URL"
          value={formData.xCom}
          onChange={handleChange}
        />
        <input
          type="url"
          name="telegram"
          placeholder="Telegram URL"
          value={formData.telegram}
          onChange={handleChange}
        />
        <input
          type="url"
          name="discord"
          placeholder="Discord URL"
          value={formData.discord}
          onChange={handleChange}
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
        />
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default EditForm;
