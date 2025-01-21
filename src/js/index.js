

submitButton.addEventListener("click", async () => {
  const input = userInput.value.trim();

//   console.log(input);

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
    responseDiv.innerText = data.response;
  } else {
    responseDiv.innerText = "Error: Unable to fetch response.";
  }
});
