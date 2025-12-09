import { db } from "@/drizzle/db";
import { UserTable } from "@/drizzle/schema";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
    const data = await request.json();
    const { ticker, analysisData } = data;
    const { userId } = await auth();

    if (!userId) {
        return new Response(
            JSON.stringify({
                error: "Not authenticated",
            }),
            {
                status: 401,
                headers: { "Content-Type": "application/json" },
            }
        );
    }

    const user = await db.query.UserTable.findFirst({
        where: eq(UserTable.id, userId),
    });

    if (user?.tokens === 0) {
        return new Response(
            JSON.stringify({
                error: "You don't have enough tokens for this operation.",
            }),
            {
                status: 402,
                headers: { "Content-Type": "application/json" },
            }
        );
    }

    if (user && user.tokens !== null && user.tokens !== undefined) {
        const updatedTokens = user.tokens - 1;

        await db
            .update(UserTable)
            .set({ tokens: updatedTokens })
            .where(eq(UserTable.id, user.id))
            .execute();
    }

    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: {
                temperature: 1,
                maxOutputTokens: 8192,  // Increased to prevent truncation
                responseMimeType: "application/json",
                responseSchema: {
                    type: SchemaType.OBJECT,
                    properties: {
                        signal: {
                            type: SchemaType.STRING,
                            format: "enum",
                            enum: ["bullish", "bearish", "neutral"]
                        },
                        confidence: {
                            type: SchemaType.NUMBER,
                        },
                        reasoning: {
                            type: SchemaType.STRING
                        }
                    },
                    required: ["signal", "confidence", "reasoning"]
                }
            },
        });

        const systemPrompt = `You are a Warren Buffett AI agent. Decide on investment signals based on Warren Buffett's principles:
  - Circle of Competence: Only invest in businesses you understand
  - Margin of Safety (> 30%): Buy at a significant discount to intrinsic value
  - Economic Moat: Look for durable competitive advantages
  - Quality Management: Seek conservative, shareholder-oriented teams
  - Financial Strength: Favor low debt, strong returns on equity
  - Long-term Horizon: Invest in businesses, not just stocks
  - Sell only if fundamentals deteriorate or valuation far exceeds intrinsic value
  When providing your reasoning, be thorough and specific by:
  1. Explaining the key factors that influenced your decision the most (both positive and negative)
  2. Highlighting how the company aligns with or violates specific Buffett principles
  3. Providing quantitative evidence where relevant (e.g., specific margins, ROE values, debt levels)
  4. Concluding with a Buffett-style assessment of the investment opportunity
  5. Using Warren Buffett's voice and conversational style in your explanation
  For example, if bullish: "I'm particularly impressed with [specific strength], reminiscent of our early investment in See's Candies where we saw [similar attribute]..."
  For example, if bearish: "The declining returns on capital remind me of the textile operations at Berkshire that we eventually exited because..."
  Follow these guidelines strictly. If some data is missing (e.g., financial metrics, management details), use reasonable assumptions based on your knowledge or skip that part of the analysis.`;

        const userPrompt = `Based on the following data, create the investment signal as Warren Buffett would:
  Analysis Data for ${ticker}:
  ${JSON.stringify(analysisData, null, 2)}
  IMPORTANT: You must return ONLY valid JSON with the following structure:
  {
    "signal": "bullish" | "bearish" | "neutral",
    "confidence": float between 0 and 100,
    "reasoning": "string"
  }
  
  CRITICAL: Provide a thorough and detailed reasoning - aim for 800-1400 characters. Be specific and comprehensive. Cover the 3-4 most important Buffett principles (Circle of Competence, Economic Moat, Financial Strength, Management Quality, Margin of Safety) as they relate to this company. Include specific metrics and examples in Warren Buffett's conversational voice.`;

        const result = await model.generateContent([
            { text: systemPrompt },
            { text: userPrompt }
        ]);

        const response = result.response;
        let text = response.text();

        // Log the raw response for debugging
        // console.log("Raw Gemini response:", text);

        // Check if response was truncated
        const finishReason = result.response.candidates?.[0]?.finishReason;
        if (finishReason && finishReason !== 'STOP') {
            console.warn('Response may have been truncated. Finish reason:', finishReason);
        }

        // Clean the response - remove markdown code blocks if present
        text = text.trim();
        if (text.startsWith("```json")) {
            text = text.replace(/^```json\n/, "").replace(/\n```$/, "");
        } else if (text.startsWith("```")) {
            text = text.replace(/^```\n/, "").replace(/\n```$/, "");
        }

        // Check if JSON appears complete (basic validation)
        const openBraces = (text.match(/{/g) || []).length;
        const closeBraces = (text.match(/}/g) || []).length;
        if (openBraces !== closeBraces) {
            console.error('Incomplete JSON detected - mismatched braces');
            return new Response(
                JSON.stringify({
                    error: "AI response was truncated",
                    details: "The response exceeded token limits and was cut off. Please try again."
                }),
                {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        // Parse the JSON response
        let jsonResponse;
        try {
            jsonResponse = JSON.parse(text);
        } catch (parseError) {
            console.error("Error parsing Gemini response:", parseError);
            console.error("Cleaned text that failed to parse:", text);
            console.error("First 1000 chars:", text.substring(0, 1000));

            return new Response(
                JSON.stringify({
                    error: "Failed to parse AI response",
                    details: parseError instanceof Error ? parseError.message : "Unknown error",
                    preview: text.substring(0, 200)
                }),
                {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        // Return in Anthropic-compatible format for consistency
        const formattedResponse = {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(jsonResponse)
                }
            ]
        };

        return new Response(JSON.stringify(formattedResponse), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error: unknown) {
        console.error("Error processing request:", error);

        let errorMessage = "An unknown error occurred";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return new Response(
            JSON.stringify({
                error: errorMessage,
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}
