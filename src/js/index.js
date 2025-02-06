document.addEventListener("DOMContentLoaded", () => {
  const chatDiv = document.getElementById("chatContainer");
  const userInput = document.getElementById("userInput");
  const submitButton = document.getElementById("submitButton");
  const fileInput = document.getElementById("fileInput");
  const uploadButton = document.getElementById("uploadButton");
  const sidebar = document.getElementById("sidebar");
  const toggleBtn = document.getElementById("toggleSidebar");
  const modal = document.getElementById("modalButton");
  const modalContent = document.querySelector(".modal");
  const closeModal = document.querySelector(".close");
  const modelSelect = document.getElementById("modelSelect");
  const instructions = document.getElementById("instructions");
  const saveSettings = document.getElementById("saveSettings");

    // Open modal
    modalButton.addEventListener("click", () => {
      modalContent.style.display = "block";
    });
  
    // Close modal when clicking the close button
    closeModal.addEventListener("click", () => {
      modalContent.style.display = "none";
    });
  
    // Close modal when clicking outside of it
    window.addEventListener("click", (event) => {
      if (event.target === modalContent) {
          modalContent.style.display = "none";
      }
    });
  // Load icons
  feather.replace();

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
        // console.log(data.response);
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

saveSettings.addEventListener("click", () => {
  changeModel();
  modalContent.style.display = "none";
  console.log("Settings saved");
});

saveSettings.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        changeModel();
        modalContent.style.display = "none";
    }
});

// Change the Model
  async function changeModel() {
    const modelType = modelSelect.value;
    const instructionsValue = instructions.value;

    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ modelType: modelType, instructions: instructionsValue }),
      });

      if (response.ok) {
        alert("Instructions updated successfully!");
      } else {
        alert("Error updating model.");
      }
    } catch (error) {
      console.error("Instructions error:", error);
      alert("Error changing instructions.");
    }
  
  }
});
