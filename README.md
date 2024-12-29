# LexArb

AI-powered arbitration case management platform with document analysis and award drafting assistance.

## Features

- Intelligent Case Filing
- Automated Document Organization
- Smart Notifications and Scheduling
- Real-Time Collaboration
- AI-Assisted Document Review
- Award Creation Assistance
- Metadata Analysis & Document Integrity Verification

## Tech Stack

### Frontend
- React + Vite
- TypeScript
- Tailwind CSS
- shadcn/ui Components
- React Query

### Backend
- Python FastAPI
- SQLAlchemy
- Ollama for AI Tasks
- JWT Authentication
- Email Automation

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- PostgreSQL
- Docker (optional)

### Development Setup

1. Clone the repository:
```bash
git clone https://github.com/jreyes-beyond/lexarb.git
cd lexarb
```

2. Frontend setup:
```bash
cd frontend
npm install
npm run dev
```

3. Backend setup:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.