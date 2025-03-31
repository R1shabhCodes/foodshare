import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, AuthErrorCodes } from "firebase/auth";
import { getDatabase, ref, child, get } from 'firebase/database';
import "../css/login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Background elements generation
  useEffect(() => {
    generateBackgroundElements();
  }, []);

  const generateBackgroundElements = () => {
    const backgroundElements = document.createElement('div');
    backgroundElements.id = 'backgroundElements';
    backgroundElements.className = 'background-elements';
    document.querySelector('.loginMain').appendChild(backgroundElements);

    const elementSize = 50;
    const spacing = 20;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const numCols = Math.ceil(screenWidth / (elementSize + spacing)) + 1;
    const numRows = Math.ceil(screenHeight / (elementSize + spacing)) + 1;

    // Placeholder image URLs - replace with your actual paths
    const imageUrls = Array(10).fill().map((_, i) => `/static/Images/login:signup/bg-elements/${i+1}.png`);

    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        const element = document.createElement('div');
        element.classList.add('bg-element');
        element.style.top = `${(row * (elementSize + spacing))}px`;
        element.style.left = `${(col * (elementSize + spacing))}px`;
        element.style.animationDelay = `${Math.random() * 5}s`;
        const imageIndex = (row + col) % imageUrls.length;
        element.style.backgroundImage = `url('${imageUrls[imageIndex]}')`;
        backgroundElements.appendChild(element);
      }
    }
  };

  const loginWithGoogle = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      window.localStorage.setItem("user", JSON.stringify(user));
      console.log(user);

      const dbRef = ref(getDatabase(), `users/${user.uid}`);
      const snapshot = await get(dbRef);

      if (snapshot.exists()) {
        console.log(snapshot.val());
        navigate("/dashboard");
      } else {
        console.log("No data available");
        navigate("/personal-info");
      }
    } catch (error) {
      console.error("Error during Google login:", error);
      // Handle error gracefully and show user-friendly message
      navigate('/register');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const auth = getAuth();
    const email = formData.email;
    const password = formData.password;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        if (user.password !== password) {
          console.log("User not found. Redirecting to register route...");
        }
        window.localStorage.setItem("user", JSON.stringify(user));
        navigate("/dashboard");
      })
      .catch((err) => {
        if (
          err.code === AuthErrorCodes.INVALID_PASSWORD ||
          err.code === AuthErrorCodes.USER_DELETED
        ) {
          setError("The email address or password is incorrect");
          navigate("/register");
        } else {
          console.log(err.code);
          alert(err.code);
        }
      });
  };

  const switchToSignup = () => {
    navigate("/register");
  };

  return (
    <div className="loginMain">
      <div className="container">
        {/* Image Section */}
        <div className="image-section">
          <img src="/static/Images/login:signup/default.png" alt="Default Image" className="active" />
          <img src="/static/Images/login:signup/donor.png" alt="Donor Image" />
          <img src="/static/Images/login:signup/recipient.png" alt="Recipient Image" />
          <img src="/static/Images/login:signup/volunteer.png" alt="Volunteer Image" />
        </div>

        {/* Auth Container */}
        <div className="auth-container">
          <div className="login-form show">
            <h2>Welcome Back!</h2>
            <p>Login to continue to FoodShare.</p>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="loginEmail">Email</label>
                <input 
                  type="email" 
                  id="loginEmail" 
                  name="email"
                  placeholder="Enter your email" 
                  onChange={handleInputChange}
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="loginPassword">Password</label>
                <input 
                  type="password" 
                  id="loginPassword" 
                  name="password"
                  placeholder="Enter your password" 
                  onChange={handleInputChange}
                  required 
                />
              </div>
              <button type="submit" className="auth-btn">Login</button>
              {error && <div className="error">{error}</div>}
            </form>
            <div className="google-login">
              <button onClick={loginWithGoogle} className="google-btn">
                <i className="fa fa-google"></i> Sign in with Google
              </button>
            </div>
            <p className="toggle-link">
              Don't have an account? <a href="#" onClick={switchToSignup}>Sign Up</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;