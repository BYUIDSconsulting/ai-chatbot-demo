document.addEventListener("DOMContentLoaded", () => {
  const chatDiv = document.getElementById("chatContainer");
  const userInput = document.getElementById("userInput");
  const submitButton = document.getElementById("submitButton");
  const fileInput = document.getElementById("fileInput");
  const uploadButton = document.getElementById("uploadButton");

  async function sendMessage() {
    const input = userInput.value.trim(); // Get input value inside function

    if (input === "") {
      return;
    }

    // Display the user's input
    chatDiv.innerHTML += `
    <div id="userInput">
    <p>${input}</p>
    </div>`;

    // Clear the input field
    userInput.value = "";

    try {
      // Send input to the backend
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      // Display the response
      if (data.response) {
        console.log(data.response);
        chatDiv.innerHTML += `<div id="aiResponse">${data.response}</div>`;
      } else {
        chatDiv.innerText = "Error: Unable to fetch response.";
      }
    } catch (error) {
      console.error("Error:", error);
      chatDiv.innerText = "Error: Unable to fetch response.";
    }
  }

  // Handle Enter key press
  userInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  });

  // Handle button click
  submitButton.addEventListener("click", () => {
    sendMessage();
  });

  // Handle file upload button click
  uploadButton.addEventListener("click", () => {
    fileInput.click(); // Simulates a click on the hidden input
});

fileInput.addEventListener("change", async () => {
    if (fileInput.files.length === 0) return; // No file selected

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            alert("File uploaded successfully!");
        } else {
            alert("Error uploading file.");
        }
    } catch (error) {
        console.error("File upload error:", error);
        alert("Error uploading file.");
    }
});
});
