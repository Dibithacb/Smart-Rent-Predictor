import * as tf from '@tensorflow/tfjs';

class RentPredictionModel {
  //create blueprint of AI model
  constructor() {
    this.model = null;  // Will hold the neural network
    this.isModelReady = false; // Flag to know if model is ready
    this.featureScalers = {  // For normalizing data (not heavily used)
      min: {},
      max: {}
    };
  }

  // Creates a sequential model-layers are stacked one after another
  createModel() {
    const model = tf.sequential();
    
    // Input layer (7 features)
    model.add(tf.layers.dense({
      units: 64,//This layer has 64 neurons (like 64 small calculators)
      activation: 'relu',//Activation function that turns negative numbers to 0 (helps learning)
      inputShape: [7],//Expects 7 input features-emirate code,area code,bedrooms.sqrt,property type code,year built,amenities count
      name: 'input_layer'
    }));
    
    // Hidden layer 1
    model.add(tf.layers.dense({
      units: 128,//First hidden layer with 128 neurons. This layer learns complex patterns from the 64 input neurons
      activation: 'relu',
      name: 'hidden_layer_1'
    }));
    
    // Dropout layer to prevent overfitting
    model.add(tf.layers.dropout({
      rate: 0.3,//Dropout randomly turns off 30% of neurons during training. This prevents model from memorizing training data.
      name: 'dropout_1'
    }));
    
    //Two more hidden layers that gradually reduce the number of neurons. This helps extract the most important features
    // Hidden layer 2
    model.add(tf.layers.dense({
      units: 64,
      activation: 'relu',
      name: 'hidden_layer_2'
    }));
    
    // Hidden layer 3
    model.add(tf.layers.dense({
      units: 32,
      activation: 'relu',
      name: 'hidden_layer_3'
    }));
    
    // Output layer (single value: predicted rent)
    model.add(tf.layers.dense({
      units: 1,
      activation: 'linear',
      name: 'output_layer'
    }));
    
    // Compile the model
    //Final layer with 1 neuron (linear activation) that outputs a single number - the predicted rent!
    model.compile({
      optimizer: tf.train.adam(0.001),//Algorithm that adjusts the model's weights to minimize errors (learning rate 0.001)
      loss: 'meanSquaredError',// Measures how wrong predictions are (smaller = better)
      metrics: ['mae']//Tracks mean absolute error (average difference in AED)
    });
    
    this.model = model;
    this.isModelReady = true;
    
    console.log('Model created successfully');
    model.summary();
    
    return model;
  }

