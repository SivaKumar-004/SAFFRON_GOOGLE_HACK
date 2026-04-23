import { getAssetDetails, getVendorsByCapability } from "../db/database.js";

// Mock ML Inference function predicting failure probability
// In a real system running on a GPU host, this would call a local inference server or run an ONNX model.
const predictFailureProbability = async (assetId, usagePatternFactor) => {
    // Placeholder logic for mock prediction
    return Math.min(0.99, usagePatternFactor + (Math.random() * 0.1));
};

const calculateDistance = (x1, y1, x2, y2) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

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

    // 2. Local ML Mock Prediction
    const failureProbability = await predictFailureProbability(assetId, asset.usage_pattern_factor);

    // 3. Filter Vendors by capability
    const potentialVendors = getVendorsByCapability(asset.type);

    if (potentialVendors.length === 0) {
        const error = new Error(`No vendors found with capability: ${asset.type}`);
        error.statusCode = 400;
        throw error;
    }

    // 4. Score Vendors
    const scoredVendors = potentialVendors.map(vendor => {
        const distance = calculateDistance(asset.facility_x, asset.facility_y, vendor.location_x, vendor.location_y);
        
        // Scoring formula: we want HIGH reliability and LOW distance
        // Normalizing distance slightly to prevent it from overwhelming the score
        // Score = (Reliability * 100) - (Distance * weight)
        const score = (vendor.reliability_score * 100) - (distance * 1.5);
        
        return {
            ...vendor,
            distance,
            score
        };
    });

    // 5. Sort to find optimal
    scoredVendors.sort((a, b) => b.score - a.score);

    const optimalVendor = scoredVendors[0];

    // Append to telemetry log
    global.routingLogs.unshift({
        timestamp: new Date().toISOString(),
        assetId: asset.id,
        candidatesEvaluated: potentialVendors.length,
        finalSelection: optimalVendor.name,
        reason: `Highest reliability (${optimalVendor.reliability_score}) + Proximity fusion score.`
    });
    if (global.routingLogs.length > 50) global.routingLogs.pop();

    // 6. Return Dispatch Payload
    return {
        dispatchId: `DSP-${Date.now()}-${asset.id}`,
        assetId: asset.id,
        facilityId: asset.facility_id,
        aiAnalysis: {
            predictedFailureProbability: failureProbability.toFixed(4),
            status: asset.status,
            recommendation: failureProbability > 0.8 || asset.status === 'FAILED' ? 'IMMEDIATE_DISPATCH' : 'SCHEDULE_MAINTENANCE'
        },
        assignedVendor: {
            vendorId: optimalVendor.id,
            name: optimalVendor.name,
            distance: optimalVendor.distance.toFixed(2),
            score: optimalVendor.score.toFixed(2)
        },
        alternatives: scoredVendors.slice(1).map(v => ({
            vendorId: v.id,
            name: v.name,
            score: v.score.toFixed(2)
        }))
    };
};
