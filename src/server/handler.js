const predictRecommendation = require('../services/inferenceService');
const crypto = require('crypto');
const storeData = require('../services/storeData');
const getAllData = require('../services/getAllData');

async function postPredictHandler(request, h) {
  const { allergens, ingredients, lastOrder, category } = request.payload;  // Get the input data
  const { model } = request.server.app;

  const { recommendations } = await predictRecommendation(model, allergens, ingredients, lastOrder, category);
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  const data = {
    "id": id,
    "recommendations": recommendations,
    "createdAt": createdAt
  }

  await storeData(id, data);  // Store recommendation history

  const response = h.response({
    status: 'success',
    message: 'Menu recommendations generated successfully',
    data
  })
  response.code(201);
  return response;
}

async function postPredictHistoriesHandler(request, h) {
  const allData = await getAllData();
  
  const formatAllData = [];
  allData.forEach(doc => {
      const data = doc.data();
      formatAllData.push({
          id: doc.id,
          history: {
              recommendations: data.recommendations,
              createdAt: data.createdAt,
              id: doc.id
          }
      });
  });
  
  const response = h.response({
    status: 'success',
    data: formatAllData
  })
  response.code(200);
  return response;
}

module.exports = { postPredictHandler, postPredictHistoriesHandler };