  // Generate synthetic training data based on UAE rental market
  generateTrainingData(samples = 10000) {
    console.log('Generating training data...');
    
    // Define all data INSIDE the method before using them
    const emirates = {
      'Dubai': 0.8,// Dubai is most expensive
      'Abu Dhabi': 0.7,// Abu Dhabi slightly less
      'Sharjah': 0.4,// Sharjah more affordable
      'Ajman': 0.3,
      'Ras Al Khaimah': 0.35
    };
    
    const areas = {
      'Dubai': { 
        'Dubai Marina': 0.9, // Premium area
        'Downtown Dubai': 1.0, // Most expensive
        'JBR': 0.85, 
        'Palm Jumeirah': 1.2, // Ultra luxury
        'Arabian Ranches': 0.7 
      },
      'Abu Dhabi': { 
        'Corniche': 0.8, 
        'Al Reem Island': 0.75, 
        'Yas Island': 0.85 
      },
      'Sharjah': { 
        'Al Majaz': 0.5, 
        'Al Nahda': 0.45, 
        'Al Khan': 0.55 
      }
    };
    
    const propertyTypes = {
      'apartment': 1.0,
      'villa': 1.8,// Villas are 80% more expensive
      'townhouse': 1.3,
      'penthouse': 2.0,// Penthouses are double price
      'studio': 0.7
    };
    
    const features = [];
    const labels = [];
    //Creates 10,000 random properties with realistic features. This is synthetic training data.
    for (let i = 0; i < samples; i++) {
      // Generate random features based on realistic UAE ranges
      const emirateNames = Object.keys(emirates);
      const emirate = emirateNames[Math.floor(Math.random() * emirateNames.length)];
      const emirateCode = emirates[emirate];
      
      // Get area based on emirate
      const areaOptions = areas[emirate] || areas['Dubai'];
      const areaNames = Object.keys(areaOptions);
      const area = areaNames[Math.floor(Math.random() * areaNames.length)];
      const areaCode = areaOptions[area];
      
      const bedrooms = Math.floor(Math.random() * 5) + 1; // 1-5 bedrooms
      const sqft = Math.floor(Math.random() * 3000) + 500; // 500-3500 sqft
      
      const propertyTypeNames = Object.keys(propertyTypes);
      const propertyType = propertyTypeNames[Math.floor(Math.random() * propertyTypeNames.length)];
      const propertyTypeCode = propertyTypes[propertyType];
      
      const yearBuilt = Math.floor(Math.random() * 20) + 2005; // 2005-2024
      const yearBuiltCode = (yearBuilt - 2000) / 30; // Normalize to 0-1 range
      
      const amenitiesCount = Math.floor(Math.random() * 8); // 0-7 amenities
      
      // Calculate rent based on features (this is our "ground truth" formula)
      //This formula creates realistic rental prices based on property features. The model will learn this pattern.
      let rent = 30000; // Base rent
      rent += emirateCode * 50000;// Location premium
      rent += areaCode * 40000;// Area premium
      rent += bedrooms * 15000;// Each bedroom adds AED 15,000
      rent += (sqft / 100) * 80;// Size: AED 80 per 100 sqft
      rent += propertyTypeCode * 30000;// Property type adjustment
      rent += yearBuiltCode * 20000;// Newer = higher rent
      rent += amenitiesCount * 3000;// Each amenity adds AED 3,000
      
      // Add some random noise to make it realistic
      rent += (Math.random() - 0.5) * rent * 0.1;
      
      features.push({
        emirateCode,
        areaCode,
        bedrooms: bedrooms / 6, // Normalize to 0-1
        sqft: sqft / 4000, // Normalize to 0-1
        propertyTypeCode: propertyTypeCode / 2, // Normalize to 0-1
        yearBuiltCode,
        amenitiesCount: amenitiesCount / 8 // Normalize to 0-1
      });
      
      labels.push(rent);
    }
    
    return { features, labels };
  }

