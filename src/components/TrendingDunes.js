.trending-container {
  padding: 20px;
  text-align: center;
}

.trending-header-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.trending-ttitle {
  cursor: pointer;
}

.trending-balance-container,
.trending-sort-container {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.trending-balance-container input {
  padding: 10px;
  font-size: 16px;
  width: 100%;
  max-width: 300px;
  box-sizing: border-box;
}

.trending-balance-container button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  width: 100%;
  max-width: 150px;
  box-sizing: border-box;
}

.trending-dune-list,
.trending-wallet-dunes-list,
.trending-drc20-list,
.trending-nft-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}

.trending-wallet-dune-card,
.trending-dune-card,
.trending-nftCard {
  border: 2px solid goldenrod;
  padding: 20px;
  border-radius: 11px;
  text-align: center;
  width: 100%;
  max-width: 300px;
  box-sizing: border-box;
}

.trending-dune-card a {
  text-decoration: none;
  color: inherit;
  word-wrap: break-word; /* Prevent long text from overflowing */
}

.trending-dune-card h2 {
  font-size: 18px;
  color: goldenrod; /* Use a color similar to your theme */
}

.trending-error {
  color: red;
}

.trending-form-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

.trending-form-container label {
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
}

.trending-form-container input[type="text"],
.trending-form-container input[type="number"],
.trending-form-container select {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 5px;
  border: 1px solid #ddd;
  box-sizing: border-box;
}

.trending-form-container input[type="checkbox"] {
  margin-right: 10px;
}

.trending-form-container button[type="submit"] {
  width: 100%;
  padding: 10px;
  background-color: goldenrod;
  border: none;
  color: white;
  border-radius: 5px;
  cursor: pointer;
}

.trending-form-container button[type="submit"]:hover {
  background-color: gold;
}

.trending-payment-popup {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

/* Mobile-specific styles */
@media (max-width: 768px) {
  .trending-dune-list,
  .trending-wallet-dunes-list,
  .trending-nft-list {
    flex-direction: column;
    align-items: center;
  }

  .trending-dune-card,
  .trending-wallet-dune-card,
  .trending-nftCard {
    width: 100%;
    max-width: 100%;
    text-align: left; /* Align text to the left */
  }

  .trending-dune-card h2 {
    font-size: 16px;
    word-wrap: break-word; /* Prevent long text from overflowing */
  }

  .trending-nftCard img {
    margin: 0 auto 10px; /* Center the image and add some margin below */
    max-width: 100%;
    height: auto;
  }
}
