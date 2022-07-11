function isLoggedIn() {
  // NOTE: This means The refresh token has not expired yet
  const accessToken = localStorage.getItem("auth_token");
  if (accessToken) {
    return true;
  } else return false;
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
  if (slug) {
    return slug.split("-").join(" ");
  }
  return "";
  // for capitalizing first letter of each word, use css capitalization
}

function parseArray(list) {
  if (list.length > 0) {
    return list.map((listitem, index) => {
      if (list.length === index + 1) {
        return parseSlug(listitem);
      } else {
        return parseSlug(listitem) + ", ";
      }
    });
  }
  return "";
}

export { isLoggedIn, parseJwt, getDate, parseSlug, parseArray };
export {
  openSuccessNotification,
  openErrorNotification,
} from "./openNotification";
