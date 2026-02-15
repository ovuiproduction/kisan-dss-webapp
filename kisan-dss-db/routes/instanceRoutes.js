const express = require("express");
const router = express.Router();
const instanceController = require("../controller/instanceController");

// Create a new instance
router.post("/create", instanceController.createInstance);

// Get all instances for a farmer (by email – temporary; later use JWT)
router.get("/", instanceController.getFarmerInstances);

// Get a single instance by ID
router.get("/:id", instanceController.getInstanceById);

router.post("/complete-stage/:id", instanceController.completeStage);

router.post("/add-initial-plan/:id", instanceController.saveInitialPlan);
router.post("/update-crop-name/:id", instanceController.setCropName);

module.exports = router;