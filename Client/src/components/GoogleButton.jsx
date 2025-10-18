const API_BASE = "http://localhost:5000/";

const GoogleButton = () => {
  // Google Sign-in handler
  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE}auth/google`;
  };

  return (
    <>
      <button onClick={handleGoogleLogin} className="google-btn">
        <img
          src="https://developers.google.com/identity/images/g-logo.png"
          alt="Google"
          style={{ width: 20, marginRight: 8, color: "black" }}
        />
        Sign up / Sign in with Google
      </button>
    </>
  );
};

export default GoogleButton;
