importReact, { useState } from'react';
import { submitOrder } from'../services/duneApiClient'; // Import the submitOrder function from duneApiClientimport'./Trending.css';

constDuneForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    operationType: 'deploy',
    duneName: '',
    symbol: '',
    limitPerMint: '',
    maxNrOfMints: '',
    mintId: '',
    mintAmount: '',
    numberOfMints: '',
    mintToAddress: '',
    paymentAddress: '',
  });

  const [isMaintenanceMode, setIsMaintenanceMode] = useState(true);
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // New state to prevent multiple submissionsconst correctPassword = 'doginals are dead'; // Password to unlock the formconsthandleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  consthandlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  consthandlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === correctPassword) {
      setIsMaintenanceMode(false);
    } else {
      alert('Incorrect password');
    }
  };

  consthandleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent duplicate submissionsif (isSubmitting) return;

    setIsSubmitting(true);

    const timestamp = Date.now();
    
    const orderData = { 
      ...formData, 
      timestamp,
      limitPerMint: parseInt(formData.limitPerMint, 10),
      maxNrOfMints: parseInt(formData.maxNrOfMints, 10),
      mintAmount: formData.operationType === 'mint' ? parseInt(formData.mintAmount, 10) : undefined,
      numberOfMints: formData.operationType === 'mint' ? parseInt(formData.numberOfMints, 10) : undefined,
    }; 

    try {
      const response = awaitsubmitOrder(orderData); // Use the submitOrder function from duneApiClient.jsonSubmit(response); // Handle the response from the backend
    } catch (error) {
      console.error('Error submitting order:', error);
    } finally {
      setIsSubmitting(false); // Reset the submitting state after the request completes
    }
  };

  return (
    <divclassName="dune-form-container">
      {isMaintenanceMode ? (
        <divclassName="maintenance-message"><h2>Dunes Etcher is under maintenance</h2><p>Please enter the password to unlock the form.</p><form onSubmit={handlePasswordSubmit}><label>
              Password:
              <inputtype="password"value={password}onChange={handlePasswordChange}required
              /></label><button type="submit">Unlock</button></form></div>
      ) : (
        <formclassName="dune-form"onSubmit={handleSubmit}><label>
            Operation Type:
            <selectname="operationType"value={formData.operationType}onChange={handleChange}><option value="deploy">Deploy</option><option value="mint">Mint</option></select></label>

          {formData.operationType === 'deploy' && (
            <><label>
                Dune Name:
                <inputtype="text"name="duneName"value={formData.duneName}onChange={(e) =>
                    handleChange({
                      target: {
                        name: 'duneName',
                        value: e.target.value.toUpperCase().replace(/ /g, '•'),
                      },
                    })
                  }
                  required
                />
              </label><label>
                Symbol:
                <inputtype="text"name="symbol"value={formData.symbol}onChange={handleChange}required
                /></label><label>
                Limit Per Mint:
                <inputtype="number"name="limitPerMint"value={formData.limitPerMint}onChange={handleChange}required
                /></label><label>
                Max Number of Mints:
                <inputtype="number"name="maxNrOfMints"value={formData.maxNrOfMints}onChange={handleChange}required
                /></label></>
          )}

          {formData.operationType === 'mint' && (
            <><label>
                Mint ID:
                <inputtype="text"name="mintId"value={formData.mintId}onChange={handleChange}required
                /></label><label>
                Amount to Mint:
                <inputtype="number"name="mintAmount"value={formData.mintAmount}onChange={handleChange}required
                /></label><label>
                Number of Mints:
                <inputtype="number"name="numberOfMints"value={formData.numberOfMints}onChange={handleChange}required
                /></label><label>
                To Address:
                <inputtype="text"name="mintToAddress"value={formData.mintToAddress}onChange={handleChange}required
                /></label></>
          )}

          <button type="submit" disabled={isSubmitting}>Submit</button>
        </form>
      )}
    </div>
  );
};

exportdefaultDuneForm;

