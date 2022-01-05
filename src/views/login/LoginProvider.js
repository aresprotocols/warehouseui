import config from "../../Config";
import Md5 from "js-md5";

const localStorageKey = "__auth_provider_token__";

export const getToken = () => window.localStorage.getItem(localStorageKey);

export const handleUserResponse = (user) => {
  window.localStorage.setItem(localStorageKey, user.data || "");
  return user;
};

export const login = (username, password) => {
  const data = {
    user: username,
    password: Md5(password),
  };
  return fetch(config.rootAPIURL + config.auth, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then(async (res) => {
    if (res.ok) {
      return handleUserResponse(await res.json());
    } else {
      return Promise.reject("login error");
    }
  });
};
