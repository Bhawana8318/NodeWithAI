# 🧠 Semantic Context Search Engine

### RAG-Powered PDF Intelligence Backend

A production-oriented **Retrieval-Augmented Generation (RAG)** backend built with **Node.js, Express, Google Gemini, and Qdrant Cloud**.

The system allows users to upload PDF documents and ask natural-language questions. Documents are converted into semantic vectors, stored in a vector database, and relevant context is retrieved before generating an answer.

---

## ✨ Key Features

* 📄 **PDF Processing** — Extract text from uploaded documents
* ✂️ **Text Chunking** — Break documents into searchable context blocks
* 🧠 **Embeddings** — Convert text into semantic vector representations
* 🔎 **Semantic Search** — Retrieve relevant document sections using Qdrant
* 🤖 **RAG Generation** — Generate answers using retrieved context
* ☁️ **Cloud Vector Storage** — Qdrant Cloud integration
* 🔐 **Secure Configuration** — Environment-based API credentials
* 🧹 **Automatic Cleanup** — Remove temporary uploaded files after processing

---

## 🏗️ Architecture

```text
                    ┌─────────────────┐
                    │   PDF Document  │
                    └────────┬────────┘
                             ↓
                    ┌─────────────────┐
                    │   PDF Parsing   │
                    │   pdf-parse     │
                    └────────┬────────┘
                             ↓
                    ┌─────────────────┐
                    │ Text Chunking   │
                    └────────┬────────┘
                             ↓
                    ┌─────────────────┐
                    │ Gemini Embedding│
                    └────────┬────────┘
                             ↓
                    ┌─────────────────┐
                    │ Qdrant Cloud    │
                    │ Vector Database │
                    └────────┬────────┘
                             │
                    Semantic Search
                             │
                             ↓
                    ┌─────────────────┐
                    │ Relevant Context│
                    └────────┬────────┘
                             ↓
                    ┌─────────────────┐
                    │ Gemini 2.5 Flash│
                    └────────┬────────┘
                             ↓
                    ┌─────────────────┐
                    │  Final Answer   │
                    └─────────────────┘
```

---

## 🔄 RAG Pipeline

```text
PDF
 ↓
Extract Text
 ↓
Chunk Document
 ↓
Generate Embeddings
 ↓
Store Vectors
 ↓
User Question
 ↓
Question Embedding
 ↓
Similarity Search
 ↓
Retrieve Relevant Context
 ↓
Gemini LLM
 ↓
Grounded Answer
```

The key principle is simple:

> **Retrieve relevant information first, then generate the answer.**

This avoids sending the entire document to the LLM for every query.

---

## 🛠️ Tech Stack

| Technology        | Role                      |
| ----------------- | ------------------------- |
| **Node.js**       | Backend runtime           |
| **Express.js**    | REST API                  |
| **Multer**        | File upload handling      |
| **pdf-parse**     | PDF text extraction       |
| **Google Gemini** | Embeddings & generation   |
| **Qdrant Cloud**  | Vector database           |
| **dotenv**        | Environment configuration |

---

## 🔌 API Endpoints

### `GET /create-collection`

Creates the Qdrant vector collection.

```text
Collection: pdf-docs
Vector Size: 768
Distance: Cosine
```

### `POST /upload`

Uploads a PDF and answers a question using retrieved document context.

**Form Data**

```text
pdf       → PDF file
question  → User question
```

**Example Response**

```json
{
  "success": true,
  "answer": "Revenue increased by 18%.",
  "retrievedContext": "The report states an 18% year-over-year increase."
}
```

---

## ⚙️ Getting Started

### Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd YOUR_REPOSITORY
```

### Install dependencies

```bash
npm install
```

### Configure environment variables

Create `.env`:

```env
PORT=3000
GEMINI_API_KEY=your_gemini_api_key
QDRANT_URL=your_qdrant_url
QDRANT_API_KEY=your_qdrant_api_key
```

### Start the server

```bash
node server.js
```

---

## 📁 Project Structure

```text
semantic-context-search/
│
├── src/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   └── config/
│
├── uploads/
├── .env.example
├── .gitignore
├── package.json
├── server.js
└── README.md
```

---

## 🔐 Security

Sensitive credentials are managed through environment variables and excluded from version control.

```gitignore
.env
node_modules/
uploads/
```

Never commit your Gemini or Qdrant API keys.

---

## 🚀 Future Improvements

* [ ] Semantic / recursive chunking
* [ ] Hybrid search
* [ ] Re-ranking
* [ ] Source citations
* [ ] Authentication & authorization
* [ ] Rate limiting
* [ ] Streaming responses
* [ ] Docker deployment
* [ ] Background document processing

---

## 🎯 Project Goal

This project demonstrates how **backend engineering, vector databases, embeddings, and LLMs** can be combined to build a practical document intelligence system.

```text
Unstructured Documents
        ↓
Semantic Representation
        ↓
Vector Retrieval
        ↓
Context Augmentation
        ↓
LLM Generation
        ↓
Intelligent Response
```

---

## 👨‍💻 Author

### Bhawana Singh

**B.Tech Computer Science Engineering**

`Backend Engineering` • `Data` • `AI` • `System Design`

---

<p align="center">
  ⭐ If you found this project interesting, consider starring the repository.
</p>
