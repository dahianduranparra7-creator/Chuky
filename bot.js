const fs = require("fs");

const API_KEY = process.env.API_KEY;
const CLAN_ID = process.env.CLAN_ID;

const MESSAGE = (username) => 
`༒ Bienvenido a Bloodline, ${username} 🩸

Nos alegra tenerte con nosotros.
Recuerda donar 200 de oro al entrar al clan para permanecer.

¡Disfruta y forma parte de la familia Bloodline! 🐺

Discord: https://discord.gg/XwmT343b`;

async function getMembers() {
  const response = await fetch(
    https://api.wolvesville.com/clans/${CLAN_ID}/members,
    {
      headers: {
        Authorization: Bot ${API_KEY},
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(Error al obtener miembros: ${response.status});
  }

  return await response.json();
}

async function sendMessage(message) {
  const response = await fetch(
    https://api.wolvesville.com/clans/${CLAN_ID}/chat,
    {
      method: "POST",
      headers: {
        Authorization: Bot ${API_KEY},
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(Error enviando mensaje: ${response.status});
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
      await sendMessage(MESSAGE(member.username));
      welcomedUsers.push(member.playerId);
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
