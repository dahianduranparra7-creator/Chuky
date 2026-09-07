const fs = require("fs");

const API_KEY = process.env.API_KEY;
const CLAN_ID = process.env.CLAN_ID;

function welcomeMessage(username) {
  return `༒ Bienvenido a Bloodline, ${username} 🩸

Nos alegra tenerte con nosotros 🐺

💰 Recuerda donar 200 monedas de oro al entrar al clan.

Únete a nuestro Discord para conocer a la comunidad, participar en actividades y estar al día:

💬 Discord:
https://discord.gg/XwmT343b

¡Disfruta tu estancia en Bloodline! 🩸`;
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
    try {
      welcomedUsers = JSON.parse(fs.readFileSync(file, "utf8"));
    } catch (error) {
      console.log("No se pudo leer la memoria. Se creará una nueva.");
      welcomedUsers = [];
    }
  }

  const members = await getMembers();

  const newMembers = [];

  for (const member of members) {
    const playerId = member.playerId;

    if (!playerId) {
      continue;
    }

    if (!welcomedUsers.includes(playerId)) {
      newMembers.push(member);
      welcomedUsers.push(playerId);
    }
  }

  if (newMembers.length > 0) {
    for (const member of newMembers) {
      const username = member.username || member.playerId;

      await sendMessage(welcomeMessage(`@${username}`));

      console.log(`Bienvenida enviada a: ${username}`);
    }
  } else {
    console.log("No hay jugadores nuevos.");
  }

  fs.writeFileSync(
    file,
    JSON.stringify(welcomedUsers, null, 2)
  );

  console.log("Bot funcionando correctamente.");
}

main().catch((error) => {
  console.error("ERROR:", error);
  process.exit(1);
});
