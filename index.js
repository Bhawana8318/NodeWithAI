const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const fs = require('fs');    
const {GoogleGenAI} = require( '@google/genai'); 
const { QdrantClient } = require('@qdrant/js-client-rest'); 
require('dotenv').config();
const app = express();
const upload = multer({ dest: 'uploads/' });
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});



// embeddings creation using gemini api
async function createEmbeddings(text) {
  const response = await ai.models.embedContent({
    model: 'gemini-embedding-2',
    contents: text,
  });
return response.embeddings[0].values;
};
 
//qdrant set up
const qdrant = new QdrantClient({
  url : process.env.QDRANT_URL,
  apiKey : process.env.QDRANT_API_KEY
});


// comparisson of embeddings to chunk chunks to find the relvancy 
function cosineSimilarity(vecA, vecB){
  let dotproduct = 0;
  for(let i=0; i<vecA.length; i++){
    dotproduct += vecA[i] * vecB[i];
  }
  return dotproduct;
}


app.get('/', (req, res) => {
  res.send('hey I am Bhawana');
});

//we are creating collection for qdrant to funtion 
app.get('/create-collection', async(req, res) =>{
  try{
    await qdrant.createCollection('pdf-docs' , {
      vectors : {
        size : 768,
        distance:"Cosine",
            },
    })
res.send('collection is created ');
  }catch(err){
    res.status(500).send(err);

  }
});


//up.single means upload single file only 
app.post('/upload', upload.single('pdf'), async(req, res) => {
  console.log(req.body);
  // read pdf from extracting text from pdf file data buffer means binary data.
  // file system is inbuilt module in nodejs to read file from local system
  try{
const databuffer = fs.readFileSync(req.file.path);
const pdfData = await pdfParse(databuffer);
const text = pdfData.text;

//chunks 
const chunks = text.split('\n\n').filter((chunk) => chunk.trim() != ''); // Split by double newlines and filter out empty chunks
//console.log(chunks);




//const embedding = await createEmbeddings(chunks[0]);
// console.log(embedding);
// convert all the chunks to embeddings and cave in an array 
const chunkEmbeddings = [];
for(const chunk of chunks)
{
  const embedding = await createEmbeddings(chunk);

  chunkEmbeddings.push({
   text : chunk, 
    embedding
  });
}

// map in js modify existing array 
 const points = chunkEmbeddings.map((item , index) => ( { 
  id : index+1, // index = 0 
  vector: item.embedding,
  payload :  {
    text : item.text // item ka text wala part 
     },
  }));
  // we will now update points in database 
  // upsert is smthing which will  if id is alrady existing then it will update it or if not found then insert as namesd update+ insert == upsert
await qdrant.upsert("pdf-docs" , {
  points,
})
const question = req.body.question;
const questionEmbedding = await createEmbeddings(question);



//now we will not use this to match the chunk but we will use cosine similarity 
//const matchedChunk = chunks.find((chunk) =>chunk.toLowerCase().includes('question'));
// let bestChunk = null;
// let bestScore = -1;

// // now will loop through chunks embeddings and find the score 
// for(const items of chunkEmbeddings) {
// const score = cosineSimilarity(items.embedding, questionEmbedding);

// if(score > bestScore)
// {
//   bestChunk = items.text;
//   bestScore = score ;

//     }
// }
// console.log(bestChunk);
// console.log(bestScore);

const searchResult = await qdrant.search('pdf-docs' , {
  vector : questionEmbedding,
  limit : 1
});


//LLM call to generate content using the matched chunk and question
const bestChunk = searchResult[0].payload.text;

const response = await ai.models.generateContent({
  model: 'gemini-2.5-flash',
  contents : `ans this question using the contest: ${bestChunk} and question is: ${question}`
})

res.send(response.text);


  }catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
})
app.listen(3000,() => {
  console.log('Server is running on port 3000');
})