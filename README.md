# Audiobook E-commerce System Design

In this README, I’ve outlined two implementation approaches: the current solution and an alternative designed with high scalability in mind.

## Current Implementation (MVP/Monolithic)

### Architecture Overview
<img width="686" height="484" alt="Screenshot 2568-09-21 at 23 26 24" src="https://github.com/user-attachments/assets/f0cf804d-a5f0-4b16-80f6-fbee96ca27f4" />


### Technology Stack of MVP

**Frontend (NextJS)**
- **Framework**: Next.js 15+ with App Router
- **Authentication**: Clerk React SDK
- **Styling**: Tailwind CSS
- **State Management**: React Query + Zustand
- **File Upload**: Direct to Digital Ocean Spaces with signed URLs

**Backend (Single Service)**
- **Runtime**: Python 3.11+
- **Framework**: FastAPI
- **Database**: PostgreSQL with SQLAlchemy ORM, Alembic Migration
- **Queue**: Celery with Redis broker
- **File Storage**: boto3 for Digital Ocean Spaces
- **External APIs**: OpenAI Python SDK, Stripe Python SDK

**Infrastructure**
- **Database**: PostgreSQL
- **Cache/Queue**: Redis
- **File Storage**: Digital Ocean Spaces
- **Deployment**: Docker containers

### Authentication
For the MVP I decided to use clerk as the identity provide, which allows the user to signup with email & password and add google auth or any social media authentication easily possible. Though using clerk as identity provider for a public website like e-commerce store will be costly decision. I used it since its easier to integrate clerk as identity provider (For demo purpose only). For a production environment I would rather choose some cheaper options like AWS cognito, Supabase Auth or even go with KeyClock (Open source) solution as these providers allow more MAU (Monthly active users).

By choosing an Identity provider, I don't need to handle user's creditentals by myself and it also allows me to add social login and Two factor authentication easily to the system.

### File Upload
For the MVP, I decided to use Digital Ocean space, since its cheaper. For the production version I would rather choose AWS S3 bucket or Google Cloud Storage, I would add a CDN layer on top the storage solution since this allows users to load the assets faster from the edge location.

Also, The file upload happens in two steps where frontend request for a pre-signed url from the backend and using the credentials provided by backend, frontend will upload the assets directly to the digital ocean (or equivalent solution). This approach allows to reduces the load on backend service since frontend directly upload the asset to the storage solution. Once uploaded Frontend will inform the backend that the file is uploaded in xyz location (or bucket)

Traditional approach
Frontend => Backend => Storage solution

My approach
Frontend <=> Backend
Frontend => Storage solution
Frontend => Backend (Starts the transcription process)

### Transcription
Once the file is uploaded directly by Frontend, Frontend informs the backend that the file is uploaded in xyz location, Backend then start the transcription via a background task. It uses Open AI's Whisper Model to generate text from the Audio file, Allowing us to generate the transcription and summary.

There are other alternatives to Open AI's Whisper model, I decided to use Open AI's Whisper as it highly accurate. For a highly scalable solution I would rather store the text in Elastic Search or Open Search allow users to have a better search capabilities.

### Data Flow

**Upload & Transcription Flow:**
```
1. Admin uploads audio file → Direct to DO Spaces via signed URL
2. Frontend notifies FastAPI backend → Creates transcription record
3. Celery task triggered → Downloads file from DO Spaces
4. OpenAI Whisper API call → Transcription processing
5. AI Summary generated → GPT API call via OpenAI SDK using Whisper Model
6. Database updated via SQLAlchemy → Status: completed
```

**Customer Purchase Flow:**
```
1. Browse audiobooks → NextJS with FastAPI data fetching
2. Add to cart → React state + FastAPI endpoints
3. Checkout → Stripe integration via FastAPI
4. Payment webhook → FastAPI processes Stripe events
5. Order created → SQLAlchemy transactions
6. Library updated → Signed download URLs generated
```

## Future Implementation for High scalability (Microservices)

