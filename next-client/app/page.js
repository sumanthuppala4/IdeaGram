import Link from "next/link";

export default function Home() {
  return (
    <div className="app-container">
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>Habits Challenge Platform </h1>
        <p>Track your daily habits and compete with friends!</p>
        <div style={{ marginTop: "30px" ,border:"1px solid red" }}>
          <Link href="/login">
            <button style={{ marginRight: "10px", padding: "10px 20px" }}>
              Login
            </button>
          </Link>
          <Link href="/signup">
            <button style={{ padding: "10px 20px", border: "1px solid #ccc" }}>Sign Up</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
