import React from "react";
import "./discordBotInvite.css"; // Ensure this CSS file is created and correctly imported
import discordBotImage from "./uploads/botimage.jpg"; // Ensure the path to your image is correct
import telegramBotImage from "./uploads/telegrambot.webp"; // Ensure the path to your Telegram bot image is correct

const DiscordBotInvite = () => {
  const discordInviteLink =
    "https://discord.com/oauth2/authorize?client_id=1246157792096813137&permissions=2147483647&scope=bot%20applications.commands"; // Replace with your actual Discord invite link
  const telegramInviteLink = "https://t.me/dogepondBot"; // Replace with your actual Telegram bot invite link

  return (
    <div className="bot-invite-container">
      <p className="invite-text">
        Invite Dogepond bot(s) to your Discord & Telegram and receive all the
        latest drops/updates!
      </p>
      <div className="bot-invites">
        <div className="bot-invite">
          <a href={discordInviteLink} target="_blank" rel="noopener noreferrer">
            <img
              src={discordBotImage}
              alt="Invite Discord Bot"
              className="bot-image"
            />
          </a>
        </div>
        <div className="bot-invite">
          <a
            href={telegramInviteLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={telegramBotImage}
              alt="Invite Telegram Bot"
              className="bot-image"
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default DiscordBotInvite;
