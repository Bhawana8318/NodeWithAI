# 🧠 Semantic Context Search Engine

### Production-Ready RAG Pipeline for Context-Aware PDF Intelligence

> **Upload a document. Ask a question. Retrieve the right context. Generate an evidence-grounded answer.**

A production-oriented **Retrieval-Augmented Generation (RAG)** backend built with **Node.js, Express, Google Gemini, and Qdrant Cloud**.

The system transforms unstructured PDF documents into searchable semantic knowledge. Instead of sending entire documents to an LLM, it extracts, chunks, embeds, indexes, retrieves, and finally generates answers using only the most relevant context.

---

## ✨ What Makes This Project Different?

Traditional LLM applications often follow this pattern:

```text
PDF → Entire Document → LLM → Answer
```

That approach becomes inefficient as documents grow.

This project introduces a retrieval layer:

```text
PDF
 ↓
Text Extraction
 ↓
Semantic Chunking
 ↓
Vector Embeddings
 ↓
Qdrant Vector Database
 ↓
Similarity Retrieval
 ↓
Relevant Context
 ↓
Gemini LLM
 ↓
Grounded Answer
```

### 🎯 Core Idea

> **Don't give the LLM everything. Give it what matters.**

The architecture separates **document retrieval** from **language generation**, reducing unnecessary context and creating a foundation for scalable document-question answering systems.

---

# 🏗️ System Architecture

```text
                         ┌───────────────────────────┐
                         │        CLIENT             │
                         │                           │
                         │   PDF + User Question     │
                         └─────────────┬─────────────┘
                                       │
                                       │ Multipart/Form-Data
                                       ▼
                         ┌───────────────────────────┐
                         │     EXPRESS SERVER        │
                         │                           │
                         │      API Layer            │
                         └─────────────┬─────────────┘
                                       │
                                       ▼
                         ┌───────────────────────────┐
                         │      MULTER               │
                         │                           │
                         │ Temporary PDF Storage     │
                         └─────────────┬─────────────┘
                                       │
                                       ▼
                         ┌───────────────────────────┐
                         │       PDF-PARSE           │
                         │                           │
                         │  PDF → Raw Text           │
                         └─────────────┬─────────────┘
                                       │
                                       ▼
                         ┌───────────────────────────┐
                         │     TEXT CHUNKING         │
                         │                           │
                         │ Document → Context Chunks │
                         └─────────────┬─────────────┘
                                       │
                                       ▼
                    ┌────────────────────────────────────┐
                    │        GOOGLE GEMINI EMBEDDING     │
                    │                                    │
                    │ Text → 768-Dimensional Vector      │
                    └────────────────┬───────────────────┘
                                     │
                                     ▼
                    ┌────────────────────────────────────┐
                    │          QDRANT CLOUD              │
                    │                                    │
                    │     Vector Storage + Search        │
                    │       Cosine Similarity             │
                    └────────────────┬───────────────────┘
                                     │
                           Top Relevant Chunks
                                     │
                                     ▼
                    ┌────────────────────────────────────┐
                    │         GEMINI 2.5 FLASH           │
                    │                                    │
                    │ Question + Retrieved Context       │
                    └────────────────┬───────────────────┘
                                     │
                                     ▼
                         ┌───────────────────────────┐
                         │       FINAL ANSWER        │
                         │                           │
                         │ Context-Grounded Response │
                         └───────────────────────────┘
```

---

# 🔄 RAG Execution Pipeline

The complete request lifecycle follows six major stages.

### 01 — 📥 Document Ingestion

The client uploads a PDF through a `multipart/form-data` request.

**Multer** intercepts the file and temporarily stores it for processing.

```text
Client
  ↓
PDF Upload
  ↓
Multer
  ↓
Temporary File
```

---

### 02 — 📄 Text Extraction

The temporary PDF is processed using `pdf-parse`.

```text
PDF
 ↓
PDF Parser
 ↓
Raw Text
```

The objective is to convert an unstructured binary document into machine-processable text.

---

### 03 — ✂️ Text Chunking

Large documents are divided into smaller contextual segments.

```text
Large Document
      ↓
Paragraph / Block Separation
      ↓
Chunk 1
Chunk 2
Chunk 3
Chunk 4
...
```

This allows the retrieval system to search for **specific pieces of information** instead of processing the entire document.

---

### 04 — 🧮 Vector Embeddings

Each chunk is converted into a numerical representation using Google's embedding model.

```text
"Revenue increased by 18%"
              ↓
       Embedding Model
              ↓
[0.018, -0.421, 0.193, ...]
```

These vectors represent the semantic meaning of the document chunks.

---

### 05 — 🔎 Semantic Retrieval

Vectors are stored inside **Qdrant Cloud**.

When the user asks a question:

```text
User Question
      ↓
Question Embedding
      ↓
Vector Similarity Search
      ↓
Most Relevant Chunks
```

Qdrant performs similarity-based retrieval using **Cosine Distance**.

