import House from "./src/models/House.js";

try {
  const houses = await House.findAll();
  console.log("Existing houses:", houses.length);

  if (houses.length === 0) {
    await House.bulkCreate([
      {
        houseName: "House A",
        capacity: 150,
        currentBirdCount: 140,
        location: "North Section",
      },
      {
        houseName: "House B",
        capacity: 150,
        currentBirdCount: 138,
        location: "South Section",
      },
      {
        houseName: "House C",
        capacity: 150,
        currentBirdCount: 142,
        location: "East Section",
      },
    ]);
    console.log("Created 3 test houses");
  } else {
    houses.forEach((h) =>
      console.log("- " + h.houseName + " (" + h.currentBirdCount + " birds)")
    );
  }

  process.exit(0);
} catch (error) {
  console.error("Error:", error);
  process.exit(1);
}
