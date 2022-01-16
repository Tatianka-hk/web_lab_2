<script>
  const url = "/api/sendMail";
  let isLoading = false;
  let resultText = "";
  const formData = {};
  const submitHandler = async (event) => {
    isLoading = true;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (result.result.success) {
        resultText = "Your message was successfuly delivered!";
      } else {
        resultText = result.errors.join(";");
      }
    } catch (exception) {
      resultText = exception.message ?? "ERROR";
    } finally {
      isLoading = false;
    }
  };
</script>

<main>
  <h1>FORMA</h1>
  <form onsubmit="">
    <input
      name="email"
      type="email"
      placeholder="Enter your email"
      bind:value={formData.email}
    /><br />
    <input
      name="name"
      placeholder="Enter your name"
      bind:value={formData.name}
    /><br />
    <input
      name="phone_number"
      type="tel"
      placeholder="Enter yourphone number"
      bind:value={formData.tel}
    /><br />
    <button disabled={isLoading} id="button"> Send</button>
    <div class="result">{resultText}</div>
  </form>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
    background-color: rgba(255, 255, 128, 0.5);
    height: 560px;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
