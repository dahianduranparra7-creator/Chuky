const fs = require("fs");

const API_KEY = process.env.API_KEY;
const CLAN_ID = process.env.CLAN_ID;

const welcomedFile = "welcomed_users.json";

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

  return await response.json();
}

async function sendMessage(message) {
  await fetch(
    https://api.wolvesville.com/clans/${CLAN_ID}/chat,
    {
      method: "POST",
      headers: {
        Authorization: Bot ${API_KEY},
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ message }),
    }
  );
}

async function main() {
  let welcomed = [];

  if (fs.existsSync(welcomedFile)) {
    welcomed = JSON.parse(fs.readFileSync(welcomedFile));
  }

  const members = await getMembers();

  for (const member of members) {
    if (!welcomed.includes(member.playerId)) {
      const message =
`🇪🇸 ¡Bienvenido/a ${member.username} a Bloodline! 🐺🔥
Nos alegra tenerte con nosotros. Esperamos que disfrutes del clan.
Recuerda donar 200 de oro al entrar para permanecer en el clan. 💰
Discord: https://discord.gg/XwmT343b

🇺🇸 Welcome ${member.username} to Bloodline! 🐺🔥
We are happy to have you with us. Enjoy the clan.
Remember to donate 200 gold when joining to stay in the clan. 💰
Discord: https://discord.gg/XwmT343b`;

      await sendMessage(message);

      welcomed.push(member.playerId);
    }
  }

  fs.writeFileSync(welcomedFile, JSON.stringify(welcomed, null, 2));
}

main();
