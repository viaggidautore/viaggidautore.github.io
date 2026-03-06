exports.handler = async function(event, context) {
  
  // Permetti solo POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { messaggio } = JSON.parse(event.body);
    
    if (!messaggio) {
      return { statusCode: 400, body: JSON.stringify({ errore: 'Messaggio mancante' }) };
    }

    const apiKey = process.env.GEMINI_API_KEY;
    
    const prompt = `Sei il consulente virtuale di "Viaggi d'Autore", un servizio italiano di organizzazione viaggi.
Il tuo compito è creare preventivi di viaggio completi e professionali in italiano.

Quando l'utente ti dice dove vuole andare e le date, rispondi SEMPRE con questo formato esatto:

Benvenuto! Ecco il tuo preventivo ✈️

✈️ VOLO ANDATA — [data]
Partenza: Bologna (BLQ) ore [ora]
Arrivo: [destinazione] ore [ora]
Compagnia: [compagnia]
Durata: [durata]

✈️ VOLO RITORNO — [data]
Partenza: [destinazione] ore [ora]
Arrivo: Bologna (BLQ) ore [ora]
Compagnia: [compagnia]
Durata: [durata]

💰 COSTO VOLO A/R: circa [prezzo] EUR a persona

🏨 HOTEL CONSIGLIATO
[Nome hotel] ⭐⭐⭐ - [quartiere] - circa [prezzo] EUR/notte

🗺️ ITINERARIO
[Giorno per giorno per tutti i giorni del soggiorno]

🍽️ RISTORANTI CONSIGLIATI
[3 ristoranti tipici]

💶 COSTO TOTALE STIMATO: circa [totale] EUR
(volo + [n] notti hotel)

━━━━━━━━━━━━━━━
Vuoi prenotare questo viaggio?
Il servizio completo costa solo 49€ — pensiamo a tutto noi!
Scrivici su WhatsApp 👇

Usa prezzi realistici italiani. Sii preciso e professionale. Rispondi sempre in italiano.
Se l'utente non ha specificato la destinazione o le date, chiediglielo gentilmente.

Messaggio utente: ${messaggio}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
          }
        })
      }
    );

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0]) {
      throw new Error('Risposta Gemini non valida');
    }

    const risposta = data.candidates[0].content.parts[0].text;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ risposta })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ errore: 'Errore interno — riprova tra poco' })
    };
  }
};
