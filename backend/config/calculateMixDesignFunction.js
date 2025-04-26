export const calculateMixDesignFinal = (input) => {
    const {
        grade,
        exposure, // mild, moderate, severe, very severe, extreme
        maxAggSize, // 10, 20, 40
        slump, // in mm
        aggregateShape, // angular, rounded
        wcrInput, // water-cement ratio input by user
        zone, // Zone I, II, III, IV
        specificGravityCement,
        specificGravityFA,
        specificGravityCA,
        admixturePercent,
        volume  // default 1 m³
    } = input;

    // Lookup Tables
    const xFactorTable = {
        M20: 7,
        M25: 6,
        M30: 5,
        M35: 5,
        M40: 5,
        M45: 5,
        M50: 5,
        M55: 5,
        M60: 5
    };

    const airContentTable = { 10: 1.5, 20: 2.0, 40: 2.5 };
    const baseWaterContentTable = { 10: 208, 20: 186, 40: 165 };
    const coarseAggregateVolumeTable = {
        "Zone I": { 10: 0.44, 20: 0.60, 40: 0.69 },
        "Zone II": { 10: 0.46, 20: 0.62, 40: 0.71 },
        "Zone III": { 10: 0.48, 20: 0.64, 40: 0.73 },
        "Zone IV": { 10: 0.50, 20: 0.66, 40: 0.75 }
    };
    const exposureLimits = {
        mild: { minCement: 300, maxWCR: 0.55 },
        moderate: { minCement: 300, maxWCR: 0.50 },
        severe: { minCement: 320, maxWCR: 0.45 },
        "very severe": { minCement: 340, maxWCR: 0.45 },
        extreme: { minCement: 360, maxWCR: 0.40 }
    };

    // Step 1: Target Mean Strength (NEW: Using X-Factor)
    const fck = parseInt(grade.replace("M", ""));
    const x = xFactorTable[grade.toUpperCase()];
    const targetStrength = fck + x;

    // Step 2: Air Content (%)
    const airContentPercent = airContentTable[maxAggSize];
    const airContent = airContentPercent / 100; // convert % to fraction

    // Step 3: Water Content
    let waterContent = baseWaterContentTable[maxAggSize];
    if (aggregateShape.toLowerCase() === "rounded") {
        waterContent *= 0.9; // reduce by 10% if rounded
    }
    if (slump > 50) {
        const extraSlump = slump - 50;
        waterContent *= 1 + (0.03 * Math.floor(extraSlump / 25));
    }
    waterContent = Math.round(waterContent);

    // Step 4: Water-Cement Ratio & Exposure Check
    let wcr = wcrInput;
    const exposureData = exposureLimits[exposure.toLowerCase()];
    if (wcrInput > exposureData.maxWCR) {
        wcr = exposureData.maxWCR;
    }

    // Step 5: Cement Content
    let cementContent = Math.round(waterContent / wcr);
    if (cementContent < exposureData.minCement) {
        cementContent = exposureData.minCement;
    }
    const cementBags = (cementContent * volume) / 50;

    // Step 6: Admixture Content
    const admixtureWeight = (admixturePercent / 100) * cementContent;

    // Step 7: Volume of Cement, Water, Admixture
    const volumeCement = cementContent / (specificGravityCement * 1000);
    const volumeWater = waterContent / (1 * 1000);
    const volumeAdmixture = admixtureWeight / (1.1 * 1000); // assuming SP SG = 1.1
    const totalVolume = 1; // for 1m³
    const remainingVolume = totalVolume - (volumeCement + volumeWater + volumeAdmixture + airContent);

    // Step 8: Fine Aggregate & Coarse Aggregate Mass
    let Vca = coarseAggregateVolumeTable[zone][maxAggSize];
    if (slump > 50) {
        Vca -= (Math.floor((slump - 50) / 25)) * 0.01;
    }
    const Vfa = 1 - Vca;

    const massCA = remainingVolume * Vca * specificGravityCA * 1000;
    const massFA = remainingVolume * Vfa * specificGravityFA * 1000;

    // Final Mix Ratio
    const mixRatio = {
        cement: 1,
        fineAggregate: (massFA / cementContent).toFixed(2),
        coarseAggregate: (massCA / cementContent).toFixed(2)
    };

    return {
        grade,
        targetStrength,
        cementContent: (cementContent * volume).toFixed(2),
        cementBags: cementBags.toFixed(2),
        waterContent: (waterContent * volume).toFixed(2),
        fineAggregateMass: (massFA * volume).toFixed(2),
        coarseAggregateMass: (massCA * volume).toFixed(2),
        admixtureWeight: (admixtureWeight * volume).toFixed(2),
        mixRatio
    };
}