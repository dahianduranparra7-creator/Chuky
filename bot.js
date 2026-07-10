const fs = require("fs");

const API_KEY = process.env.API_KEY;
const CLAN_ID = process.env.CLAN_ID;

function welcomeMessage(username) {
  return `༒ Bienvenido a Bloodline, ${username} 🩸

Nos alegra tenerte con nosotros.
Recuerda donar 200 de oro al entrar al clan para permanecer.

¡Disfruta del clan y forma parte de Bloodline! 🐺

Discord: https://discord.gg/XwmT343b`;
}

async function getMembers() {
  const response = await fetch(
    `https://api.wolvesville.com/clans/${CLAN_ID}/members`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bot ${API_KEY}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Error obteniendo miembros: ${response.status}`);
  }

  return await response.json();
}

async function sendMessage(message) {
  const response = await fetch(
    `https://api.wolvesville.com/clans/${CLAN_ID}/chat`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bot ${API_KEY}`,
      },
      body: JSON.stringify({
        message: message,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Error enviando mensaje: ${response.status}`);
  }
}

async function main() {
  const file = "welcomed_users.json";

  let welcomedUsers = [];

  if (fs.existsSync(file)) {
    welcomedUsers = JSON.parse(fs.readFileSync(file, "utf8"));
  }

  const members = await getMembers();

  for (const member of members) {
    if (!welcomedUsers.includes(member.playerId)) {
      await sendMessage(welcomeMessage(member.username));

      welcomedUsers.push(member.playerId);

      console.log(`Bienvenida enviada a ${member.username}`);
      break;
    }
  }

  fs.writeFileSync(file, JSON.stringify(welcomedUsers, null, 2));

  console.log("Bot funcionando correctamente");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
