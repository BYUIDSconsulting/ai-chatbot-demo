

const responseDiv = document.getElementById("response");
const prevChatDiv = document.getElementById("prevChat");

submitButton.addEventListener("click", async () => {
  const input = userInput.value.trim();

//   console.log(input);

  if (input === "") {
    return;
  }

  // Display the user's input
  prevChatDiv.innerHTML = `<p>${input}</p>`;

  // Clear the input field
  userInput.value = "";

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
    responseDiv.innerHTML = `${data.response}`;
  } else {
    responseDiv.innerText = "Error: Unable to fetch response.";
  }
});
