const express = require("express");
const app = express();
let restartCount = 0;
let lastActivity = new Date();
let healthChecks = 0;

// Enhanced keep-alive endpoint
app.get("/", (req, res) => {
  lastActivity = new Date();
  healthChecks++;
  res.send({
    status: "alive",
    uptime: process.uptime(),
    restarts: restartCount,
    lastActivity: lastActivity.toISOString(),
    healthChecks,
    memory: process.memoryUsage(),
    botStatus: client.isReady() ? 'connected' : 'disconnected'
  });
});

// Enhanced keep-alive system with multiple strategies
setInterval(async () => {
  const inactiveTime = Date.now() - lastActivity.getTime();
  console.log(`Health check - Uptime: ${process.uptime()}s, Inactive: ${inactiveTime/1000}s`);
  
  // Update lastActivity to prevent Replit timeout
  lastActivity = new Date();
  
  try {
    // Multiple keep-alive strategies
    await Promise.all([
      fetch(`http://0.0.0.0:${PORT}/`).catch(() => {}),
      // Minimal CPU operation to keep process active
      Promise.resolve(Math.random() * 100),
      // Small memory allocation/deallocation
      Promise.resolve(new Array(100).fill(0))
    ]);
    
    // Force garbage collection to keep memory usage low
    if (global.gc) {
      global.gc();
    }
    
    process.stdout.write('.'); // Minimal console activity
  
    if (inactiveTime > 120000) { // 2 minutes
      console.log('Long inactivity detected, refreshing connection...');
      if (!client.isReady()) {
        client.login(process.env.DISCORD_BOT_TOKEN);
      }
    }
  } catch (error) {
    console.error('Error in keep-alive system:', error);
  }
}, 20000); // More frequent checks

// Periodic health check
setInterval(() => {
  console.log(`Bot alive - Uptime: ${process.uptime()}s, Restarts: ${restartCount}`);
}, 60000); // Log every minute

// Auto-restart on uncaught errors
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  restartCount++;
  // Give time for logs to flush
  setTimeout(() => {
    process.exit(1); // Replit will auto-restart the process
  }, 1000);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js"); // Corrected import
(async () => {
  const fetch = await import("node-fetch"); // New way

  // You can now use fetch here
})();

// Initialize Discord bot client with intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, // Corrected intents syntax for latest discord.js version
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages, // Add other intents as needed
  ],
});

const DEBUG_MODE = true;
// Bearer token for API authentication
const BEARER_TOKEN = process.env.BEARER_TOKEN;

