function loggedInOrNot() {
  // NOTE: This means The refresh token has not expired yet
  const accessToken = localStorage.getItem("auth_token");
  if (accessToken) {
    const parsedJwt = parseJwt(accessToken);
    if (parsedJwt.invalid) {
      localStorage.removeItem("auth_Token");
      return false;
    } else if ("sub" in parsedJwt) {
      return parsedJwt.sub;
    }
  }
}

/**
 *
 * Parses Jwt. **Doesn't throw any exception**
 * @param {string} token
 * @returns {object}
 */
function parseJwt(token) {
  try {
    const baseSplit = token.split(".");
    if (baseSplit.length !== 3) throw new Error("Token has been tampered");
    const base64 = baseSplit[1].replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    let parsedJwt = JSON.parse(jsonPayload);
    if (Date.now() > parsedJwt.exp * 1000) {
      throw new Error("Token expired");
    }

    return { ...parsedJwt, invalid: false };
  } catch {
    return { invalid: true };
  }
}

function getDate(date) {
  const d = new Date(date);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

function parseSlug(slug) {
  // add space for - in slug
  return slug.split("-").join(" ");
  // for capitalizing first letter of each word, use css capitalization
}

export { loggedInOrNot, parseJwt, getDate, parseSlug };
