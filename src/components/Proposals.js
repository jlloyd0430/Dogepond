import React, { useState, useEffect } from 'react';
import apiClient from '../services/apiClient';
import { getWalletAddress, getWalletData, DOGELABS_WALLET, DOGINALS_TYPE } from '../wallets/wallets';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import './Proposals.css';

const Proposals = () => {
  const [proposals, setProposals] = useState([]);
  const [filteredProposals, setFilteredProposals] = useState([]);
  const [walletAddress, setWalletAddress] = useState(null);
  const [walletHoldings, setWalletHoldings] = useState([]);
  const [showCreateProposal, setShowCreateProposal] = useState(false);
  const [newProposal, setNewProposal] = useState({
    name: '',
    description: '',
    options: [''],
    endDate: '',
    collectionName: '',
    ticker: '',
    weightInputs: {},
    image: null,
    classified: false,
    drc20Weight: 1,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('mostRecent');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [viewingProposalId, setViewingProposalId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const response = await apiClient.get('/proposals');
        setProposals(response.data);
        setFilteredProposals(response.data);
      } catch (error) {
        console.error('Error fetching proposals:', error);
      }
    };

    fetchProposals();
  }, []);

  useEffect(() => {
    filterProposals();
  }, [searchTerm, filterType, proposals]);

  const handleConnectWallet = async () => {
    try {
      const address = await getWalletAddress(DOGELABS_WALLET, DOGINALS_TYPE);
      setWalletAddress(address);
      const data = await getWalletData(address);
      setWalletHoldings(data.inscriptions);
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const handleVote = async (proposal, option) => {
    if (!walletAddress) {
      alert('Please connect your wallet first.');
      return;
    }

    if (!option) {
      alert('Please select an option to vote.');
      return;
    }

    console.log('Wallet Address:', walletAddress);
    console.log('Proposal ID:', proposal._id);
    console.log('Option:', option);

    try {
      const response = await apiClient.post('/proposals/vote', {
        proposalId: proposal._id,
        walletAddress: walletAddress.trim(),
        option,
      });
      console.log('Vote response:', response);
      alert('Vote cast successfully!');
      // Fetch updated proposals
      const updatedProposals = await apiClient.get('/proposals');
      setProposals(updatedProposals.data);
    } catch (error) {
      console.error('Error casting vote:', error);
      alert('Failed to cast vote. Please try again later.');
    }
  };

  const handleCreateProposal = async () => {
    if (!walletAddress) {
      alert('Please connect your wallet first.');
      return;
    }

    if (!newProposal.collectionName && !newProposal.ticker) {
      setError('You must provide either a collection name or a DRC-20 ticker.');
      return;
    }

    if (newProposal.collectionName && newProposal.ticker) {
      setError('You cannot provide both a collection name and a DRC-20 ticker. Please choose one.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', newProposal.name);
      formData.append('description', newProposal.description);
      formData.append('endDate', newProposal.endDate);
      if (newProposal.collectionName) {
        formData.append('collectionName', newProposal.collectionName);
      }
      if (newProposal.ticker) {
        formData.append('ticker', newProposal.ticker);
      }
      formData.append('walletAddress', walletAddress);
      formData.append('classified', newProposal.classified);
      newProposal.options.forEach((option, index) => {
        formData.append(`options[${index}]`, option);
      });
      Object.keys(newProposal.weightInputs).forEach((key) => {
        formData.append(`weightInputs[${key}]`, newProposal.weightInputs[key]);
      });
      if (newProposal.image) {
        formData.append('image', newProposal.image);
      }
      formData.append('drc20Weight', newProposal.drc20Weight);

      // Log the FormData
      console.log('FormData before sending:');
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      const response = await apiClient.post('/proposals/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Proposal created successfully!');
      setShowCreateProposal(false);
      // Fetch updated proposals
      const updatedProposals = await apiClient.get('/proposals');
      setProposals(updatedProposals.data);
      setError('');
    } catch (error) {
      console.error('Error creating proposal:', error);
      if (error.response && error.response.data && error.response.data.error) {
        alert(error.response.data.error);
      } else {
        alert('Failed to create proposal. Please try again later.');
      }
    }
  };

  const handleProposalOptionChange = (index, value) => {
    const newOptions = [...newProposal.options];
    newOptions[index] = value;
    setNewProposal({ ...newProposal, options: newOptions });
  };

  const handleWeightInputChange = (nft, weight) => {
    const weightInputs = { ...newProposal.weightInputs, [nft]: weight };
    setNewProposal({ ...newProposal, weightInputs });
  };

  const handleImageChange = (e) => {
    setNewProposal({ ...newProposal, image: e.target.files[0] });
  };

  const handleViewProposal = async (proposalId) => {
    if (!walletAddress) {
      alert('Please connect your wallet first.');
      return;
    }

    try {
      const response = await apiClient.post('/proposals/view', {
        proposalId,
        walletAddress: walletAddress.trim(),
      });

      if (response.data.allowed) {
        setViewingProposalId(proposalId);
      } else {
        alert('You do not have access to view this proposal.');
      }
    } catch (error) {
      console.error('Error fetching proposal details:', error);
      alert('Failed to fetch proposal details. Please try again later.');
    }
  };

  const filterProposals = () => {
    let filtered = proposals;

    if (searchTerm) {
      filtered = filtered.filter((proposal) =>
        proposal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proposal.collectionName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    switch (filterType) {
      case 'past':
        filtered = filtered.filter((proposal) => new Date(proposal.endDate) < new Date());
        break;
      case 'mostRecent':
        filtered = filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'topVotes':
        filtered = filtered.sort((a, b) => {
          const totalVotesA = a.votes.reduce((acc, vote) => acc + vote.weight, 0);
          const totalVotesB = b.votes.reduce((acc, vote) => acc + vote.weight, 0);
          return totalVotesB - totalVotesA;
        });
        break;
      default:
        break;
    }

    setFilteredProposals(filtered);
  };

  return (
    <div className="proposals-container">
      <div className="header-buttons">
        <button className="button" onClick={handleConnectWallet}>
          {walletAddress ? `Connected: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Connect Wallet'}
        </button>
        <button className="button" onClick={() => setShowCreateProposal(true)}>Create Proposal</button>
      </div>

      <div className="search-filter-container">
        <input
          type="text"
          placeholder="Search Proposals"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="filter-dropdown">
          <FontAwesomeIcon
            className="search"
            icon={faFilter}
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
          />
          {showFilterDropdown && (
            <div className="dropdown-menu">
              <div onClick={() => setFilterType('mostRecent')}>Most Recent</div>
              <div onClick={() => setFilterType('past')}>Past</div>
              <div onClick={() => setFilterType('topVotes')}>Top Votes</div>
            </div>
          )}
        </div>
      </div>

      {showCreateProposal && (
        <div className="create-proposal-form">
          <h3>Create Proposal</h3>
          <input
            type="text"
            placeholder="Proposal Name"
            value={newProposal.name}
            onChange={(e) => setNewProposal({ ...newProposal, name: e.target.value })}
          />
          <textarea
            placeholder="Proposal Description"
            value={newProposal.description}
            onChange={(e) => setNewProposal({ ...newProposal, description: e.target.value })}
          />
          {newProposal.options.map((option, index) => (
            <input
              key={index}
              type="text"
              placeholder={`Option ${index + 1}`}
              value={option}
              onChange={(e) => handleProposalOptionChange(index, e.target.value)}
            />
          ))}
          <button className="button" onClick={() => setNewProposal({ ...newProposal, options: [...newProposal.options, ''] })}>
            Add Option
          </button>
          <input
            type="datetime-local"
            value={newProposal.endDate}
            onChange={(e) => setNewProposal({ ...newProposal, endDate: e.target.value })}
          />
          <input
            type="text"
            placeholder="OW Collection Name"
            value={newProposal.collectionName}
            onChange={(e) => setNewProposal({ ...newProposal, collectionName: e.target.value })}
            disabled={newProposal.ticker !== ''}
          />
          <input
            type="text"
            placeholder="DRC-20 Ticker CAPS"
            value={newProposal.ticker}
            onChange={(e) => setNewProposal({ ...newProposal, ticker: e.target.value })}
            disabled={newProposal.collectionName !== ''}
          />
          <label className="checkbox">
            <input
              type="checkbox"
              checked={newProposal.classified}
              onChange={(e) => setNewProposal({ ...newProposal, classified: e.target.checked })}
            />
            Classified
          </label>
          {Object.keys(newProposal.weightInputs).map((nft, index) => (
            <div key={index}>
              <input
                type="text"
                placeholder="NFT"
                value={nft}
                onChange={(e) => handleWeightInputChange(e.target.value, newProposal.weightInputs[nft])}
              />
              <input
                type="number"
                placeholder="Weight"
                value={newProposal.weightInputs[nft]}
                onChange={(e) => handleWeightInputChange(nft, e.target.value)}
              />
            </div>
          ))}
          {newProposal.ticker && (
            <div>
              <label>
                DRC-20 Voting Power (Number of tokens for 1 vote)
                <input
                  type="number"
                  value={newProposal.drc20Weight}
                  onChange={(e) => setNewProposal({ ...newProposal, drc20Weight: e.target.value })}
                />
              </label>
            </div>
          )}
          <input type="file" accept="image/*" onChange={handleImageChange} />
          <button className="button" onClick={handleCreateProposal}>Create Proposal</button>
          {error && <div className="error-message">{error}</div>}
          <div>Note: you must hold an inscription or DRC-20 token from the collection you are making a proposal for.</div>
        </div>
      )}

      <div className="proposals-list">
        {filteredProposals.map((proposal) => (
          <div key={proposal._id} className="proposal">
            <h2>{proposal.name}</h2>
            {proposal.isClassified && viewingProposalId !== proposal._id ? (
              <>
                <p>Collection Name: {proposal.collectionName}</p>
                {proposal.ticker && <p>Project Ticker: {proposal.ticker}</p>}
                <p>This proposal is classified.</p>
                <button className="button" onClick={() => handleViewProposal(proposal._id)}>View</button>
              </>
            ) : (
              <>
               <div className="prop">
                {proposal.image && <img src={proposal.image} alt={proposal.name} className="proposal-image" />}
                <p>{proposal.description}</p>
                <p>End Date: {new Date(proposal.endDate).toLocaleString()}</p>
                <p>Collection Name: {proposal.collectionName}</p>
                {proposal.ticker && <p>Project Ticker: {proposal.ticker}</p>}
                <p>Total Votes: {proposal.votes.reduce((acc, vote) => acc + vote.weight, 0)}</p>
                </div>
                {new Date(proposal.endDate) > new Date() ? (
                  proposal.options.map((option) => (
                    <button key={option} className="button" onClick={() => handleVote(proposal, option)}>
                      Vote for {option}
                    </button>
                  ))
                ) : (
                  <p>Winning Option: {proposal.votes.length > 0 ? proposal.options.reduce((a, b) =>
                    proposal.votes.filter(vote => vote.option === a).length >= proposal.votes.filter(vote => vote.option === b).length ? a : b
                  ) : 'No votes cast'}</p>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Proposals;
