export const showToast = (message, type = "success") => {
  window.dispatchEvent(
    new CustomEvent("smart-ambulance-toast", {
      detail: { message, type },
    })
  );
};
