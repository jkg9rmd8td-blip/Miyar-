import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import * as dotenv from "dotenv";

// Load .env if it exists (for local or specific envs)
dotenv.config();

import { 
  generateCandidateProfile, 
  generateEmployerProfile, 
  analyzeJobTasks, 
  assessFunctionalCapability, 
  suggestWorkplaceAccommodations, 
  estimateCostValue, 
  generateIEARecommendation, 
  generateExecutiveNarrative,
  generateAuditLog
} from "./src/services/ai-generator.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Diagnostic endpoint (SAFE)
  app.get("/api/health", (req, res) => {
    const key = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    res.json({ 
      status: "ok", 
      env: process.env.NODE_ENV,
      hasApiKey: !!key,
      keyName: process.env.GEMINI_API_KEY ? "GEMINI_API_KEY" : (process.env.VITE_GEMINI_API_KEY ? "VITE_GEMINI_API_KEY" : "NONE"),
      keyLength: key ? key.length : 0,
      keyPrefix: key ? key.substring(0, 4) + "..." : null
    });
  });

  // API Routes
  app.post("/api/ai/candidate-profile", async (req, res) => {
    try {
      const { prompt, options } = req.body;
      const result = await generateCandidateProfile(prompt, options);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/ai/employer-profile", async (req, res) => {
    try {
      const { prompt, options } = req.body;
      const result = await generateEmployerProfile(prompt, options);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/ai/analyze-tasks", async (req, res) => {
    try {
      const { data } = req.body;
      const result = await analyzeJobTasks(data);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/ai/assess-functional", async (req, res) => {
    try {
      const { data } = req.body;
      const result = await assessFunctionalCapability(data);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/ai/suggest-accommodations", async (req, res) => {
    try {
      const { data } = req.body;
      const result = await suggestWorkplaceAccommodations(data);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/ai/estimate-cost", async (req, res) => {
    try {
      const { data } = req.body;
      const result = await estimateCostValue(data);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/ai/iea-recommendation", async (req, res) => {
    try {
      const { data } = req.body;
      const result = await generateIEARecommendation(data);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/ai/executive-narrative", async (req, res) => {
    try {
      const { stats } = req.body;
      const result = await generateExecutiveNarrative(stats);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/ai/audit-log", async (req, res) => {
    try {
      const { data } = req.body;
      const result = await generateAuditLog(data);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