### High-Level Architecture
```
                           ┌─────────────────────────────────┐
                           │        Load Balancer            │
                           │         (NGINX/ALB)             │
                           └─────────────┬───────────────────┘
                                         │
                    ┌────────────────────┼────────────────────┐
                    │                    │                    │
              ┌─────▼──────┐    ┌────────▼────────┐    ┌─────▼──────┐
              │  Store     │    │     Admin       │    │   Mobile   │
              │ Frontend   │    │   Frontend      │    │    App     │
              │ (NextJS)   │    │   (NextJS)      │    │ (React N.) │
              └─────┬──────┘    └────────┬────────┘    └─────┬──────┘
                    │                    │                   │
                    └────────────────────┼───────────────────┘
                                         │
                           ┌─────────────▼───────────────┐
                           │       API Gateway           │
                           │     (Kong/AWS Gateway)      │
                           │                             │
                           │ • Authentication            │
                           │ • Rate Limiting             │
                           │ • Request Routing           │
                           │ • Load Balancing            │
                           └─────────────┬───────────────┘
                                         │
        ┌────────────────────────────────┼────────────────────────────────┐
        │                               │                                │
   ┌────▼────┐  ┌────▼────┐  ┌────▼────┐  ┌────▼────┐  ┌────▼────┐  ┌────▼────┐
   │Product  │  │Cart     │  │Order    │  │Payment  │  │Transc.  │  │Notif.   │
   │Service  │  │Service  │  │Service  │  │Service  │  │Service  │  │Service  │
   └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘
        │            │            │            │            │            │
   ┌────▼────┐  ┌────▼────┐  ┌────▼────┐  ┌────▼────┐  ┌────▼────┐  ┌────▼────┐
   │Product  │  │Cart     │  │Order    │  │Payment  │  │File     │  │Queue    │
   │   DB    │  │  Cache  │  │   DB    │  │Provider │  │Storage  │  │System   │
   │(Elastic)│  │(Redis)  │  │(Postgres│  │(Stripe) │  │(DO/S3)  │  │(RabbitMQ│
   └─────────┘  └─────────┘  └─────────┘  └─────────┘  └─────────┘  └─────────┘
```

### Microservices Breakdown

#### 1. Product Service
**Technology**: FastAPI + Elasticsearch + PostgreSQL
**Responsibilities**:
- Audiobook catalog management
- Search and filtering (Elasticsearch)
- Category management
- Author/narrator data
- Metadata and AI summaries

**API Endpoints**:
```python
GET /api/v1/audiobooks - Search and filter audiobooks
GET /api/v1/audiobooks/{id} - Get audiobook details
POST /api/v1/audiobooks - Create audiobook (admin)
PUT /api/v1/audiobooks/{id} - Update audiobook (admin)
GET /api/v1/categories - Get categories
GET /api/v1/search - Advanced search with Elasticsearch
```

**Database**: 
- Primary: PostgreSQL (audiobooks, categories, audio_files)
- Search: Elasticsearch cluster
- Cache: Redis for frequently accessed data

#### 2. Cart Service
**Technology**: FastAPI + Redis + PostgreSQL
**Responsibilities**:
- Shopping cart management
- Session handling for guest users
- Cart persistence and synchronization
- Price validation

**API Endpoints**:
```python
GET /api/v1/cart - Get user's cart
POST /api/v1/cart/items - Add item to cart
PUT /api/v1/cart/items/{id} - Update cart item
DELETE /api/v1/cart/items/{id} - Remove from cart
POST /api/v1/cart/clear - Clear cart
```

**Storage**:
- Primary: Redis (fast cart operations)
- Backup: PostgreSQL (cart_items table)

#### 3. Order Service
**Technology**: FastAPI + PostgreSQL + Event Streaming
**Responsibilities**:
- Order processing and management
- Order history and tracking
- Integration with payment service
- User library management after purchase

**API Endpoints**:
```python
POST /api/v1/orders - Create order
GET /api/v1/orders - Get user orders
GET /api/v1/orders/{id} - Get order details
PUT /api/v1/orders/{id}/status - Update order status
GET /api/v1/library - Get user's purchased audiobooks
```

#### 4. Payment Service
**Technology**: FastAPI + Stripe + PostgreSQL
**Responsibilities**:
- Payment processing with Stripe
- Webhook handling for payment events
- Refund processing
- Payment method management

