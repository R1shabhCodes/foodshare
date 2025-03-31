import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword } from "firebase/auth";
import "../css/login.css"; // We'll keep the same CSS file path

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [showRoleSelection, setShowRoleSelection] = useState(false);
    const [selectedRole, setSelectedRole] = useState("");
    const [activeImage, setActiveImage] = useState("default");
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const auth = getAuth();
        const email = formData.email;
        const password = formData.password;

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            // Store user data with selected role
            window.localStorage.setItem("user", JSON.stringify({
                ...user,
                role: selectedRole,
                name: formData.name
            }));
            navigate("/personal-info");
        } catch (err) {
            console.log(err.code);
            console.log(err.message);
            setError(err.message);
        }
    };

    const loginWithGoogle = () => {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const user = result.user;
                window.localStorage.setItem("user", JSON.stringify({
                    ...user,
                    role: selectedRole || "user"
                }));
                navigate('/dashboard');
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                setError(errorMessage);
            });
    };

    const switchToLogin = () => {
        navigate("/login");
    };

    const selectRole = (role) => {
        setSelectedRole(role);
        setActiveImage(role);
        setShowRoleSelection(false);
    };

    // Generate background elements
    useEffect(() => {
        const createBackgroundElements = () => {
            const backgroundElements = document.createElement('div');
            backgroundElements.id = 'backgroundElements';
            backgroundElements.className = 'background-elements';
            document.body.appendChild(backgroundElements);

            const elementSize = 50;
            const spacing = 20;
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;
            const numCols = Math.ceil(screenWidth / (elementSize + spacing)) + 1;
            const numRows = Math.ceil(screenHeight / (elementSize + spacing)) + 1;

            // Array of image URLs - update with your actual paths
            const imageUrls = [
                '/static/Images/login:signup/bg-elements/1.png',
                '/static/Images/login:signup/bg-elements/2.png',
                '/static/Images/login:signup/bg-elements/3.png',
                '/static/Images/login:signup/bg-elements/4.png',
                '/static/Images/login:signup/bg-elements/5.png',
                '/static/Images/login:signup/bg-elements/6.png',
                '/static/Images/login:signup/bg-elements/7.png',
                '/static/Images/login:signup/bg-elements/8.png',
                '/static/Images/login:signup/bg-elements/9.png',
                '/static/Images/login:signup/bg-elements/10.png',
            ];

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

        // Create background elements on component mount
        createBackgroundElements();

        // Clean up on component unmount
        return () => {
            const backgroundElements = document.getElementById('backgroundElements');
            if (backgroundElements) {
                backgroundElements.remove();
            }
        };
    }, []);

    return (
        <div className="container">
            {/* Image Section */}
            <div className="image-section">
                <img src="/static/Images/login:signup/default.png" alt="Default Image" className={activeImage === "default" ? "active" : ""} />
                <img src="/static/Images/login:signup/donor.png" alt="Donor Image" className={activeImage === "donor" ? "active" : ""} />
                <img src="/static/Images/login:signup/recipient.png" alt="Recipient Image" className={activeImage === "recipient" ? "active" : ""} />
                <img src="/static/Images/login:signup/volunteer.png" alt="Volunteer Image" className={activeImage === "volunteer" ? "active" : ""} />
            </div>

            {/* Auth Container */}
            <div className="auth-container">
                {/* Role Selection */}
                {showRoleSelection && (
                    <div className="role-selection show">
                        <h2>Choose Your Role</h2>
                        <p>Select your role to get started.</p>
                        <div className="role-buttons">
                            <div className="role-button" onClick={() => selectRole("donor")}>Donor</div>
                            <div className="role-button" onClick={() => selectRole("recipient")}>Recipient</div>
                            <div className="role-button" onClick={() => selectRole("volunteer")}>Volunteer</div>
                        </div>
                    </div>
                )}

                {/* Signup Form */}
                {!showRoleSelection && (
                    <div className="signup-form show">
                        <h2>Create an Account</h2>
                        <p>Join FoodShare to reduce food waste and help communities.</p>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="signupName">Full Name</label>
                                <input 
                                    type="text" 
                                    id="signupName" 
                                    name="name"
                                    placeholder="Enter your full name" 
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="signupEmail">Email</label>
                                <input 
                                    type="email" 
                                    id="signupEmail" 
                                    name="email"
                                    placeholder="Enter your email" 
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="signupPassword">Password</label>
                                <input 
                                    type="password" 
                                    id="signupPassword" 
                                    name="password"
                                    placeholder="Create a password" 
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <input 
                                    type="password" 
                                    id="confirmPassword" 
                                    name="confirmPassword"
                                    placeholder="Confirm your password" 
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    required 
                                />
                            </div>
                            <button type="submit" className="auth-btn">Sign Up</button>
                            
                            {error && <div className="error">{error}</div>}
                            
                            <div className="google-signup">
                                <button type="button" onClick={loginWithGoogle} className="google-btn">
                                    <i className="fa fa-google"></i> Sign in with Google
                                </button>
                            </div>
                        </form>
                        <p className="toggle-link">Already have an account? <a href="#" onClick={switchToLogin}>Login</a></p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Register;