const form = document.getElementById("buildForm");
const result = document.getElementById("result");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  result.textContent = "Sedang diproses...";

  const formData = new FormData(form);

  try {
    const response = await fetch("/api/build", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (response.status === 200) {
      result.innerHTML = `
        <strong>${data.message}</strong>
        <br><br>
        File: ${data.filename}
      `;

      return;
    }

    if (response.status === 403) {
      result.innerHTML = `
        <strong>Error 403</strong>
        <br><br>
        ${data.errors.join("<br>")}
      `;

      return;
    }

    result.textContent =
      data.message || "Terjadi kesalahan.";

  } catch (error) {
    result.textContent =
      "Tidak dapat terhubung ke server.";
  }
});
