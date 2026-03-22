/**
 * Player Blocking System
 * Reads blocked players from blocked-players.json
 * Displays ERR_CONNECTION_REFUSED when player is blocked
 */

let blockedPlayersData = null;

// Load blocked players from JSON file
const loadBlockedPlayers = async () => {
  try {
    const response = await fetch('blocked-players.json');
    blockedPlayersData = await response.json();
    console.log('Blocked players list loaded:', blockedPlayersData);
  } catch (error) {
    console.warn('Could not load blocked players list:', error);
    blockedPlayersData = { blockedPlayers: [], blockedIPs: [] };
  }
};

// Check if player is blocked
const isPlayerBlocked = (playerEmail) => {
  if (!blockedPlayersData) return false;
  return blockedPlayersData.blockedPlayers?.includes(playerEmail);
};

// Check if IP is blocked
const isIPBlocked = (ipAddress) => {
  if (!blockedPlayersData) return false;
  return blockedPlayersData.blockedIPs?.includes(ipAddress);
};

// Block player with error
const blockPlayer = (reason = 'blocked') => {
  if (!hasError) {
    const err = new Error('PLAYER_BLOCKED: ' + reason);
    err.code = 'ERR_CONNECTION_REFUSED';
    handleError(err);
  }
};

// Check player on load
const checkPlayerStatus = async (playerEmail) => {
  await loadBlockedPlayers();
  
  if (isPlayerBlocked(playerEmail)) {
    blockPlayer('Twoje konto zostało zablokowane');
  }
};

// Make functions globally accessible
window.blockPlayer = blockPlayer;
window.checkPlayerStatus = checkPlayerStatus;
window.isPlayerBlocked = isPlayerBlocked;
window.isIPBlocked = isIPBlocked;
window.loadBlockedPlayers = loadBlockedPlayers;

// Auto-load on script start
loadBlockedPlayers();

console.log('Block Player system loaded. Use window.checkPlayerStatus(email) to check player.');
// blocked-players.json
{
  "blockedPlayers" [
    "zhasanmark2@gmail.com"
  ]
}