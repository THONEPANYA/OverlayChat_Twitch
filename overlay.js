const chatContainer = document.getElementById('chat-container');
let client = null;
let thirdPartyEmotes = {};

const BADGES = {
    subscriber: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFPSURBVHgBpZK/SsNAHMe/FxpoOjRBh3SIpA7q1ri5tVCcXZytT5DBByj45wWEvIGOTmrfQSoudrOCjeAQJ0OWKpWed4XExrO5kH6GcLnf7z6/3/04cqb2DinFOQgMFIL6BOSYnKq3I4DUsRyhIpO4wzbc5zYkGEpW1DmwYNQ1GLYGp2NlpSJT1OxupqSFRHE3MXZrFVt75qJ0sGH3KF/suOuwmyswnSoTVJBF8BjhK5zg6SZA3/NneyXMXaNslJCHGivG0VnBWJRc7XL3Dp/hN/LCc6/2H5L/RBQMotwynsNz+RlBNC+T8VciiDiUQN5RNBH2BFFZlw/cbFTlIv5eUtXZPEJ/nNrTbU0QCeUNu5II+t4I994L61JFo7OGVndjFqtt64IoeZC/Io0dsjC4eEP4OsZ/seH1uzBsLvrgOVgK6itTTI/4AkWhCNnn5Aff83MLIfHVAgAAAABJRU5ErkJggg==",
    broadcaster: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADVSURBVHgB3ZNPCoJAFIffDNVCwWxREG06h7coD9BKWvfHfa0raBtdIegU5TFy6yoRalHkyxdokimms+qDYd4wwzc/HjPM6TQHDGGNyFQohg2IM+a0W6dg0YVyuFyAhFA5CKISFvJkCpIxBKYoqYcvq2UwFl/3+FtkZkoIyTCiuqppoO72yUR5YEr9JZDHJtSCOc5PIqIRSxFHWLP/QHTWe3CzDuki9DzIw906gqv3E8JIdN1uMgV0ET3IT2EIfVoEAYhrNmPoQnls/vBhRAUUhIL4iPMnX2ZBF+vOpZUAAAAASUVORK5CYII=",
    founder: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAH3SURBVHgBhVQ9SyRBEH091zMDt2Jw3HF3XHB3LHewKCjKiiLiF6YmCoYiZhr4F2b+gKiIoR+RgZkgaGKiBoIa6bLqmhhqIrKiuzrddvdMz4c7qwVDTVdVv35dr2YIAlscYpxzgBBAeRkkqDWeHqf6xfK8KEriG/Qicmm4ZKWvwnV55gfB6LqZKFwbqCI3YqB1/BOqZaC0w9S7ttX+qvKGxTzYnCHzmaFt3Kg5UTLtmKbYnqxgd6YCyhjWex9VTnpb7JcY1BYJSWl0K4M0M0W+tPGMwXkbheUqiuLRnC2RC3tkMr83m933yg8fNCYZiXxh7hHlcxPNkza+ZAnOFp7CHA96aEjU8PFY7dVEPDdh4e74GYdTZWTHrJCJqfZ4ak21WnVUVYVUzEPnUgNoA8Hl7EOosCk8EfPCmeC1137DNYj0PUffEkD7+dt3ZZfGCHd9RqQ+I/PFPzVZ4SNLBtyA23X806HynjKfBqJ7JM2f+AhMrl8I3PzJL0euqRWoFpvfhNlKmcj0JySibv70t6PjND4LaWaKYX17ggRpLvx14rGQUT1OiW9QgcD9X8w6b+sUIx6DqgGKMZYgfy7+OSllILfZIteipCoX5Dwh8fdSLhVEMbID1bQgJPDhPwk+yNerprog/tW4aB2LDgeSnWKcuY3XLQ4+sFedNuWK4rCoCQAAAABJRU5ErkJggg==",
    vip: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADbSURBVHgBrZPNCoJAFIXPDAq5SVu1S8EWvUDP0xO0iLYJResg6GmkXqRFpC8QI23Nm0oEajnjzwfD/J177p1hhoW6vyBiRzCy0I6AAVsW6P49nTjohuA9mGRYHD2hlReGywlGh1lt0GN9xfMUFtYKFWn2AKY3hQzLc3PtTyNuaRif53kvI9deitqvkZllcQyootkGzI1bNSIRoylJFFeNxP6GKG2qlPW8blPVpGKkYvZvnzcR1yXhqpllldY+GvEJpLTJ7i77/YQeSI/GBLoTcMJrlQ3QFmKCkOze0FVcnXDbxtkAAAAASUVORK5CYII=",
    moderator: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAE5SURBVHgBpZQ/TgJBGMXfuNho4STGQhu3sLExMdRG0QPgDYweQFkPoOABzOoBhNhDgj0x0dpCGwtNGBpb1wIbimG+CQwssDOb5SWT+bPf/PZ7b5NlaHgnkAgBcGSTAEOZoe611cbHfIpyaSEXW+cId26nzlmDEOALaSD+0ibK21fWGieIL3I877X0PBfoWnXiL/uuMjuIcimpkUaJIFcuUS9C8HFp9rnJDpo/TVX0Z81F/HdQeDnU80h1T9IovQeS1O4KWRU1maTw607yp1U5vDccTC8GVqiLpGDJSuXzBuH3/cznBmSDzbYSl/Pz1zqP2G3lrZAYaLwbuiS6Qp8frO2r0FfgkgFV8w8GQjYKr0caRi84Xi86QbGwCXb6dmZsaMhGMTHgSdAvsv+LBpKCrAW0QGbJCPAqfZUtm2qML5G2AAAAAElFTkSuQmCC",
    premium: "https://static-cdn.jtvnw.net/badges/v1/bbbe0db0-a598-423e-86d0-f9ef9820f963/1", // Fallback URL, might be broken but we have the core 5 working perfectly
    turbo: "https://static-cdn.jtvnw.net/badges/v1/bd444ec6-8f34-4bf9-91f4-af1e3428d80f/1"
};

