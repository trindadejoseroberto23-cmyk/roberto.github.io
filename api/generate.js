export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({ error: "Descrição é obrigatória" });
    }

    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content:
              "Você é um engenheiro de prompt profissional que cria prompts extremamente detalhados com direção de arte, composição, iluminação, tipografia, paleta de cores, estilo visual e configurações técnicas."
          },
          {
            role: "user",
            content: `Crie um prompt ultra detalhado baseado em: ${description}`
          }
        ],
        temperature: 0.9
      }),
    });

    const data = await openaiResponse.json();

    if (!data.choices) {
      return res.status(500).json({ error: data });
    }

    return res.status(200).json({
      prompt: data.choices[0].message.content
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}
