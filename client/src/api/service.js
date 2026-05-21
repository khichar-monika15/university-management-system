export async function fetchResponse(url, type, bodyData) {
  let options;
  switch (type) {
    case 0:
      options = {
        method: "GET",
      };
      break;
    case 1:
      options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      };
      break;
    case 2:
      options = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      };
      break;
    case 3:
      options = {
        method: "DELETE",
      };
      break;
    case 4:
      options = {
        method: "POST",
        body: bodyData,
      };
      break;
    case 5:
      options = {
        method: "PUT",
        body: bodyData,
      };
      break;
    default:
      return;
  }
  try {
    const res = await fetch(url, options);
    const jsonData = await res.json();
    return jsonData;
  } catch (error) {
    throw error;
  }
}