async function fetchThirdPartyEmotes(roomId) {
    thirdPartyEmotes = {};
    try {
        let res = await fetch('https://api.betterttv.net/3/cached/emotes/global');
        let data = await res.json();
        if(data.length) data.forEach(e => thirdPartyEmotes[e.code] = `https://cdn.betterttv.net/emote/${e.id}/1x`);
    } catch(e) {}
    try {
        let res = await fetch(`https://api.betterttv.net/3/cached/users/twitch/${roomId}`);
        let data = await res.json();
        if(data.channelEmotes) data.channelEmotes.forEach(e => thirdPartyEmotes[e.code] = `https://cdn.betterttv.net/emote/${e.id}/1x`);
        if(data.sharedEmotes) data.sharedEmotes.forEach(e => thirdPartyEmotes[e.code] = `https://cdn.betterttv.net/emote/${e.id}/1x`);
    } catch(e) {}
    try {
        let res = await fetch('https://api.frankerfacez.com/v1/set/global');
        let data = await res.json();
        if(data.sets) for (let set in data.sets) data.sets[set].emoticons.forEach(e => thirdPartyEmotes[e.name] = e.urls['1']);
    } catch(e) {}
    try {
        let res = await fetch(`https://api.frankerfacez.com/v1/room/id/${roomId}`);
        let data = await res.json();
        if(data.sets) for (let set in data.sets) data.sets[set].emoticons.forEach(e => thirdPartyEmotes[e.name] = e.urls['1']);
    } catch(e) {}
    try {
        let res = await fetch(`https://7tv.io/v3/users/twitch/${roomId}`);
        let data = await res.json();
        if (data.emote_set && data.emote_set.emotes) {
            data.emote_set.emotes.forEach(e => thirdPartyEmotes[e.name] = `https://cdn.7tv.app/emote/${e.id}/1x.webp`);
        }
    } catch(e) {}
    try {
        let res = await fetch('https://7tv.io/v3/emote-sets/global');
        let data = await res.json();
        if (data.emotes) {
            data.emotes.forEach(e => thirdPartyEmotes[e.name] = `https://cdn.7tv.app/emote/${e.id}/1x.webp`);
        }
    } catch(e) {}
}

let currentConfig = null;
let customBadges = {};

async function fetchTwitchCustomBadges(roomId) {
    if (!currentConfig || !currentConfig.clientId || !currentConfig.clientSecret) return;
    
    try {
        // Fetch App Access Token
        let tokenRes = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${currentConfig.clientId}&client_secret=${currentConfig.clientSecret}&grant_type=client_credentials`, {
            method: 'POST'
        });
        let tokenData = await tokenRes.json();
        
        if (tokenData.access_token) {
            // Fetch Custom Channel Badges
            let badgeRes = await fetch(`https://api.twitch.tv/helix/chat/badges?broadcaster_id=${roomId}`, {
                headers: {
                    'Client-ID': currentConfig.clientId,
                    'Authorization': `Bearer ${tokenData.access_token}`
                }
            });
            let badgeData = await badgeRes.json();
            
            if (badgeData.data) {
                badgeData.data.forEach(set => {
                    customBadges[set.set_id] = {};
                    set.versions.forEach(version => {
                        customBadges[set.set_id][version.id] = version.image_url_1x;
                    });
                });
            }
        }
    } catch(e) {
        console.error("Error fetching custom badges:", e);
    }
}