// API URLs and their respective Thread IDs
const API_URLS = {
  soil: [
    "https://industry.guildpal.com/v2/entities/ent_allcrops?tier=1&includeHouse=true",
    "https://industry.guildpal.com/v2/entities/ent_allcrops?tier=2&includeHouse=true",
    "https://industry.guildpal.com/v2/entities/ent_allcrops?tier=3&includeHouse=true",
    "https://industry.guildpal.com/v2/entities/ent_allcrops?tier=4&includeHouse=true",
  ],
  tree: [
    "https://industry.guildpal.com/v2/entities/ent_tree?tier=1&includeHouse=true",
    "https://industry.guildpal.com/v2/entities/ent_tree?tier=2&includeHouse=true",
    "https://industry.guildpal.com/v2/entities/ent_tree?tier=3&includeHouse=true",
    "https://industry.guildpal.com/v2/entities/ent_tree?tier=4&includeHouse=true",
  ],
  stoneshaping: [
    "https://industry.guildpal.com/v2/entities/ent_kiln_01?count=30&includeHouse=true",
    "https://industry.guildpal.com/v2/entities/ent_kiln_02?count=30&includeHouse=true",
    "https://industry.guildpal.com/v2/entities/ent_kiln_03?count=30&includeHouse=true",
    "https://industry.guildpal.com/v2/entities/ent_kiln_04?count=30&includeHouse=true",
  ],
  metalworking: [
    "https://industry.guildpal.com/v2/entities/ent_metalworking_01?count=30&includeHouse=true",
    "https://industry.guildpal.com/v2/entities/ent_metalworking_02?count=30&includeHouse=true",
    "https://industry.guildpal.com/v2/entities/ent_metalworking_03?count=30&includeHouse=true",
    "https://industry.guildpal.com/v2/entities/ent_metalworking_04?count=30&includeHouse=true",
  ],
  stove: [
    "https://industry.guildpal.com/v2/entities/ent_stove?count=30&includeHouse=true",
    "https://industry.guildpal.com/v2/entities/ent_stove_02?count=30&includeHouse=true",
    "https://industry.guildpal.com/v2/entities/ent_stove_03?count=30&includeHouse=true",
    "https://industry.guildpal.com/v2/entities/ent_stove_04?count=30&includeHouse=true",
  ],
  woodworking: [
    "https://industry.guildpal.com/v2/entities/ent_woodwork_01?count=30&includeHouse=true",
    "https://industry.guildpal.com/v2/entities/ent_woodwork_02?count=30&includeHouse=true",
    "https://industry.guildpal.com/v2/entities/ent_woodwork_03?count=30&includeHouse=true",
    "https://industry.guildpal.com/v2/entities/ent_woodwork_04?count=30&includeHouse=true",
  ],
  mine: [
    "https://industry.guildpal.com/v2/entities/ent_mine_01?includeHouse=true",
    "https://industry.guildpal.com/v2/entities/ent_mine_02?includeHouse=true",
    "https://industry.guildpal.com/v2/entities/ent_mine_03?includeHouse=true",
    "https://industry.guildpal.com/v2/entities/ent_mine_04?includeHouse=true", // You had mine_03 twice
  ],
  // Entities without tier
  textile: [
    "https://industry.guildpal.com/v2/entities/ent_textile?count=30&includeHouse=true",
  ],
  apiary: [
    "https://industry.guildpal.com/v2/entities/ent_apiary?includeHouse=true",
  ],
  coop: [
    "https://industry.guildpal.com/v2/entities/ent_coop?includeHouse=true",
  ],
  cow_pickup: [
    "https://industry.guildpal.com/v2/entities/ent_cow_pickup?includeHouse=true",
  ],
  landbbq: [
    "https://industry.guildpal.com/v2/entities/ent_landbbq?count=30&includeHouse=true",
  ],
  sluggery: [
    "https://industry.guildpal.com/v2/entities/ent_sluggery?includeHouse=true",
  ],
  windmill: [
    "https://industry.guildpal.com/v2/entities/ent_windmill?count=30&includeHouse=true",
  ],
};

// Thread IDs
const THREAD_IDS = {
  soil: "1357476963304083606",
  tree: "1357477049597689977",
  stoneshaping: "1357477128106410266",
  metalworking: "1357477173098709123",
  woodworking: "1357477214882500648",
  stove: "1357477087962730556",
  mine: "1357477016391254197",
  textile: "1357477478171541776",
  apiary: "1357477478171541776",
  coop: "1357477478171541776",
  cow_pickup: "1357477478171541776",
  landbbq: "1357477478171541776",
  sluggery: "1357477478171541776",
  windmill: "1357477478171541776",
};

const MAX_MESSAGE_LENGTH = 2000;
const check_interval = 1000; // 1-second delay to avoid rate limits
const tierMessageIds = { 1: null, 2: null, 3: null, 4: null };

async function fetchAndSendToThread(category, threadId) {
  try {
    if (!threadId) {
      console.error(`🚨 Missing thread ID for category: ${category}`);
      return;
    }

    console.log(`📌 Fetching category: ${category}, Thread ID: ${threadId}`);

    const urls = API_URLS[category];
    if (!urls) {
      console.error(`❌ Category ${category} not found in API_URLS.`);
      return;
    }

    const thread = await client.channels.fetch(threadId);
    const fetchedMessages = await thread.messages.fetch({ limit: 50 });

    const fetchPromises = urls.map(async (url) => {
      let tierNumber = extractTierNumber(url, category);

      console.log(`🌐 Fetching from URL: ${url} | Tier: ${tierNumber}`);
      const response = await fetch(url);
      if (!response.ok) {
        console.error(`❌ Failed to fetch data from ${url}`);
        return null;
      }

      let rawData = await response.json();
      rawData = Array.isArray(rawData) ? rawData[0] : rawData;

      if (!rawData?.public || !Array.isArray(rawData.public)) {
        console.log(
          `⚠️ No valid public data for ${category} Tier ${tierNumber}.`,
        );
        return null;
      }

      return { tierNumber, rawData };
    });

    const results = await Promise.all(fetchPromises);

    for (const result of results) {
      if (!result) continue;

      const { tierNumber, rawData } = result;
      let hasAvailableEntities = false;
      let embedCount = 0;

      const categoryLabel = capitalize(category);
      const tierLabel = `T${tierNumber}`;
      const embedMessage = new EmbedBuilder()
        .setTitle(`${categoryLabel} ${tierLabel} Lands`)
        .setDescription(
          `Here are the available ${categoryLabel} ${tierLabel} Lands.`,
        )
        .setColor(getTierColor(tierNumber));

      rawData.public.forEach((entity) => {
        if (embedCount >= 25) return;

        const landInfo = formatLandInfo(entity, categoryLabel, tierLabel);
        embedMessage.addFields([landInfo]);

        embedCount++;
        if (entity.numberOfAvailableEntities > 0) {
          hasAvailableEntities = true;
        }
      });

      const existingMessage = fetchedMessages.find(
        (msg) =>
          msg.embeds.length > 0 &&
          msg.embeds[0].title.includes(`${categoryLabel} ${tierLabel}`),
      );

      if (existingMessage) {
        await editMessage(
          existingMessage,
          embedMessage,
          categoryLabel,
          tierLabel,
        );
      } else if (hasAvailableEntities) {
        await sendNewMessage(thread, embedMessage, categoryLabel, tierLabel);
      }

      await delay(check_interval);
    }
  } catch (error) {
    console.error(`🚨 Error fetching data for ${category}:`, error);
  }
}

