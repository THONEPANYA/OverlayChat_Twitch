let isEditing = false;
const editLayoutBtn = document.getElementById('editLayoutBtn');

const toggleSettingsBtn = document.getElementById('toggleSettingsBtn');
const settingsPanel = document.getElementById('settingsPanel');
const clientIdInput = document.getElementById('clientIdInput');
const clientSecretInput = document.getElementById('clientSecretInput');
const channelInput = document.getElementById('channelInput');

// Load stored values
window.api.getConfig().then(config => {
    channelInput.value = config.twitchChannel || '';
    clientIdInput.value = config.twitchClientId || '';
    clientSecretInput.value = config.twitchClientSecret || '';
});

toggleSettingsBtn.addEventListener('click', () => {
    toggleSettingsBtn.classList.toggle('open');
    settingsPanel.classList.toggle('active');
});

document.getElementById('connectBtn').addEventListener('click', () => {
    const channel = channelInput.value.trim();
    const clientId = clientIdInput.value.trim();
    const clientSecret = clientSecretInput.value.trim();

    if (channel) {
        window.api.saveConfig({
            twitchChannel: channel,
            twitchClientId: clientId,
            twitchClientSecret: clientSecret
        });
        
        window.api.startOverlay({ channel, clientId, clientSecret });
        editLayoutBtn.disabled = false;
    } else {
        alert("Please enter a Twitch username.");
    }
});

editLayoutBtn.addEventListener('click', () => {
    isEditing = !isEditing;
    editLayoutBtn.innerText = isEditing ? 'Finish Editing' : 'Enter Edit Mode';
    window.api.toggleEditMode(isEditing);
});