**API Endpoints**:
```python
POST /api/v1/payments/intent - Create payment intent
POST /api/v1/payments/confirm - Confirm payment
POST /api/v1/payments/refund - Process refund
POST /api/v1/webhooks/stripe - Handle Stripe webhooks
```

#### 5. Transcription Service
**Technology**: FastAPI + Celery + OpenAI + File Storage
**Responsibilities**:
- Audio file transcription using Whisper
- AI summary generation
- Background job processing
- File management and cleanup

**API Endpoints**:
```python
POST /api/v1/transcription/start - Start transcription job
GET /api/v1/transcription/{job_id}/status - Get job status
GET /api/v1/transcription/{audiobook_id} - Get transcription
POST /api/v1/ai/summary - Generate AI summary
```

**Processing Pipeline**:
```python
# Celery Tasks
@celery.task
def process_audio_transcription(audio_file_id):
    # Download from DO Spaces
    # Call OpenAI Whisper API
    # Store transcription
    # Trigger AI summary generation
    
@celery.task
def generate_ai_summary(audiobook_id):
    # Get transcription
    # Call OpenAI GPT API
    # Update audiobook summary
```

#### 6. Notification Service
**Technology**: FastAPI + WebSockets + Email Provider
**Responsibilities**:
- Real-time notifications (WebSocket)
- Email notifications
- Push notifications for mobile
- Admin alerts and monitoring

#### 7. User Service
**Technology**: FastAPI + PostgreSQL + Clerk Integration
**Responsibilities**:
- User profile management
- Role-based access control
- User preferences and settings
- Integration with Clerk authentication

### Inter-Service Communication

**Synchronous Communication (REST)**:
- Direct API calls for immediate data needs
- Circuit breaker pattern for resilience
- API Gateway handles routing and authentication

**Asynchronous Communication (Events)**:
```python
# Event-driven architecture using RabbitMQ/Apache Kafka

# Events Examples:
AudiobookCreated → Triggers indexing in Elasticsearch
OrderCompleted → Updates user library + sends notifications
PaymentProcessed → Updates order status + triggers fulfillment
TranscriptionCompleted → Updates audiobook status + notifies admin
```

### Data Strategy

**Database per Service**:
- **Product Service**: PostgreSQL + Elasticsearch
- **Cart Service**: Redis + PostgreSQL (backup)
- **Order Service**: PostgreSQL (ACID compliance)
- **Payment Service**: PostgreSQL (audit trail)
- **User Service**: PostgreSQL (profile data)
- **Transcription Service**: PostgreSQL + File Storage metadata

**Shared Data Challenges**:
```python
# User data synchronization via events
class UserProfileUpdated(Event):
    user_id: str
    email: str
    role: str
    
# Product data consistency
class AudiobookUpdated(Event):
    audiobook_id: str
    title: str
    price_cents: int
    status: str
```

### Technology Stack Comparison

| Component | Current (Monolith) | Future (Microservices) |
|-----------|-------------------|------------------------|
| Backend | FastAPI (Single) | FastAPI (Multiple) |
| Database | PostgreSQL (Single) | PostgreSQL + Elasticsearch + Redis |
| Queue | Celery + Redis | Celery + RabbitMQ/Kafka |
| Frontend | NextJS (Single) | Micro-frontends (Multiple NextJS) |
| Authentication | Clerk Direct | Clerk + API Gateway |
| File Storage | DO Spaces Direct | DO Spaces + CDN |
| Monitoring | Basic logging | APM + Distributed tracing |

### Migration Strategy

**Phase 1: Extract Read-Heavy Services**
- Extract Product Service with Elasticsearch
- Implement API Gateway
- Migrate search functionality

**Phase 2: Extract Stateless Services**
- Extract Transcription Service
- Extract Notification Service
- Implement event streaming

**Phase 3: Extract Stateful Services**
- Extract Cart Service
- Extract Order Service
- Extract Payment Service

**Phase 4: Micro-frontend Implementation**
- Split admin and customer frontends
- Implement micro-frontend architecture
- Mobile app development