function extractTierNumber(url, category) {
  const tierMatch = url.match(/tier=(\d+)/);
  const suffixMatch = url.match(/_0?(\d)\b/);
  if (tierMatch) return parseInt(tierMatch[1]);
  if (suffixMatch) return parseInt(suffixMatch[1]);
  if (category === "stove" && url.includes("ent_stove")) return 1;
  return 1;
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function getTierColor(tier) {
  return tier === 1
    ? "#3498db"
    : tier === 2
      ? "#2ecc71"
      : tier === 3
        ? "#e74c3c"
        : "#f39c12";
}

function formatLandInfo(entity, categoryLabel, tierLabel) {
  let landNumber = entity.landName.match(/\d+/);
  landNumber = landNumber ? landNumber[0] : "N/A";

  return {
    name: `Land #${landNumber} - ${categoryLabel} ${tierLabel}`,
    value: `🏰 Guild: ${entity.landGuild || "N/A"}\n🌊 Type: ${entity.landType || "N/A"}\n👥 Players: ${entity.numPlayers || "N/A"}\n🏗 Total Entities: ${entity.numberOfEntities || "N/A"}\n⛏ Available Entities: ${entity.numberOfAvailableEntities || "N/A"}\n⏳ Fetched at: ${new Date().toLocaleString()}`,
    inline: false,
  };
}

async function editMessage(
  existingMessage,
  embedMessage,
  categoryLabel,
  tierLabel,
) {
  try {
    console.log(
      `✏️ Editing existing message for ${categoryLabel} ${tierLabel}`,
    );
    await existingMessage.edit({ embeds: [embedMessage] });
  } catch (error) {
    console.error(
      `❌ Error editing message for ${categoryLabel} ${tierLabel}:`,
      error,
    );
  }
}

async function sendNewMessage(thread, embedMessage, categoryLabel, tierLabel) {
  const newMessage = await thread.send({ embeds: [embedMessage] });
  console.log(`✅ Sent new message for ${categoryLabel} ${tierLabel}`);
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Loop to call fetchAndSendToThread continuously
async function startContinuousUpdate() {
  while (true) {
    try {
      for (const category in THREAD_IDS) {
        await fetchAndSendToThread(category, THREAD_IDS[category]);
      }
    } catch (error) {
      console.error("Error in continuous update loop:", error);
    }
    await new Promise((resolve) => setTimeout(resolve, check_interval));
  }
}

// Handle Discord disconnections
client.on("disconnect", () => {
  console.log("Bot disconnected! Attempting to reconnect...");
  client.login(process.env.DISCORD_BOT_TOKEN);
});

client.on("error", (error) => {
  console.error("Discord client error:", error);
});

// Start the continuous update loop with error handling
try {
  startContinuousUpdate();
} catch (error) {
  console.error("Failed to start continuous update:", error);
}

client.once("ready", () => {
  console.log("Bot is ready!");

  // Fetch and send data for each category (soil, tree, etc.)
  Object.keys(API_URLS).forEach((category) => {
    fetchAndSendToThread(category, THREAD_IDS[category]);
  });
});

// Login to Discord with your bot token
client.login(process.env.DISCORD_BOT_TOKEN);