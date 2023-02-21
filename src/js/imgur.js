async function imgur(imgs) {
  let url;
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Client-ID 662eeb04642a3c2");

  var formdata = new FormData();
  formdata.append("image", imgs);

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: formdata,
    redirect: "follow",
  };

  await fetch("https://api.imgur.com/3/image", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      url = result.data.link;
    })
    .catch((error) => {
      url = "lol";
    });
  return url;
}
export default imgur;
