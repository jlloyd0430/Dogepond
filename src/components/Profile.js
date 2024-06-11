import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import NFTCard from "../components/NFTCard";
import apiClient from "../services/apiClient";

const Profile = () => {
  const { auth } = useContext(AuthContext);
  const [userDrops, setUserDrops] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserDrops = async () => {
      try {
        const config = {
          headers: {
            "x-auth-token": auth.token,
          },
        };
        const response = await apiClient.get("/nftdrops/user", config);
        setUserDrops(response.data);
        setError("");
      } catch (error) {
        console.error("Error fetching user NFT drops:", error);
        setError("Failed to fetch user NFT drops. Please try again later.");
      }
    };

    fetchUserDrops();
  }, [auth.token]);

  return (
    <div>
      <h1>My NFT Drops</h1>
      {error && <p>{error}</p>}
      <div className="nft-drops">
        {userDrops.map((drop) => (
          <NFTCard
            key={drop._id}
            drop={drop}
            onLike={() => {}}
            isProfilePage={true}
            userRole={auth.user?.role} // Pass user role to the NFTCard component
          />
        ))}
      </div>
    </div>
  );
};

export default Profile;
