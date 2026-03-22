const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

/* 🧠 1. INTAKE AGENT */
function intakeAgent(input) {
  input = input.toLowerCase();

  let intent = "general";

  if (input.includes("police") || input.includes("arrest"))
    intent = "police";

  if (input.includes("theft") || input.includes("stolen"))
    intent = "theft";

  if (input.includes("rent") || input.includes("landlord"))
    intent = "rent";

  if (input.includes("salary") || input.includes("job"))
    intent = "salary";

  return {
    raw: input,
    intent
  };
}

/* 🔍 2. RESEARCH AGENT */
function researchAgent(data) {
  const laws = {
    police: "Police detention limit: 24 hours (CrPC)",
    theft: "IPC Section 379 - Theft",
    rent: "Tenant Protection Laws",
    salary: "Labour Law - Salary Rights"
  };

  return {
    ...data,
    law: laws[data.intent] || "General Law"
  };
}

/* ⚖️ 3. ANALYSIS AGENT */
function analysisAgent(data) {
  let explanation = "";

  switch (data.intent) {
    case "police":
      explanation =
        "Police cannot detain you beyond 24 hours without court order. You have right to lawyer.";
      break;

    case "theft":
      explanation =
        "You should file FIR under IPC Section 379 for theft.";
      break;

    case "rent":
      explanation =
        "Landlord cannot evict you without proper notice.";
      break;

    case "salary":
      explanation =
        "Employer must pay salary on time. Non-payment is illegal.";
      break;

    default:
      explanation =
        "Your issue requires legal consultation.";
  }

  return {
    ...data,
    explanation
  };
}

/* 📄 4. LETTER AGENT */
function letterAgent(data) {
  let notice = "";

  switch (data.intent) {
    case "police":
      notice =
        "Legal Notice:\nI request clarification regarding my detention. Kindly provide valid legal reason.";
      break;

    case "theft":
      notice =
        "FIR:\nI want to report theft of my belongings. Kindly register FIR.";
      break;

    case "rent":
      notice =
        "Legal Notice:\nIllegal eviction attempt. Please provide written notice.";
      break;

    case "salary":
      notice =
        "Legal Notice:\nPending salary request. Kindly release payment.";
      break;

    default:
      notice = "General Notice:\nPlease review this issue.";
  }

  return {
    agent: "⚖️ AI Legal System",
    explanation: data.explanation,
    notice,
    confidence: "88%"
  };
}

/* 🔥 MAIN PIPELINE */
function runAI(input) {
  const step1 = intakeAgent(input);
  const step2 = researchAgent(step1);
  const step3 = analysisAgent(step2);
  const step4 = letterAgent(step3);

  return step4;
}

/* API */
app.post("/analyze", (req, res) => {
  const { input } = req.body;

  const result = runAI(input);

  res.json(result);
});

/* START */
app.listen(3000, () => {
  console.log("🚀 Multi-Agent AI running on http://localhost:3000");
});