---

### 06 — 🤖 Context-Aware Generation

The retrieved document context is combined with the user's question.

```text
User Question
      +
Relevant Document Context
      ↓
   Gemini 2.5 Flash
      ↓
Grounded Answer
```

The model therefore operates on **retrieved evidence** rather than blindly processing the complete document.

---

# 🧩 Technology Stack

| Layer           | Technology                 | Responsibility                     |
| --------------- | -------------------------- | ---------------------------------- |
| Runtime         | **Node.js**                | Asynchronous backend runtime       |
| API             | **Express.js**             | HTTP server and routing            |
| File Upload     | **Multer**                 | Multipart PDF handling             |
| PDF Processing  | **pdf-parse**              | Text extraction                    |
| Embeddings      | **Google Gemini**          | Semantic vector generation         |
| Vector Database | **Qdrant Cloud**           | Vector storage & similarity search |
| LLM             | **Gemini 2.5 Flash**       | Context-aware answer generation    |
| Vector Client   | **@qdrant/js-client-rest** | Qdrant API communication           |
| Configuration   | **dotenv**                 | Environment configuration          |

---

# 🚀 Core Features

### 📄 PDF Intelligence

Process multi-page PDF documents and extract their textual content.

### 🧠 Semantic Search

Retrieve information based on **meaning**, not merely keyword matching.

### 🔢 Vector Embeddings

Represent document chunks as high-dimensional semantic vectors.

### ⚡ Context-Aware Generation

Generate answers using retrieved document context.

### ☁️ Cloud Vector Storage

Persist embeddings using Qdrant Cloud.

### 🔐 Secure Configuration

Sensitive API keys and database credentials are isolated using environment variables.

### 🧹 Temporary File Cleanup

Processed documents are removed from local temporary storage after ingestion.

### 🧩 Modular Backend Architecture

The application separates routing, configuration, processing, and external AI/vector services.

---

# 📁 Project Structure

```text
semantic-context-search/
│
├── src/
│   ├── routes/
│   │   └── app.routes.js
│   │
│   ├── services/
│   │   ├── embedding.service.js
│   │   ├── qdrant.service.js
│   │   └── rag.service.js
│   │
│   ├── controllers/
│   │   └── document.controller.js
│   │
│   ├── config/
│   │   └── env.js
│   │
│   └── app.js
│
├── uploads/
│
├── .env.example
├── .gitignore
├── package.json
├── server.js
└── README.md
```

> The exact structure may vary depending on the current implementation.

---

# 🔌 API Reference

## 1. Create Vector Collection

### `GET /create-collection`

Initializes the Qdrant collection used for storing document embeddings.

### Configuration

```text
Collection: pdf-docs
Distance Metric: Cosine
Vector Size: 768
```

### Example Response

```json
{
  "success": true,
  "message": "Collection created successfully"
}
```

---

# 2. Upload & Query Document

### `POST /upload`

Processes a PDF and answers a question against its content.

### Request

```text
Content-Type: multipart/form-data
```

### Parameters

| Parameter  | Type   | Required | Description                 |
| ---------- | ------ | -------- | --------------------------- |
| `pdf`      | File   | Yes      | PDF document                |
| `question` | String | Yes      | Question about the document |

### Example

```text
POST /upload

pdf       → annual-report.pdf
question  → What was the revenue growth?
```

### Example Response

```json
{
  "success": true,
  "answer": "According to the document, revenue increased by 18%.",
  "retrievedContext": "Section 4 reports an 18% year-over-year improvement in revenue."
}
```

---

# 🔐 Environment Configuration

Create a `.env` file in the project root.

```env
PORT=3000

GEMINI_API_KEY=your_gemini_api_key

QDRANT_URL=https://your-cluster.qdrant.io

QDRANT_API_KEY=your_qdrant_api_key
```

### Recommended `.env.example`

```env
PORT=3000
GEMINI_API_KEY=
QDRANT_URL=
QDRANT_API_KEY=
```

### ⚠️ Security

Never commit your actual `.env` file.

Add it to `.gitignore`:

```gitignore
.env
node_modules/
uploads/
*.log
```

---

# ⚙️ Installation

## 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
```

```bash
cd YOUR_REPOSITORY
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment Variables

```bash
cp .env.example .env
```

Then add your:

* Gemini API key
* Qdrant URL
* Qdrant API key

---

## 4. Start the Server

```bash
node server.js
```

Or, if your project provides a development script:

```bash
npm run dev
```

Expected output:

```text
Server running on port 3000
```

---

# 🧪 Example RAG Workflow

Imagine uploading:

```text
annual-report.pdf
```

And asking:

```text
"What was the company's revenue growth?"
```

The backend performs:

