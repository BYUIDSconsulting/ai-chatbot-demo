document.addEventListener("DOMContentLoaded", () => {
  const responseDiv = document.getElementById("response");
  const prevChatDiv = document.getElementById("prevChat");
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
    prevChatDiv.innerHTML += `<p>${input}</p>`;

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
        responseDiv.innerHTML += `<p>${data.response}</p>`;
      } else {
        responseDiv.innerText = "Error: Unable to fetch response.";
      }
    } catch (error) {
      console.error("Error:", error);
      responseDiv.innerText = "Error: Unable to fetch response.";
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
  uploadButton.addEventListener("click", async () => {
    if (fileInput.files.length === 0) {
      alert("Please select a file to upload.");
      return;
    }

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