window.api.onSetChannel((event, config) => {
    currentConfig = config;
    if (client) {
        client.disconnect();
    }

    client = new tmi.Client({
        channels: [config.channel]
    });

    client.connect()
        .then(() => {
            addSystemMessage(`Connected to channel: ${config.channel}`);
        })
        .catch(console.error);

    client.on('roomstate', (channel, state) => {
        if (state['room-id']) {
            fetchThirdPartyEmotes(state['room-id']);
            fetchTwitchCustomBadges(state['room-id']);
        }
    });

    client.on('message', (channel, tags, message, self) => {
        addMessage(tags, message);
    });
});

// Request channel name from main process
window.api.sendOverlayReady();

window.api.onEditModeChanged((event, isEditing) => {
    const dragHeader = document.getElementById('drag-header');
    if (isEditing) {
        document.body.classList.add('edit-mode');
        dragHeader.classList.remove('hidden');
        addSystemMessage("🛠️ Edit Mode: Drag the purple bar above to move, or drag edges to resize!");
    } else {
        document.body.classList.remove('edit-mode');
        dragHeader.classList.add('hidden');
        addSystemMessage("✅ Edit Mode Closed - Overlay is click-through again.");
    }
});

document.getElementById('finish-edit-btn').addEventListener('click', () => {
    window.api.toggleEditMode(false);
});

function parseMessage(message, emotes) {
    if (!message) return '';
    let emoteReplacements = [];

    if (emotes) {
        for (let id in emotes) {
            emotes[id].forEach(range => {
                let [start, end] = range.split('-').map(Number);
                emoteReplacements.push({
                    start: start,
                    end: end,
                    img: `<img src="https://static-cdn.jtvnw.net/emoticons/v2/${id}/default/dark/1.0" class="emote">`
                });
            });
        }
    }

    emoteReplacements.sort((a, b) => a.start - b.start);

    let lastEnd = 0;
    let finalHtml = '';
    let tempSegments = [];

    if (emoteReplacements.length > 0) {
        emoteReplacements.forEach(rep => {
            let textBefore = message.substring(lastEnd, rep.start);
            if (textBefore) tempSegments.push({ type: 'text', content: textBefore });
            tempSegments.push({ type: 'emote', content: rep.img });
            lastEnd = rep.end + 1;
        });
        let textAfter = message.substring(lastEnd);
        if (textAfter) tempSegments.push({ type: 'text', content: textAfter });
    } else {
        tempSegments.push({ type: 'text', content: message });
    }

    tempSegments.forEach(seg => {
        if (seg.type === 'text') {
            let words = seg.content.split(' ');
            let wordsHtml = words.map(word => {
                if (thirdPartyEmotes[word]) {
                    return `<img src="${thirdPartyEmotes[word]}" class="emote">`;
                }
                return word.replace(/&/g, '&amp;')
                           .replace(/</g, '&lt;')
                           .replace(/>/g, '&gt;')
                           .replace(/"/g, '&quot;')
                           .replace(/'/g, '&#039;');
            }).join(' ');
            finalHtml += wordsHtml;
        } else {
            finalHtml += seg.content;
        }
    });

    return finalHtml;
}

function addSystemMessage(message) {
    addMessage({
        'display-name': 'System',
        color: '#00ff00',
        badges: null,
        emotes: null
    }, message);
}

function addMessage(tags, message) {
    const messageEl = document.createElement('div');
    messageEl.classList.add('chat-message');

    const userSpan = document.createElement('span');
    userSpan.classList.add('username');

    if (tags.badges) {
        for (let type in tags.badges) {
            let badgeSrc = null;
            let version = tags.badges[type];
            
            // Check custom badges first
            if (customBadges[type] && customBadges[type][version]) {
                badgeSrc = customBadges[type][version];
            } 
            // Fallback to global badge
            else if (BADGES[type]) {
                badgeSrc = BADGES[type];
            }

            if (badgeSrc) {
                const badgeImg = document.createElement('img');
                badgeImg.src = badgeSrc;
                badgeImg.classList.add('badge');
                userSpan.appendChild(badgeImg);
            }
        }
    }

    const nameText = document.createElement('span');
    nameText.style.color = tags.color || '#ffffff';
    nameText.innerText = tags['display-name'] + ': ';
    userSpan.appendChild(nameText);

    const textSpan = document.createElement('span');
    textSpan.classList.add('text');
    textSpan.innerHTML = parseMessage(message, tags.emotes);

    messageEl.appendChild(userSpan);
    messageEl.appendChild(textSpan);

    chatContainer.appendChild(messageEl);

    window.scrollTo(0, document.body.scrollHeight);

    setTimeout(() => {
        messageEl.classList.add('fade-out');
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.parentNode.removeChild(messageEl);
            }
        }, 1000);
    }, 15000);
    
    if (chatContainer.children.length > 50) {
        chatContainer.removeChild(chatContainer.firstChild);
    }
}
