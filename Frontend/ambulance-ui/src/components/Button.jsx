export default function Button({
  children,
  type = "button",
  variant = "primary",
  loading = false,
  disabled = false,
  onClick,
}) {
  const buttonClass = ["btn", `btn-${variant}`, "btn-block", "btn-large"].join(" ");

  return (
    <button type={type} className={buttonClass} disabled={disabled || loading} onClick={onClick}>
      {loading ? (
        <>
          <span className="spinner-small"></span>
          {children}
        </>
      ) : (
        children
      )}
    </button>
  );
}
