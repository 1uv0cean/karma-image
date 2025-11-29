import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "referrals.json");

// Ensure data directory exists
const ensureDb = () => {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({}));
  }
};

// Read DB
const readDb = () => {
  ensureDb();
  try {
    const data = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
};

// Write DB
const writeDb = (data: any) => {
  ensureDb();
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

export async function POST(req: NextRequest) {
  try {
    const { refId, visitorId } = await req.json();

    if (!refId || !visitorId) {
      return NextResponse.json({ error: "Missing refId or visitorId" }, { status: 400 });
    }

    const db = readDb();

    // Initialize referrer if not exists
    if (!db[refId]) {
      db[refId] = { count: 0, visitors: [] };
    }

    // Check if visitor already counted
    if (db[refId].visitors.includes(visitorId)) {
      return NextResponse.json({ success: false, message: "Already counted" });
    }

    // Prevent self-referral
    if (refId === visitorId) {
      return NextResponse.json({ success: false, message: "Self-referral" });
    }

    // Increment count
    db[refId].visitors.push(visitorId);
    db[refId].count += 1;
    
    writeDb(db);

    return NextResponse.json({ success: true, count: db[refId].count });
  } catch (error) {
    console.error("Referral Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const refId = searchParams.get("refId");

  if (!refId) {
    return NextResponse.json({ error: "Missing refId" }, { status: 400 });
  }

  const db = readDb();
  const count = db[refId]?.count || 0;

  return NextResponse.json({ count });
}
