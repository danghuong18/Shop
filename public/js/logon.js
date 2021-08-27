$("#logon").on("click", async () => {
  try {
    const gender = $("#male").prop("checked") ? "male" : "female";
    const res = await $.ajax({
      url: "/user",
      type: "POST",
      data: {
        username: $("#username").val(),
        password: $("#password").val(),
        phone: $("#phone").val(),
        email: $("#email").val(),
        fullName: $("#fullName").val(),
        gender: gender,
      },
    });
    $(".noti").html(res.mess);
  } catch (error) {
    console.log(error);
  }
});
