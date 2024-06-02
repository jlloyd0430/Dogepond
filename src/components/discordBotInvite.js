// src/components/DiscordBotInvite.js
import React from 'react';
import './discordBotInvite.css'; // Create this CSS file for styles
import botImage from './uploads/botimage.jpg'; // Ensure the path to your image is correct

const DiscordBotInvite = () => {
  const inviteLink = "https://discord.com/oauth2/authorize?client_id=1246157792096813137&permissions=2147483647&scope=bot%20applications.commands"; // Replace with your actual invite link

  return (
    <div className="discord-bot-invite">
      <a href={inviteLink} target="_blank" rel="noopener noreferrer">
        <img src={botImage} alt="Invite Discord Bot" className="discord-bot-image" />
      </a>
      <p className='bio'>Invite Dogepond bot to your discord and recieve all the latest drops/updates!</p>
    </div>
  );
};

export default DiscordBotInvite;