  // Train the model
  async trainModel(epochs = 80, batchSize = 32) {
    if (!this.model) {
      this.createModel();
    }
    
    console.log('🏋️ Starting model training...');
    
    // Generate training data
    const trainingData = this.generateTrainingData(8000);//Used to teach the model
    const validationData = this.generateTrainingData(2000);//Used to test if model is learning correctly
    
    // Convert training data to tensors
    const trainFeatures = tf.tensor2d(trainingData.features.map(f => [
      f.emirateCode, f.areaCode, f.bedrooms, f.sqft, 
      f.propertyTypeCode, f.yearBuiltCode, f.amenitiesCount
    ]));
    const trainLabels = tf.tensor2d(trainingData.labels, [trainingData.labels.length, 1]);
    
    // Convert validation data to tensors
    const valFeatures = tf.tensor2d(validationData.features.map(f => [
      f.emirateCode, f.areaCode, f.bedrooms, f.sqft, 
      f.propertyTypeCode, f.yearBuiltCode, f.amenitiesCount
    ]));
    const valLabels = tf.tensor2d(validationData.labels, [validationData.labels.length, 1]);
    
    // Train the model
    const history = await this.model.fit(trainFeatures, trainLabels, {
      epochs,
      batchSize,
      validationData: [valFeatures, valLabels],
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          if (epoch % 10 === 0) {
            console.log(`Epoch ${epoch}: loss = ${logs.loss.toFixed(4)}, mae = ${logs.mae.toFixed(2)}`);
          }
        }
      }
    });
    
    console.log('Training complete!');
    
    // Clean up tensors
    trainFeatures.dispose();
    trainLabels.dispose();
    valFeatures.dispose();
    valLabels.dispose();
    
    return history;
  }

  // Make prediction
  async predict(features) {
    if (!this.model) {
      await this.loadModel();
    }
    
    // Convert features to normalized values
    const normalizedFeatures = {
      emirateCode: this.getEmirateCode(features.emirate),
      areaCode: this.getAreaCode(features.emirate, features.area),
      bedrooms: features.bedrooms / 6,
      sqft: features.sqft / 4000,
      propertyTypeCode: this.getPropertyTypeCode(features.propertyType),
      yearBuiltCode: (features.yearBuilt - 2000) / 30,
      amenitiesCount: features.amenities.length / 8
    };
    
    const inputTensor = tf.tensor2d([[
      normalizedFeatures.emirateCode,
      normalizedFeatures.areaCode,
      normalizedFeatures.bedrooms,
      normalizedFeatures.sqft,
      normalizedFeatures.propertyTypeCode,
      normalizedFeatures.yearBuiltCode,
      normalizedFeatures.amenitiesCount
    ]]);
    
    const prediction = this.model.predict(inputTensor);
    const predictedRent = (await prediction.data())[0];
    
    // Calculate confidence based on feature completeness
    let confidence = 85; // Base confidence
    
    // Adjust confidence based on data quality
    if (features.amenities.length === 0) confidence -= 10;
    if (features.sqft < 500) confidence -= 5;
    if (features.yearBuilt < 2010) confidence -= 5;
    
    confidence = Math.min(95, Math.max(60, confidence));
    
    // Calculate market comparison (simulate market average)
    const marketAverage = predictedRent * 0.92;
    const difference = Math.round(predictedRent - marketAverage); // Positive = Above market
    
    // Clean up tensors
    inputTensor.dispose();
    prediction.dispose();
    
    return {
      predictedRent: Math.round(predictedRent),
      confidence: Math.round(confidence),
      marketAverage: Math.round(marketAverage),
      difference: difference,
      aboveMarket: difference > 0,
      belowMarket: difference < 0
    };
  }
  
  // Helper functions to convert text to codes
  getEmirateCode(emirate) {
    const codes = {
      'Dubai': 0.8,
      'Abu Dhabi': 0.7,
      'Sharjah': 0.4,
      'Ajman': 0.3,
      'Ras Al Khaimah': 0.35
    };
    return codes[emirate] || 0.5;
  }
  
  getAreaCode(emirate, area) {
    const areas = {
      'Dubai': { 
        'Dubai Marina': 0.9, 
        'Downtown Dubai': 1.0, 
        'JBR': 0.85, 
        'Palm Jumeirah': 1.2, 
        'Arabian Ranches': 0.7 
      },
      'Abu Dhabi': { 
        'Corniche': 0.8, 
        'Al Reem Island': 0.75, 
        'Yas Island': 0.85 
      },
      'Sharjah': { 
        'Al Majaz': 0.5, 
        'Al Nahda': 0.45, 
        'Al Khan': 0.55 
      }
    };
    return (areas[emirate] && areas[emirate][area]) || 0.6;
  }
  
  getPropertyTypeCode(type) {
    const codes = {
      'apartment': 1.0,
      'villa': 1.8,
      'townhouse': 1.3,
      'penthouse': 2.0,
      'studio': 0.7
    };
    return codes[type] / 2;
  }
  
  // Save model to IndexedDB
  async saveModel() {
    if (!this.model) return;
    await this.model.save('indexeddb://rent-predictor-model');//Saves the trained model to the browser's IndexedDB storage. Next time visit, it loads instantly!
    console.log('💾 Model saved to browser storage');
  }
  
  // Load model from IndexedDB
  async loadModel() {
    try {
      this.model = await tf.loadLayersModel('indexeddb://rent-predictor-model');
      this.isModelReady = true;
      console.log('📦 Model loaded from browser storage');
      return true;
    } catch (error) {
      console.log('No saved model found, creating new one...');
      this.createModel();
      return false;
    }
  }
}

export default RentPredictionModel;