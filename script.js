const chatBox = document.getElementById("chatBox");
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

function showMessage(text, sender, isHTML = false) {
  const msg = document.createElement("div");
  msg.className = `message ${sender}`;
  if (isHTML) {
    msg.innerHTML = text;
  } else {
    msg.textContent = text;
  }
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const userText = input.value.trim();
  if (!userText) return;

  showMessage(userText, "user");
  input.value = "";
  showMessage("⏳ Nathalie réfléchit...", "bot");

  const question = userText.toLowerCase();

  const nameTriggers = [
    "ton nom",
    "comment tu t'appelles",
    "qui es-tu",
    "quel est ton nom",
    "tu t'appelles comment",
    "comment tu t’appelles",
    "qui t'a créé",
    "qui est ton créateur",
    "qui est ton createur",
    "ton créateur",
    "ton createur",
    "qui est crazy",
    "qui est ton papa",
    "qui est ta maman",
  ];

  const imageTriggers = [
    "image",
    "photo",
    "montre-moi",
    "affiche",
    "voir",
    "photo de",
    "image de",
    "cherche une image de",
  ];

  if (nameTriggers.some((phrase) => question.includes(phrase))) {
    const fixedReply = "Je suis Nathalie, une assistante IA créée par David.";
    const nathalieBotMsg = document.querySelector(".bot:last-child");
    if (nathalieBotMsg) nathalieBotMsg.textContent = fixedReply;
    return;
  }

  if (imageTriggers.some((trigger) => question.includes(trigger))) {
    try {
      const apiKey = "1b1c199b5e69ad206c";
      const url = `https://api.nexoracle.com/search/google-image?apikey=${apiKey}&q=${encodeURIComponent(userText)}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error(`Erreur réseau : ${res.status}`);

      const json = await res.json();

      if (!json.images || json.images.length === 0) throw new Error("Aucune image trouvée.");

      const imageUrl = json.images[0].url;

      const nathalieBotMsg = document.querySelector(".bot:last-child");
      if (nathalieBotMsg) {
        nathalieBotMsg.innerHTML = `
          <div>Voici une image correspondant à ta recherche :</div>
          <a href="${imageUrl}" target="_blank" rel="noopener noreferrer">
            <img src="${imageUrl}" alt="Image" style="max-width:100%; border-radius:12px; margin-top:8px;" />
          </a>
          <div style="margin-top:8px; font-size: 13px; color:#555;">
            🤖 Je suis Nathalie, une assistante IA créée par Crazy.
          </div>
        `;
      }
      return;

    } catch (err) {
      const lastBotMsg = document.querySelector(".bot:last-child");
      if (lastBotMsg) lastBotMsg.textContent = `❌ Erreur image : ${err.message}`;
      return;
    }
  }

  try {
    const response = await fetch(
      `https://apis.davidcyriltech.my.id/ai/chatbot?query=${encodeURIComponent(userText)}`
    );
    if (!response.ok) throw new Error(`Erreur réseau : ${response.status}`);

    const data = await response.json();

    if (!data.result) throw new Error("Réponse vide");

    let reply = data.result;

    reply = reply
      .replace(/Google/g, "Nathalie")
      .replace(/PaLM/g, "Nathalie")
      .replace(/AI/g, "intelligence artificielle")
      .replace(/chatbot/gi, "assistante Nathalie")
      .replace(/bot/gi, "Nathalie");

    //reply += "\n\n🤖 Je suis Nathalie, une assistante IA creer par Crazy.";

    const nathalieBotMsg = document.querySelector(".bot:last-child");
    if (nathalieBotMsg) nathalieBotMsg.textContent = reply;
  } catch (err) {
    const nathalieBotMsg = document.querySelector(".bot:last-child");
    if (nathalieBotMsg) lastBotMsg.textContent = `❌ Erreur : ${err.message}`;
  }
}

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});
