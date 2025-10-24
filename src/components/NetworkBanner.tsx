import useOnlineStatus from "../hooks/useOnlineStatus";

export default function NetworkBanner() {
  const online = useOnlineStatus();
  if (online) return null;
  return <div style={{ background: "salmon" }}>You are offline</div>;
}
