const Farmer = require("../models/farmer");
const CropInstance = require("../models/CropInstance");

exports.createInstance = async (req, res) => {
  try {
    const {
      email,
      instanceName,
      cropName,      // may be undefined for Planning stage
      season,
      landUsed,
      startingStage,
    } = req.body;

    // 1. Fetch farmer
    const farmer = await Farmer.findOne({ email });
    if (!farmer) {
      return res.status(404).json({ message: "Farmer not found" });
    }

    // 2. Validate land
    if (landUsed > farmer.landSize) {
      return res.status(400).json({ message: "Land used exceeds total land" });
    }

    // 3. Create location & soil snapshots
    const localitySnapshot = {
      state: farmer.state,
      district: farmer.district,
      village: farmer.village || "",
    };

    const soilSnapshot = {
      soilType: farmer.soilType || null,
      nitrogen: farmer.soilHealth?.nitrogen || null,
      phosphorus: farmer.soilHealth?.phosphorus || null,
      potassium: farmer.soilHealth?.potassium || null,
      ph: farmer.soilHealth?.ph || null,
      organicCarbon: farmer.soilHealth?.organicCarbon || null,
    };

    const initialPlan = {
      recommended_crop: "",
      crop_recommendation_reasoning: "",
      complete_crop_plan: {
        seed_selection: "",
        sowing_plan: "",
        expected_yield: "",
        expected_expenditure: "",
      },
    };

    // 4. Build the instance document
    const newInstance = new CropInstance({
      farmerId: farmer._id,
      instanceName,
      // cropName is optional – if not provided, schema default "" will apply
      cropName: cropName || "",   // ensure it's never undefined (store empty string)
      season,
      landUsed,
      localitySnapshot,
      soilSnapshot,
      irrigationType: farmer.irrigationType || null,
      initialPlan,
      // Stage tracking
      currentStage: startingStage,
      currentStageEnteredAt: new Date(),          // ✅ required by schema
      completedStages: [],
      
      isActive: true,
    });

    await newInstance.save();

    res.status(201).json({
      message: "Instance created successfully",
      instance: newInstance,
    });
  } catch (error) {
    console.error("Create instance error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getFarmerInstances = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const farmer = await Farmer.findOne({ email });
    if (!farmer) {
      return res.status(404).json({ message: "Farmer not found" });
    }

    const instances = await CropInstance.find({ farmerId: farmer._id })
      .sort({ createdAt: -1 });

    res.json(instances);
  } catch (error) {
    console.error("Get instances error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getInstanceById = async (req, res) => {
  try {
    const { id } = req.params;
    const instance = await CropInstance.findById(id);
    if (!instance) {
      return res.status(404).json({ message: "Instance not found" });
    }
    res.json(instance);
  } catch (error) {
    console.error("Get instance by id error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.completeStage = async (req, res) => {
  try {
    const { id } = req.params;
    const { stage } = req.body;

    if (!stage) {
      return res.status(400).json({ message: "Stage name is required" });
    }

    const instance = await CropInstance.findById(id);
    if (!instance) {
      return res.status(404).json({ message: "Instance not found" });
    }

    // 1. Prevent double completion
    const alreadyCompleted = instance.completedStages?.find(
      (cs) => cs.stage === stage
    );
    if (alreadyCompleted) {
      return res.status(400).json({ message: "Stage already completed" });
    }

    // 2. Define stage order
    const stageOrder = ["Planning", "Sowing", "Cultivation", "Harvesting", "Selling", "Completed"];

    // 3. Add to completedStages
    instance.completedStages.push({
      stage,
      completedAt: new Date(),
    });

    if (stage === instance.currentStage) {
      const currentIndex = stageOrder.indexOf(stage);
      const nextStage = stageOrder[currentIndex + 1];
      if (nextStage) {
        instance.currentStage = nextStage;
        instance.currentStageEnteredAt = new Date();
      }
    }

    // 5. If Selling is completed → mark whole instance as Completed
    if (stage === "Selling" || stage === "Completed") {
      instance.isActive = false;
      instance.completedAt = new Date();
      instance.currentStage = "Completed";
    }

    await instance.save();

    res.json({
      message: "Stage completed successfully",
      instance,
    });
  } catch (error) {
    console.error("Complete stage error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.saveInitialPlan = async (req, res) => {
  
  try {
    const {id} =  req.params;
    const initialPlan = req.body.initialPlan; // Expecting the entire plan object in the request body
    
    const {recommended_crop, crop_recommendation_reasoning, complete_crop_plan } = initialPlan; 
    
    const instance = await CropInstance.findById(id);
    if (!instance) {
      return res.status(404).json({ message: "Instance not found" });
    }

    instance.initialPlan = {
      recommended_crop,
      crop_recommendation_reasoning,
      complete_crop_plan
    };

    await instance.save();
    
    res.json({
      message: "Initial plan saved successfully",
      instance,
    });
  } catch (error) {
    console.error("Save initial plan error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  } 
};

exports.setCropName = async (req, res) => {
  try {
   const {id} = req.params;
    const {cropName } = req.body;
    const instance = await CropInstance.findById(id);
    if (!instance) {
      return res.status(404).json({ message: "Instance not found" });
    }
    instance.cropName = cropName;
    await instance.save();
   
    res.json({  
      message: "Crop name updated successfully",
      instance,
    });
  } catch (error) {
    console.error("Set crop name error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};