import { getAssetDetails, getVendorsByCapability } from "../db/database.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini SDK
// Fails gracefully if GOOGLE_API_KEY is not set by falling back to mock routing.
const genAI = process.env.GOOGLE_API_KEY ? new GoogleGenerativeAI(process.env.GOOGLE_API_KEY) : null;

// Add tracking capability globally
global.routingLogs = global.routingLogs || [];

export const calculateOptimalRepairRoute = async (assetId) => {
    // 1. Fetch Asset
    const asset = getAssetDetails(assetId);
    if (!asset) {
        const error = new Error(`Asset with ID ${assetId} not found.`);
        error.statusCode = 404;
        throw error;
    }

    // 2. Filter Vendors by capability
    const potentialVendors = getVendorsByCapability(asset.type);

    if (potentialVendors.length === 0) {
        const error = new Error(`No vendors found with capability: ${asset.type}`);
        error.statusCode = 400;
        throw error;
    }

    // Calculate baseline distances for context
    const vendorsWithDistance = potentialVendors.map(v => {
        const distance = Math.sqrt(Math.pow(asset.facility_x - v.location_x, 2) + Math.pow(asset.facility_y - v.location_y, 2));
        return { ...v, distance };
    });

    let optimalVendor;
    let fallbackReason = "";
    let predictedFailureProb = Math.min(0.99, asset.usage_pattern_factor + 0.1);

    // 3. AI-Driven Decision Engine
    if (genAI) {
        try {
            // Using gemini-1.5-pro or gemini-1.5-flash for reasoning
            const model = genAI.getGenerativeModel({ 
                model: "gemini-1.5-flash",
                generationConfig: {
                    responseMimeType: "application/json" // Hallucination-proof strict JSON parsing
                }
            });

            const prompt = `
            You are the AssetSphere AI Decision Engine.
            Your task is to analyze an asset failure and select the BEST vendor from the list to fix it.
            You must ONLY choose a vendor ID from the provided list. Do not invent vendors.
            Consider both 'reliability_score' (higher is better) and 'distance' (lower is better).

            ASSET DETAILS:
            ${JSON.stringify(asset, null, 2)}

            AVAILABLE VENDORS (Must pick one from here!):
            ${JSON.stringify(vendorsWithDistance, null, 2)}

            Output a strict JSON object with this exact schema:
            {
              "selectedVendorId": <integer ID of the chosen vendor>,
              "reason": "<A short exactly 1 sentence explanation of why this vendor was chosen based on their distance and reliability score>",
              "predictedFailureProbability": <float between 0.0 and 1.0 based on the asset's usage_pattern_factor>
            }
            `;

            const result = await model.generateContent(prompt);
            const responseText = result.response.text();
            
            // Parse structured output
            const aiDecision = JSON.parse(responseText);
            
            // Validate the vendorId is not a hallucination
            const matchedVendor = vendorsWithDistance.find(v => v.id === aiDecision.selectedVendorId);
            if (!matchedVendor) throw new Error("AI Hallucinated Vendor ID");

            optimalVendor = matchedVendor;
            fallbackReason = `AI Engine Decision: ${aiDecision.reason}`;
            predictedFailureProb = aiDecision.predictedFailureProbability;

        } catch (error) {
            console.error("Gemini AI Engine failed or hallucinated. Falling back to algorithmic sorting.", error);
        }
    }

    // 4. Algorithmic Fallback (if AI fails, API key missing, or hallucinates)
    if (!optimalVendor) {
        const scoredVendors = vendorsWithDistance.map(vendor => {
            const score = (vendor.reliability_score * 100) - (vendor.distance * 1.5);
            return { ...vendor, score };
        });
        scoredVendors.sort((a, b) => b.score - a.score);
        optimalVendor = scoredVendors[0];
        fallbackReason = `Algorithmic Selection: Highest reliability (${optimalVendor.reliability_score}) + proximity fusion.`;
    }

    // 5. Append telemetry log
    global.routingLogs.unshift({
        timestamp: new Date().toISOString(),
        assetId: asset.id,
        candidatesEvaluated: potentialVendors.length,
        finalSelection: optimalVendor.name,
        reason: fallbackReason
    });
    if (global.routingLogs.length > 50) global.routingLogs.pop();

    // 6. Return Dispatch Payload
    return {
        dispatchId: `DSP-${Date.now()}-${asset.id}`,
        assetId: asset.id,
        facilityId: asset.facility_id,
        aiAnalysis: {
            predictedFailureProbability: predictedFailureProb.toFixed(4),
            status: asset.status,
            recommendation: predictedFailureProb > 0.8 || asset.status === 'FAILED' ? 'IMMEDIATE_DISPATCH' : 'SCHEDULE_MAINTENANCE'
        },
        assignedVendor: {
            vendorId: optimalVendor.id,
            name: optimalVendor.name,
            distance: optimalVendor.distance.toFixed(2)
        }
    };
};
