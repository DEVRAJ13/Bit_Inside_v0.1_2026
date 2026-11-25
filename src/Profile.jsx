import { useState } from "react";
import { Settings, Share2, Plus, LogOut, MoreHorizontal, Lock, Link2 } from "lucide-react";
import { useAuth, defaultUsername } from "./auth/AuthContext";
import EditProfile from "./EditProfile";
import "./Profile.css";

// Placeholder data — replace with real API data later
const img = (seed, h) => `https://picsum.photos/seed/${seed}/400/${h}`;

const PINS = [
  { id: 1, title: "Cozy reading corner", h: 560 },
  { id: 2, title: "Minimal desk setup", h: 400 },
  { id: 3, title: "Mountain sunrise", h: 620 },
  { id: 4, title: "Coffee art", h: 460 },
  { id: 5, title: "Plant shelf ideas", h: 520 },
  { id: 6, title: "Street style", h: 680 },
  { id: 7, title: "Weekend pasta", h: 420 },
  { id: 8, title: "Ocean blues", h: 580 },
  { id: 9, title: "Watercolor study", h: 480 },
  { id: 10, title: "Scandi living room", h: 600 },
].map((p) => ({ ...p, src: img(`pin${p.id}`, p.h) }));

const BOARDS = [
  { id: 1, name: "Home decor", pins: 48, seeds: ["b1a", "b1b", "b1c"] },
  { id: 2, name: "Recipes", pins: 112, seeds: ["b2a", "b2b", "b2c"] },
  { id: 3, name: "Travel", pins: 36, seeds: ["b3a", "b3b", "b3c"], secret: true },
  { id: 4, name: "Outfits", pins: 71, seeds: ["b4a", "b4b", "b4c"] },
];

function formatCount(n) {
  return n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k` : n;
}

function PinGrid() {
  return (
    <div className="pin-grid">
      {PINS.map((pin) => (
        <div className="pin" key={pin.id}>
          <div className="pin-image">
            <img src={pin.src} alt={pin.title} loading="lazy" />
          </div>
          <div className="pin-meta">
            <span>{pin.title}</span>
            <MoreHorizontal size={18} />
          </div>
        </div>
      ))}
    </div>
  );
}

function BoardGrid() {
  return (
    <div className="board-grid">
      {BOARDS.map((b) => (
        <div className="board" key={b.id}>
          <div className="board-collage">
            <img className="board-main" src={img(b.seeds[0], 400)} alt="" loading="lazy" />
            <img src={img(b.seeds[1], 400)} alt="" loading="lazy" />
            <img src={img(b.seeds[2], 400)} alt="" loading="lazy" />
          </div>
          <div className="board-name">
            {b.name}
            {b.secret && <Lock size={14} />}
          </div>
          <div className="board-count">{b.pins} Pins</div>
        </div>
      ))}
    </div>
  );
}

function Profile() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState("created");
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);

  const handle = defaultUsername(user);
  const initial = (user.name || user.email).trim().charAt(0).toUpperCase();
  const websiteLabel = user.website?.replace(/^https?:\/\//, "").replace(/\/$/, "");

  return (
    <div className="profile">
      <div className="profile-topbar">
        <button className="icon-btn" aria-label="Share profile">
          <Share2 size={22} />
        </button>
        <div className="menu-wrap">
          <button
            className="icon-btn"
            aria-label="Settings"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <Settings size={22} />
          </button>
          {menuOpen && (
            <div className="menu" role="menu">
              <button
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  setEditing(true);
                }}
              >
                <Settings size={18} /> Edit profile
              </button>
              <button role="menuitem" onClick={logout}>
                <LogOut size={18} /> Log out
              </button>
            </div>
          )}
        </div>
      </div>

      <header className="profile-header">
        <div className="avatar">
          {user.avatar ? <img src={user.avatar} alt={user.name} /> : initial}
        </div>
        <h1>{user.name}</h1>
        <p className="handle">@{handle}</p>
        {user.bio && <p className="bio">{user.bio}</p>}
        {user.website && (
          <a className="website" href={user.website} target="_blank" rel="noopener noreferrer">
            <Link2 size={16} /> {websiteLabel}
          </a>
        )}
        <p className="stats">
          <strong>{formatCount(1240)}</strong> followers · <strong>{formatCount(318)}</strong> following
        </p>
        <div className="profile-actions">
          <button className="pill-btn">Share</button>
          <button className="pill-btn" onClick={() => setEditing(true)}>
            Edit profile
          </button>
        </div>
      </header>

      <nav className="profile-tabs">
        {["created", "saved"].map((t) => (
          <button
            key={t}
            className={`profile-tab ${tab === t ? "active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t === "created" ? "Created" : "Saved"}
          </button>
        ))}
      </nav>

      <section className="profile-body">
        {tab === "created" ? <PinGrid /> : <BoardGrid />}
      </section>

      <button className="fab" aria-label="Create">
        <Plus size={26} />
      </button>

      {editing && <EditProfile onClose={() => setEditing(false)} />}
    </div>
  );
}

export default Profile;
