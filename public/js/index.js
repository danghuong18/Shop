$("#logout").on("click", async () => {
  try {
    const res = await $.ajax({
      url: "/user/logout",
      type: "POST",
    });
    if (res.status === 200) {
      delete_cookie("cookie");
      window.location.href = "/";
    }
  } catch (error) {
    console.log(error);
  }
});

function delete_cookie(name) {
  document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}
