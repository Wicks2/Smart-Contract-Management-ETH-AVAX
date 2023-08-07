import { useState, useEffect } from "react";
import { ethers } from "ethers";
// import "../App.css"
import AssessmentABI from "../artifacts/contracts/Assessment.sol/Assessment.json";

const greeterAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export default function HomePage() {
  // Property Variables

  const [message, setMessage] = useState("");
  const [currentGreeting, setCurrentGreeting] = useState("");

  // Requests access to the user's Meta Mask Account
  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  // Fetches the current value store in greeting
  async function fetchGreeting() {
    // If MetaMask exists
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        greeterAddress,
        AssessmentABI.abi,
        provider
      );
      try {
        const data = await contract.greet();
        console.log("data: ", data);
        setCurrentGreeting(data);
      } catch (error) {
        console.log("Error: ", error);
      }
    }
  }

  // Sets the greeting from input text box
  async function setGreeting() {
    if (!message) return;
  
    // If MetaMask exists
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        greeterAddress,
        AssessmentABI.abi,
        signer
      );
  
      try {
        const transaction = await contract.setGreeting(message);
        setMessage("");
        await transaction.wait();
        fetchGreeting();
      } catch (error) {
        console.log(error.message);
      }
    }
  }
  
  
  

  return (
    <div className="App" style={{
      backgroundColor:"pink",
      borderRadius:"20px",
      display:"flex",
      alignItems:"center",
      justifyContent: "center",
      height:"100vh",
      maxHeight: "100vh",
      padding: "10px"
    }}>
      <div className="App-header">
        {/* DESCRIPTION  */}
        <div className="description">
          <h1>Assessment</h1>
          <h3>Smart Contract Management-ETH-AVX Project</h3>
        </div>
        {/* BUTTONS - Fetch and Set */}
        <div className="custom-buttons">
          <button onClick={fetchGreeting} style={{ 
            padding:"10px",
            border:"2px black solid",
            borderRadius:"999px",
            marginBottom:"30px",
            marginRight:"10px",
            color:"black"
            }}>
            Fetch Greeting
          </button>
          <button onClick={setGreeting} style={{ 
            backgroundColor: "black",
            padding:"10px",
            borderRadius:"999px",
            marginBottom:"30px",
            marginRight:"10px" ,
            color:"white"
            }}>
            Set Greeting
          </button>
        </div>
        {/* INPUT TEXT - String  */}
        <input
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          placeholder="Set Greeting Message"
          style={{
            padding:"10px",
            borderRadius:"20px",
            width:"320px"
          }}
        />

        {/* Current Value stored on Blockchain */}
        <h2 className="greeting" style={{
          padding:"20px",
          backgroundColor: "yellow",
          border: "2px solid gray",
          borderRadius:"9999px"
        }}>Greeting: {currentGreeting}</h2>
      </div>
    </div>
  );
}
