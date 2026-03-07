const axios = require('axios');

exports.handler = async (event) => {
  try {
    const data = JSON.parse(event.body);
    
    // INCOLLA QUI IL TUO URL WEBHOOK DI N8N (Production URL)
    const n8nWebhookUrl = "https://TUO_N8N_URL/webhook/chat-viaggi";

    const response = await axios.post(n8nWebhookUrl, {
      messaggio: data.messaggio
    });

    // n8n restituisce l'output dell'AI Agent
    const rispostaIA = response.data.output || response.data.risposta || "Ecco la tua proposta di viaggio!";

    return {
      statusCode: 200,
      body: JSON.stringify({ risposta: rispostaIA }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ risposta: "Il sistema è occupato. Contattaci su WhatsApp per un preventivo!" }),
    };
  }
};
