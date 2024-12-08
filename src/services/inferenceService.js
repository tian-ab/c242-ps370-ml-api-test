const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');
const foodList = require('./foodList')

// Function to predict food recommendations based on user input and confidence score
async function predictFoodRecommendations(model, inputJson) {
  try {
    // Extract user preferences and input features
    const { user_allergens, user_last_order, food_category, food_ingredients } = inputJson;

    // Prepare the input data for the model (this may require preprocessing, depending on the model's expectations)
    const inputData = {
      user_allergens, 
      user_last_order, 
      food_category, 
      food_ingredients
    };

    // Preprocess input data (if necessary) - assume that it's ready for the model
    const tensorInput = tf.tensor([Object.values(inputData)]); // Convert input to tensor, adjust preprocessing if needed

    // Use the model to make predictions (ensure the model can process this type of data)
    const prediction = await model.predict(tensorInput); // Modify according to your model's expected input/output
    const score = prediction.dataSync(); // Get prediction scores
    const confidenceScore = Math.max(...score) * 100; // Use the highest score for confidence

    // Generate food recommendations using confidence score
    // Assuming each food in foodList has a confidence score associated with it
    const recommendedFoods = foodList
      .map(food => ({
        food: food,
        confidence: score[foodList.indexOf(food)] * 100 // Assign confidence score to each food
      }))
      .sort((a, b) => b.confidence - a.confidence); // Sort by confidence score, highest first

    // Return the recommended foods in the expected format
    return { foods_recommendation: recommendedFoods.map(food => food.food) };

  } catch (error) {
    throw new InputError('Terjadi kesalahan dalam melakukan prediksi');
  }
}

module.exports = predictFoodRecommendations;
