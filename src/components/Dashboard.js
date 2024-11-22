import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import NFTCard from "../components/NFTCard";
import apiClient from "../services/apiClient";

const Dashboard = () => {
  const { auth } = useContext(AuthContext);
  const [unapprovedDrops, setUnapprovedDrops] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUnapprovedDrops = async () => {
      try {
        const config = {
          headers: {
            "x-auth-token": auth.token,
          },
        };
        const response = await apiClient.get("/nftdrops", config);
        setUnapprovedDrops(response.data.filter((drop) => !drop.approved));
        setError("");
      } catch (error) {
        console.error("Error fetching unapproved NFT drops:", error);
        setError(
          "Failed to fetch unapproved NFT drops. Please try again later."
        );
      }
    };

    fetchUnapprovedDrops();
  }, [auth.token]);

  const handleApprove = async (id) => {
    try {
      const config = {
        headers: {
          "x-auth-token": auth.token,
        },
      };
      const response = await apiClient.put(
        `/nftdrops/approve/${id}`,
        {},
        config
      );
      setUnapprovedDrops((prevDrops) =>
        prevDrops.filter((drop) => drop._id !== id)
      );
    } catch (error) {
      console.error("Error approving NFT drop:", error);
      setError("Failed to approve NFT drop. Please try again later.");
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      {error && <p>{error}</p>}
      <div className="nft-drops">
        {unapprovedDrops.map((drop) => (
          <NFTCard
            key={drop._id}
            drop={drop}
            onLike={null}
            onApprove={handleApprove}
            userRole={auth.user?.role} // Pass user role to the NFTCard component
            isProfilePage={false} // Ensure this is set to false for dashboard
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
