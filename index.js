const express = require("express");
const cors = require('cors')
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@cluster0.8cnv71c.mongodb.net/?retryWrites=true&w=majority`;

app.use(cors())
app.use(express.json())


// Sample district names
const districtNames = [
  'dhaka', 'sylhet', 'chittagong', 'khulna', 'barisal', 'rajshahi', 'rangpur', 'mymensingh', 'narsingdi', 'brahmanbaria',
  'kishoreganj', 'jamalpur', 'comilla', 'feni', 'noakhali', 'panchagarh', 'thakurgaon', 'cox\'s bazar', 'dinajpur', 'nilphamari',
  'kurigram', 'lalmanirhat', 'barguna', 'rangamati', 'bandarban', 'natore', 'narayanganj', 'munshiganj', 'manikganj', 'gazipur',
  'netrokona', 'tangail', 'shariatpur', 'rajbari', 'gopalganj', 'madaripur', 'faridpur', 'sherpur', 'lakshmipur', 'chandpur',
  'sunamganj', 'moulvibazar', 'habiganj', 'khagrachari', 'naogaon', 'chapainawabganj', 'pabna', 'sirajganj', 'bogura', 'joypurhat',
  'gaibandha', 'bagerhat', 'satkhira', 'jashore', 'magura', 'narail', 'kushtia', 'jhenaidah', 'chuadanga', 'meherpur',
  'jhalokathi', 'pirojpur', 'bhola', 'patuakhali',
];


const districtDistances = [
  // Dhaka to all other districts
  [0, 248, 295, 271, 185, 258, 309, 121, 52, 107, 143, 181, 94, 151, 190, 444, 408, 388, 383, 361, 350, 346, 327, 314, 311, 220, 17, 27, 64, 37, 159, 98, 238, 136, 232, 220, 145, 203, 216, 169, 346, 214, 179, 275, 283, 320, 161, 142, 228, 280, 301, 270, 343, 273, 201, 307, 277, 228, 267, 312, 290, 304, 317, 319],
];


const calculateDistance = (destination) =>{
  const destinationIndex = districtNames.indexOf(destination);

  if (destinationIndex === -1) {
    return null; // Handle invalid district names
  }

  const distance = districtDistances[0][destinationIndex];
  return distance;
}


const calculateCharges = (distance , weight) =>{
  let shippingCharge = 0;

  if (distance <= 30) {
    // For distances up to 30 km
    shippingCharge = 50 + (weight - 1) * 20;
  } else {
    // For distances beyond 30 km
    shippingCharge = 50 + (weight - 1) * 20 + (distance - 30) * 0.5 * weight;
  }

  return shippingCharge;
}



// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Server successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get("/",(req , res) =>{
    res.send("Pathan Server Is Running")
})


app.get('/calculate-distance', (req, res) => {
  const { destination } = req.query;

  const distance = calculateDistance(destination.toLowerCase());

  if (distance === null) {
    res.status(400).json({ error: 'Invalid district name' });
  } else {
    res.json({ distance });
  }
});


app.get('/calculate-total-price', (req, res) => {
  const { distance, weight,quantity } = req.query;

  if (distance && weight) {
    const adjustedWeight = parseFloat(weight) * parseFloat(quantity);
    const shippingCharge = calculateCharges(distance, adjustedWeight);
    const totalPrice = shippingCharge;
    res.json({ totalPrice });
    
  } else {
    res.status(400).json({ error: 'Invalid' });
  }
});



app.listen(port,()=>{
    console.log(`Server running at port ${port}`);
})