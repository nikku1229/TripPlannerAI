const { GoogleGenerativeAI } = require("@google/generative-ai");
const OpenAI = require("openai");
const axios = require("axios");

// Initialize providers
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Provider configuration
const providers = {
  gemini: {
    name: "gemini",
    enabled: !!process.env.GEMINI_API_KEY,
    handler: async (prompt) => {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    },
  },
  openai: {
    name: "openai",
    enabled: !!process.env.OPENAI_API_KEY,
    handler: async (prompt) => {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      });
      return completion.choices[0].message.content;
    },
  },
  huggingface: {
    name: "huggingface",
    enabled: !!process.env.HUGGINGFACE_API_KEY,
    handler: async (prompt) => {
      const response = await axios.post(
        "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1",
        { inputs: prompt },
        {
          headers: {
            Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            "Content-Type": "application/json",
          },
        },
      );
      return response.data[0].generated_text;
    },
  },
  fallbackRules: {
    name: "fallbackRules",
    enabled: true,
    handler: async (prompt) => {
      return generateRuleBasedResponse(prompt);
    },
  },
};

// Helper function to generate rule-based responses
function generateRuleBasedResponse(prompt) {
  const prompt_lower = prompt.toLowerCase();

  if (prompt_lower.includes("packing") || prompt_lower.includes("pack for")) {
    return JSON.stringify({
      essentials: [
        "Passport",
        "Tickets",
        "Wallet",
        "Phone",
        "Travel insurance",
      ],
      clothing: [
        "Weather-appropriate clothes",
        "Comfortable shoes",
        "Sleepwear",
      ],
      electronics: ["Phone charger", "Power bank", "Adapter"],
      toiletries: ["Toothbrush", "Toothpaste", "Shampoo", "Deodorant"],
      miscellaneous: ["First aid kit", "Snacks", "Water bottle", "Face mask"],
    });
  }

  if (
    prompt_lower.includes("destination") ||
    prompt_lower.includes("travel to")
  ) {
    return "Based on popular recommendations, consider visiting destinations like Bali, Paris, Tokyo, or New York. Each offers unique experiences, cultural attractions, and diverse culinary scenes. For specific recommendations, please provide your preferences for budget, climate, and activities.";
  }

  if (
    prompt_lower.includes("hotel") ||
    prompt_lower.includes("accommodation")
  ) {
    return "For accommodations, consider factors like location, budget, amenities, and reviews. Popular options include hotels (best for service), hostels (budget-friendly), Airbnbs (home-like experience), and resorts (all-inclusive luxury). I recommend checking booking platforms like Booking.com or Agoda for current rates and availability.";
  }

  return "I'm a travel assistant! I can help with destination recommendations, packing lists, accommodation tips, local cuisine, budget planning, and weather advice. Could you please provide more details about your travel plans so I can assist you better?";
}

// Main function to try providers in sequence
async function callWithFallback(prompt, retryCount = 0) {
  const orderedProviders = [
    providers.gemini,
    providers.openai,
    providers.huggingface,
    providers.fallbackRules,
  ];

  for (const provider of orderedProviders) {
    if (!provider.enabled) continue;

    try {
      console.log(`Attempting with provider: ${provider.name}`);
      const result = await provider.handler(prompt);
      return { success: true, data: result, provider: provider.name };
    } catch (error) {
      console.error(`Provider ${provider.name} failed:`, error.message);
      continue;
    }
  }

  throw new Error("All providers failed");
}

// Updated chat endpoint with fallback
exports.chatWithAI = async (req, res) => {
  try {
    const { message, context } = req.body;

    const prompt = `You are a travel assistant AI. Help the user with their travel query.
    Context: ${context || "General travel planning"}
    User Query: ${message}
    
    Provide helpful, concise travel advice about destinations, accommodations, local cuisine, hidden gems, budget tips, and weather considerations.
    Keep responses friendly and informative.`;

    const { data: text, provider } = await callWithFallback(prompt);

    res.json({
      reply: text,
      timestamp: new Date(),
      provider: provider, // So you know which API was used
    });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({
      message: "Error processing chat",
      error: error.message,
      reply:
        "I apologize, but I'm currently experiencing technical difficulties. Please try again in a moment. In the meantime, you can check travel resources like Lonely Planet or TripAdvisor for travel advice.",
    });
  }
};

// Updated packing suggestions with fallback
exports.getPackingSuggestions = async (req, res) => {
  try {
    const { destination, days, weather } = req.body;

    const prompt = `Create a packing list for a ${days}-day trip to ${destination}.
    Weather conditions: ${weather || "Unknown"}
    
    Provide a JSON response with this exact structure:
    {
      "essentials": ["item1", "item2", "item3"],
      "clothing": ["item1", "item2", "item3"],
      "electronics": ["item1", "item2"],
      "toiletries": ["item1", "item2", "item3"],
      "miscellaneous": ["item1", "item2"]
    }`;

    const { data: text, provider } = await callWithFallback(prompt);

    // Try to parse JSON, if it fails use fallback
    let suggestions;
    try {
      const cleanText = text.replace(/```json\n?/g, "").replace(/```\n?/g, "");
      suggestions = JSON.parse(cleanText);
    } catch (parseError) {
      console.error("JSON parse error, using default:", parseError);
      suggestions = getDefaultPackingList(destination, days, weather);
    }

    res.json({
      ...suggestions,
      provider: provider,
    });
  } catch (error) {
    console.error("Packing suggestions error:", error);
    res.json(getDefaultPackingList(destination, days, weather));
  }
};

function getDefaultPackingList(destination, days, weather) {
  const weather_lower = (weather || "").toLowerCase();
  const isCold =
    weather_lower.includes("cold") || weather_lower.includes("winter");
  const isHot =
    weather_lower.includes("hot") || weather_lower.includes("summer");

  return {
    essentials: [
      "Passport/ID",
      "Tickets/Bookings",
      "Wallet/Money",
      "Phone",
      "Travel insurance",
    ],
    clothing: isCold
      ? ["Warm jacket", "Sweaters", "Thermal layers", "Scarf & gloves", "Boots"]
      : isHot
        ? [
            "Light t-shirts",
            "Shorts",
            "Sundresses",
            "Swimwear",
            "Sandals",
            "Sun hat",
          ]
        : [
            "Mix of light and warm clothes",
            "Comfortable walking shoes",
            "Jacket for evenings",
          ],
    electronics: [
      "Phone charger",
      "Power bank",
      "Universal adapter",
      "Headphones",
    ],
    toiletries: [
      "Toothbrush & paste",
      "Shampoo & conditioner",
      "Deodorant",
      "Sunscreen",
      "Personal medications",
    ],
    miscellaneous: [
      "First aid kit",
      "Snacks",
      "Water bottle",
      "Travel pillow",
      "Laundry bag",
    ],
  };
}
