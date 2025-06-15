// This is a Vercel serverless function to proxy the alerts API
export default async function handler(req, res) {
  // Set CORS headers to allow requests from your frontend
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    // Fetch with proper headers to mimic a browser request
    const response = await fetch(
      "https://www.tzevaadom.co.il/static/historical/all.json",
      {
        method: "GET",
        headers: {
          Accept: "application/json, */*",
          "Accept-Encoding": "gzip, deflate, br",
          "Accept-Language": "en-US,en;q=0.9",
          "Cache-Control": "no-cache",
          Referer: "https://www.tzevaadom.co.il/en/historical/",
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "same-origin",
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Set cache headers similar to the original API
    res.setHeader("Cache-Control", "public, max-age=3200");
    res.setHeader("Content-Type", "application/json");

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching alerts:", error);
    res.status(500).json({
      error: "Failed to fetch alerts data",
      message: error.message,
    });
  }
}
