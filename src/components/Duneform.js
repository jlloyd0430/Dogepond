importReact, { useState, useEffect } from'react';
import { submitOrder } from'../services/duneApiClient';
import'./Trending.css';

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
  const [isSubmitting, setIsSubmitting] = useState(false); // To track the submission stateconst correctPassword = 'doginals are dead';

  consthandleChange = (e) => {
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

    if (isSubmitting) return; // Prevent double submissionsetIsSubmitting(true);

    const timestamp = Date.now();
    const orderData = {
      ...formData,
      timestamp,
      limitPerMint: formData.operationType === 'deploy' ? parseInt(formData.limitPerMint, 10) : undefined,
      maxNrOfMints: formData.operationType === 'deploy' ? parseInt(formData.maxNrOfMints, 10) : undefined,
      mintAmount: formData.operationType === 'mint' ? parseInt(formData.mintAmount, 10) : undefined,
      numberOfMints: formData.operationType === 'mint' ? parseInt(formData.numberOfMints, 10) : undefined,
    };

    try {
      const response = awaitsubmitOrder(orderData); // Submit the orderonSubmit(response); // Notify parent of successful submission
    } catch (error) {
      console.error('Error submitting order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    return() => {
      setIsSubmitting(false); // Reset submission state if the component unmounts
    };
  }, []);

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

          <button type="submit" disabled={isSubmitting}>Submit</button> {/* Disable button while submitting */}
        </form>
      )}
    </div>
  );
};

exportdefaultDuneForm;