```text
annual-report.pdf
       │
       ▼
   PDF Parsing
       │
       ▼
   Text Chunks
       │
       ▼
    Embeddings
       │
       ▼
 Qdrant Vector Store
       │
       │
       │      User Question
       │           │
       │           ▼
       │      Question Vector
       │           │
       └──────► Similarity Search
                     │
                     ▼
              Relevant Chunks
                     │
                     ▼
               Gemini 2.5 Flash
                     │
                     ▼
              Final Answer
```

---

# 🧠 Why RAG?

A conventional LLM application might send an entire document to the model:

```text
10,000-page document
       ↓
      LLM
       ↓
    Answer
```

The RAG architecture instead retrieves only relevant information:

```text
10,000-page document
       ↓
   Vector Index
       ↓
Relevant 5–10 chunks
       ↓
      LLM
       ↓
    Answer
```

This architecture can help applications:

* reduce unnecessary context
* retrieve relevant information
* work with private documents
* scale document collections
* separate retrieval from generation

---

# 🏛️ Engineering Decisions

## Why Qdrant?

A vector database is required to efficiently store and search high-dimensional embeddings.

Qdrant provides:

* vector indexing
* similarity search
* metadata support
* cloud deployment
* JavaScript/Node.js integration

---

## Why Gemini Embeddings?

The embedding layer converts natural-language document chunks into semantic vector representations that can be compared mathematically.

This creates the bridge between:

```text
Human Language
      ↓
Numerical Representation
      ↓
Similarity Search
```

---

## Why Gemini 2.5 Flash?

The generation layer needs to transform retrieved context into a natural-language response.

The LLM receives:

```text
SYSTEM INSTRUCTIONS
        +
USER QUESTION
        +
RETRIEVED CONTEXT
        ↓
GENERATED RESPONSE
```

---

# 🧹 Stateless Temporary Storage

Uploaded PDFs are processed through temporary local storage.

After processing:

```text
Upload
  ↓
Temporary File
  ↓
Parse
  ↓
Extract Text
  ↓
Generate Embeddings
  ↓
Store Vectors
  ↓
Cleanup
  ↓
Temporary File Removed
```

This prevents processed documents from unnecessarily accumulating in local storage.

---

# 📊 RAG vs Traditional LLM Pipeline

| Traditional LLM                    | This RAG Architecture                        |
| ---------------------------------- | -------------------------------------------- |
| Entire document → LLM              | Document → Vector Store                      |
| Large context                      | Retrieved context                            |
| Keyword/context dependent          | Semantic retrieval                           |
| Poor scalability for large corpora | Designed for searchable document collections |
| Generation-focused                 | Retrieval + generation                       |
| No dedicated knowledge layer       | Dedicated vector knowledge layer             |

---

# 🛡️ Security Considerations

The application follows several basic security principles:

```text
API Credentials
      ↓
Environment Variables
      ↓
.env
      ↓
.gitignore
      ↓
Never committed to Git
```

Recommended production improvements include:

* request validation
* file-type validation
* file-size limits
* authentication
* rate limiting
* structured logging
* centralized error handling
* malware scanning for uploaded files
* secret management through a cloud provider

---

# 📈 Future Engineering Roadmap

### Retrieval

* [ ] Semantic chunking
* [ ] Recursive text splitting
* [ ] Metadata-aware retrieval
* [ ] Hybrid keyword + vector search
* [ ] Re-ranking
* [ ] Top-K retrieval configuration

### AI

* [ ] Streaming responses
* [ ] Citation-aware answers
* [ ] Hallucination evaluation
* [ ] Prompt versioning
* [ ] RAG evaluation pipeline

### Backend

* [ ] Authentication & authorization
* [ ] Rate limiting
* [ ] Request validation
* [ ] Centralized error handling
* [ ] Background document processing
* [ ] Job queues

### Infrastructure

* [ ] Dockerization
* [ ] CI/CD pipeline
* [ ] Production deployment
* [ ] Observability
* [ ] Performance monitoring

---

# 📐 Production Evolution

The current architecture establishes the foundation for a larger document intelligence platform.

A future production architecture could evolve into:

```text
                    ┌───────────────┐
                    │    Client     │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │ API Gateway   │
                    └───────┬───────┘
                            │
             ┌──────────────┴──────────────┐
             ▼                             ▼
      Document Service              Query Service
             │                             │
             ▼                             ▼
       Object Storage                 Retriever
             │                             │
             ▼                             ▼
       Processing Queue              Qdrant Cloud
             │                             │
             ▼                             ▼
        Embedding Service ─────────►  Top-K Context
                                           │
                                           ▼
                                      LLM Service
                                           │
                                           ▼
                                         Answer
```

This creates a natural path from a single-server prototype toward a distributed document intelligence system.

---

# 🎯 Learning Outcomes

Building this project provides practical exposure to:

* REST API development
* Express.js architecture
* asynchronous Node.js programming
* multipart file handling
* PDF processing
* vector embeddings
* vector databases
* semantic search
* Retrieval-Augmented Generation
* LLM orchestration
* environment-based configuration
* cloud AI APIs
* backend system architecture

---

# 🧪 Example Use Cases

The architect
