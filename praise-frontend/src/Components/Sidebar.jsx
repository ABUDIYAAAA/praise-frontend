import React from "react";

const Sidebar = ({
  repoName = "Repo Name",
  userRole = "Contributor",
  repoIcon = "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
  profile = { name: "Your Name", avatar: "https://i.pravatar.cc/40" },
  onProfileClick = () => {},
}) => {
  return (
    <aside
      style={{
        width: 260,
        height: "100vh",
        background: "#1a1a1a",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: "2px 0 8px rgba(0,0,0,0.07)",
      }}
    >
      {/* Top Section */}
      <div
        style={{
          padding: "32px 24px 24px 24px",
          borderBottom: "1px solid #222",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <img
            src={repoIcon}
            alt="Repo Icon"
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              background: "#fff",
            }}
          />
          <div>
            <div style={{ fontWeight: 600, fontSize: 18 }}>{repoName}</div>
            <div style={{ fontSize: 13, color: "#bbb", marginTop: 2 }}>
              {userRole}
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Elements */}
      <nav style={{ flex: 1, padding: "32px 0 0 0" }}>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          <li
            style={{
              padding: "12px 32px",
              cursor: "pointer",
              fontWeight: 500,
              fontSize: 16,
              transition: "background 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#222")}
            onMouseOut={(e) => (e.currentTarget.style.background = "none")}
          >
            🏅 Badges
          </li>
          <li
            style={{
              padding: "12px 32px",
              cursor: "pointer",
              fontWeight: 500,
              fontSize: 16,
              transition: "background 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#222")}
            onMouseOut={(e) => (e.currentTarget.style.background = "none")}
          >
            👥 Communities
          </li>
        </ul>
      </nav>

      {/* Profile Section */}
      <div
        style={{
          padding: "24px",
          borderTop: "1px solid #222",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
        onClick={onProfileClick}
      >
        <img
          src={profile.avatar}
          alt="Profile"
          style={{ width: 36, height: 36, borderRadius: "50%" }}
        />
        <div>
          <div style={{ fontWeight: 500, fontSize: 15 }}>{profile.name}</div>
          <div style={{ fontSize: 12, color: "#bbb" }}>Edit Settings</div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
