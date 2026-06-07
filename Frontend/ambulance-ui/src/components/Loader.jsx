export default function Loader({ message = "Loading" }) {
  return (
    <div className="loader-wrap">
      <div className="loader-spinner" />
      <div className="loader-text">{message}</div>
    </div>
  );
}
