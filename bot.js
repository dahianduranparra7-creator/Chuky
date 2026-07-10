const fs = require("fs");

const API_KEY = process.env.API_KEY;
const CLAN_ID = process.env.CLAN_ID;

function welcomeMessage(username) {
  return `༒ Bienvenido a Bloodline, @${username} 🩸

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
    welcomedUsers = JSON.parse(fs.readFileSync(file, "utf8"));
  }

  const members = await getMembers();

  let newMembers = [];

  for (const member of members) {
    if (
      member.status === "ACCEPTED" &&
      !welcomedUsers.includes(member.playerId)
    ) {
      newMembers.push(member);
      welcomedUsers.push(member.playerId);
    }
  }

  if (newMembers.length > 0) {
    const names = newMembers
      .map((member) => `@${member.username}`)
      .join(", ");

    await sendMessage(
      welcomeMessage(names)
    );

    console.log(`Bienvenida enviada a: ${names}`);
  } else {
    console.log("No hay jugadores nuevos");
  }

  fs.writeFileSync(
    file,
    JSON.stringify(welcomedUsers, null, 2)
  );

  console.log("Bot funcionando correctamente");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
