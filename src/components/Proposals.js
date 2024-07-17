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
    weightInputs: {},
    image: null,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('mostRecent');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

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

    try {
      const formData = new FormData();
      formData.append('name', newProposal.name);
      formData.append('description', newProposal.description);
      formData.append('endDate', newProposal.endDate);
      formData.append('collectionName', newProposal.collectionName);
      formData.append('walletAddress', walletAddress); // Add walletAddress to form data
      newProposal.options.forEach((option, index) => {
        formData.append(`options[${index}]`, option);
      });
      Object.keys(newProposal.weightInputs).forEach((key) => {
        formData.append(`weightInputs[${key}]`, newProposal.weightInputs[key]);
      });
      if (newProposal.image) {
        formData.append('image', newProposal.image);
      }

      await apiClient.post('/proposals/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Proposal created successfully!');
      setShowCreateProposal(false);
      // Fetch updated proposals
      const response = await apiClient.get('/proposals');
      setProposals(response.data);
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
            placeholder="OW Collection name"
            value={newProposal.collectionName}
            onChange={(e) => setNewProposal({ ...newProposal, collectionName: e.target.value })}
          />
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
          <input type="file" accept="image/*" onChange={handleImageChange} />
          <button className="button" onClick={handleCreateProposal}>Create Proposal</button>
          <div>Note: you must hold an inscription from the collection you are making a proposal for.</div>
        </div>
      )}

      <div className="proposals-list">
        {filteredProposals.map((proposal) => (
          <div key={proposal._id} className="proposal">
            <h2>{proposal.name}</h2>
            {proposal.image && <img src={proposal.image} alt={proposal.name} className="proposal-image" />}
        <div className="voteinfo">
            <p>{proposal.description}</p>
            <p>End Date: {new Date(proposal.endDate).toLocaleString()}</p>
            <p>Collection Name: {proposal.collectionName}</p>
            <p>Total Votes: {proposal.votes.reduce((acc, vote) => acc + vote.weight, 0)}</p>
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
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Proposals;
