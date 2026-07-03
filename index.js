const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const fs = require('fs');    
const {GoogleGenAI} = require( '@google/genai');    
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




app.get('/', (req, res) => {
  res.send('hey I am Bhawana');
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
console.log(chunks);




const embedding = await createEmbeddings(chunks[0]);
// console.log(embedding);
// convert all the chunks to embeddings 





const question = req.body.question;
const matchedChunk = chunks.find((chunk) =>chunk.toLowerCase().includes('question'));


//LLM call to generate content using the matched chunk and question
const response = await ai.models.generateContent({
  model: 'gemini-2.5-flash',
  contents : `ans this question using the contest: ${matchedChunk} and question is: ${question}`
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