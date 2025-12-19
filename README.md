🎓 AI-Based Student Dropout Prediction System (MERN)

An intelligent full-stack MERN application that predicts student dropout risk using academic and behavioral data.
The system helps institutions, mentors, and administrators identify at-risk students early and take preventive actions.

🚀 Features
👨‍🎓 Student Module

Secure authentication (JWT)

Student profile management

View attendance, performance, and risk status

Personalized dashboard with analytics

👨‍🏫 Mentor Module

View assigned students

Analyze student performance & risk levels

Book and manage counseling sessions

Track prediction history

🧑‍💼 Admin Module

Manage users (students, mentors)

View overall system statistics

Monitor dropout risk distribution

Secure role-based access control

🧠 Dropout Prediction Logic

Risk calculated using academic indicators such as:

Attendance

Academic performance

Historical data

Rule-based risk engine (extensible to ML models)

🛠 Tech Stack
Frontend

⚛️ React.js (Vite)

🎨 Tailwind CSS

📊 Chart.js / Recharts

🔐 Context API for authentication

🌐 Axios for API communication

Backend

🟢 Node.js

🚀 Express.js

🛢 MongoDB (Mongoose)

🔐 JWT Authentication

🧩 Role-based middleware

📂 Project Structure
project-dropout-patched/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── index.html
│   └── package.json
│
├── .gitignore
└── README.md

⚙️ Installation & Setup
1️⃣ Clone Repository
git clone https://github.com/aamirgada/project-dropout-patched.git
cd project-dropout-patched

2️⃣ Backend Setup
cd backend
npm install


Create a .env file inside backend/:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key


Run backend:

npm run dev

3️⃣ Frontend Setup
cd frontend
npm install
npm run dev


Frontend runs on:

http://localhost:5173


Backend runs on:

http://localhost:5000

🔐 Environment Variables
Variable	Description
PORT	Backend server port
MONGO_URI	MongoDB connection string
JWT_SECRET	JWT authentication secret

⚠️ .env file is intentionally excluded from GitHub for security.

📸 Screenshots (Optional)

Add screenshots of dashboards here for better presentation.

🌍 Future Enhancements

Machine Learning–based prediction model

Email/SMS alerts for high-risk students

CSV export for reports

Advanced analytics dashboard

Cloud deployment (Vercel + Render)

👨‍💻 Author

Mohd Aamir
📌 Full-Stack MERN Developer
🔗 GitHub: https://github.com/aamirgada

⭐ Show Your Support

If you like this project:

⭐ Star the repository

🍴 Fork it

🧠 Use it for learning or enhancement
