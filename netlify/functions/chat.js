const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event) => {
  // 1. Prendi la chiave dalle variabili di Netlify
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    // 2. Leggi il messaggio inviato dal tuo index.html
    const data = JSON.parse(event.body);
    const testoUtente = data.messaggio; // Il tuo sito usa 'messaggio'

    // 3. Chiedi a Gemini
    const result = await model.generateContent(testoUtente);
    const response = await result.response;
    const testoIA = response.text();

    return {
      statusCode: 200,
      body: JSON.stringify({ risposta: testoIA }), // Il tuo sito aspetta 'risposta'
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Errore nel cervello dell'IA" }),
    };
  }
};
