import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./routes/Home/home";
import About from "./routes/About/about";
import Book from "./routes/Book/book";
import SingleBook from "./routes/Book/singleBook";
import CreateBook from "./routes/Book/createBook";
import EditBook from "./routes/Book/editBook";
import Login from "./routes/Auth/Login";
import Signup from "./routes/Auth/Signup";
import Header from "./components/Header";
import Footer from "./components/Footer";




function App() {

  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element= { <Home/> }/>
          <Route path="/about" element= { <About/> }/>
          <Route path="/books" element= { <Book/> }/>
          <Route path="/books/:slug" element= { <SingleBook/> }/>
          <Route path="/login" element= { <Login/> }/>
          <Route path="/signup" element= { <Signup/> }/>
          <Route path="/createbook/" element= { 
            <ProtectedRoute>
              <CreateBook/>
            </ProtectedRoute>
          }/>
          <Route path="/editbook/:slug" element= { 
            <ProtectedRoute>
              <EditBook/>
            </ProtectedRoute>
          }/>
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  )
}

export default App
